"use server";

import { getSessionUser, requireUser } from "@/lib/auth";
import { audit, getProfile, listSavedJobIds, patchProfile, setSaved } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { run, UserError, type ActionResult } from "@/lib/action";
import { onboardingSchema, profileUpdateSchema } from "@/lib/validation";
import type { UserProfile } from "@/lib/types";

/** Called on sign-in: ensures the profile exists and returns the server-trusted profile (incl. role). */
export async function fetchUserProfileAction(): Promise<UserProfile | null> {
  try {
    const user = await getSessionUser();
    return user ? await getProfile(user.id) : null;
  } catch (error) {
    console.error("fetchUserProfileAction failed:", error);
    return null;
  }
}

/** One-time role selection. Only jobseeker/employer can be chosen; admin is never self-assignable. */
export async function completeOnboardingAction(input: unknown): Promise<ActionResult<{ profile: UserProfile }>> {
  return run(async () => {
    const user = await requireUser();
    if (user.onboarded) throw new UserError("Your account is already set up.");
    const d = onboardingSchema.parse(input);
    if (d.role === "employer" && !d.companyName?.trim()) throw new UserError("Company name is required.");
    const profile = await patchProfile(user.id, {
      role: d.role,
      full_name: d.fullName,
      phone: d.phone || null,
      location: d.location || null,
      headline: d.headline || null,
      company_name: d.role === "employer" ? d.companyName : null,
      company_industry: d.role === "employer" ? d.companyIndustry || null : null,
      onboarded: true,
    });
    await audit(user.id, "onboarding.complete", user.id, { role: d.role });
    return { profile };
  });
}

/** Whitelisted profile fields only: role, email, verification and suspension can never be set here. */
export async function saveUserProfileAction(input: unknown): Promise<ActionResult<{ profile: UserProfile }>> {
  return run(async () => {
    const user = await requireUser();
    await rateLimit(`profile:${user.id}`, 30, 3600);
    const d = profileUpdateSchema.parse(input);
    const patch: Record<string, unknown> = {};
    if (d.fullName !== undefined) patch.full_name = d.fullName;
    if (d.phone !== undefined) patch.phone = d.phone || null;
    if (d.location !== undefined) patch.location = d.location || null;
    if (d.headline !== undefined) patch.headline = d.headline || null;
    if (d.bio !== undefined) patch.bio = d.bio || null;
    if (d.skills !== undefined) patch.skills = d.skills;
    if (d.education !== undefined) patch.education = d.education || null;
    if (d.portfolioUrl !== undefined) patch.portfolio_url = d.portfolioUrl || null;
    if (d.expectedSalary !== undefined) patch.expected_salary = d.expectedSalary || null;
    if (user.role === "employer") {
      if (d.companyName !== undefined) patch.company_name = d.companyName || null;
      if (d.companyIndustry !== undefined) patch.company_industry = d.companyIndustry || null;
    }
    return { profile: await patchProfile(user.id, patch) };
  });
}

export async function fetchSavedJobIdsAction(): Promise<string[]> {
  try {
    const user = await getSessionUser();
    return user ? await listSavedJobIds(user.id) : [];
  } catch {
    return [];
  }
}

export async function toggleSavedJobAction(jobId: string, saved: boolean): Promise<ActionResult> {
  return run(async () => {
    const user = await requireUser();
    if (typeof jobId !== "string" || jobId.length > 100) throw new UserError("Invalid job.");
    await rateLimit(`save:${user.id}`, 200, 3600);
    await setSaved(user.id, jobId, saved);
    return {};
  });
}
