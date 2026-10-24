import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

interface ClerkUserEvent {
  type: string;
  data: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    primary_email_address_id?: string | null;
    email_addresses?: { id: string; email_address: string }[];
  };
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set; rejecting webhook.");
    return new NextResponse("Webhook not configured", { status: 503 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  // Svix signs the exact raw body; never re-serialize.
  const body = await req.text();
  let evt: ClerkUserEvent;
  try {
    new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
    evt = JSON.parse(body) as ClerkUserEvent;
  } catch {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  const db = getSupabaseAdmin();

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
    const email =
      email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address ??
      email_addresses?.[0]?.email_address ??
      "";
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0] || "New User";

    // Role is intentionally NOT synced from Clerk metadata: roles live in our database only.
    const { data: existing } = await db.from("profiles").select("id").eq("id", id).maybeSingle();
    const { error } = existing
      ? await db.from("profiles").update({ email, updated_at: new Date().toISOString() }).eq("id", id)
      : await db.from("profiles").insert({ id, full_name: fullName, email, role: "jobseeker" });
    if (error) {
      console.error("Webhook profile sync failed:", error.message);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  if (evt.type === "user.deleted") {
    const { error } = await db.from("profiles").delete().eq("id", evt.data.id);
    if (error) {
      console.error("Webhook profile delete failed:", error.message);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
