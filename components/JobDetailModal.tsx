"use client";

import React from "react";
import { Job } from "@/lib/types";
import {
  X,
  MapPin,
  Briefcase,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign
} from "lucide-react";

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
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-neutral-200 text-left max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Block */}
        <div className="flex items-start gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="max-w-full max-h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-neutral-900 leading-snug">
                {job.title}
              </h2>
              {job.featured && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                  Featured
                </span>
              )}
            </div>

            <div className="text-xs text-neutral-600 font-medium mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-neutral-800">{job.company}</span>
              <span className="text-neutral-300">&bull;</span>
              <span className="flex items-center gap-1 text-neutral-500">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{job.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Highlights Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">
              Monthly Pay
            </div>
            <div className="text-xs sm:text-sm font-bold text-blue-700">
              {job.salary}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">
              Work Setup
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-800">
              {job.type}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-0.5">
              Category
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-800">
              {job.category}
            </div>
          </div>
        </div>

        {/* Body Description */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              Role Overview
            </h4>
            <p className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 leading-relaxed text-neutral-600">
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Qualifications &amp; Requirements
              </h4>
              <div className="space-y-2 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-neutral-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Transparency Guarantee */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Verified Butuan City Employer &bull; Direct Hiring</span>
            </div>
            <span className="text-[11px] text-neutral-400">
              Posted: {job.postedDate}
            </span>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleBookmark(job.id)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isSaved
                ? "text-amber-600 bg-amber-50 border-amber-200"
                : "text-neutral-600 hover:text-black bg-neutral-50 border-neutral-200"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save Opening"}</span>
          </button>

          {hasApplied ? (
            <span className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Application Submitted</span>
            </span>
          ) : (
            <button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl btn-brand-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Apply to Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
