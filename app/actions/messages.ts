"use server";

import { requireUser } from "@/lib/auth";
import {
  audit,
  getApplicationChatRef,
  insertApplicationMessage,
  listApplicationMessages,
  markApplicationMessagesRead,
} from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { run, UserError, type ActionResult } from "@/lib/action";
import { messageInputSchema } from "@/lib/validation";
import type { ApplicationMessage } from "@/lib/types";

export interface ChatThreadInfo {
  applicationId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  callerRole: "employer" | "jobseeker";
  otherPartyName: string;
}

/** Fetch messages for a specific application with strict authorization check. */
export async function fetchApplicationMessagesAction(
  applicationId: string
): Promise<ActionResult<{ messages: ApplicationMessage[]; thread: ChatThreadInfo }>> {
  return run(async () => {
    const user = await requireUser();
    if (!applicationId || typeof applicationId !== "string") {
      throw new UserError("Invalid application identifier.");
    }

    const app = await getApplicationChatRef(applicationId);
    if (!app) throw new UserError("Application not found.");

    const isApplicant = app.applicantId === user.id;
    const isEmployer = app.employerId === user.id;
    const isAdmin = user.role === "admin";

    if (!isApplicant && !isEmployer && !isAdmin) {
      throw new UserError("You do not have permission to view messages for this application.");
    }

    const callerRole: "employer" | "jobseeker" = isEmployer || (isAdmin && !isApplicant) ? "employer" : "jobseeker";
    const otherPartyName = callerRole === "employer" ? app.applicantName : app.company || "Employer";

    // Mark messages sent by the other party as read
    await markApplicationMessagesRead(applicationId, user.id);

    const messages = await listApplicationMessages(applicationId);

    return {
      messages,
      thread: {
        applicationId: app.id,
        jobTitle: app.jobTitle,
        company: app.company,
        applicantName: app.applicantName,
        callerRole,
        otherPartyName,
      },
    };
  });
}

/** Send a new message regarding an application. */
export async function sendApplicationMessageAction(
  input: unknown
): Promise<ActionResult<{ message: ApplicationMessage }>> {
  return run(async () => {
    const user = await requireUser();
    await rateLimit(`msg:${user.id}`, 60, 3600);

    const data = messageInputSchema.parse(input);

    const app = await getApplicationChatRef(data.applicationId);
    if (!app) throw new UserError("Application not found.");

    const isApplicant = app.applicantId === user.id;
    const isEmployer = app.employerId === user.id;
    const isAdmin = user.role === "admin";

    if (!isApplicant && !isEmployer && !isAdmin) {
      throw new UserError("You do not have permission to message on this application.");
    }

    const senderRole: "employer" | "jobseeker" = isEmployer || (isAdmin && !isApplicant) ? "employer" : "jobseeker";
    const senderName = user.fullName || (senderRole === "employer" ? app.company : app.applicantName) || "User";
    const recipientId = senderRole === "employer" ? app.applicantId : app.employerId;

    const message = await insertApplicationMessage({
      applicationId: app.id,
      senderId: user.id,
      senderRole,
      senderName,
      content: data.content,
    });

    await audit(user.id, "message.send", message.id, {
      applicationId: app.id,
      recipientId,
    });

    // Asynchronously dispatch notification webhook if configured
    const webhookUrl = process.env.MESSAGE_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": process.env.MESSAGE_WEBHOOK_SECRET || "",
        },
        body: JSON.stringify({
          event: "message.created",
          applicationId: app.id,
          messageId: message.id,
          senderName,
          senderRole,
          recipientId,
          jobTitle: app.jobTitle,
          company: app.company,
          contentSnippet: data.content.slice(0, 100),
          createdAt: message.createdAt,
        }),
      }).catch((err) => {
        console.error("[webhook] dispatch failed:", err.message);
      });
    }

    return { message };
  });
}
