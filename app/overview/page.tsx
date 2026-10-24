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
  Users,
  Building2
} from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import OnboardingModal from "@/components/OnboardingModal";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";
import Dock, { DockItemData } from "@/components/Dock/Dock";

export default function OverviewPage() {
  const {
    openAuthModal,
    isSignedIn,
    user,
    userProfile,
    jobs,
    applications,
    bookmarkedJobIds,
    setIsPostJobOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
  } = useApp();

  const [jobseekerSubTab, setJobseekerSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Strict role check: authentic accounts only
  const isEmployerAuthorized = user.role === "employer" || user.role === "admin";

  // Build role-isolated Dock items
  const dockItems: DockItemData[] = isEmployerAuthorized
    ? [
        {
          icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          label: "Candidate Pipeline",
          active: true,
          badge: applications.length > 0 ? applications.length : undefined,
          onClick: () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        },
        {
          icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          label: "Active Vacancies",
          badge: jobs.filter((j) => j.company === userProfile.companyName).length || undefined,
          onClick: () => {
            const el = document.getElementById("active-vacancies-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          },
        },
        {
          icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          label: "Post Vacancy",
          onClick: () => {
            setIsPostJobOpen(true);
          },
        },
      ]
    : [
        {
          icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          label: "Find Jobs",
          active: jobseekerSubTab === "find",
          badge: jobs.length > 0 ? jobs.length : undefined,
          onClick: () => {
            setJobseekerSubTab("find");
          },
        },
        {
          icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          label: "My Applications",
          active: jobseekerSubTab === "applications",
          badge: applications.length > 0 ? applications.length : undefined,
          onClick: () => {
            setJobseekerSubTab("applications");
          },
        },
        {
          icon: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
          label: "Saved Jobs",
          active: jobseekerSubTab === "saved",
          badge: bookmarkedJobIds.length > 0 ? bookmarkedJobIds.length : undefined,
          onClick: () => {
            setJobseekerSubTab("saved");
          },
        },
        {
          icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />,
          label: "My Resume",
          active: jobseekerSubTab === "resume",
          onClick: () => {
            setJobseekerSubTab("resume");
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

          {/* Authentic Role Status (Non-arbitrary, securely bound) & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isEmployerAuthorized ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] sm:text-xs font-semibold text-blue-800 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{userProfile.companyName || "Verified Employer"}</span>
                <span className="text-blue-300 hidden sm:inline">&bull;</span>
                <span className="text-blue-600 font-medium hidden sm:inline">Hiring Portal</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-[11px] sm:text-xs font-semibold text-neutral-700 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Candidate</span>
                <span className="text-neutral-400 hidden sm:inline">&bull;</span>
                <span className="text-neutral-500 font-medium hidden sm:inline">Butuan City</span>
              </div>
            )}

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

      {/* Main Workspace (Strictly Isolated by Account Role) */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {isEmployerAuthorized ? (
            <EmployerAppView />
          ) : (
            <JobseekerAppView
              activeSubTab={jobseekerSubTab}
              onSubTabChange={setJobseekerSubTab}
              hideTopTabs={true}
            />
          )}
        </div>
      </main>

      {/* React Bits Floating Bottom Dock (Adaptive Sizing for Mobile & Desktop) */}
      <div className="fixed bottom-2.5 sm:bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4">
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            panelHeight={isMobile ? 54 : 64}
            baseItemSize={isMobile ? 38 : 44}
            magnification={isMobile ? 50 : 60}
            distance={isMobile ? 80 : 120}
            roundness={0.4}
            autoHide={!isMobile}
          />
        </div>
      </div>

      {/* Production Modals */}
      <ApplyModal />
      <PostJobModal />
      <ResumePortfolioModal />
      <AuthModal />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

    </div>
  );
}
