"use server";

import { getJobsFromDb, insertJobToDb } from "@/lib/db";
import { Job } from "@/lib/types";

export async function fetchJobsAction(category?: string): Promise<Job[]> {
  try {
    return await getJobsFromDb(category);
  } catch (error) {
    console.error("fetchJobsAction failed:", error);
    return [];
  }
}

export async function createJobAction(jobData: Partial<Job> & { employerId?: string }): Promise<{ success: boolean; job?: Job; error?: string }> {
  try {
    if (!jobData.title || !jobData.company || !jobData.location) {
      return { success: false, error: "Title, Company, and Location are required." };
    }

    const job = await insertJobToDb(jobData);
    return { success: true, job };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create job";
    console.error("createJobAction failed:", message);
    return { success: false, error: message };
  }
}
