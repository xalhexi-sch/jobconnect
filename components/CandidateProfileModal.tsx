"use client";

import React from "react";
import Dialog from "@/components/ui/Dialog";
import { Application } from "@/lib/types";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

export default function CandidateProfileModal({
  candidate,
  onClose,
  onOpenChat,
  onOpenResume,
}: {
  candidate: Application | null;
  onClose: () => void;
  onOpenChat: (app: Application) => void;
  onOpenResume: (app: Application) => void;
}) {
  if (!candidate) return null;

  const initials = (candidate.applicantName || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog
      open={Boolean(candidate)}
      onClose={onClose}
      title="Candidate Profile"
      description={`Applied for ${candidate.jobTitle}`}
      size="lg"
    >
      <div className="space-y-6 pt-1">
        {/* Profile Card Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-2/60 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate text-fg">{candidate.applicantName}</h2>
              {candidate.applicantHeadline ? (
                <p className="text-sm font-medium text-blue-700 truncate">{candidate.applicantHeadline}</p>
              ) : (
                <p className="text-xs text-fg-muted">Applicant</p>
              )}
              {candidate.applicantLocation && (
                <p className="text-xs text-fg-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-fg-muted/80" /> {candidate.applicantLocation}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface border border-line text-fg-muted">
              Stage: <span className="text-fg font-medium">{candidate.status}</span>
            </span>
          </div>
        </div>

        {/* Quick Contact & Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenChat(candidate);
            }}
            className="btn-brand-primary h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Message Candidate
          </button>

          {candidate.applicantPhone && (
            <a
              href={`tel:${candidate.applicantPhone}`}
              className="h-10 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-2 hover:bg-surface-3 transition-colors text-fg"
            >
              <Phone className="w-4 h-4 text-emerald-600" /> {candidate.applicantPhone}
            </a>
          )}

          {candidate.applicantEmail && (
            <a
              href={`mailto:${candidate.applicantEmail}`}
              className="h-10 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-2 hover:bg-surface-3 transition-colors text-fg"
            >
              <Mail className="w-4 h-4 text-blue-600" /> {candidate.applicantEmail}
            </a>
          )}

          <button
            onClick={() => onOpenResume(candidate)}
            className="h-10 px-4 rounded-xl bg-neutral-900 text-white text-sm font-semibold flex items-center gap-2 hover:bg-black transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" /> {candidate.resumeUrl ? "View Resume" : "No Resume"}
          </button>
        </div>

        {/* Application Specifics */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" /> Target Vacancy
            </div>
            <p className="text-sm font-semibold text-fg">{candidate.jobTitle}</p>
            <p className="text-xs text-fg-muted">
              {candidate.company} · Applied on {candidate.appliedDate}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-line space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </div>
            <p className="text-sm font-semibold text-fg">
              {candidate.applicantEducation || "Not specified on profile"}
            </p>
          </div>
        </div>

        {/* Candidate Bio / Overview */}
        {candidate.applicantBio && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">About Candidate</h3>
            <div className="p-4 rounded-2xl bg-surface-2 border border-line text-sm leading-relaxed text-fg/90">
              {candidate.applicantBio}
            </div>
          </div>
        )}

        {/* Skills Tags */}
        {candidate.applicantSkills && candidate.applicantSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Key Skills &amp; Qualifications
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.applicantSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-line text-xs font-medium text-fg shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter Note */}
        {candidate.coverLetter && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Submitted Cover Note</h3>
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-sm leading-relaxed text-fg/90 italic">
              “{candidate.coverLetter}”
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
