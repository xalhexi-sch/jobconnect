"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileText, ArrowRight, Check } from "lucide-react";

export default function ApplyModal() {
  const { applyModalJob, setApplyModalJob, applyToJob, userProfile } = useApp();
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!applyModalJob) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      applyToJob(applyModalJob, note);
      setIsSubmitting(false);
      setNote("");
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-200 text-left"
      >
        {/* Close button */}
        <button
          onClick={() => setApplyModalJob(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Job Header */}
        <div className="flex items-center gap-3.5 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={applyModalJob.companyLogo}
              alt={applyModalJob.company}
              className="max-w-full max-h-full object-cover rounded-xl"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-neutral-900 leading-tight truncate">
              {applyModalJob.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 truncate">
              {applyModalJob.company} • {applyModalJob.location}
            </p>
            <span className="inline-block text-xs font-bold text-neutral-900 mt-0.5">
              {applyModalJob.salary}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Resume Chip (CossUI Card) */}
          <div>
            <div className="text-[11px] font-bold text-neutral-700 mb-1.5">
              Your Resume
            </div>
            <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate pr-2">
                <div className="w-8 h-8 rounded-xl bg-[#111116] text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    {userProfile.resumeFileName || "Resume_2026.pdf"}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {userProfile.fullName}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                Attached
              </span>
            </div>
          </div>

          {/* Short Note */}
          <div>
            <div className="text-[11px] font-bold text-neutral-700 mb-1.5">
              Note or Portfolio (Optional)
            </div>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your portfolio link or a quick message..."
              className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#111116] text-white hover:bg-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : (
              <>
                <span>Send Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
