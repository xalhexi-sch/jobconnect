-- Security hardening: deny-all RLS (server-only access via service role),
-- missing profile columns, audit log, rate limits, private resume bucket.

-- Remove permissive demo data
delete from public.jobs where employer_id = 'user-demo-employer';
delete from public.profiles where id in ('user-demo-employer', 'user-maria');

-- Columns the app already reads/writes
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists company_industry text;
alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles add column if not exists expected_salary text;
alter table public.profiles add column if not exists company_verified boolean not null default false;
alter table public.profiles add column if not exists suspended boolean not null default false;

-- Drop every wide-open policy; with RLS on and no policies the anon/authenticated roles get nothing.
do $$
declare p record;
begin
  for p in select policyname, tablename from pg_policies where schemaname = 'public' loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;

alter table public.saved_jobs drop constraint if exists saved_jobs_user_fk;

-- Keep applied_count truthful
create or replace function public.bump_applied_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.jobs set applied_count = applied_count + 1 where id = new.job_id;
  elsif tg_op = 'DELETE' then
    update public.jobs set applied_count = greatest(applied_count - 1, 0) where id = old.job_id;
  end if;
  return null;
end $$;
drop trigger if exists trg_applied_count on public.applications;
create trigger trg_applied_count after insert or delete on public.applications
  for each row execute function public.bump_applied_count();

-- Allow seekers to withdraw
alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check
  check (status in ('Submitted','Under Review','Interview Scheduled','Offer Extended','Rejected','Withdrawn'));

create index if not exists idx_jobs_employer on public.jobs(employer_id);
create index if not exists idx_jobs_created on public.jobs(created_at desc);
create index if not exists idx_saved_user on public.saved_jobs(user_id);

-- Audit log
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id text,
  action text not null,
  target text,
  meta jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;

-- Rate limiting (fixed window counters)
create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  primary key (key, window_start)
);
alter table public.rate_limits enable row level security;

create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_max integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare w timestamptz; c integer;
begin
  w := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.rate_limits(key, window_start, count) values (p_key, w, 1)
    on conflict (key, window_start) do update set count = public.rate_limits.count + 1
    returning count into c;
  delete from public.rate_limits where window_start < now() - interval '1 day';
  return c <= p_max;
end $$;
revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.bump_applied_count() from public, anon, authenticated;

-- Private bucket for resumes (5 MB, pdf/doc/docx)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
