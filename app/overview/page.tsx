"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Users,
  Shield,
  Plus,
  ArrowLeft,
  FileText,
  UserCheck
} from "lucide-react";
import JobseekerAppView from "@/components/overview/JobseekerAppView";
import EmployerAppView from "@/components/overview/EmployerAppView";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";

export default function OverviewPage() {
  const {
    role,
    setRole,
    user,
    jobs,
    applications,
    updateJobStatus,
    setIsPostJobOpen,
    setIsResumeModalOpen,
    openAuthModal,
    isSignedIn,
    showToast
  } = useApp();

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
              <span>Back to Landing</span>
            </Link>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold">
              <button
                onClick={() => setRole("jobseeker")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "jobseeker"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
                title="Jobseeker Mode"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Seeker</span>
              </button>

              <button
                onClick={() => setRole("employer")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "employer"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
                title="Employer Mode"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Employer</span>
              </button>

              <button
                onClick={() => setRole("admin")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "admin"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-black"
                }`}
                title="Admin Moderation"
              >
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin</span>
              </button>
            </div>

            {/* Account / Sign In */}
            {!isSignedIn ? (
              <button
                onClick={() => openAuthModal("sign-in")}
                className="px-3.5 py-1.5 rounded-xl bg-[#111116] hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => openAuthModal("sign-in")}
                className="flex items-center gap-2 px-3 py-1 rounded-xl hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors"
              >
                <img src={user.avatar} alt={user.fullName} className="w-6 h-6 rounded-full object-cover" />
                <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Seeker Perspective */}
          {role === "jobseeker" && <JobseekerAppView />}

          {/* Employer Perspective */}
          {role === "employer" && <EmployerAppView />}

          {/* Admin Perspective (Evaluator Oversight) */}
          {role === "admin" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-rose-600" />
                    <h2 className="text-xl font-bold text-neutral-900">Platform Admin &amp; Moderation</h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Live oversight of all active job listings, employer submissions, and database records.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                  <span>Total Vacancies: <strong className="text-neutral-900">{jobs.length}</strong></span>
                  <span>&bull;</span>
                  <span>Applications: <strong className="text-neutral-900">{applications.length}</strong></span>
                </div>
              </div>

              {/* Live Jobs Audit Table */}
              <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 mb-3">Live PostgreSQL Job Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500">
                        <th className="pb-2 font-semibold">Title</th>
                        <th className="pb-2 font-semibold">Company</th>
                        <th className="pb-2 font-semibold">Location</th>
                        <th className="pb-2 font-semibold">Category</th>
                        <th className="pb-2 font-semibold">Salary</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-neutral-50">
                          <td className="py-2.5 font-bold text-neutral-900">{job.title}</td>
                          <td className="py-2.5 text-neutral-700">{job.company}</td>
                          <td className="py-2.5 text-neutral-600">{job.location}</td>
                          <td className="py-2.5 text-neutral-600">{job.category}</td>
                          <td className="py-2.5 font-semibold text-emerald-700">{job.salary}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800">
                              {job.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => {
                                const newStatus = job.status === "Active" ? "Expired" : "Active";
                                updateJobStatus(job.id, newStatus);
                              }}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

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
