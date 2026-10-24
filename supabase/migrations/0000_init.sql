-- ==============================================================================
-- Butuan-Caraga JobConnect Database Schema (Supabase PostgreSQL)
-- ==============================================================================

-- 1. PROFILES TABLE (Tied to Clerk User ID or Local Session)
create table if not exists public.profiles (
  id text primary key, -- Clerk User ID or mock ID
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'jobseeker' check (role in ('jobseeker', 'employer', 'admin')),
  headline text,
  bio text,
  location text default 'Butuan City, Caraga',
  barangay text,
  skills text[] default array[]::text[],
  education text,
  resume_url text,
  portfolio_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. JOBS TABLE (Vacancies in Butuan City & Caraga Region)
create table if not exists public.jobs (
  id text primary key default gen_random_uuid()::text,
  employer_id text not null,
  title text not null,
  company text not null,
  company_logo text,
  location text not null,
  barangay text,
  city text not null default 'Butuan City',
  salary text not null,
  salary_php integer not null default 0,
  type text not null default 'On-site' check (type in ('On-site', 'Hybrid', 'Remote (Caraga)', 'Remote')),
  category text not null check (category in ('Design', 'Developer', 'Security', 'Marketing', 'Healthcare', 'Admin & Support', 'Hospitality', 'Trades & Logistics')),
  status text not null default 'Active' check (status in ('Active', 'Pending', 'Expired')),
  description text not null,
  requirements text[] default array[]::text[],
  applied_count integer not null default 0,
  featured boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. APPLICATIONS TABLE
create table if not exists public.applications (
  id text primary key default gen_random_uuid()::text,
  job_id text not null references public.jobs(id) on delete cascade,
  applicant_id text not null,
  applicant_name text not null,
  applicant_email text not null,
  phone text,
  cover_letter text,
  resume_url text,
  status text not null default 'Submitted' check (status in ('Submitted', 'Under Review', 'Interview Scheduled', 'Offer Extended', 'Rejected')),
  interview_date text,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, applicant_id)
);

-- 4. SAVED JOBS (BOOKMARKS)
create table if not exists public.saved_jobs (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  job_id text not null references public.jobs(id) on delete cascade,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- Indexes for lightning-fast localized search
create index if not exists idx_jobs_city on public.jobs(city);
create index if not exists idx_jobs_barangay on public.jobs(barangay);
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_applications_applicant on public.applications(applicant_id);

