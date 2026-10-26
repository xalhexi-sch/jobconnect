# Application Messaging (Employer-Applicant Direct Channel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, real-time messaging channel between job hirers and applicants on active applications with Supabase database storage, secure Server Actions, Vercel-compatible notification webhook dispatch, and a polished chat UI featuring the sleek `Send` icon.

**Architecture:** 
- PostgreSQL migration in Supabase creating `application_messages` table with strict foreign keys, indexes, and server-only RLS.
- Server Actions (`app/actions/messages.ts`) with strict authorization (only the applicant or job employer can read/write messages for a given application), rate-limiting, and Zod validation.
- Vercel-ready webhook dispatcher (`app/api/webhooks/messages/route.ts`) that triggers outbound notifications whenever a message is sent.
- A clean, modern chat modal (`components/ApplicationChatModal.tsx`) with sleek message bubbles, auto-scroll, real-time poll/refresh, and a prominent `Send` icon button (avoiding bulky message-box icons).
- Integrated into both `EmployerAppView` (Candidates list) and `JobseekerAppView` (My Applications tab).

**Tech Stack:** Next.js 16 (App Router), React 19, Supabase (PostgreSQL), Clerk Authentication, Tailwind CSS v4, Lucide React (`Send` icon).

---

## Global Constraints
- Only authorized parties (application applicant or job posting employer) may read or post messages.
- Must use `Send` from `lucide-react` for all message actions — no bulky or generic messagebox icons.
- All database queries must run through the existing server-side admin client (`getSupabaseAdmin()`) with deny-all RLS.
- Server actions must wrap logic in `run()` from `lib/action.ts` and handle Zod validation and rate limits cleanly.
- Must run and verify migrations via `npm run db:migrate`.

## Review Focus
1. **Unauthorized Access:** An employer attempting to view messages on an application for someone else's job must receive a 403 / "Application not found".
2. **Empty / Oversized Messages:** Blank text or messages > 2000 characters must fail Zod validation with friendly user error.
3. **Sender Attribution:** Messages must record the sender's verified user ID and role (`employer` vs `jobseeker`) from the server session, never trusting client parameters.
4. **Vercel Webhook Resilience:** Outbound notification webhook dispatch must fail gracefully without failing the message save if the webhook endpoint is unconfigured.
5. **Mobile Responsiveness:** The chat modal must render comfortably on mobile screens with safe-area spacing and a responsive input bar.

---

### Task 1: Database Migration for Application Messages

**Files:**
- Create: `supabase/migrations/0006_application_messages.sql`
- Verify: `scripts/migrate.mjs`

**Steps:**
- [ ] Create `supabase/migrations/0006_application_messages.sql` with table `public.application_messages`:
  - `id text primary key default gen_random_uuid()::text`
  - `application_id text not null references public.applications(id) on delete cascade`
  - `sender_id text not null references public.profiles(id) on delete cascade`
  - `sender_role text not null check (sender_role in ('employer', 'jobseeker'))`
  - `sender_name text not null`
  - `content text not null`
  - `read_at timestamp with time zone`
  - `created_at timestamp with time zone default timezone('utc'::text, now()) not null`
  - Indexes on `(application_id, created_at asc)` and `(sender_id)`
  - Enable RLS on `public.application_messages` with no public policies (server-only access).
- [ ] Run `npm run db:migrate` and verify migration applies cleanly.

---

### Task 2: Data Access & Types in `lib/db.ts` and `lib/types.ts`

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/db.ts`
- Modify: `lib/validation.ts`

**Steps:**
- [ ] Add `ApplicationMessage` interface to `lib/types.ts`:
  ```ts
  export interface ApplicationMessage {
    id: string;
    applicationId: string;
    senderId: string;
    senderRole: "employer" | "jobseeker";
    senderName: string;
    content: string;
    readAt?: string;
    createdAt: string;
  }
  ```
- [ ] Add `messageInputSchema` in `lib/validation.ts`:
  ```ts
  export const messageInputSchema = z.object({
    applicationId: z.string().min(1),
    content: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message too long"),
  });
  ```
- [ ] Add message helper functions in `lib/db.ts`:
  - `listApplicationMessages(applicationId: string): Promise<ApplicationMessage[]>`
  - `insertApplicationMessage(msg: Omit<ApplicationMessage, "id" | "createdAt">): Promise<ApplicationMessage>`
  - `markMessagesAsRead(applicationId: string, recipientId: string): Promise<void>`
  - `getApplicationAccess(applicationId: string, userId: string): Promise<{ authorized: boolean; role: 'employer' | 'jobseeker'; otherPartyName: string; jobTitle: string } | null>`

---

### Task 3: Server Actions & Webhook Dispatcher

**Files:**
- Create: `app/actions/messages.ts`
- Create: `app/api/webhooks/messages/route.ts`

**Steps:**
- [ ] Create `app/actions/messages.ts`:
  - `fetchApplicationMessagesAction(applicationId: string)`: Validates user session, checks application access, marks incoming unread messages as read, returns message list.
  - `sendApplicationMessageAction(input: unknown)`: Validates user session, rate-limits (`60/hour`), validates schema, verifies caller access, inserts message into DB, triggers asynchronous notification webhook if configured, returns inserted message.
- [ ] Create `app/api/webhooks/messages/route.ts`:
  - Receives message dispatch payload (`applicationId`, `senderName`, `senderRole`, `recipientId`, `contentSnippet`).
  - Supports Vercel serverless environment (optional webhook URL or integration forwarding).
  - Verifies optional webhook shared secret `MESSAGE_WEBHOOK_SECRET` for secure incoming/outgoing webhooks.

---

### Task 4: Clean Chat Modal Component (`components/ApplicationChatModal.tsx`)

**Files:**
- Create: `components/ApplicationChatModal.tsx`

**Steps:**
- [ ] Build `ApplicationChatModal.tsx` using `Dialog` component:
  - Clean title header: Candidate Name, Job Title, and employer/applicant badge.
  - Scrollable message thread area with distinct bubble styles:
    - User's own messages: Right-aligned, primary blue theme, timestamp.
    - Other party's messages: Left-aligned, light surface theme, sender name, timestamp.
  - Empty state with friendly prompt: "No messages yet. Send a message to discuss this application, schedule details, or next steps."
  - Responsive footer input bar:
    - Clean text input / textarea with auto-focus.
    - Sleek **`Send`** button using `lucide-react`'s `<Send className="w-4 h-4" />` icon (clean, minimalist, modern).
    - Loading spinner during transmission (`Loader2`).
    - Enter key sends message (`Ctrl+Enter` or `Enter` without Shift).

---

### Task 5: Integration into Employer and Jobseeker Portals

**Files:**
- Modify: `components/overview/EmployerAppView.tsx`
- Modify: `components/overview/JobseekerAppView.tsx`

**Steps:**
- [ ] In `EmployerAppView.tsx`:
  - Add chat state: `const [chatApp, setChatApp] = useState<Application | null>(null);`
  - In each candidate card next to "Stage" and "View resume", add a clean button:
    ```tsx
    <button
      onClick={() => setChatApp(app)}
      className="h-10 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-2 hover:bg-surface-3 transition-colors cursor-pointer"
    >
      <Send className="w-4 h-4 text-blue-600" /> Message
    </button>
    ```
  - Render `<ApplicationChatModal application={chatApp} onClose={() => setChatApp(null)} />`
- [ ] In `JobseekerAppView.tsx`:
  - In the "My Applications" tab, next to the status badge on each submitted application:
  - Add `<button onClick={() => setChatApp(app)} ...> <Send className="w-4 h-4 text-blue-600" /> Message employer</button>`.
  - Render `<ApplicationChatModal application={chatApp} onClose={() => setChatApp(null)} />`.

---

### Task 6: Verification and Build Validation

**Files:**
- All touched files

**Steps:**
- [ ] Run `npm run db:migrate` to verify the new table exists.
- [ ] Run `npm run build` or `next lint` to confirm TypeScript types, zero errors, and clean bundle compilation.
- [ ] Test message flow:
  - Employer sending a message to an applicant.
  - Applicant receiving and replying.
  - Ensuring `Send` icon renders cleanly on both mobile and desktop.
