import "server-only";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";
import { RateLimitError } from "@/lib/rate-limit";
import { firstIssue } from "@/lib/validation";
import { ConfigError } from "@/lib/supabase";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** A failure whose message is safe to show to the user. */
export class UserError extends Error {}

/** Runs a server action body and converts known failures to user-safe errors. */
export async function run<T extends object>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, ...(await fn()) };
  } catch (e) {
    if (e instanceof AuthError || e instanceof RateLimitError || e instanceof UserError) {
      return { ok: false, error: e.message };
    }
    if (e instanceof ZodError) return { ok: false, error: firstIssue(e) };
    if (e instanceof ConfigError) {
      console.error("[config]", e.message);
      return { ok: false, error: "JobConnect is temporarily unavailable. Please try again in a few minutes." };
    }
    console.error("[action] unexpected error:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
