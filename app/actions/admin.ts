"use server";

import { requireRole } from "@/lib/auth";
import { audit, listEmployerProfiles, setCompanyVerified, setSuspended } from "@/lib/db";
import { run, UserError, type ActionResult } from "@/lib/action";
import type { UserProfile } from "@/lib/types";

export async function adminListEmployersAction(): Promise<ActionResult<{ employers: UserProfile[] }>> {
  return run(async () => {
    await requireRole("admin");
    return { employers: await listEmployerProfiles() };
  });
}

export async function adminVerifyCompanyAction(userId: string, verified: boolean): Promise<ActionResult> {
  return run(async () => {
    const admin = await requireRole("admin");
    if (typeof userId !== "string" || !userId || userId.length > 100) throw new UserError("Invalid employer.");
    if (!(await setCompanyVerified(userId, Boolean(verified)))) throw new UserError("Employer not found.");
    await audit(admin.id, verified ? "company.verify" : "company.unverify", userId);
    return {};
  });
}

export async function adminSetSuspendedAction(userId: string, suspended: boolean): Promise<ActionResult> {
  return run(async () => {
    const admin = await requireRole("admin");
    if (typeof userId !== "string" || !userId || userId.length > 100) throw new UserError("Invalid user.");
    if (userId === admin.id) throw new UserError("You cannot suspend yourself.");
    if (!(await setSuspended(userId, Boolean(suspended)))) throw new UserError("User not found.");
    await audit(admin.id, suspended ? "user.suspend" : "user.unsuspend", userId);
    return {};
  });
}
