# JobConnect (Butuan & Caraga) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Jobgio prototype into **JobConnect Caraga** — a web-native, app-like platform built specifically for jobseekers and employers in Butuan City and the Caraga Region (Agusan & Surigao), featuring an app-like `/overview` surface with real-time job searching, application tracking, saved jobs, and interactive resume & portfolio management.

**Architecture:** Next.js 16 App Router application with React 19, Tailwind CSS v4, Lucide icons, and Figtree typography. State is centrally managed via `context/AppContext.tsx` with rich Caraga-localized mock data, ready for Supabase persistence and Clerk authentication.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, `@supabase/supabase-js`, `lucide-react`, `canvas-confetti`.

**Spec:** Localized Caraga/Butuan job portal with web-first app experience (`/overview`), eliminating AppStore/PlayStore app references in favor of direct web application tools (Job Search, My Applications, Saved Jobs, Resume & Portfolio Builder, and Employer Candidate Pipeline).

## Global Constraints

- Preserve the monochrome, Apple-minimalist, soft-squircle aesthetic (`rounded-3xl`, `#111116`, `#FBFBFC`, `#EDEFF2`) and Figtree typography.
- No external mobile app store redirects or dependencies; 100% responsive web application.
- All pricing and salaries localized to Philippine Peso (₱ / PHP) and local employment types (Full-time, Part-time, Project-based, Remote in Caraga).
- Locations localized to Butuan City (Bancasi, Libertad, Doongan, Montilla, Villa Kananga) and Caraga provinces (Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur, Dinagat Islands).

## Review Focus

- Role switching smoothly updates the `/overview` UI between Jobseeker hub (Applications, Saved, Resume) and Employer hub (Postings, Applicants, Pipeline).
- Resume and portfolio updates made in the Jobseeker tab persist in the session and reflect in new job applications.
- Currency and location formatting consistently display ₱ and Caraga municipalities without broken symbols.
- Responsive navigation on mobile devices functions smoothly without clipping the tab bar.
- Direct route navigation between `/` (Landing page) and `/overview` (App hub) preserves active state and search queries.

---

### Task 1: Caraga & Butuan Mock Data & Types Localization

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/mock-data.ts`
- Modify: `lib/clerk.ts`

**Interfaces:**
- Consumes: Existing `Job`, `Application`, `PendingApproval`, `ReviewItem` definitions.
- Produces: Enhanced `Job` with `salaryPhp`, `city`, `barangay`, `workSetup`, updated `UserProfile` with `resume`, `skills`, `education`, `portfolioUrl`, and realistic Butuan/Caraga companies (e.g. Caraga State University, FSUU, Butuan Doctors, SM City Butuan, Tech BPO Caraga, Agusan Wood & Bio-Agri).

- [ ] **Step 1: Update `lib/types.ts` with Caraga-specific fields**
  Add `salaryPhp`, `barangay`, `city`, and `UserProfile` (skills, education, portfolioUrl, resumeSummary).

- [ ] **Step 2: Update `lib/mock-data.ts` with authentic Caraga/Butuan employers and roles**
  Replace generic Silicon Valley entries with:
  - Lead UX/UI Designer @ TechVenture Caraga (₱65,000/mo, Remote Butuan)
  - Full-Stack Web Developer @ CSU Innovation Hub (₱45,000 - ₱60,000/mo, Ampayon, Butuan)
  - IT Systems Specialist @ Father Saturnino Urios University (₱32,000/mo, J.C. Aquino, Butuan)
  - Medical Records Specialist @ Butuan Medical Center (₱28,000/mo, T. Sanchez, Butuan)
  - Digital Marketing Associate @ Robinsons Place Butuan / Retail Group (₱25,000/mo, J.C. Aquino)
  - Environmental Compliance Officer @ Agusan Forestry & Mining Resources (₱40,000/mo, Tubay/Agusan del Norte)
  - Customer Support Lead @ Surigao Coastal Tech (₱30,000/mo, Hybrid Caraga)

- [ ] **Step 3: Update `lib/clerk.ts` default mock user**
  Set user to Juan Dela Cruz (Butuan City) with CSU / FSUU graduate background and a verified resume summary.

- [ ] **Step 4: Verify TypeScript compilation**
  Run `npx tsc --noEmit` and verify zero errors.

---

### Task 2: State Enhancement for Web App Capabilities

**Files:**
- Modify: `context/AppContext.tsx`

**Interfaces:**
- Consumes: Updated types and mock data from Task 1.
- Produces:
  - `userProfile`: { fullName, email, phone, location, headline, bio, skills, education, portfolioUrl, resumeName, resumeUpdated }
  - `updateUserProfile(profile)`: updates seeker profile in state.
  - `applications`: expanded with timeline stages (*Submitted*, *HR Screening*, *Technical Interview*, *Offer Extended*).
  - `savedJobs`: array of bookmarked jobs with quick apply.
  - `filterByLocation(city)`: quick filters for Butuan City, Cabadbaran, Surigao, Bayugan, Bislig, Remote.

- [ ] **Step 1: Extend `AppContext` state and methods**
  Add `userProfile` state and `updateUserProfile` handler with toast notifications.

- [ ] **Step 2: Add interactive pipeline stage update for employers**
  Allow employers in the app overview to advance an applicant's stage (*Screening* -> *Interview* -> *Hired*).

- [ ] **Step 3: Verify context compiles without type mismatches**
  Run `npx tsc --noEmit`.

---

### Task 3: Overhaul Landing Page to Web-First JobConnect Caraga

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/Hero.tsx`
- Modify: `components/StatsProof.tsx`
- Modify: `components/ExploreJobs.tsx`
- Modify: `components/HowItWorks.tsx`
- Modify: `components/CtaBanner.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: Localized mock data, `useApp()` hooks.
- Produces: Web-first landing page with no AppStore/PlayStore requirements; primary CTAs link straight to `/overview` ("Find Work in Caraga" & "Post a Vacancy in Butuan").

- [ ] **Step 1: Update `components/Navbar.tsx`**
  Change brand logo text to "JobConnect", add "Caraga Region" badge, and route "App" to `/overview`.

- [ ] **Step 2: Update `components/Hero.tsx`**
  Replace app store download buttons with web action buttons: "Look for Jobs in Butuan" and "Hire Caraga Talent". Update phone mockup to showcase Butuan listings with ₱ currency.

- [ ] **Step 3: Update `components/StatsProof.tsx`**
  Highlight 15,000+ Caraga jobseekers, 450+ verified Butuan & regional enterprises, ₱25M+ local payroll matched.

- [ ] **Step 4: Update `components/ExploreJobs.tsx`**
  Display local jobs with ₱ salaries and Caraga municipality chips (Butuan, Cabadbaran, Surigao, Bayugan, Bislig, Remote).

- [ ] **Step 5: Update `components/CtaBanner.tsx` and `components/Footer.tsx`**
  Replace mobile app download links with direct web portal links to `/overview` and localized office info: J.C. Aquino Ave, Butuan City, Caraga Region.

- [ ] **Step 6: Verify landing page build**
  Run `npm run build` to confirm clean page generation.

---

### Task 4: Build the App-Like `/overview` Experience

**Files:**
- Create: `app/overview/page.tsx`
- Create: `components/overview/JobseekerAppView.tsx`
- Create: `components/overview/EmployerAppView.tsx`
- Create: `components/overview/ResumePortfolioModal.tsx`
- Redirect: `app/dashboard/page.tsx` -> `/overview`

**Interfaces:**
- Consumes: `useApp()`, `Job`, `Application`, `UserProfile`.
- Produces: A unified, native-feeling web app experience with top app bar, role switcher, and sub-views:
  - **Jobseeker App View**:
    1. *Instant Job Search*: "Looking for work right now" with live Caraga location & salary filter.
    2. *My Applications Tracker*: Stage pipeline cards with interview dates.
    3. *Saved Jobs*: Bookmarked roles with 1-click Easy Apply.
    4. *My Resume & Portfolio*: Visual CV card, skills tags, portfolio link, and edit modal.
  - **Employer App View**:
    1. *Candidate Pipeline*: Manage incoming applications from Caraga talent.
    2. *Active Postings*: Manage jobs with status toggles.
    3. *Post Vacancy*: Modal with ₱ compensation and Butuan barangay selection.
    4. *Local Talent Analytics*: Regional applicant breakdown.

- [ ] **Step 1: Create `components/overview/ResumePortfolioModal.tsx`**
  Build editable modal for jobseekers to update their headline, skills, education, portfolio link, and resume.

- [ ] **Step 2: Create `components/overview/JobseekerAppView.tsx`**
  Implement the 4 core jobseeker app surfaces with tab switching and instant feedback.

- [ ] **Step 3: Create `components/overview/EmployerAppView.tsx`**
  Implement the employer recruitment dashboard adapted from Image 4 with Butuan/Caraga local context.

- [ ] **Step 4: Create `app/overview/page.tsx`**
  Integrate top app bar, role switcher ("Jobseeker" vs "Employer"), and smooth view transitions.

- [ ] **Step 5: Redirect `app/dashboard/page.tsx` to `/overview`**
  Ensure any existing links to `/dashboard` seamlessly render `/overview`.

---

### Task 5: End-to-End Verification & Quality Check

**Files:**
- Verification only

- [ ] **Step 1: Run TypeScript compiler**
  `npx tsc --noEmit` -> verify 0 errors.

- [ ] **Step 2: Run production Next.js build**
  `npm run build` -> verify all routes compile cleanly.

- [ ] **Step 3: Test user flows**
  - Verify job searching by Butuan / Caraga filters.
  - Verify 1-click apply adds to "My Applications" in `/overview`.
  - Verify bookmarking adds to "Saved Jobs".
  - Verify editing Resume & Portfolio updates immediately.
  - Verify role toggle switches seamlessly to Employer management.
