import "server-only";
import { getSupabaseAdmin } from "./supabase";
import type { Job, Application, UserProfile } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function mapJob(r: Row): Job {
  return {
    id: r.id,
    title: r.title,
    company: r.company,
    companyLogo: r.company_logo || "/hero-applicant.png",
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

function mapApplication(r: Row): Application {
  return {
    id: r.id,
    jobId: r.job_id,
    applicantId: r.applicant_id,
    applicantName: r.applicant_name,
    applicantEmail: r.applicant_email,
    employerId: r.jobs?.employer_id,
    jobTitle: r.jobs?.title || "Job Application",
    company: r.jobs?.company || "Employer",
    companyLogo: r.jobs?.company_logo || "/hero-applicant.png",
    location: r.jobs?.location || "Butuan City",
    salary: r.jobs?.salary || "Competitive",
    appliedDate: shortDate(r.applied_at),
    status: r.status,
    interviewDate: r.interview_date || undefined,
    coverLetter: r.cover_letter || undefined,
    resumeUrl: r.resume_url || undefined,
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
    resumeFileName: r.resume_url ? "Resume" : "",
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
  return (data ?? []).map(mapApplication);
}

export async function listApplicationsForEmployer(employerId: string): Promise<Application[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .select("*, jobs!inner(*)")
    .eq("jobs.employer_id", employerId)
    .order("applied_at", { ascending: false });
  if (error) fail("loading applicants", error);
  return (data ?? []).map(mapApplication);
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
  resumeUrl?: string;
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
      resume_url: a.resumeUrl || null,
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

/* ---------------------------------- Audit -------------------------------- */

export async function audit(actorId: string, action: string, target?: string, meta?: Row) {
  const { error } = await getSupabaseAdmin().from("audit_log").insert({ actor_id: actorId, action, target, meta });
  if (error) console.error("[audit] failed:", error.message);
}
