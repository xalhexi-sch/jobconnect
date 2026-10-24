# Operations guide

## Environment
Required in `.env.local` / hosting env: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`,
`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (migrations only), optional `NEXT_PUBLIC_SITE_URL`.
The anon Supabase key is not used: RLS denies it everywhere and all data access is server-side.

## Database
`npm run db:migrate` applies new files in `supabase/migrations/` in order (tracked in `schema_migrations`). Add new changes as new numbered files; never edit applied ones.

## Roles
- `jobseeker` / `employer` are chosen once during onboarding and stored in `profiles.role`.
- **Admin is never self-assignable.** Promote in Supabase: `update profiles set role='admin' where email='you@example.com';`
- Employer jobs stay `Pending` until an admin verifies the company or approves the job in `/admin`.

## Clerk webhook
Point `/api/webhooks/clerk` at user.created, user.updated, user.deleted. Requests without a valid Svix signature are rejected.

## Security notes
Rate limits live in the `rate_limit_hit` Postgres function. Resumes are in the private `resumes` bucket and only reachable via 2-minute signed links issued after an ownership check. Every sensitive action writes to `audit_log`.
