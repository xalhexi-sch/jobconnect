"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileText, ArrowRight, CheckCircle2, User, Mail, Phone } from "lucide-react";

export default function ApplyModal() {
  const { applyModalJob, setApplyModalJob, applyToJob, userProfile, user } = useApp();
  const [applicantName, setApplicantName] = useState(user?.fullName || userProfile?.fullName || "Maria Santos");
  const [applicantEmail, setApplicantEmail] = useState(user?.email || userProfile?.email || "maria.santos@caraga.tech");
  const [phone, setPhone] = useState(userProfile?.phone || "+63 917 842 9011");
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-200 text-left max-h-[92vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={() => setApplyModalJob(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Job Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={applyModalJob.companyLogo}
              alt={applyModalJob.company}
              className="max-w-full max-h-full object-cover rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug truncate">
              {applyModalJob.title}
            </h3>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {applyModalJob.company} &bull; {applyModalJob.location}
            </p>
            <span className="inline-block text-xs font-bold text-emerald-700 mt-1">
              {applyModalJob.salary}
            </span>
          </div>
        </div>

        {/* Clean Application Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0917..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Attached Resume Indicator */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Resume Document
            </label>
            <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-neutral-800 truncate">
                  {userProfile?.resumeFileName || "Candidate_Resume_Caraga.pdf"}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Attached
              </span>
            </div>
          </div>

          {/* Optional Short Note */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brief Note to Employer <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why are you a good fit for this role?"
              className="w-full p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-2.5 rounded-xl btn-supabase-emerald text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
