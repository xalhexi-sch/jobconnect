"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import { Briefcase, ArrowLeft, LogIn, Search, Send, Bookmark, FileText, Plus, Building2, ShieldCheck, Lock } from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import OnboardingModal from "@/components/OnboardingModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";
import Dock, { DockItemData } from "@/components/Dock/Dock";

const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia("(max-width: 639px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMobile = () => window.matchMedia("(max-width: 639px)").matches;

const subscribeDark = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
};
const getDark = () => document.documentElement.dataset.theme === "dark";

export default function OverviewPage() {
  const {
    role,
    openAuthModal,
    isSignedIn,
    userProfile,
    jobs,
    applications,
    bookmarkedJobIds,
    setIsPostJobOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<"jobseeker" | "employer">("jobseeker");
  const [jobseekerSubTab, setJobseekerSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const isDark = useSyncExternalStore(subscribeDark, getDark, () => false);

  // Employers land on their workspace; the role comes from the server, never from the client.
  const [lastRole, setLastRole] = useState(role);
  if (role !== lastRole) {
    setLastRole(role);
    if (role === "employer") setViewMode("employer");
  }

  const isEmployer = role === "employer";
  const showJobseeker = viewMode === "jobseeker" || !isEmployer;

  const goSeeker = (tab: typeof jobseekerSubTab) => () => {
    setViewMode("jobseeker");
    setJobseekerSubTab(tab);
  };

  const dockItems: DockItemData[] = [
    { icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "Find Jobs", active: showJobseeker && jobseekerSubTab === "find", badge: jobs.length || undefined, onClick: goSeeker("find") },
    { icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "My Applications", active: showJobseeker && jobseekerSubTab === "applications", badge: applications.length || undefined, onClick: goSeeker("applications") },
    { icon: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />, label: "Saved Jobs", active: showJobseeker && jobseekerSubTab === "saved", badge: bookmarkedJobIds.length || undefined, onClick: goSeeker("saved") },
    { icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />, label: "My Profile", active: showJobseeker && jobseekerSubTab === "resume", onClick: goSeeker("resume") },
    ...(isEmployer
      ? ([
          { separator: true },
          { icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />, label: "Employer Portal", active: viewMode === "employer", onClick: () => setViewMode("employer") },
          { icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "Post Vacancy", onClick: () => setIsPostJobOpen(true) },
        ] as DockItemData[])
      : []),
    ...(role === "admin"
      ? ([{ separator: true }, { icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />, label: "Admin", onClick: () => (window.location.href = "/admin") }] as DockItemData[])
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-line px-3 sm:px-6 lg:px-8 h-16 flex items-center">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="hover:opacity-85 transition-opacity shrink-0" aria-label="JobConnect home">
              <JobgioLogo variant={isDark ? "light" : "dark"} size="sm" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted hover:text-fg transition-colors pl-3 border-l border-line">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isSignedIn && (
              <span className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-surface-2 border border-line text-xs font-semibold text-fg-muted capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {role === "jobseeker" ? "Job seeker" : role}
              </span>
            )}
            <ThemeToggle />
            {isClerkConfigured && (
              <>
                <Show when="signed-in">
                  <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                </Show>
                <Show when="signed-out">
                  <Link href="/sign-in" className="btn-brand-primary h-9 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                    <LogIn className="w-4 h-4" /> Sign in
                  </Link>
                </Show>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main" className="flex-1 p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {isEmployer && viewMode === "employer" ? (
            <EmployerAppView />
          ) : (
            <>
              {isSignedIn && !userProfile.onboarded && (
                <div className="max-w-4xl mx-auto mb-5 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">Finish setting up your account to apply or post jobs.</p>
                  <button onClick={() => setIsOnboardingOpen(true)} className="btn-brand-primary h-10 px-5 rounded-xl text-sm font-semibold cursor-pointer">
                    Continue setup
                  </button>
                </div>
              )}
              <JobseekerAppView activeSubTab={jobseekerSubTab} onSubTabChange={setJobseekerSubTab} hideTopTabs />
              {!isSignedIn && (
                <div className="max-w-4xl mx-auto mt-6 p-5 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-fg-muted flex items-center gap-2"><Lock className="w-4 h-4" /> Sign in to apply, save jobs, or post a vacancy as an employer.</p>
                  <button onClick={() => openAuthModal("sign-in")} className="h-10 px-5 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <Building2 className="w-4 h-4" /> Sign in
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-2.5 sm:bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none px-2 sm:px-4">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            position="bottom"
            theme={isDark ? "dark" : "light"}
            autoHide={!isMobile}
            baseItemSize={isMobile ? 38 : 46}
            magnification={isMobile ? 48 : 66}
            panelHeight={isMobile ? 52 : 62}
            roundness={0.4}
            showLabels={!isMobile}
            showBadges
            showIndicators
            badgeColor="#2563EB"
            accentColor="#2563EB"
          />
        </div>
      </div>

      <ApplyModal />
      <PostJobModal />
      <ResumePortfolioModal />
      <AuthModal />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
}
