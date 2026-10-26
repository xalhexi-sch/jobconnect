-- Migration: 0006_application_messages.sql
-- Direct messaging channel between job hirers and applicants tied to specific applications.

create table if not exists public.application_messages (
  id text primary key default gen_random_uuid()::text,
  application_id text not null references public.applications(id) on delete cascade,
  sender_id text not null references public.profiles(id) on delete cascade,
  sender_role text not null check (sender_role in ('employer', 'jobseeker')),
  sender_name text not null,
  content text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_app_messages_app_id on public.application_messages(application_id, created_at asc);
create index if not exists idx_app_messages_sender on public.application_messages(sender_id);

-- Enforce deny-all RLS: all reads and writes must pass through validated server actions using the service role.
alter table public.application_messages enable row level security;
