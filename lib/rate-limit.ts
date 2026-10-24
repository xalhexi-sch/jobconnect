import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";

/** Fixed-window limiter backed by the rate_limit_hit() Postgres function. Throws when exceeded. */
export async function rateLimit(key: string, max: number, windowSeconds: number) {
  const { data, error } = await getSupabaseAdmin().rpc("rate_limit_hit", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  });
  if (error) throw new Error("Rate limiter unavailable");
  if (data === false) throw new RateLimitError();
}

export class RateLimitError extends Error {
  constructor() {
    super("Too many requests. Please slow down and try again shortly.");
  }
}
