"use server";

import { getProfileFromDb, updateProfileInDb } from "@/lib/db";
import { UserProfile } from "@/lib/types";

export async function fetchUserProfileAction(userId: string): Promise<UserProfile> {
  return await getProfileFromDb(userId);
}

export async function saveUserProfileAction(profileData: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const profile = await updateProfileInDb(profileData);
    return { success: true, profile };
  } catch (error: any) {
    console.error("saveUserProfileAction error:", error);
    return { success: false, error: error.message || "Failed to save profile." };
  }
}
