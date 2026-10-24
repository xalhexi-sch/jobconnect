"use server";

import { requireRole, requireUser } from "@/lib/auth";
import {
  audit,
  getApplication,
  getJobById,
  insertApplication,
  listApplicationsByApplicant,
  listApplicationsForEmployer,
  updateApplication,
} from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { run, UserError, type ActionResult } from "@/lib/action";
import { applicationInputSchema, statusUpdateSchema } from "@/lib/validation";
import type { Application } from "@/lib/types";

/** The signed-in seeker's own applications. No ID is accepted from the client. */
export async function fetchUserApplicationsAction(): Promise<ActionResult<{ applications: Application[] }>> {
  return run(async () => {
    const user = await requireUser();
    return { applications: await listApplicationsByApplicant(user.id) };
  });
}

/** Applications to the signed-in employer's own jobs. */
export async function fetchEmployerApplicationsAction(): Promise<ActionResult<{ applications: Application[] }>> {
  return run(async () => {
    const user = await requireRole("employer");
    return { applications: await listApplicationsForEmployer(user.id) };
  });
}

export async function submitApplicationAction(input: unknown): Promise<ActionResult<{ application: Application }>> {
  return run(async () => {
    const user = await requireRole("jobseeker");
    if (!user.onboarded) throw new UserError("Complete your profile before applying.");
    await rateLimit(`apply:${user.id}`, 20, 3600);
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
      resumeUrl: data.resumeUrl,
    });
    if (duplicate || !application) throw new UserError("You already applied to this job.");
    await audit(user.id, "application.submit", application.id, { jobId: job.id });
    return { application };
  });
}

const EMPLOYER_ALLOWED = new Set(["Under Review", "Interview Scheduled", "Offer Extended", "Rejected"]);

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
      if (user.role !== "employer" || app.employerId !== user.id) throw new UserError("Application not found.");
      if (!EMPLOYER_ALLOWED.has(data.status)) throw new UserError("Invalid stage.");
      if (app.status === "Withdrawn") throw new UserError("The applicant withdrew this application.");
    }

    await updateApplication(app.id, data.status, data.interviewDate);
    await audit(user.id, "application.status", app.id, { status: data.status });
    return {};
  });
}
