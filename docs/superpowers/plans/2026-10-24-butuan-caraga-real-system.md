# Butuan-Caraga JobConnect Real System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the JobConnect prototype into a real, production-ready web application for Butuan City and the Caraga region, integrating Clerk authentication, Supabase PostgreSQL persistence and resume storage, authentic local seed data, and a unified environment contract for local development and Vercel deployment.

**Architecture:** Hybrid-resilient Next.js App Router architecture. When Clerk and Supabase credentials are provided in `.env.local` or Vercel, the app runs live authentication via Clerk and executes database mutations through Next.js Server Actions connecting to Supabase. If credentials are missing or in offline presentation mode, the system seamlessly falls back to rich local mock data so evaluator demos never fail.

**Tech Stack:** Next.js 16 (Turbopack, App Router, React 19), Clerk (`@clerk/nextjs`), Supabase (`@supabase/supabase-js`), Tailwind CSS v4, Lucide React, TypeScript 5.

**Spec:** [`docs/superpowers/specs/2026-10-24-butuan-caraga-jobconnect-design.md`](file:///C:/Users/mayke/OneDrive/Desktop/jobconnect/docs/superpowers/specs/2026-10-24-butuan-caraga-jobconnect-design.md)

## Global Constraints

- Must run cleanly with zero errors on Next.js 16 with Turbopack (`npm run dev` and `npm run build`).
- Target region scope is strictly Butuan City and Caraga (Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur, Dinagat Islands).
- Environment variables contract must be identical between local development and Vercel production:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (optional for server-side direct access)
- Interactive perspective switching (Applicant, Employer, Admin) must remain easily accessible in 1 click for school presentation and grading without account lockouts.
- Graceful degradation: If Supabase or Clerk is unconfigured, the app must remain fully interactive via mock state without crashing or rendering blank screens.

## Review Focus

1. **Missing or invalid API keys:** If `.env.local` is empty or holds placeholder keys, the app must load without runtime crashes and render the fallback demo mode with a subtle indicator.
2. **Role switching state synchronization:** When an evaluator toggles between Applicant, Employer, and Admin, active context and listings must immediately re-render to reflect the selected view.
3. **Application submission edge cases:** Submitting an application without an uploaded resume or with empty required contact fields must display clear inline validation instead of breaking.
4. **New job posting persistence:** When an employer posts a job in live Supabase mode, it must immediately appear in the job board without requiring a full browser refresh.
5. **Vercel build-time environment evaluation:** Clerk and Supabase imports must not fail during Next.js static page generation when build-time environment variables are not yet bound.

---

### Task 1: Supabase Database Schema, SQL Migration, and Seeder

**Files:**
- Create: `supabase/schema.sql`
- Create: `lib/db.ts`
- Modify: `lib/supabase.ts`
- Test: `tests/db-schema.test.ts` (or node verification script `scripts/verify-schema.mjs`)

**Interfaces:**
- Consumes: `lib/types.ts` (`Job`, `Application`, `UserProfile`)
- Produces: `getJobsFromDb()`, `insertJobToDb()`, `getApplicationsFromDb()`, `insertApplicationToDb()` in `lib/db.ts`

- [ ] **Step 1: Write the SQL schema file `supabase/schema.sql`**
  Define tables for `profiles`, `jobs`, `applications`, and `saved_jobs` with foreign keys, indexes on `barangay`, `city`, `category`, and localized seed data for Butuan City (Montilla, Bancasi, Libertad, Ampayon, Doongan, Villa Kananga).
- [ ] **Step 2: Create database access module `lib/db.ts`**
  Implement safe query wrappers using `@supabase/supabase-js` that check `isSupabaseConfigured`. If true, execute queries against Supabase; if false, return localized fallback data from `lib/mock-data.ts`.
- [ ] **Step 3: Write verification test script `scripts/verify-db.mjs`**
  Create a test script that validates the fallback behavior when Supabase is unconfigured, and queries mock data correctly.
- [ ] **Step 4: Run verification script**
  Run: `node scripts/verify-db.mjs`
  Expected: PASS (Successfully retrieves Butuan seed listings in fallback mode).
- [ ] **Step 5: Commit**
  ```bash
  git add supabase/schema.sql lib/db.ts scripts/verify-db.mjs lib/supabase.ts
  git commit -m "feat(db): add Supabase SQL schema, localized seed data, and resilient db query wrapper"
  ```

---

### Task 2: Clerk Authentication Integration & Perspective Provider

**Files:**
- Modify: `package.json` (install `@clerk/nextjs`)
- Modify: `app/layout.tsx`
- Create: `middleware.ts`
- Modify: `lib/clerk.ts`
- Modify: `components/Navbar.tsx`
- Modify: `components/AuthModal.tsx`

**Interfaces:**
- Consumes: `isClerkConfigured` from `lib/clerk.ts`, `RoleType` from `lib/types.ts`
- Produces: `<ClerkProvider>` wrapper in layout with graceful mock fallback, and role perspective switcher supporting Applicant, Employer, and Admin.

- [ ] **Step 1: Install `@clerk/nextjs`**
  Run: `npm install @clerk/nextjs`
- [ ] **Step 2: Update `lib/clerk.ts` and `app/layout.tsx`**
  Conditionally wrap `layout.tsx` with `<ClerkProvider>` if `isClerkConfigured` is true, otherwise render standard children so mock auth functions without keys.
- [ ] **Step 3: Create `middleware.ts` with Clerk matcher**
  Configure Clerk route middleware that protects private routes if Clerk is configured, and allows public access to the landing page and job exploration.
- [ ] **Step 4: Update `components/Navbar.tsx` and `components/AuthModal.tsx`**
  Support signed-in Clerk user badge (`<UserButton />`) when live keys are present, alongside the 1-click perspective switcher (`Applicant | Employer | Admin`) for evaluator demos.
- [ ] **Step 5: Verify dev server and compilation**
  Run: `curl.exe -I http://localhost:3000`
  Expected: HTTP 200 OK.
- [ ] **Step 6: Commit**
  ```bash
  git add package.json package-lock.json app/layout.tsx middleware.ts lib/clerk.ts components/Navbar.tsx components/AuthModal.tsx
  git commit -m "feat(auth): integrate Clerk with conditional provider and demo perspective switcher"
  ```

---

### Task 3: Real Database Server Actions & CRUD Operations

**Files:**
- Create: `app/actions/jobs.ts`
- Create: `app/actions/applications.ts`
- Create: `app/actions/profile.ts`
- Modify: `context/AppContext.tsx`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/types.ts`
- Produces: Server actions:
  - `fetchJobsAction(filter)`: returns list of jobs
  - `createJobAction(jobData)`: inserts job into DB or state
  - `submitApplicationAction(appData)`: inserts application
  - `updateApplicationStatusAction(applicationId, newStatus)`: updates hiring stage

- [ ] **Step 1: Create `app/actions/jobs.ts`**
  Implement server action with input validation for posting jobs and querying filtered Butuan listings.
- [ ] **Step 2: Create `app/actions/applications.ts`**
  Implement server action for submitting job applications and updating review status (Applied, Shortlisted, Interview, Rejected, Hired).
- [ ] **Step 3: Create `app/actions/profile.ts`**
  Implement server action to load and persist user profile info.
- [ ] **Step 4: Integrate Server Actions into `context/AppContext.tsx`**
  Connect `AppContext` state dispatchers to trigger server actions with optimistic UI updates.
- [ ] **Step 5: Write verification script `scripts/verify-actions.mjs`**
  Verify action methods export correct signatures and return expected data structures.
- [ ] **Step 6: Run verification script**
  Run: `node scripts/verify-actions.mjs`
  Expected: PASS.
- [ ] **Step 7: Commit**
  ```bash
  git add app/actions/ context/AppContext.tsx scripts/verify-actions.mjs
  git commit -m "feat(actions): create Next.js server actions for jobs, applications, and profiles"
  ```

---

### Task 4: Connect Interactive Modals & Two-Sided Views

**Files:**
- Modify: `components/PostJobModal.tsx`
- Modify: `components/ApplyModal.tsx`
- Modify: `components/overview/JobseekerAppView.tsx`
- Modify: `components/overview/EmployerAppView.tsx`

**Interfaces:**
- Consumes: Server actions and `AppContext`
- Produces: Interactive job application workflow and employer hiring pipeline.

- [ ] **Step 1: Update `components/PostJobModal.tsx`**
  Bind form submission to `createJobAction` with specific Butuan barangay selector (Libertad, Montilla, Ampayon, Doongan, etc.) and toast confirmation.
- [ ] **Step 2: Update `components/ApplyModal.tsx`**
  Bind application submission to `submitApplicationAction` with form field validation and optional file attachment.
- [ ] **Step 3: Update `components/overview/JobseekerAppView.tsx`**
  Display applied jobs with real-time status badges and filter controls.
- [ ] **Step 4: Update `components/overview/EmployerAppView.tsx`**
  Display posted jobs and candidates with interactive status dropdowns (Review, Interview, Reject, Hire).
- [ ] **Step 5: Test interactive workflows locally**
  Trigger test actions via browser or test script to confirm state updates without page reloads.
- [ ] **Step 6: Commit**
  ```bash
  git add components/PostJobModal.tsx components/ApplyModal.tsx components/overview/
  git commit -m "feat(views): wire posting, application submission, and status management"
  ```

---

### Task 5: Vercel Production Readiness, Configuration Guide, and Full Verification

**Files:**
- Modify: `.env.example`
- Create: `docs/deployment/VERCEL_SETUP.md`
- Modify: `README.md`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: Complete project codebase
- Produces: Production build artifact and complete documentation for Supabase & Clerk API key setup.

- [ ] **Step 1: Update `.env.example`**
  Add complete documentation for the exact keys required:
  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```
- [ ] **Step 2: Create `docs/deployment/VERCEL_SETUP.md`**
  Write an easy step-by-step setup guide for the user detailing:
  1. Creating a free Supabase project and running `supabase/schema.sql` in Supabase SQL Editor.
  2. Creating a Clerk application and grabbing API keys.
  3. Adding environment variables to Vercel Project Settings.
- [ ] **Step 3: Run production build verification**
  Run: `npm run build`
  Expected: Successful compilation with zero TypeScript or linting errors.
- [ ] **Step 4: Commit**
  ```bash
  git add .env.example docs/deployment/VERCEL_SETUP.md README.md next.config.ts
  git commit -m "docs: add Vercel deployment guide and verify production build"
  ```
