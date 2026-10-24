"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, ExternalLink, MapPin, Send, ShieldCheck, Wifi, Tag, Clock3 } from "lucide-react";
import type { Job } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import Dialog from "@/components/ui/Dialog";
import CompanyLogo from "@/components/CompanyLogo";

export default function JobDetailModal({
  job,
  onClose,
  onApply,
  isSaved,
  hasApplied,
  onToggleBookmark,
}: {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
  hasApplied: boolean;
  onToggleBookmark: (jobId: string) => void;
}) {
  return (
    <Dialog
      open={Boolean(job)}
      onClose={onClose}
      title={job?.title ?? "Job details"}
      description={job ? `${job.company} · ${job.location}` : undefined}
      size="lg"
      footer={
        job && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleBookmark(job.id)}
              aria-pressed={isSaved}
              className={`h-11 px-4 rounded-xl border text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                isSaved ? "text-amber-600 bg-amber-50 border-amber-200" : "text-fg-muted hover:text-fg bg-surface-2 border-line"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </button>

            <Link
              href={`/jobs/${job.id}`}
              className="hidden sm:flex h-11 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold text-fg-muted hover:text-fg items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Open page
            </Link>

            {hasApplied ? (
              <span className="flex-1 h-11 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Application submitted
              </span>
            ) : job.status !== "Active" ? (
              <span className="flex-1 h-11 rounded-xl text-sm font-semibold bg-surface-2 text-fg-muted flex items-center justify-center">
                Not accepting applications
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="flex-1 btn-brand-primary h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Apply now
              </button>
            )}
          </div>
        )
      }
    >
      {job && (
        <div className="space-y-5">
          <div className="flex items-center gap-3.5">
            <CompanyLogo name={job.company} src={job.companyLogo} size={56} />
            <div className="min-w-0">
              <p className="font-semibold">{job.company}</p>
              <p className="text-sm text-fg-muted flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{job.location}</span>
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-xl bg-blue-50 col-span-2 sm:col-span-1">
              <dt className="text-xs font-medium text-fg-muted">Salary</dt>
              <dd className="font-bold text-blue-700 mt-0.5">{job.salary}</dd>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-2">
              <dt className="text-xs font-medium text-fg-muted flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> Setup</dt>
              <dd className="font-semibold mt-0.5">{job.type}</dd>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-2">
              <dt className="text-xs font-medium text-fg-muted flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Category</dt>
              <dd className="font-semibold mt-0.5">{job.category}</dd>
            </div>
          </dl>

          <section>
            <h3 className="text-sm font-bold mb-2">About the role</h3>
            <p className="text-[15px] text-fg/85 leading-7 whitespace-pre-line">{job.description}</p>
          </section>

          {job.requirements.length > 0 && (
            <section>
              <h3 className="text-sm font-bold mb-2">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-fg/85 leading-6">
                    <CheckCircle2 className="w-[18px] h-[18px] text-blue-600 shrink-0 mt-0.5" aria-hidden />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="flex items-center justify-between gap-3 text-xs text-fg-muted pt-1">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-600" /> Direct hiring, no agency fees</span>
            {job.createdAt && <span className="flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" /> Posted {timeAgo(job.createdAt)}</span>}
          </p>
        </div>
      )}
    </Dialog>
  );
}
