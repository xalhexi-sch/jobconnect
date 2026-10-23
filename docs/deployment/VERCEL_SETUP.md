# JobConnect Caraga: Complete Setup & Vercel Deployment Guide

This guide walks you through connecting your real **Supabase** database and **Clerk** authentication for both local development and live **Vercel** deployment.

---

## 1. Supabase Setup (Database & Real Persistence)

1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project**:
   - **Name:** `jobconnect-caraga` (or your preferred name)
   - **Database Password:** Enter a strong password and save it somewhere secure.
   - **Region:** Select `Singapore` (closest low-latency region to the Philippines).
3. Once your project finishes creating (1–2 minutes):
   - In the left sidebar, click **SQL Editor**.
   - Click **New query**.
   - Copy the entire contents of [`supabase/schema.sql`](../../supabase/schema.sql) in this repository and paste it into the editor.
   - Click **Run** (or `Ctrl+Enter`). This creates all tables (`profiles`, `jobs`, `applications`, `saved_jobs`), sets up Row Level Security (RLS) policies, and seeds authentic Butuan City listings.
4. Retrieve your API Keys:
   - In the left sidebar, go to **Project Settings** (gear icon) -> **API**.
   - Copy **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **Project API keys: `anon public`** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **Project API keys: `service_role secret`** -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Clerk Setup (Authentication)

1. Go to [https://clerk.com](https://clerk.com) and create a free account or sign in.
2. Click **Create Application**:
   - **Application Name:** `JobConnect Caraga`
   - **Select Authentication Providers:** Email, Google, etc.
3. Retrieve your API Keys:
   - Under **API Keys** in the Clerk dashboard:
   - Copy **Publishable key** -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy **Secret key** -> `CLERK_SECRET_KEY`

---

## 3. Local Development (`.env.local`)

In the root of your project directory, create a `.env.local` file with the keys you gathered:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Start the local server:
```bash
npm run dev
```
Open `http://localhost:3000` to test live authentication and database persistence.

---

## 4. Vercel Production Deployment

Deploying to Vercel uses the exact same keys:

1. Push your repository to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your `jobconnect` GitHub repository.
4. In the **Configure Project** screen, expand **Environment Variables**:
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Add `CLERK_SECRET_KEY`
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**.
6. When deployment finishes, visit your live Vercel URL!

---

## 5. Offline & Presentation Safety Note

The system is equipped with **zero-downtime fallback mode**:
- If API keys are ever omitted, misconfigured, or temporarily rate-limited during a live school presentation, the application gracefully continues operating using local mock data.
- Panelists and evaluators can freely switch between **Seeker**, **Employer**, and **Admin** modes with one click from the top navigation bar.
