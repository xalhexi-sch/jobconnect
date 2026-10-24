"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileText, ArrowRight, CheckCircle2, User, Mail, Phone, UploadCloud } from "lucide-react";

export default function ApplyModal() {
  const { applyModalJob, setApplyModalJob, applyToJob, userProfile, user } = useApp();
  
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with authenticated user details when modal opens
  useEffect(() => {
    if (applyModalJob) {
      setApplicantName(user?.fullName || userProfile?.fullName || "");
      setApplicantEmail(user?.email || userProfile?.email || "");
      setPhone(userProfile?.phone || "");
      setResumeFileName(userProfile?.resumeFileName || "");
    }
  }, [applyModalJob, user, userProfile]);

  if (!applyModalJob) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      applyToJob(applyModalJob, {
        applicantName,
        applicantEmail,
        phone,
        coverNote: note,
      });
      setIsSubmitting(false);
      setNote("");
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-200 text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close button */}
        <button
          onClick={() => setApplyModalJob(null)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Job Header */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={applyModalJob.companyLogo}
              alt={applyModalJob.company}
              className="max-w-full max-h-full object-cover rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug truncate">
              {applyModalJob.title}
            </h3>
            <p className="text-xs text-neutral-500 truncate mt-0.5">
              {applyModalJob.company} &bull; {applyModalJob.location}
            </p>
            <span className="inline-block text-xs font-bold text-blue-700 mt-0.5">
              {applyModalJob.salary}
            </span>
          </div>
        </div>

        {/* Clean Application Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0917 123 4567"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload / Attachment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Resume Document
            </label>
            {resumeFileName ? (
              <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-medium text-neutral-800 truncate">
                    {resumeFileName}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Attached
                  </span>
                  <label className="text-[11px] text-neutral-500 hover:text-neutral-800 cursor-pointer underline">
                    Change
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="p-2.5 rounded-xl border border-dashed border-neutral-300 hover:border-blue-500 bg-neutral-50 hover:bg-blue-50/30 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-neutral-600">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload PDF or Word Resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Optional Short Note */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Short Cover Note <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A brief note about your experience or availability..."
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-xl btn-brand-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Submit Application to {applyModalJob.company}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
