"use client";

import React, { useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, FileText, Loader2, Send, UploadCloud } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import CompanyLogo from "@/components/CompanyLogo";

export default function ApplyModal() {
  const { applyModalJob, setApplyModalJob, applyToJob, userProfile, user, uploadResume } = useApp();
  const close = () => setApplyModalJob(null);

  return (
    <Dialog
      open={Boolean(applyModalJob)}
      onClose={close}
      title="Apply to this job"
      description={applyModalJob ? `${applyModalJob.title} at ${applyModalJob.company}` : undefined}
    >
      {applyModalJob && (
        <ApplyForm
          key={applyModalJob.id}
          job={applyModalJob}
          defaults={{
            name: user.fullName || userProfile.fullName || "",
            email: user.email || userProfile.email || "",
            phone: userProfile.phone || "",
          }}
          resumeName={userProfile.resumeFileName}
          onUpload={uploadResume}
          onSubmit={applyToJob}
          onCancel={close}
        />
      )}
    </Dialog>
  );
}

function ApplyForm({
  job,
  defaults,
  resumeName,
  onUpload,
  onSubmit,
  onCancel,
}: {
  job: NonNullable<ReturnType<typeof useApp>["applyModalJob"]>;
  defaults: { name: string; email: string; phone: string };
  resumeName: string;
  onUpload: (file: File) => Promise<boolean>;
  onSubmit: ReturnType<typeof useApp>["applyToJob"];
  onCancel: () => void;
}) {
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [phone, setPhone] = useState(defaults.phone);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    await onSubmit(job, { applicantName: name, applicantEmail: email, phone, coverNote: note });
    setSubmitting(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
        <CompanyLogo name={job.company} src={job.companyLogo} size={40} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{job.title}</p>
          <p className="text-xs text-fg-muted truncate">{job.company} · {job.salary}</p>
        </div>
      </div>

      <div>
        <label htmlFor="ap-name" className="block text-sm font-medium mb-1.5">Full name</label>
        <input id="ap-name" className="field" required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="ap-email" className="block text-sm font-medium mb-1.5">Email</label>
          <input id="ap-email" className="field" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ap-phone" className="block text-sm font-medium mb-1.5">Mobile number</label>
          <input id="ap-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium mb-1.5">Resume</span>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={pickFile} aria-label="Upload resume" />
        {resumeName ? (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-line bg-surface-2">
            <span className="flex items-center gap-2 min-w-0 text-sm">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate font-medium">{resumeName}</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-label="Attached" />
            </span>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-sm font-semibold text-brand hover:underline cursor-pointer shrink-0">
              {uploading ? "Uploading…" : "Replace"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-brand hover:bg-blue-50 text-sm text-fg-muted flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4 text-brand" />}
            {uploading ? "Uploading…" : "Upload PDF or Word (max 5 MB)"}
          </button>
        )}
      </div>

      <div>
        <label htmlFor="ap-note" className="block text-sm font-medium mb-1.5">
          Cover note <span className="text-fg-muted font-normal">(optional)</span>
        </label>
        <textarea id="ap-note" className="field resize-none" rows={3} maxLength={3000} placeholder="Tell them briefly why you’re a good fit…" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="h-11 px-5 rounded-xl border border-line bg-surface-2 text-sm font-semibold cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={submitting || uploading} className="flex-1 btn-brand-primary h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? "Sending…" : "Send application"}
        </button>
      </div>
    </form>
  );
}
