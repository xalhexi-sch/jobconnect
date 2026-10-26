"use server";

import { requireUser } from "@/lib/auth";
import {
  audit,
  getApplication,
  getJobById,
  getResumeRef,
  insertApplication,
  listApplicationsByApplicant,
  listApplicationsForEmployer,
  updateApplication,
} from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { run, UserError, type ActionResult } from "@/lib/action";
import { applicationInputSchema, statusUpdateSchema } from "@/lib/validation";
import type { Application } from "@/lib/types";

/** The signed-in user's own applications. */
export async function fetchUserApplicationsAction(): Promise<ActionResult<{ applications: Application[] }>> {
  return run(async () => {
    const user = await requireUser();
    return { applications: await listApplicationsByApplicant(user.id) };
  });
}

/** Applications to jobs posted by the signed-in user. */
export async function fetchEmployerApplicationsAction(): Promise<ActionResult<{ applications: Application[] }>> {
  return run(async () => {
    const user = await requireUser();
    return { applications: await listApplicationsForEmployer(user.id) };
  });
}

/** Any signed-in user can apply to an active job listing. */
export async function submitApplicationAction(input: unknown): Promise<ActionResult<{ application: Application }>> {
  return run(async () => {
    const user = await requireUser();
    await rateLimit(`apply:${user.id}`, 30, 3600);
    const data = applicationInputSchema.parse(input);

    const job = await getJobById(data.jobId);
    if (!job || job.status !== "Active") throw new UserError("This job is no longer accepting applications.");

    const { application, duplicate } = await insertApplication({
      jobId: job.id,
      applicantId: user.id,
      applicantName: data.applicantName || user.fullName,
      applicantEmail: data.applicantEmail || user.email,
      phone: data.phone || user.phone,
      coverLetter: data.coverLetter,
      resume: await getResumeRef(user.id),
    });
    if (duplicate || !application) throw new UserError("You already applied to this job.");
    await audit(user.id, "application.submit", application.id, { jobId: job.id });
    return { application };
  });
}

const STAGES_ALLOWED = new Set(["Under Review", "Interview Scheduled", "Offer Extended", "Rejected"]);

export async function updateApplicationStatusAction(
  applicationId: string,
  status: string,
  interviewDate?: string
): Promise<ActionResult> {
  return run(async () => {
    const user = await requireUser();
    const data = statusUpdateSchema.parse({ applicationId, status, interviewDate });
    await rateLimit(`app-status:${user.id}`, 120, 3600);

    const app = await getApplication(data.applicationId);
    if (!app) throw new UserError("Application not found.");

    if (data.status === "Withdrawn") {
      if (app.applicantId !== user.id) throw new UserError("Application not found.");
      if (app.status === "Rejected" || app.status === "Offer Extended") {
        throw new UserError("This application can no longer be withdrawn.");
      }
    } else {
      if (app.employerId !== user.id && user.role !== "admin") throw new UserError("Application not found.");
      if (!STAGES_ALLOWED.has(data.status)) throw new UserError("Invalid stage.");
      if (app.status === "Withdrawn") throw new UserError("The applicant withdrew this application.");
    }

    await updateApplication(app.id, data.status, data.interviewDate);
    await audit(user.id, "application.status", app.id, { status: data.status });
    return {};
  });
}
