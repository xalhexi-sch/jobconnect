"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import { Briefcase, ArrowLeft, LogIn, Search, Send, Bookmark, FileText, Plus, Building2, ShieldCheck, Lock, UserCheck } from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import OnboardingModal from "@/components/OnboardingModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleToggle from "@/components/ui/LocaleToggle";
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
    profileLoaded,
    profileError,
    retryProfile,
    jobs,
    applications,
    bookmarkedJobIds,
    setIsPostJobOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    setIsInboxOpen,
    unreadMessagesCount,
  } = useApp();

  const router = useRouter();
  const [viewMode, setViewMode] = useState<"jobseeker" | "employer">("jobseeker");
  const [jobseekerSubTab, setJobseekerSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const isDark = useSyncExternalStore(subscribeDark, getDark, () => false);

  const goSeeker = (tab: typeof jobseekerSubTab) => () => {
    setViewMode("jobseeker");
    setJobseekerSubTab(tab);
  };

  const dockItems: DockItemData[] = [
    { icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "Find Jobs", active: viewMode === "jobseeker" && jobseekerSubTab === "find", badge: jobs.length || undefined, onClick: goSeeker("find") },
    { icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "My Applications", active: viewMode === "jobseeker" && jobseekerSubTab === "applications", badge: applications.length || undefined, onClick: goSeeker("applications") },
    { icon: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />, label: "Saved Jobs", active: viewMode === "jobseeker" && jobseekerSubTab === "saved", badge: bookmarkedJobIds.length || undefined, onClick: goSeeker("saved") },
    { icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />, label: "My Profile", active: viewMode === "jobseeker" && jobseekerSubTab === "resume", onClick: goSeeker("resume") },
    { separator: true },
    { icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />, label: "Employer Hub", active: viewMode === "employer", onClick: () => setViewMode("employer") },
    { icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, label: "Post Vacancy", onClick: () => setIsPostJobOpen(true) },
    ...(role === "admin"
      ? ([{ separator: true }, { icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />, label: "Admin", onClick: () => router.push("/admin") }] as DockItemData[])
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

          {/* Quick Dual Switcher: Candidate vs Employer Hub */}
          <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-line">
            <button
              type="button"
              onClick={() => setViewMode("jobseeker")}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "jobseeker"
                  ? "bg-surface shadow-xs text-blue-600 font-bold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Jobseeker</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("employer")}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "employer"
                  ? "bg-surface shadow-xs text-emerald-600 font-bold"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hiring Hub</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => (isSignedIn ? setIsInboxOpen(true) : openAuthModal("sign-in"))}
              className="h-8 px-2.5 sm:px-3 rounded-xl border border-line bg-surface hover:bg-surface-2 text-fg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer relative"
              title="Inbox Messages"
              aria-label="Direct inbox messages"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Inbox</span>
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>
            <LocaleToggle />
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
          {viewMode === "employer" ? (
            isSignedIn ? (
              <EmployerAppView />
            ) : (
              <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-surface border border-line text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold">Employer &amp; Hiring Hub</h2>
                <p className="text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
                  Post vacancies, review applicant resumes, schedule interviews, and manage hiring for your business in Butuan City &amp; Caraga.
                </p>
                <button
                  onClick={() => openAuthModal("sign-in")}
                  className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Sign In to Access Hiring Hub
                </button>
              </div>
            )
          ) : (
            <>
              {isSignedIn && profileError && (
                <div role="alert" className="max-w-4xl mx-auto mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">{profileError}</p>
                  <button onClick={retryProfile} className="h-10 px-5 rounded-xl border border-amber-200 bg-surface text-sm font-semibold cursor-pointer">
                    Try again
                  </button>
                </div>
              )}
              {isSignedIn && profileLoaded && !profileError && !userProfile.onboarded && (
                <div className="max-w-4xl mx-auto mb-5 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">Quick setup: Personalize your account to start applying and hiring.</p>
                  <button onClick={() => setIsOnboardingOpen(true)} className="btn-brand-primary h-10 px-5 rounded-xl text-sm font-semibold cursor-pointer">
                    Continue setup
                  </button>
                </div>
              )}
              <JobseekerAppView activeSubTab={jobseekerSubTab} onSubTabChange={setJobseekerSubTab} hideTopTabs />
              {!isSignedIn && (
                <div className="max-w-4xl mx-auto mt-6 p-5 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-fg-muted flex items-center gap-2"><Lock className="w-4 h-4" /> Sign in to apply, save jobs, or manage your hiring workspace.</p>
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
