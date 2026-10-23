# Butuan-Caraga JobConnect: Real System Architecture & Transition Design

**Date:** 2026-10-24  
**Project:** JobConnect (Butuan City & Caraga Region Job Portal)  
**Context:** Academic Capstone / School Project ready for Vercel production deployment  

---

## 1. Intent and the Why
In Butuan City and the wider Caraga region, the employment market suffers from severe fragmentation. Micro, small, and medium enterprises (MSMEs)—from neighborhood cafes and hardware stores to regional offices, clinics, and BPO hubs—struggle to recruit local talent. Conversely, local students, fresh graduates, and skilled workers rely on disorganized Facebook groups, walk-in inquiries with paper resumes, or outdated tarpaulins.

This project transitions the JobConnect prototype into a real, operational web application tailored specifically to the Butuan-Caraga economic and geographic landscape, using Supabase for persistent data storage and Clerk for identity and access management.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Real Backend Integration:** Connect Supabase (PostgreSQL + Storage) for live jobs, applicant profiles, job applications, and resume uploads.
- **Real Authentication with Flexible Demo Testing:** Implement Clerk for secure authentication, allowing seamless perspective switching between Applicant and Employer during grading and live defense testing.
- **Admin & Evaluator Visibility:** Retain the Admin dashboard for grading committees to audit job posts, view system metrics, and monitor user counts.
- **Butuan & Caraga Geographic Focus:** Structure job filters, locations, and seed data around real Butuan barangays (e.g., Montilla Blvd, Libertad, Ampayon, Doongan, Bancasi, Villa Kananga, Holy Redeemer) and neighboring Caraga hubs (Cabadbaran, Surigao, Bayugan).
- **Two-Sided Portals:**
  - *Job Seekers:* Search and filter local jobs, apply with resume/contact details, and track application statuses.
  - *Employers:* Post job vacancies with localized details, view incoming applicants, and update hiring stages (Applied, Under Review, Interview, Rejected, Hired).
- **Zero-Downtime Defense Reliability:** Maintain graceful fallback/mock capability when API keys are unpopulated so school presentations and evaluator testing never crash.
- **Production & Vercel Readiness:** Identical environment variable structure for both local development (`.env.local`) and Vercel production deployment.

### Non-Goals
- Nationwide or international job aggregation.
- In-platform automated payroll, tax withholding, or social security deductions.
- Native mobile apps (iOS/Android) — the responsive web app meets all academic and presentation requirements.
- Mandatory commercial payment gateways for job postings.

### Anti-Goals
- Complex corporate verification barriers that would deter small local businesses or stall live demos.
- Hard failures or blank white screens if external API rate limits or network issues hit during a live school presentation.

---

## 3. System Architecture & Environment Contract

- **Framework:** Next.js 16 (App Router, Turbopack, React 19).
- **Styling:** Tailwind CSS v4, Lucide React icons, motion animations.
- **Authentication:** Clerk (`@clerk/nextjs`) managing user session, email verification, and active perspective state.
- **Database & Storage:** Supabase (PostgreSQL with Server Actions / API routes for persistent CRUD and file storage for resumes).
- **Environment Variables Contract:**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (used server-side for robust operations)

---

## 4. Key User Workflows & Decisions

### Decided by User
- Target region: Butuan City & Caraga Region.
- Nature of project: School project requiring high polish for academic defense.
- Tech stack: Clerk for Auth + Supabase for Database/Storage.
- Deployment target: Vercel (same environment variables for local and production).
- Evaluation Flow: Dynamic perspective switching enabled so panelists/testers can easily try both applicant and employer flows without juggling multiple accounts.

### Builder Calls & Settle Decisions
1. **Data Access Pattern:** Server Actions and Next.js Route Handlers validate Clerk user sessions server-side and perform Supabase queries. This guarantees maximum security without requiring complex client-side JWT template handshakes.
2. **Schema Design:**
   - `profiles`: Tied to Clerk `userId` (fields: full name, email, phone, role, headline, bio, location/barangay, resume_url).
   - `jobs`: Posted by employers (fields: title, company_name, category, job_type, location, barangay, salary_min, salary_max, salary_type, description, requirements, status).
   - `applications`: Connecting applicant `userId` to `job_id` (fields: applicant_name, applicant_email, phone, cover_letter, resume_url, status, applied_at).
   - `saved_jobs`: Bookmarks for job seekers.
3. **Admin Dashboard:** Preserved as a management and analytics view for academic presentation, with moderation controls that don't block instant posting.
4. **Graceful Hybrid Mode:** If Clerk or Supabase keys are not set, the app falls back to the rich local mock data seamlessly, allowing offline demos without code changes.
5. **Local Localization Seed:** Pre-populate authentic Butuan job listings across small shops (cafes, retail stores), institutions (local schools, clinics), and regional employers.

---

## 5. Verification & School Defense Criteria
- System loads without compilation or runtime errors on `http://localhost:3000` and Vercel.
- Switching between Applicant, Employer, and Admin perspectives functions cleanly in 1 click.
- When Supabase credentials are inserted, jobs and applications persist in PostgreSQL.
- When Clerk credentials are inserted, user signup and login work with proper role routing.
