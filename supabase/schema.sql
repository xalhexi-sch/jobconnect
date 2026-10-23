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
  id uuid primary key default gen_random_uuid(),
  employer_id text not null references public.profiles(id) on delete cascade,
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
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id text not null references public.profiles(id) on delete cascade,
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
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
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

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;

-- Policies for public and authenticated access
create policy "Allow public read of active jobs" on public.jobs
  for select using (status = 'Active');

create policy "Allow public read of profiles" on public.profiles
  for select using (true);

create policy "Allow authenticated/service role full access to profiles" on public.profiles
  for all using (true) with check (true);

create policy "Allow authenticated/service role full access to jobs" on public.jobs
  for all using (true) with check (true);

create policy "Allow authenticated/service role full access to applications" on public.applications
  for all using (true) with check (true);

create policy "Allow authenticated/service role full access to saved_jobs" on public.saved_jobs
  for all using (true) with check (true);

-- ==============================================================================
-- INITIAL BUTUAN-CARAGA SEED DATA
-- ==============================================================================

-- Seed Sample Employers & Demo Users
insert into public.profiles (id, full_name, email, role, headline, bio, location, barangay)
values
  ('user-demo-employer', 'Caraga Tech HR', 'hr@caragatech.ph', 'employer', 'Talent Acquisition Team', 'Empowering local employment in Butuan City and the Caraga Region.', 'Butuan City', 'Libertad'),
  ('user-maria', 'Maria Santos', 'maria.santos@caraga.tech', 'jobseeker', 'Junior Full-Stack Developer & Tech Enthusiast', 'Graduate of Father Saturnino Urios University passionate about web technologies and local impact.', 'Butuan City', 'Bancasi')
on conflict (id) do nothing;

-- Seed Authentic Butuan Jobs
insert into public.jobs (
  id, employer_id, title, company, company_logo, location, barangay, city,
  salary, salary_php, type, category, status, description, requirements, applied_count, featured
) values
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-111111111111',
    'user-demo-employer',
    'Junior Full-Stack Web Developer',
    'Balanghai Tech Solutions',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80',
    'Libertad, Butuan City',
    'Libertad',
    'Butuan City',
    '₱25,000 - ₱35,000 / month',
    30000,
    'Hybrid',
    'Developer',
    'Active',
    'We are hiring an enthusiastic junior developer to help build web portals and digital services for local enterprises and government units across Caraga.',
    array['Proficiency in JavaScript/TypeScript and React/Next.js', 'Familiarity with SQL or PostgreSQL', 'Good communication skills and eagerness to learn'],
    12,
    true
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-222222222222',
    'user-demo-employer',
    'Registered Clinic Nurse',
    'Caraga Health Specialist Clinic',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'Montilla Blvd, Butuan City',
    'Montilla Blvd',
    'Butuan City',
    '₱22,000 - ₱28,000 / month',
    25000,
    'On-site',
    'Healthcare',
    'Active',
    'Seeking a compassionate Registered Nurse to provide patient triage, vital assessments, and healthcare administration at our primary care center on Montilla Boulevard.',
    array['Active PRC Nursing License', 'Strong interpersonal bedside manner', 'Willing to work morning or afternoon shifts in Butuan'],
    8,
    true
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-333333333333',
    'user-demo-employer',
    'Barista & Customer Service Lead',
    'Kape Butuanon Artisan Cafe',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80',
    'JC Aquino Ave, Butuan City',
    'JC Aquino Ave',
    'Butuan City',
    '₱14,000 - ₱18,000 / month',
    16000,
    'On-site',
    'Hospitality',
    'Active',
    'Join our premier specialty cafe team crafting locally sourced Caraga coffees, welcoming guests, and maintaining friendly neighborhood service.',
    array['Passion for espresso craft and hospitality', 'Warm, respectful customer-facing attitude', 'Previous cafe experience is a plus, training provided'],
    19,
    false
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-444444444444',
    'user-demo-employer',
    'Inventory & Logistics Associate',
    'Agusan Hardware & Supply Corp.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'Bancasi, Butuan City',
    'Bancasi',
    'Butuan City',
    '₱16,000 - ₱21,000 / month',
    18500,
    'On-site',
    'Trades & Logistics',
    'Active',
    'Manage warehouse inventory counts, dispatch logistics, and coordinate commercial deliveries for building materials across Agusan del Norte.',
    array['High school or College degree', 'Attention to detail in stock auditing', 'Basic computer literacy in Excel or inventory software'],
    6,
    false
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-555555555555',
    'user-demo-employer',
    'Graphic Designer & Brand Associate',
    'Mindanao Digital Creatives',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80',
    'Doongan, Butuan City',
    'Doongan',
    'Butuan City',
    '₱20,000 - ₱28,000 / month',
    24000,
    'Remote (Caraga)',
    'Design',
    'Active',
    'Design promotional graphics, social media assets, and digital marketing materials for local Butuan and regional business brands.',
    array['Proficiency in Figma, Photoshop, or Canva', 'Creative visual portfolio', 'Ability to meet project deadlines'],
    15,
    true
  )
on conflict (id) do nothing;
