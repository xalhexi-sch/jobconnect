"use server";

import { getProfileFromDb, updateProfileInDb } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase";
import { UserProfile } from "@/lib/types";

export async function fetchUserProfileAction(userId: string): Promise<UserProfile> {
  return await getProfileFromDb(userId);
}

export async function saveUserProfileAction(profileData: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const profile = await updateProfileInDb(profileData);
    return { success: true, profile };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save profile.";
    console.error("saveUserProfileAction error:", message);
    return { success: false, error: message };
  }
}

export async function syncClerkUserAction(userData: {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("profiles").upsert(
      {
        id: userData.id,
        full_name: userData.fullName || "User",
        email: userData.email,
        role: userData.role === "employer" ? "employer" : "jobseeker",
        location: "Butuan City",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error("syncClerkUserAction Supabase error:", error.message);
      return { success: false, error: error.message };
    }
    console.log(`Synced Clerk user ${userData.id} to Supabase`);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync error";
    console.error("syncClerkUserAction error:", msg);
    return { success: false, error: msg };
  }
}
