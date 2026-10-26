import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { Job, Application, UserProfile, ApplicationMessage } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function mapJob(r: Row): Job {
  return {
    id: r.id,
    title: r.title,
    company: r.company,
    companyLogo: r.company_logo || undefined,
    location: r.location,
    barangay: r.barangay,
    city: r.city || "Butuan City",
    salary: r.salary,
    salaryPhp: r.salary_php || 0,
    type: r.type,
    category: r.category,
    status: r.status,
    postedDate: shortDate(r.created_at),
    createdAt: r.created_at,
    appliedCount: r.applied_count || 0,
    featured: r.featured || false,
    description: r.description,
    requirements: r.requirements || [],
    employerId: r.employer_id,
  };
}

function mapApplication(r: Row, profile?: Row, hasUnread = false): Application {
  return {
    id: r.id,
    jobId: r.job_id,
    applicantId: r.applicant_id,
    applicantName: r.applicant_name,
    applicantEmail: r.applicant_email,
    applicantPhone: r.phone || profile?.phone || undefined,
    employerId: r.jobs?.employer_id,
    jobTitle: r.jobs?.title || "Job Application",
    company: r.jobs?.company || "Employer",
    companyLogo: r.jobs?.company_logo || undefined,
    location: r.jobs?.location || "Butuan City",
    salary: r.jobs?.salary || "Competitive",
    appliedDate: shortDate(r.applied_at),
    status: r.status,
    interviewDate: r.interview_date || undefined,
    coverLetter: r.cover_letter || undefined,
    resumeUrl: r.resume_url ? "private" : undefined,
    applicantHeadline: profile?.headline || undefined,
    applicantBio: profile?.bio || undefined,
    applicantLocation: profile?.barangay ? `${profile.barangay}, ${profile.location || "Butuan City"}` : profile?.location || undefined,
    applicantSkills: Array.isArray(profile?.skills) ? profile.skills : [],
    applicantEducation: profile?.education || undefined,
    applicantPortfolioUrl: profile?.portfolio_url || undefined,
    hasUnreadMessages: hasUnread,
  };
}

function mapProfile(r: Row): UserProfile {
  return {
    id: r.id,
    fullName: r.full_name || "",
    email: r.email || "",
    phone: r.phone || "",
    role: r.role || "jobseeker",
    companyName: r.company_name || "",
    companyIndustry: r.company_industry || "",
    companyVerified: Boolean(r.company_verified),
    onboarded: Boolean(r.onboarded),
    location: r.location || "Butuan City",
    headline: r.headline || "",
    bio: r.bio || "",
    skills: r.skills || [],
    education: r.education || "",
    portfolioUrl: r.portfolio_url || "",
    resumeFileName: r.resume_url ? r.resume_name || "Resume" : "",
    resumeUpdated: r.updated_at ? shortDate(r.updated_at) : "",
    expectedSalary: r.expected_salary || "",
  };
}

function fail(what: string, error: { message: string }): never {
  console.error(`[db] ${what}:`, error.message);
  throw new Error(`Database error while ${what}.`);
}

/* ---------------------------------- Jobs --------------------------------- */

export async function listActiveJobs(opts: { category?: string; limit?: number } = {}): Promise<Job[]> {
  let q = getSupabaseAdmin().from("jobs").select("*").eq("status", "Active");
  if (opts.category && opts.category !== "All") q = q.eq("category", opts.category);
  const { data, error } = await q.order("created_at", { ascending: false }).limit(opts.limit ?? 200);
  if (error) fail("loading jobs", error);
  return (data ?? []).map(mapJob);
}

export async function listJobsByEmployer(employerId: string): Promise<Job[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("jobs").select("*").eq("employer_id", employerId).order("created_at", { ascending: false });
  if (error) fail("loading your jobs", error);
  return (data ?? []).map(mapJob);
}

export async function listJobsByStatus(status: string): Promise<Job[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("jobs").select("*").eq("status", status).order("created_at", { ascending: true }).limit(200);
  if (error) fail("loading jobs", error);
  return (data ?? []).map(mapJob);
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await getSupabaseAdmin().from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) fail("loading job", error);
  return data ? mapJob(data) : null;
}

export async function insertJob(
  employerId: string,
  input: Omit<Job, "id" | "postedDate" | "appliedCount" | "status">,
  status: "Active" | "Pending"
): Promise<Job> {
  const { data, error } = await getSupabaseAdmin()
    .from("jobs")
    .insert({
      employer_id: employerId,
      title: input.title,
      company: input.company,
      company_logo: input.companyLogo || null,
      location: input.location,
      barangay: input.barangay || null,
      city: input.city,
      salary: input.salary,
      salary_php: input.salaryPhp,
      type: input.type,
      category: input.category,
      status,
      description: input.description,
      requirements: input.requirements,
      featured: false,
    })
    .select("*")
    .single();
  if (error || !data) fail("posting job", error ?? { message: "no row" });
  return mapJob(data);
}

export async function setJobStatus(id: string, status: string, onlyEmployerId?: string): Promise<boolean> {
  let q = getSupabaseAdmin().from("jobs").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (onlyEmployerId) q = q.eq("employer_id", onlyEmployerId);
  const { data, error } = await q.select("id");
  if (error) fail("updating job", error);
  return (data?.length ?? 0) > 0;
}

/* ------------------------------ Applications ----------------------------- */

export async function listApplicationsByApplicant(userId: string): Promise<Application[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications").select("*, jobs(*)").eq("applicant_id", userId).order("applied_at", { ascending: false });
  if (error) fail("loading applications", error);
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const appIds = rows.map((d) => d.id);
  const { data: unread } = await getSupabaseAdmin()
    .from("application_messages")
    .select("application_id")
    .in("application_id", appIds)
    .neq("sender_id", userId)
    .is("read_at", null);
  const unreadAppIds = new Set((unread ?? []).map((u) => u.application_id));

  return rows.map((r) => mapApplication(r, undefined, unreadAppIds.has(r.id)));
}

export async function listApplicationsForEmployer(employerId: string): Promise<Application[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .select("*, jobs!inner(*)")
    .eq("jobs.employer_id", employerId)
    .order("applied_at", { ascending: false });
  if (error) fail("loading applicants", error);
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const applicantIds = Array.from(new Set(rows.map((d) => d.applicant_id).filter(Boolean)));
  const appIds = rows.map((d) => d.id);

  const [profilesRes, unreadRes] = await Promise.all([
    applicantIds.length > 0
      ? getSupabaseAdmin()
          .from("profiles")
          .select("id, headline, bio, location, barangay, skills, education, portfolio_url, phone")
          .in("id", applicantIds)
      : Promise.resolve({ data: [] }),
    appIds.length > 0
      ? getSupabaseAdmin()
          .from("application_messages")
          .select("application_id")
          .in("application_id", appIds)
          .neq("sender_id", employerId)
          .is("read_at", null)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
  const unreadAppIds = new Set((unreadRes.data ?? []).map((u) => u.application_id));

  return rows.map((r) => mapApplication(r, profileMap.get(r.applicant_id), unreadAppIds.has(r.id)));
}

export async function getApplication(id: string): Promise<Application | null> {
  const { data, error } = await getSupabaseAdmin().from("applications").select("*, jobs(*)").eq("id", id).maybeSingle();
  if (error) fail("loading application", error);
  return data ? mapApplication(data) : null;
}

export async function insertApplication(a: {
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  coverLetter?: string;
  resume?: { path: string; name: string } | null;
}): Promise<{ application?: Application; duplicate?: boolean }> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .insert({
      job_id: a.jobId,
      applicant_id: a.applicantId,
      applicant_name: a.applicantName,
      applicant_email: a.applicantEmail,
      phone: a.phone || null,
      cover_letter: a.coverLetter || null,
      resume_url: a.resume?.path ?? null,
      resume_name: a.resume?.name ?? null,
      status: "Submitted",
    })
    .select("*, jobs(*)")
    .single();
  if (error) {
    if ((error as { code?: string }).code === "23505") return { duplicate: true };
    fail("submitting application", error);
  }
  return { application: mapApplication(data) };
}

export async function updateApplication(id: string, status: string, interviewDate?: string): Promise<void> {
  const patch: Row = { status, updated_at: new Date().toISOString() };
  if (interviewDate !== undefined) patch.interview_date = interviewDate || null;
  const { error } = await getSupabaseAdmin().from("applications").update(patch).eq("id", id);
  if (error) fail("updating application", error);
}

/* -------------------------------- Profiles ------------------------------- */

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await getSupabaseAdmin().from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) fail("loading profile", error);
  return data ? mapProfile(data) : null;
}

export async function patchProfile(userId: string, patch: Row): Promise<UserProfile> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) fail("saving profile", error ?? { message: "no row" });
  return mapProfile(data);
}

/* --------------------------------- Saved --------------------------------- */

export async function listSavedJobIds(userId: string): Promise<string[]> {
  const { data, error } = await getSupabaseAdmin().from("saved_jobs").select("job_id").eq("user_id", userId);
  if (error) fail("loading saved jobs", error);
  return (data ?? []).map((r) => r.job_id);
}

export async function setSaved(userId: string, jobId: string, saved: boolean): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = saved
    ? await db
        .from("saved_jobs")
        .upsert({ user_id: userId, job_id: jobId }, { onConflict: "user_id,job_id", ignoreDuplicates: true })
    : await db.from("saved_jobs").delete().eq("user_id", userId).eq("job_id", jobId);
  if (error) fail("updating saved jobs", error);
}

/* --------------------------------- Search -------------------------------- */

export interface JobSearch {
  q?: string;
  category?: string;
  type?: string;
  city?: string;
  minSalary?: number;
  cursor?: string; // created_at of the last item from the previous page
  limit?: number;
}

export async function searchJobs(s: JobSearch): Promise<{ jobs: Job[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(s.limit ?? 20, 1), 50);
  let q = getSupabaseAdmin().from("jobs").select("*").eq("status", "Active");
  if (s.category && s.category !== "All") q = q.eq("category", s.category);
  if (s.type && s.type !== "All") q = q.eq("type", s.type);
  if (s.city && s.city !== "All") q = q.eq("city", s.city);
  if (s.minSalary) q = q.gte("salary_php", s.minSalary);
  if (s.cursor) q = q.lt("created_at", s.cursor);
  const term = s.q?.trim().replace(/[%,()]/g, " ").slice(0, 80);
  if (term) q = q.or(`title.ilike.%${term}%,company.ilike.%${term}%,description.ilike.%${term}%`);
  const { data, error } = await q.order("created_at", { ascending: false }).limit(limit + 1);
  if (error) fail("searching jobs", error);
  const rows = data ?? [];
  const page = rows.slice(0, limit);
  return { jobs: page.map(mapJob), nextCursor: rows.length > limit ? page[page.length - 1].created_at : null };
}

/* --------------------------------- Resumes ------------------------------- */

export async function getResumeRef(userId: string): Promise<{ path: string; name: string } | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles").select("resume_url, resume_name").eq("id", userId).maybeSingle();
  if (error) fail("loading resume", error);
  return data?.resume_url ? { path: data.resume_url, name: data.resume_name || "Resume" } : null;
}

export async function getApplicationResumeRef(
  applicationId: string
): Promise<{ path: string; name: string; employerId: string; applicantId: string } | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications").select("resume_url, resume_name, applicant_id, jobs(employer_id)").eq("id", applicationId).maybeSingle();
  if (error) fail("loading resume", error);
  if (!data?.resume_url) return null;
  const job = data.jobs as unknown as { employer_id: string } | null;
  return { path: data.resume_url, name: data.resume_name || "Resume", employerId: job?.employer_id ?? "", applicantId: data.applicant_id };
}

/* ---------------------------------- Admin -------------------------------- */

export async function listEmployerProfiles(): Promise<UserProfile[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles").select("*").eq("role", "employer").order("company_verified", { ascending: true }).order("created_at", { ascending: false }).limit(200);
  if (error) fail("loading employers", error);
  return (data ?? []).map(mapProfile);
}

export async function setCompanyVerified(userId: string, verified: boolean): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles").update({ company_verified: verified }).eq("id", userId).eq("role", "employer").select("id");
  if (error) fail("verifying company", error);
  return (data?.length ?? 0) > 0;
}

export async function setSuspended(userId: string, suspended: boolean): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles").update({ suspended }).eq("id", userId).neq("role", "admin").select("id");
  if (error) fail("updating account", error);
  return (data?.length ?? 0) > 0;
}

/* ---------------------------------- Audit -------------------------------- */

export async function audit(actorId: string, action: string, target?: string, meta?: Row) {
  const { error } = await getSupabaseAdmin().from("audit_log").insert({ actor_id: actorId, action, target, meta });
  if (error) console.error("[audit] failed:", error.message);
}


/* --------------------------------- Messages ------------------------------ */

export function mapMessage(r: Row): ApplicationMessage {
  return {
    id: r.id,
    applicationId: r.application_id,
    senderId: r.sender_id,
    senderRole: r.sender_role as "employer" | "jobseeker",
    senderName: r.sender_name,
    content: r.content,
    readAt: r.read_at || undefined,
    createdAt: r.created_at,
  };
}

export async function listApplicationMessages(applicationId: string): Promise<ApplicationMessage[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("application_messages")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });
  if (error) fail("loading messages", error);
  return (data ?? []).map(mapMessage);
}

export async function insertApplicationMessage(msg: {
  applicationId: string;
  senderId: string;
  senderRole: "employer" | "jobseeker";
  senderName: string;
  content: string;
}): Promise<ApplicationMessage> {
  const { data, error } = await getSupabaseAdmin()
    .from("application_messages")
    .insert({
      application_id: msg.applicationId,
      sender_id: msg.senderId,
      sender_role: msg.senderRole,
      sender_name: msg.senderName,
      content: msg.content,
    })
    .select("*")
    .single();
  if (error || !data) fail("sending message", error ?? { message: "insert failed" });
  return mapMessage(data);
}

export async function markApplicationMessagesRead(applicationId: string, currentUserId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("application_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("application_id", applicationId)
    .neq("sender_id", currentUserId)
    .is("read_at", null);
  if (error) console.error("[db] mark messages read failed:", error.message);
}

export async function getApplicationChatRef(
  applicationId: string
): Promise<{
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string;
  employerId: string;
} | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .select("id, job_id, applicant_id, applicant_name, jobs(id, title, company, employer_id)")
    .eq("id", applicationId)
    .maybeSingle();
  if (error) fail("loading application details", error);
  if (!data) return null;
  const job = data.jobs as unknown as { id: string; title: string; company: string; employer_id: string } | null;
  return {
    id: data.id,
    jobId: data.job_id,
    jobTitle: job?.title ?? "Job Application",
    company: job?.company ?? "",
    applicantId: data.applicant_id,
    applicantName: data.applicant_name ?? "Applicant",
    employerId: job?.employer_id ?? "",
  };
}
