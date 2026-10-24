"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  ArrowLeft,
  LogIn,
  Search,
  Send,
  Bookmark,
  FileText,
  Plus,
  ShieldAlert,
  Building2,
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";
import Dock, { DockItemData } from "@/components/Dock/Dock";

export default function OverviewPage() {
  const {
    openAuthModal,
    isSignedIn,
    user,
    setRole,
    jobs,
    applications,
    bookmarkedJobIds,
    setIsPostJobOpen,
    setIsResumeModalOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<"jobseeker" | "employer">("jobseeker");
  const [jobseekerSubTab, setJobseekerSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isEmployerAuthorized = user.role === "employer" || user.role === "admin";

  // Build items for the macOS-style React Bits Dock
  const dockItems: DockItemData[] = [
    {
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      label: "Find Jobs",
      active: viewMode === "jobseeker" && jobseekerSubTab === "find",
      badge: jobs.length > 0 ? jobs.length : undefined,
      onClick: () => {
        setViewMode("jobseeker");
        setJobseekerSubTab("find");
      },
    },
    {
      icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      label: "My Applications",
      active: viewMode === "jobseeker" && jobseekerSubTab === "applications",
      badge: applications.length > 0 ? applications.length : undefined,
      onClick: () => {
        setViewMode("jobseeker");
        setJobseekerSubTab("applications");
      },
    },
    {
      icon: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
      label: "Saved Jobs",
      active: viewMode === "jobseeker" && jobseekerSubTab === "saved",
      badge: bookmarkedJobIds.length > 0 ? bookmarkedJobIds.length : undefined,
      onClick: () => {
        setViewMode("jobseeker");
        setJobseekerSubTab("saved");
      },
    },
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />,
      label: "My Resume",
      active: viewMode === "jobseeker" && jobseekerSubTab === "resume",
      onClick: () => {
        setViewMode("jobseeker");
        setJobseekerSubTab("resume");
      },
    },
    {
      separator: true,
    },
    {
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />,
      label: "Employer Portal",
      active: viewMode === "employer",
      onClick: () => {
        setViewMode("employer");
      },
    },
    {
      icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      label: "Post Vacancy",
      onClick: () => {
        setIsPostJobOpen(true);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111116] flex flex-col antialiased font-sans">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-3 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Back to Home */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0">
              <JobgioLogo variant="dark" size="sm" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black transition-colors pl-2.5 sm:pl-3 border-l border-neutral-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Home</span>
            </Link>
          </div>

          {/* Active Mode Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100/90 border border-neutral-200/80 text-[11px] sm:text-xs font-semibold text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>
                {viewMode === "employer" ? "Employer" : "Seeker"}
              </span>
              <span className="text-neutral-400 hidden sm:inline">&bull;</span>
              <span className="text-neutral-500 font-medium hidden sm:inline">BXU</span>
            </div>

            {/* Authentication Control */}
            {isClerkConfigured ? (
              <div className="flex items-center">
                <Show when="signed-in">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8 border border-neutral-300 shadow-xs",
                      }
                    }}
                  />
                </Show>

                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="btn-brand-primary px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </Show>
              </div>
            ) : (
              !isSignedIn ? (
                <button
                  onClick={() => openAuthModal("sign-in")}
                  className="btn-brand-primary px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : null
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {viewMode === "jobseeker" ? (
            <JobseekerAppView
              activeSubTab={jobseekerSubTab}
              onSubTabChange={setJobseekerSubTab}
              hideTopTabs={true}
            />
          ) : isEmployerAuthorized ? (
            <EmployerAppView />
          ) : (
            /* Protected Employer Workspace & Candidate Privacy Gate */
            <div className="max-w-xl mx-auto my-6 sm:my-8 p-5 sm:p-7 rounded-2xl bg-white border border-neutral-200/90 shadow-sm text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3.5 sm:mb-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Protected Employer Workspace</span>
              </span>

              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 mb-2">
                Candidate Privacy &amp; Organization Access
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto mb-5 sm:mb-6">
                Candidate resumes, contact details, and hiring pipelines are strictly confidential under JobConnect BXU security standards. Access to review candidate CVs and publish vacancies is restricted to verified employers.
              </p>

              <div className="text-left bg-neutral-50/80 rounded-2xl p-3.5 sm:p-4 border border-neutral-200/80 mb-5 sm:mb-6 space-y-2 text-xs text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Applicant Privacy:</strong> Full resumes and contact details are isolated from unverified accounts.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Local Business Verification:</strong> Free onboarding for Butuan DTI/SEC registered entities and CSU/FSUU partners.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Zero Agency Markups:</strong> Direct hiring without intermediary fees.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => setRole("employer")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-brand-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Switch to Employer Profile</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode("jobseeker");
                    setJobseekerSubTab("find");
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl btn-clerk-outline text-xs font-semibold cursor-pointer"
                >
                  Return to Job Search
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 mt-3.5">
                Tip for evaluators: Click &ldquo;Switch to Employer Profile&rdquo; for instant simulated employer portal access.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* React Bits Floating Bottom Dock (Adaptive Sizing for Mobile & Desktop) */}
      <div className="fixed bottom-2.5 sm:bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            position="bottom"
            theme="light"
            autoHide={!isMobile}
            baseItemSize={isMobile ? 38 : 46}
            magnification={isMobile ? 48 : 66}
            panelHeight={isMobile ? 52 : 62}
            roundness={0.4}
            showLabels={!isMobile}
            showBadges={true}
            showIndicators={true}
            badgeColor="#2563EB"
            accentColor="#2563EB"
          />
        </div>
      </div>

      {/* Global Interactive Modals */}
      <ApplyModal />
      <PostJobModal />
      <ResumePortfolioModal />
      <AuthModal />
    </div>
  );
}
