import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: any = payload;

  // If a webhook secret is provided in production, verify with Svix
  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Missing svix headers", { status: 400 });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Clerk Webhook verification failed:", err);
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }
  }

  const eventType = evt.type;
  console.log(`Clerk Webhook received: ${eventType}`);

  // Sync user record to Supabase profiles table
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses, public_metadata } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0] || "Butuan User";
    const role = (public_metadata?.role as string) || "jobseeker";

    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from("profiles").upsert(
        {
          id,
          full_name: fullName,
          email,
          role: role === "employer" ? "employer" : "jobseeker",
          location: "Butuan City",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Failed to sync Clerk user to Supabase:", error.message);
      } else {
        console.log(`Successfully synced user ${id} (${fullName}) to Supabase profiles.`);
      }
    } catch (dbErr) {
      console.error("Database connection error in webhook:", dbErr);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      const admin = getSupabaseAdmin();
      await admin.from("profiles").delete().eq("id", id);
      console.log(`Deleted profile for Clerk user ${id}`);
    } catch (delErr) {
      console.error("Error deleting profile:", delErr);
    }
  }

  return NextResponse.json({ success: true, event: eventType });
}
