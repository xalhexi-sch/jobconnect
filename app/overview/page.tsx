"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  ArrowLeft,
  UserCheck,
  LogIn
} from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";

export default function OverviewPage() {
  const {
    openAuthModal,
    isSignedIn,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"jobseeker" | "employer">("jobseeker");

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111116] flex flex-col antialiased font-sans">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Back to Home */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <JobgioLogo variant="dark" size="sm" />
            </Link>
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black transition-colors pl-3 border-l border-neutral-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Clean Functional Workspace Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("jobseeker")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "jobseeker"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Job Seeker</span>
              </button>

              <button
                onClick={() => setActiveTab("employer")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "employer"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Employer Portal</span>
              </button>
            </div>

            {/* Authentication Control */}
            {isClerkConfigured ? (
              <div className="flex items-center ml-1">
                <Show when="signed-in">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 border border-neutral-300",
                      }
                    }}
                  />
                </Show>

                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="btn-supabase-emerald px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="btn-supabase-emerald px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "jobseeker" ? <JobseekerAppView /> : <EmployerAppView />}
        </div>
      </main>

      {/* Global Interactive Modals */}
      <ApplyModal />
      <PostJobModal />
      <ResumePortfolioModal />
      <AuthModal />
    </div>
  );
}
