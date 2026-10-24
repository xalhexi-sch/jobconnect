import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { RoleType } from "@/lib/types";

export class AuthError extends Error {
  constructor(message: string, public status: 401 | 403 = 401) {
    super(message);
  }
}

export interface SessionUser {
  id: string;
  role: RoleType;
  onboarded: boolean;
  suspended: boolean;
  companyVerified: boolean;
  fullName: string;
  email: string;
  phone: string;
}

/** Ensures a profile row exists for the signed-in Clerk user without ever changing an existing role. */
async function ensureProfile(userId: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) return data;

  const u = await currentUser();
  const email = u?.primaryEmailAddress?.emailAddress ?? "";
  const fullName =
    u?.fullName || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || email.split("@")[0] || "New User";
  const { data: created, error } = await admin
    .from("profiles")
    .upsert({ id: userId, full_name: fullName, email, role: "jobseeker" }, { onConflict: "id", ignoreDuplicates: true })
    .select("*")
    .maybeSingle();
  if (error) throw new Error("Could not create profile");
  if (created) return created;
  const { data: again } = await admin.from("profiles").select("*").eq("id", userId).single();
  return again;
}

/** Returns the authenticated user (role from the database, never from the client) or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const p = await ensureProfile(userId);
  if (!p) return null;
  return {
    id: p.id,
    role: p.role as RoleType,
    onboarded: Boolean(p.onboarded),
    suspended: Boolean(p.suspended),
    companyVerified: Boolean(p.company_verified),
    fullName: p.full_name ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError("Please sign in to continue.", 401);
  if (user.suspended) throw new AuthError("This account is suspended.", 403);
  return user;
}

export async function requireRole(...roles: RoleType[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new AuthError("You don't have permission to do that.", 403);
  return user;
}
