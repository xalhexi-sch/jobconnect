-- Resume metadata and job search support.
alter table public.profiles add column if not exists resume_name text;
alter table public.applications add column if not exists resume_name text;

create index if not exists idx_jobs_fts on public.jobs
  using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(company,'') || ' ' || coalesce(description,'')));
create index if not exists idx_jobs_type on public.jobs(type);
create index if not exists idx_profiles_role on public.profiles(role);
