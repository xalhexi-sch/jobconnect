"use server";

import { getApplicationsFromDb, insertApplicationToDb, updateApplicationStatusInDb } from "@/lib/db";
import { Application } from "@/lib/types";

export async function fetchUserApplicationsAction(userId: string): Promise<Application[]> {
  try {
    return await getApplicationsFromDb(userId);
  } catch (error) {
    console.error("fetchUserApplicationsAction error:", error);
    return [];
  }
}

export async function submitApplicationAction(data: {
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl?: string;
}): Promise<{ success: boolean; application?: Application; error?: string }> {
  try {
    if (!data.jobId || !data.applicantName || !data.applicantEmail) {
      return { success: false, error: "Missing required application fields." };
    }

    const application = await insertApplicationToDb(data);
    return { success: true, application };
  } catch (error: any) {
    console.error("submitApplicationAction error:", error);
    return { success: false, error: error.message || "Failed to submit application." };
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: Application["status"],
  interviewDate?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updateApplicationStatusInDb(applicationId, newStatus, interviewDate);
    return { success };
  } catch (error: any) {
    console.error("updateApplicationStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}
