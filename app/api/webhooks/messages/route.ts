import { NextResponse, type NextRequest } from "next/server";

/**
 * Message webhook handler for Vercel + Supabase deployment.
 * Can be hooked to Slack, Discord, SMS providers (e.g. Twilio/Semaphore), or external notification services.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.MESSAGE_WEBHOOK_SECRET;
    if (secret) {
      const incomingSecret =
        req.headers.get("x-webhook-secret") || req.headers.get("authorization")?.replace("Bearer ", "");
      if (incomingSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await req.json();

    // Log the notification event cleanly in Vercel logs
    console.log("[webhook:messages] Notification event received:", {
      event: payload.event || "message.created",
      applicationId: payload.applicationId,
      senderRole: payload.senderRole,
      senderName: payload.senderName,
      recipientId: payload.recipientId,
      jobTitle: payload.jobTitle,
      timestamp: payload.createdAt || new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      delivered: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[webhook:messages] Processing error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
