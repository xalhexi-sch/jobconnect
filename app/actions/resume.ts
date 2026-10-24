"use server";

import { randomUUID } from "node:crypto";
import { requireRole, requireUser } from "@/lib/auth";
import { audit, getApplicationResumeRef, getResumeRef, patchProfile } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";
import { run, UserError, type ActionResult } from "@/lib/action";

const BUCKET = "resumes";
const MAX_BYTES = 5 * 1024 * 1024;
const SIGNED_URL_SECONDS = 120;

/** Verify the real file type from magic bytes; the browser-supplied MIME type is not trusted. */
function detect(buf: Uint8Array): { ext: string; mime: string } | null {
  const startsWith = (...b: number[]) => b.every((v, i) => buf[i] === v);
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return { ext: "pdf", mime: "application/pdf" };
  if (startsWith(0xd0, 0xcf, 0x11, 0xe0)) return { ext: "doc", mime: "application/msword" };
  if (startsWith(0x50, 0x4b, 0x03, 0x04)) {
    return { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  }
  return null;
}

/** Seeker uploads (or replaces) their resume. Expects FormData with a "file" field. */
export async function uploadResumeAction(formData: FormData): Promise<ActionResult<{ fileName: string }>> {
  return run(async () => {
    const user = await requireRole("jobseeker");
    await rateLimit(`resume-upload:${user.id}`, 10, 3600);

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) throw new UserError("Choose a file to upload.");
    if (file.size > MAX_BYTES) throw new UserError("Resume must be 5 MB or smaller.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = detect(bytes);
    if (!kind) throw new UserError("Only PDF, DOC or DOCX files are allowed.");

    const db = getSupabaseAdmin();
    const path = `${user.id}/${randomUUID()}.${kind.ext}`;
    const { error } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: kind.mime, upsert: false });
    if (error) {
      console.error("[resume] upload failed:", error.message);
      throw new UserError("Upload failed. Please try again.");
    }

    const previous = await getResumeRef(user.id);
    const safeName = file.name.replace(/[^\w.\- ]/g, "_").slice(0, 100) || `resume.${kind.ext}`;
    await patchProfile(user.id, { resume_url: path, resume_name: safeName });
    // Applications keep their own snapshot path, so only remove the old file if nothing references it.
    if (previous) {
      const { count } = await db.from("applications").select("id", { count: "exact", head: true }).eq("resume_url", previous.path);
      if (!count) await db.storage.from(BUCKET).remove([previous.path]);
    }
    await audit(user.id, "resume.upload", path);
    return { fileName: safeName };
  });
}

/** Short-lived link to the signed-in seeker's own resume. */
export async function getMyResumeLinkAction(): Promise<ActionResult<{ url: string }>> {
  return run(async () => {
    const user = await requireUser();
    const ref = await getResumeRef(user.id);
    if (!ref) throw new UserError("You haven't uploaded a resume yet.");
    const { data, error } = await getSupabaseAdmin().storage.from(BUCKET).createSignedUrl(ref.path, SIGNED_URL_SECONDS, { download: ref.name });
    if (error || !data) throw new UserError("Could not open the resume.");
    return { url: data.signedUrl };
  });
}

/** Short-lived link to an applicant's resume. Only the employer who owns the job (or the applicant) may open it. */
export async function getApplicationResumeLinkAction(applicationId: string): Promise<ActionResult<{ url: string }>> {
  return run(async () => {
    const user = await requireUser();
    await rateLimit(`resume-view:${user.id}`, 200, 3600);
    const ref = await getApplicationResumeRef(String(applicationId).slice(0, 100));
    const allowed = ref && (ref.employerId === user.id || ref.applicantId === user.id || user.role === "admin");
    if (!ref || !allowed) throw new UserError("Resume not available.");
    const { data, error } = await getSupabaseAdmin().storage.from(BUCKET).createSignedUrl(ref.path, SIGNED_URL_SECONDS, { download: ref.name });
    if (error || !data) throw new UserError("Could not open the resume.");
    await audit(user.id, "resume.view", applicationId);
    return { url: data.signedUrl };
  });
}
