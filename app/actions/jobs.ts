"use server";

import { requireRole, requireUser } from "@/lib/auth";
import {
  audit, getJobById, insertJob, listActiveJobs, listJobsByEmployer, listJobsByStatus, searchJobs, setJobStatus,
  type JobSearch,
} from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { run, UserError, type ActionResult } from "@/lib/action";
import { jobInputSchema } from "@/lib/validation";
import type { Job } from "@/lib/types";

/** Public: only Active listings. */
export async function fetchJobsAction(category?: string): Promise<Job[]> {
  try {
    return await listActiveJobs({ category });
  } catch (error) {
    console.error("fetchJobsAction failed:", error);
    return [];
  }
}

/** Public: server-side search with cursor pagination. */
export async function searchJobsAction(input: JobSearch): Promise<{ jobs: Job[]; nextCursor: string | null }> {
  try {
    return await searchJobs({
      q: typeof input?.q === "string" ? input.q : undefined,
      category: typeof input?.category === "string" ? input.category : undefined,
      type: typeof input?.type === "string" ? input.type : undefined,
      city: typeof input?.city === "string" ? input.city : undefined,
      minSalary: Number.isFinite(input?.minSalary) ? Number(input.minSalary) : undefined,
      cursor: typeof input?.cursor === "string" ? input.cursor : undefined,
      limit: Number.isFinite(input?.limit) ? Number(input.limit) : undefined,
    });
  } catch (error) {
    console.error("searchJobsAction failed:", error);
    return { jobs: [], nextCursor: null };
  }
}

/** Signed-in user: all of their own posted listings. */
export async function fetchMyJobsAction(): Promise<ActionResult<{ jobs: Job[] }>> {
  return run(async () => {
    const user = await requireUser();
    return { jobs: await listJobsByEmployer(user.id) };
  });
}

/** Any signed-in user can post a job vacancy; immediately live (Active) without verification delay. */
export async function createJobAction(input: unknown): Promise<ActionResult<{ job: Job }>> {
  return run(async () => {
    const user = await requireUser();
    await rateLimit(`post-job:${user.id}`, 30, 3600);
    const data = jobInputSchema.parse(input);
    const status = "Active";
    const job = await insertJob(user.id, data, status);
    await audit(user.id, "job.create", job.id, { status });
    return { job };
  });
}

/** Owner: close or re-open own listing. */
export async function setMyJobStatusAction(jobId: string, status: "Active" | "Expired"): Promise<ActionResult> {
  return run(async () => {
    const user = await requireUser();
    if (status !== "Active" && status !== "Expired") throw new UserError("Invalid status.");
    const job = await getJobById(jobId);
    if (!job || job.employerId !== user.id) throw new UserError("Job not found.");
    await setJobStatus(jobId, status, user.id);
    await audit(user.id, "job.status", jobId, { status });
    return {};
  });
}

/** Admin: moderation queue. */
export async function adminListPendingJobsAction(): Promise<ActionResult<{ jobs: Job[] }>> {
  return run(async () => {
    await requireRole("admin");
    return { jobs: await listJobsByStatus("Pending") };
  });
}

export async function adminReviewJobAction(jobId: string, approve: boolean): Promise<ActionResult> {
  return run(async () => {
    const admin = await requireRole("admin");
    const ok = await setJobStatus(jobId, approve ? "Active" : "Expired");
    if (!ok) throw new UserError("Job not found.");
    await audit(admin.id, approve ? "job.approve" : "job.reject", jobId);
    return {};
  });
}
