"use client";

import { Bookmark, CheckCircle2, Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ApplyModal from "@/components/ApplyModal";
import AuthModal from "@/components/AuthModal";
import OnboardingModal from "@/components/OnboardingModal";
import type { Job } from "@/lib/types";

/** Sticky apply bar for the public job page. Applying requires sign-in; the server enforces the rest. */
export default function JobPageActions({ job }: { job: Job }) {
  const { applications, bookmarkedJobIds, toggleBookmark, setApplyModalJob, isSignedIn, openAuthModal, isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const applied = applications.some((a) => a.jobId === job.id);
  const saved = bookmarkedJobIds.includes(job.id);

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur-md border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => toggleBookmark(job.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center cursor-pointer ${saved ? "text-amber-600 bg-amber-50 border-amber-200" : "bg-surface-2 border-line text-fg-muted"}`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
          </button>
          {applied ? (
            <span className="flex-1 h-12 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Application submitted
            </span>
          ) : (
            <button
              onClick={() => (isSignedIn ? setApplyModalJob(job) : openAuthModal("sign-in"))}
              className="flex-1 btn-brand-primary h-12 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5" /> {isSignedIn ? "Apply now" : "Sign in to apply"}
            </button>
          )}
        </div>
      </div>
      <ApplyModal />
      <AuthModal />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
}
