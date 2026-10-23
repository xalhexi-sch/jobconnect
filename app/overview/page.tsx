"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "@/components/JobgioLogo";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  Building2,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Upload,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  MapPin,
  ExternalLink,
  Edit3,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Send,
  GraduationCap,
  Globe,
  Filter,
  Check,
  Grid,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import ResumePortfolioModal from "@/components/overview/ResumePortfolioModal";
import AuthModal from "@/components/AuthModal";
import { MONTHLY_STATS, STARTUPS } from "@/lib/mock-data";

export default function OverviewPage() {
  const {
    role,
    setRole,
    user,
    userProfile,
    jobs,
    applications,
    pendingApprovals,
    bookmarkedJobIds,
    toggleBookmark,
    setApplyModalJob,
    setIsPostJobOpen,
    setIsResumeModalOpen,
    openAuthModal,
    approvePending,
    rejectPending,
    updateJobStatus,
    updateApplicationStage,
    showToast
  } = useApp();

  // Navigation tab inside the dashboard
  const [currentNav, setCurrentNav] = useState<
    "overview" | "jobs" | "applications" | "companies" | "users" | "saved" | "resume"
  >("overview");

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedCityFilter, setSelectedCityFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [tableSearch, setTableSearch] = useState("");
  const [hoveredMonth, setHoveredMonth] = useState<string>("Aug");
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [approvedState, setApprovedState] = useState<Record<string, boolean>>({});

  // Filter jobs for table/grid
  const filteredJobs = jobs.filter((job) => {
    if (selectedStatusFilter !== "All" && job.status !== selectedStatusFilter) return false;
    if (selectedCityFilter !== "All" && job.city !== selectedCityFilter) return false;
    if (selectedCategoryFilter !== "All" && job.category !== selectedCategoryFilter) return false;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const savedJobs = jobs.filter((j) => bookmarkedJobIds.includes(j.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobIds(filteredJobs.map((j) => j.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleApprove = (id: string) => {
    setApprovedState((prev) => {
      const isCurrentlyApproved = !prev[id];
      if (isCurrentlyApproved) {
        showToast("Company verification approved!", "success");
      }
      return { ...prev, [id]: isCurrentlyApproved };
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Title,Company,Location,City,Status,PostedDate,Salary"]
        .concat(
          filteredJobs.map(
            (j) =>
              `"${j.title}","${j.company}","${j.location}","${j.city}","${j.status}","${j.postedDate}","${j.salary}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobconnect_caraga_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported table records to CSV!", "success");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#111116] flex flex-col lg:flex-row antialiased font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* ========================================================= */}
      {/* DESKTOP FIXED SIDEBAR (Tailored to Active Role) */}
      {/* ========================================================= */}
      <aside className="w-full lg:w-64 xl:w-72 bg-[#F0F2F5] lg:h-screen lg:sticky lg:top-0 p-6 xl:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/[0.06] shrink-0 z-30">
        <div>
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="hover:opacity-85 transition-opacity inline-flex items-center gap-3">
              <JobgioLogo variant="dark" size="md" />
            </Link>

            {/* Role Badge Indicator */}
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
              role === "admin"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : role === "employer"
                ? "bg-amber-100 text-amber-900 border border-amber-200"
                : "bg-emerald-100 text-emerald-900 border border-emerald-200"
            }`}>
              {role === "admin" ? "Admin" : role === "employer" ? "Employer" : "Jobseeker"}
            </span>
          </div>

          {/* Navigation Menu (Role-Based Permissions) */}
          <nav className="space-y-1.5">
            
            {/* 1. Dashboard (All Roles) */}
            <button
              onClick={() => setCurrentNav("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                currentNav === "overview"
                  ? "bg-[#111116] text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-white/80"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>
                {role === "admin"
                  ? "Admin Dashboard"
                  : role === "employer"
                  ? "Recruitment Hub"
                  : "My Dashboard"}
              </span>
            </button>

            {/* 2. Jobseeker Navigation */}
            {role === "jobseeker" && (
              <>
                <button
                  onClick={() => setCurrentNav("jobs")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "jobs"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Find Jobs</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700">
                    {jobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("applications")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "applications"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Applications</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {applications.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("saved")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "saved"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4 shrink-0" />
                    <span>Saved Jobs</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700">
                    {savedJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("resume")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "resume"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>My Resume &amp; CV</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </>
            )}

            {/* 3. Employer Navigation */}
            {role === "employer" && (
              <>
                <button
                  onClick={() => setCurrentNav("applications")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "applications"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Candidate Pipeline</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {applications.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("jobs")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "jobs"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Manage Postings</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700">
                    4
                  </span>
                </button>

                <button
                  onClick={() => setIsPostJobOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs sm:text-sm font-bold text-neutral-600 hover:text-black hover:bg-white/80 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Post Vacancy</span>
                </button>
              </>
            )}

            {/* 4. Admin Navigation */}
            {role === "admin" && (
              <>
                <button
                  onClick={() => setCurrentNav("jobs")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "jobs"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>Audit All Jobs</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700">
                    {jobs.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("companies")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "companies"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>Companies</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700">
                    {STARTUPS.length + 3}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav("users")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    currentNav === "users"
                      ? "bg-[#111116] text-white shadow-md"
                      : "text-neutral-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>User Accounts</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-bold">15K</span>
                </button>
              </>
            )}

            {/* Settings (All Roles) */}
            <button
              onClick={() => showToast("Account & preferences updated", "info")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs sm:text-sm font-bold text-neutral-600 hover:text-black hover:bg-white/80 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Role Switcher */}
        <div className="pt-6 mt-6 border-t border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover border border-neutral-300 shadow-xs"
              />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-[#111116] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#F0F2F5]">
                {user.notificationsCount || 3}
              </span>
            </div>
            <div className="truncate flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-900 leading-tight truncate">
                {user.fullName}
              </div>
              <div className="text-[11px] text-neutral-400 font-medium truncate mt-0.5">
                {user.email}
              </div>
            </div>
          </div>

          {/* 3-Role Quick Switcher for School Project Demo */}
          <div className="mt-4 pt-3 border-t border-black/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Role View
              </span>
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-full border border-neutral-200/80 shadow-xs">
              <button
                onClick={() => {
                  setRole("jobseeker");
                  setCurrentNav("overview");
                  showToast("Switched to Jobseeker View: Seeker Dashboard & Applications", "info");
                }}
                className={`py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  role === "jobseeker"
                    ? "bg-[#111116] text-white shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
                title="Jobseeker view: see applications, saved jobs, interviews"
              >
                <UserCheck className="w-2.5 h-2.5" />
                <span>Seeker</span>
              </button>
              <button
                onClick={() => {
                  setRole("employer");
                  setCurrentNav("overview");
                  showToast("Switched to Employer View: Recruitment Hub & Candidate Pipeline", "info");
                }}
                className={`py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  role === "employer"
                    ? "bg-[#111116] text-white shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
                title="Employer view: review candidates, manage postings"
              >
                <Briefcase className="w-2.5 h-2.5" />
                <span>Employer</span>
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setCurrentNav("overview");
                  showToast("Switched to Admin View: Image 4 Telemetry & Master Controls", "info");
                }}
                className={`py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  role === "admin"
                    ? "bg-[#111116] text-white shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
                title="Admin view: Image 4 stats chart, pending approvals, master table"
              >
                <Shield className="w-2.5 h-2.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* DESKTOP MAIN WORKSPACE (Strict Role Separation) */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 xl:p-10 space-y-8 max-w-[1720px] w-full">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.05]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111116]">
                {role === "admin"
                  ? "Platform Administration & Moderation"
                  : role === "employer"
                  ? "TechVenture Caraga • Employer Hub"
                  : `Welcome back, ${user.fullName.split(" ")[0]}`}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                role === "admin"
                  ? "bg-rose-100 text-rose-800"
                  : role === "employer"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                {role}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {role === "admin"
                ? "Manage system-wide listings, verify employers, and monitor site activity."
                : role === "employer"
                ? "Review applicants, manage job postings, and schedule interviews."
                : "Discover matching jobs in Butuan and track your active submissions."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white text-neutral-700 hover:text-black border border-black/[0.08] text-xs font-semibold shadow-xs transition-colors"
            >
              ← Landing
            </Link>

            {role === "employer" ? (
              <button
                onClick={() => setIsPostJobOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Post Job</span>
              </button>
            ) : role === "jobseeker" ? (
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => showToast("Admin moderation tools unlocked", "info")}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit Tools</span>
              </button>
            )}
          </div>
        </header>

        {/* ========================================================= */}
        {/* VIEW 1: ROLE-SPECIFIC DASHBOARDS */}
        {/* ========================================================= */}
        {currentNav === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* ------------------------------------------------------- */}
            {/* 1A. JOBSEEKER DASHBOARD (Only what seekers should see) */}
            {/* ------------------------------------------------------- */}
            {role === "jobseeker" && (
              <div className="space-y-8">
                
                {/* Seeker Welcome Hero Banner featuring the uploaded photo */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-gradient-to-r from-neutral-900 via-[#16161b] to-[#1e1e26] text-white relative overflow-hidden shadow-xl border border-white/10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Ready for Interviews • Bancasi &amp; Libertad, Butuan City</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                        Welcome back, {user.fullName.split(" ")[0]} 👋
                      </h2>

                      <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-normal leading-relaxed">
                        Your profile was viewed by <strong>18 verified hiring teams</strong> in Caraga this week. You have <strong>1 interview scheduled</strong> tomorrow with TechVenture Caraga.
                      </p>

                      {/* Profile Strength Bar */}
                      <div className="pt-2 max-w-md">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span className="text-neutral-300">Profile Health</span>
                          <span className="text-emerald-400 font-bold">95% • Excellent</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[95%]" />
                        </div>
                        <span className="text-[11px] text-neutral-400 mt-1 block">
                          Add your GitHub or Figma portfolio link to reach 100%
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => setCurrentNav("jobs")}
                          className="px-6 py-2.5 rounded-full bg-white text-[#111116] hover:bg-neutral-100 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                          <span>Explore Open Roles</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setIsResumeModalOpen(true)}
                          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Update Resume</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Hero Applicant Photo with Floating Status Chips */}
                    <div className="lg:col-span-4 flex justify-center lg:justify-end">
                      <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-[28px] overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-800">
                        <img
                          src="/hero-applicant.png"
                          alt={user.fullName}
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                          <div className="text-xs font-bold truncate">{user.fullName}</div>
                          <div className="text-[10px] text-emerald-300 font-medium">Bancasi, Butuan City</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Seeker Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">
                        {applications.length}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        Active Applications
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">
                        {savedJobs.length}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        Saved Jobs
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">
                        1
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        Interview Invite
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#111116] text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">
                        95%
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        Profile Complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Interview Alert */}
                <div className="p-6 rounded-[28px] bg-amber-50/90 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      🗓️
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-amber-950">
                        Interview Tomorrow at 2:00 PM: Lead UI/UX Designer
                      </div>
                      <div className="text-xs text-amber-800 mt-0.5">
                        TechVenture Caraga • Google Meet &amp; Bancasi Office • Interviewer: Alexis Rivera
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Opening interview link in Google Meet...", "success")}
                    className="px-5 py-2.5 rounded-full bg-amber-950 text-white text-xs font-bold hover:bg-black transition-colors self-start sm:self-auto cursor-pointer shadow-xs active:scale-95"
                  >
                    Join Meeting
                  </button>
                </div>

                {/* Recommended Jobs For You */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">Recommended Jobs For You</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Based on your skills in Butuan City &amp; Caraga</p>
                    </div>
                    <button
                      onClick={() => setCurrentNav("jobs")}
                      className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All ({jobs.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.slice(0, 4).map((job) => (
                      <div
                        key={job.id}
                        className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-xl object-cover border border-neutral-200" />
                              <div>
                                <div className="text-xs text-neutral-500">{job.company}</div>
                                <div className="text-sm font-bold text-neutral-900">{job.title}</div>
                              </div>
                            </div>
                            <span className="text-xs font-black text-neutral-900 bg-white px-2.5 py-1 rounded-full border border-neutral-200">
                              {job.salary}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 line-clamp-2 mb-4">{job.description}</p>
                        </div>

                        <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between">
                          <span className="text-[11px] text-neutral-400">{job.location}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleBookmark(job.id)}
                              className={`p-1.5 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer ${
                                bookmarkedJobIds.includes(job.id) ? "text-amber-500 fill-amber-500" : "text-neutral-400"
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setApplyModalJob(job)}
                              className="px-4 py-1.5 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Active Applications Tracker with Visual 4-Step Stepper */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">Your Applications</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Real-time status updates synced directly with hiring teams</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                      {applications.length} submitted
                    </span>
                  </div>

                  <div className="space-y-4">
                    {applications.map((app) => {
                      const isInterview = app.status === "Interview Scheduled";
                      const isReview = app.status === "Under Review" || isInterview;
                      const isOffer = app.status === "Offer Extended";

                      return (
                        <div
                          key={app.id}
                          className="p-6 rounded-[28px] bg-neutral-50/80 border border-neutral-200/80 hover:bg-white hover:shadow-xs transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={app.companyLogo}
                                alt={app.company}
                                className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shrink-0 p-0.5 bg-white shadow-xs"
                              />
                              <div>
                                <div className="text-base font-bold text-neutral-900">{app.jobTitle}</div>
                                <div className="text-xs text-neutral-500 mt-0.5">
                                  {app.company} • {app.location} • <strong className="text-neutral-800">{app.salary}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                app.status === "Interview Scheduled"
                                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                                  : app.status === "Under Review"
                                  ? "bg-blue-100 text-blue-900 border border-blue-200"
                                  : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>

                          {/* 4-Stage Visual Progress Bar */}
                          <div className="pt-3 pb-1 border-t border-neutral-200/70">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              {/* Step 1: Submitted */}
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-xs">
                                  ✓
                                </div>
                                <span className="text-[11px] font-bold text-neutral-800">Submitted</span>
                                <span className="text-[10px] text-neutral-400">Oct 21</span>
                              </div>

                              {/* Step 2: Under Review */}
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                  isReview ? "bg-emerald-500 text-white shadow-xs" : "bg-neutral-200 text-neutral-500"
                                }`}>
                                  {isReview ? "✓" : "2"}
                                </div>
                                <span className="text-[11px] font-bold text-neutral-800">Under Review</span>
                                <span className="text-[10px] text-neutral-400">Oct 22</span>
                              </div>

                              {/* Step 3: Interview */}
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                  isInterview ? "bg-amber-500 text-white shadow-xs" : isOffer ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-500"
                                }`}>
                                  {isOffer ? "✓" : "3"}
                                </div>
                                <span className={`text-[11px] font-bold ${isInterview ? "text-amber-800" : "text-neutral-800"}`}>
                                  Interview
                                </span>
                                <span className="text-[10px] text-neutral-400">{isInterview ? "Scheduled" : "Pending"}</span>
                              </div>

                              {/* Step 4: Decision */}
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                  isOffer ? "bg-emerald-500 text-white shadow-xs" : "bg-neutral-200 text-neutral-500"
                                }`}>
                                  {isOffer ? "✓" : "4"}
                                </div>
                                <span className="text-[11px] font-bold text-neutral-800">Decision</span>
                                <span className="text-[10px] text-neutral-400">Final Stage</span>
                              </div>
                            </div>
                          </div>

                          {app.interviewDate && (
                            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span>🗓️</span>
                                <span><strong>Interview:</strong> {app.interviewDate}</span>
                              </div>
                              <button
                                onClick={() => showToast("Google Meet link opened in new tab", "success")}
                                className="px-3 py-1 rounded-lg bg-amber-900 text-white text-[11px] font-bold hover:bg-black transition-colors self-start sm:self-auto cursor-pointer"
                              >
                                Join Meet
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* 1B. EMPLOYER DASHBOARD (What business owners should see) */}
            {/* ------------------------------------------------------- */}
            {role === "employer" && (
              <div className="space-y-8">
                {/* 4 Employer Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">4</div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">Active Postings</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">81</div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">Total Candidates</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">3</div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">Interviews Scheduled</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-neutral-900 leading-tight">6 days</div>
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">Avg Time to Hire</div>
                    </div>
                  </div>
                </div>

                {/* Candidate Hiring Pipeline */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">Candidate Hiring Pipeline</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Move applicants through your interview stages</p>
                    </div>
                    <button
                      onClick={() => setIsPostJobOpen(true)}
                      className="px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post New Role</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-sm font-bold text-neutral-900">{app.jobTitle}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">Candidate: Juan Dela Cruz • Applied {app.appliedDate}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStage(app.id, e.target.value as any)}
                            aria-label="Change candidate status"
                            className="px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Offer Extended">Offer Extended</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => showToast("Opening verified candidate CV", "info")}
                            className="px-4 py-1.5 rounded-xl bg-[#111116] text-white hover:bg-black text-xs font-bold cursor-pointer"
                          >
                            View CV
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Active Job Postings */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">Your Live Postings</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Roles published under TechVenture Caraga</p>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="py-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-neutral-900">{job.title}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">{job.location} • {job.salary} • {job.type}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            Active
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            {job.appliedCount} applicants
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------- */}
            {/* 1C. ADMIN DASHBOARD (Image 4 Masterpiece Layout) */}
            {/* ------------------------------------------------------- */}
            {role === "admin" && (
              <div className="space-y-8">
                {/* 6 Quick Stats Pills (Direct Image 4 Blueprint) */}
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="shrink-0 lg:w-56">
                      <h2 className="text-2xl font-bold tracking-tight text-[#111116]">System Stats</h2>
                      <p className="text-xs text-neutral-400 font-medium mt-1">Platform moderation overview</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 flex-1">
                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">500K</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Total Users</div>
                        </div>
                      </div>

                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">1.2K</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Total Companies</div>
                        </div>
                      </div>

                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px] relative">
                        <div className="w-10 h-10 rounded-full bg-[#111116] text-white flex items-center justify-center shadow-xs">
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">3.5K</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Active Vacancies</div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 absolute bottom-3 right-3" />
                      </div>

                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">28K</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Applications</div>
                        </div>
                      </div>

                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">80</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Pending Review</div>
                        </div>
                      </div>

                      <div className="p-5 rounded-[28px] bg-white border border-black/[0.04] shadow-xs flex flex-col items-center justify-between min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-extrabold text-neutral-900 leading-tight">20</div>
                          <div className="text-xs text-neutral-400 font-semibold mt-1">Flagged / Reports</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Statistics Bar Chart & Pending Approvals */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (8 cols): Statistics Dual-Bar Chart */}
                  <div className="lg:col-span-8 p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Statistics</h3>
                      <div className="flex items-center gap-5 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#111116]" />
                          <span className="text-neutral-800">Jobs Posted</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D1D5DB]" />
                          <span className="text-neutral-400">Applications</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative pt-6 pb-2">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-9 pl-10 pr-2">
                        <div className="flex items-center w-full">
                          <span className="w-8 text-[11px] font-bold text-neutral-400 -ml-10">8K</span>
                          <div className="flex-1 border-b border-dashed border-neutral-100" />
                        </div>
                        <div className="flex items-center w-full">
                          <span className="w-8 text-[11px] font-bold text-neutral-400 -ml-10">6K</span>
                          <div className="flex-1 border-b border-dashed border-neutral-100" />
                        </div>
                        <div className="flex items-center w-full">
                          <span className="w-8 text-[11px] font-bold text-neutral-400 -ml-10">4K</span>
                          <div className="flex-1 border-b border-dashed border-neutral-100" />
                        </div>
                        <div className="flex items-center w-full">
                          <span className="w-8 text-[11px] font-bold text-neutral-400 -ml-10">2K</span>
                          <div className="flex-1 border-b border-dashed border-neutral-100" />
                        </div>
                        <div className="flex items-center w-full">
                          <span className="w-8 text-[11px] font-bold text-neutral-400 -ml-10">0</span>
                          <div className="flex-1 border-b border-neutral-200" />
                        </div>
                      </div>

                      <div className="flex items-end justify-between h-64 pl-10 pr-2 gap-2 sm:gap-4 relative z-10">
                        {MONTHLY_STATS.map((item) => {
                          const isHovered = hoveredMonth === item.month;
                          const maxVal = 8000;
                          const postedHeight = (item.posted * 7.5 / maxVal) * 100;
                          const appHeight = (item.applications / maxVal) * 100;

                          return (
                            <div
                              key={item.month}
                              onMouseEnter={() => setHoveredMonth(item.month)}
                              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                            >
                              {isHovered && (
                                <div className="absolute -top-11 px-3 py-1 rounded-xl bg-[#111116] text-white text-[11px] font-extrabold shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center">
                                  <span>{(item.applications / 1000).toFixed(1)}K</span>
                                  <div className="w-2 h-2 bg-[#111116] rotate-45 -mb-1 mt-0.5" />
                                </div>
                              )}

                              <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 pb-2">
                                <div
                                  style={{ height: `${Math.max(12, postedHeight)}%` }}
                                  className="w-2 sm:w-2.5 bg-[#111116] rounded-full transition-all duration-300 group-hover:scale-y-105"
                                />
                                <div
                                  style={{ height: `${Math.max(16, appHeight)}%` }}
                                  className="w-2 sm:w-2.5 bg-[#D1D5DB] rounded-full transition-all duration-300 group-hover:scale-y-105"
                                />
                              </div>

                              <span className={`text-[11px] font-bold mt-2 transition-colors ${
                                isHovered ? "text-neutral-900" : "text-neutral-400"
                              }`}>
                                {item.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (4 cols): Pending Approvals Queue */}
                  <div className="lg:col-span-4 p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Pending Approvals</h3>
                        <button
                          onClick={() => showToast("Viewing company verification queue", "info")}
                          className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-900 shrink-0">
                              CSU
                            </div>
                            <div>
                              <div className="text-sm font-bold text-neutral-900">CSU Tech Park</div>
                              <div className="text-xs text-neutral-400 mt-0.5">Ampayon, Butuan</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleApprove("appr-1")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              approvedState["appr-1"]
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {approvedState["appr-1"] ? "Approved ✓" : "Pending"}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-900 shrink-0">
                              TVC
                            </div>
                            <div>
                              <div className="text-sm font-bold text-neutral-900">TechVenture Caraga</div>
                              <div className="text-xs text-neutral-400 mt-0.5">Montilla, Butuan</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleApprove("appr-2")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              approvedState["appr-2"]
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {approvedState["appr-2"] ? "Approved ✓" : "Pending"}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-900 shrink-0">
                              BMC
                            </div>
                            <div>
                              <div className="text-sm font-bold text-neutral-900">Butuan Medical Center</div>
                              <div className="text-xs text-neutral-400 mt-0.5">Libertad, Butuan</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleApprove("appr-3")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              approvedState["appr-3"]
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {approvedState["appr-3"] ? "Approved ✓" : "Pending"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-medium">
                      <span>3 awaiting review</span>
                      <button
                        onClick={() => {
                          setApprovedState({ "appr-1": true, "appr-2": true, "appr-3": true });
                          showToast("All companies approved!", "success");
                        }}
                        className="text-neutral-900 hover:underline font-bold cursor-pointer"
                      >
                        Approve All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Master Job Registry Table (Admin Full Moderation) */}
                <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Manage jobs</h3>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        {filteredJobs.length} active vacancy records across Butuan &amp; Caraga
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 text-xs font-medium">
                        <Search className="w-3.5 h-3.5 text-neutral-400" />
                        <input
                          type="text"
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          placeholder="Search jobs..."
                          className="w-28 sm:w-40 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
                        />
                      </div>

                      <div className="relative">
                        <select
                          value={selectedStatusFilter}
                          onChange={(e) => setSelectedStatusFilter(e.target.value)}
                          aria-label="Filter status"
                          className="appearance-none px-4 py-2 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                        >
                          <option value="All">Status: All</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Expired">Expired</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span>Export</span>
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-semibold pb-4">
                          <th className="py-3 px-3 w-10">
                            <input
                              type="checkbox"
                              checked={selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              aria-label="Select all"
                              className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer w-4 h-4"
                            />
                          </th>
                          <th className="py-3 px-3 font-semibold">Job Title</th>
                          <th className="py-3 px-3 font-semibold">Company</th>
                          <th className="py-3 px-3 font-semibold">Location</th>
                          <th className="py-3 px-3 font-semibold">Status</th>
                          <th className="py-3 px-3 font-semibold">Posted Date</th>
                          <th className="py-3 px-3 text-right font-semibold">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-neutral-100">
                        {filteredJobs.map((job) => {
                          const isSelected = selectedJobIds.includes(job.id);
                          return (
                            <tr key={job.id} className={`hover:bg-neutral-50/90 transition-colors ${isSelected ? "bg-neutral-50" : ""}`}>
                              <td className="py-4 px-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectOne(job.id)}
                                  aria-label={`Select ${job.title}`}
                                  className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer w-4 h-4"
                                />
                              </td>
                              <td className="py-4 px-3 font-bold text-neutral-900">{job.title}</td>
                              <td className="py-4 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img src={job.companyLogo} alt={job.company} className="w-6 h-6 rounded-lg object-cover border border-neutral-200" />
                                  <span className="font-semibold text-neutral-800">{job.company}</span>
                                </div>
                              </td>
                              <td className="py-4 px-3 text-neutral-600 font-medium">{job.location}</td>
                              <td className="py-4 px-3">
                                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                                  {job.status}
                                </span>
                              </td>
                              <td className="py-4 px-3 text-neutral-500 font-medium text-xs">{job.postedDate}</td>
                              <td className="py-4 px-3 text-right">
                                <button
                                  onClick={() => updateJobStatus(job.id, job.status === "Active" ? "Expired" : "Active")}
                                  className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                                >
                                  {job.status === "Active" ? "Set Expired" : "Activate"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: JOBS DIRECTORY (Role-Separated) */}
        {/* ========================================================= */}
        {currentNav === "jobs" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 2A. ADMIN VIEW: Master Job Registry Table */}
            {role === "admin" && (
              <div className="p-7 sm:p-9 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-rose-600" />
                      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Audit All Regional Jobs</h3>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      Platform-wide vacancy records across Butuan City &amp; Caraga ({filteredJobs.length} records)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 text-xs font-medium">
                      <Search className="w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="Search jobs..."
                        className="w-28 sm:w-40 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        aria-label="Filter status"
                        className="appearance-none px-4 py-2 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                      >
                        <option value="All">Status: All</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>Export CSV</span>
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-semibold pb-4">
                        <th className="py-3 px-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            aria-label="Select all"
                            className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer w-4 h-4"
                          />
                        </th>
                        <th className="py-3 px-3 font-semibold">Job Title</th>
                        <th className="py-3 px-3 font-semibold">Company</th>
                        <th className="py-3 px-3 font-semibold">Location</th>
                        <th className="py-3 px-3 font-semibold">Status</th>
                        <th className="py-3 px-3 font-semibold">Posted Date</th>
                        <th className="py-3 px-3 text-right font-semibold">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                      {filteredJobs.map((job) => {
                        const isSelected = selectedJobIds.includes(job.id);
                        return (
                          <tr key={job.id} className={`hover:bg-neutral-50/90 transition-colors ${isSelected ? "bg-neutral-50" : ""}`}>
                            <td className="py-4 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectOne(job.id)}
                                aria-label={`Select ${job.title}`}
                                className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer w-4 h-4"
                              />
                            </td>
                            <td className="py-4 px-3 font-bold text-neutral-900">{job.title}</td>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2.5">
                                <img src={job.companyLogo} alt={job.company} className="w-6 h-6 rounded-lg object-cover border border-neutral-200" />
                                <span className="font-semibold text-neutral-800">{job.company}</span>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-neutral-600 font-medium">{job.location}</td>
                            <td className="py-4 px-3">
                              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                                {job.status}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-neutral-500 font-medium text-xs">{job.postedDate}</td>
                            <td className="py-4 px-3 text-right">
                              <button
                                onClick={() => updateJobStatus(job.id, job.status === "Active" ? "Expired" : "Active")}
                                className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                              >
                                {job.status === "Active" ? "Set Expired" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2B. EMPLOYER VIEW: Manage Company Postings */}
            {role === "employer" && (
              <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">Your Company Vacancies</h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Active hiring listings for TechVenture Caraga in Butuan City
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPostJobOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Post New Role</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-100">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 p-0.5 bg-white" />
                        <div>
                          <div className="text-base font-bold text-neutral-900">{job.title}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {job.location} • <strong className="text-neutral-800">{job.salary}</strong> • {job.type}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-1">Posted {job.postedDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            {job.status}
                          </span>
                          <div className="text-xs text-neutral-500 font-medium mt-1">
                            {job.appliedCount} Candidates
                          </div>
                        </div>

                        <button
                          onClick={() => updateJobStatus(job.id, job.status === "Active" ? "Expired" : "Active")}
                          className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:text-black hover:bg-neutral-50 cursor-pointer"
                        >
                          {job.status === "Active" ? "Pause" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2C. JOBSEEKER VIEW: Browse Opportunities with Filter Chips */}
            {role === "jobseeker" && (
              <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">Explore Careers in Caraga</h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      Direct employer postings with transparent compensation across Butuan City.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 text-xs font-medium">
                    <Search className="w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search roles, skills, or city..."
                      className="w-36 sm:w-48 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {["All", "Design", "Developer", "Healthcare", "Education"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? "bg-[#111116] text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      {cat === "All" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-7 rounded-[28px] bg-neutral-50/70 border border-neutral-200/70 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3.5">
                            <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 p-1 bg-white" />
                            <div>
                              <div className="text-base font-bold text-neutral-900">{job.company}</div>
                              <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-black text-neutral-900 bg-white px-3 py-1 rounded-full border border-neutral-200">
                            {job.salary}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-neutral-900 mb-2">{job.title}</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-6">{job.description}</p>
                      </div>

                      <div className="pt-4 border-t border-neutral-200/80 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 font-mono">{job.postedDate}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(job.id)}
                            className="p-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedJobIds.includes(job.id) ? "fill-amber-500 text-amber-500" : "text-neutral-400"}`} />
                          </button>
                          <button
                            onClick={() => setApplyModalJob(job)}
                            className="px-6 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            Easy Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: APPLICATIONS */}
        {/* ========================================================= */}
        {currentNav === "applications" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {role === "employer" ? "Candidate Hiring Pipeline" : "My Active Submissions"}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {role === "employer"
                      ? "Advance applicants through recruitment stages and schedule interviews."
                      : "Live status updates synced directly with local hiring teams."}
                  </p>
                </div>
                <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-4 py-2 rounded-full self-start">
                  {applications.length} Submissions
                </span>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 sm:p-7 rounded-[28px] bg-neutral-50/70 border border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-5">
                      <img src={app.companyLogo} alt={app.company} className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 p-1 bg-white shrink-0" />
                      <div>
                        <div className="text-lg font-bold text-neutral-900">{app.jobTitle}</div>
                        <div className="text-sm text-neutral-600 font-medium mt-0.5">{app.company} • {app.location}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          Applied: {app.appliedDate} • Expected: <strong className="text-neutral-700">{app.salary}</strong>
                        </div>
                      </div>
                    </div>

                    {role === "employer" ? (
                      <div className="flex items-center gap-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStage(app.id, e.target.value as any)}
                          aria-label={`Change stage for ${app.jobTitle}`}
                          className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Extended">Offer Extended</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => showToast("Opening verified candidate CV", "info")}
                          className="px-4 py-2 rounded-xl bg-[#111116] text-white hover:bg-black text-xs font-bold cursor-pointer"
                        >
                          View CV
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:items-end gap-2">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                            app.status === "Interview Scheduled"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : app.status === "Under Review"
                              ? "bg-blue-100 text-blue-900 border border-blue-200"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{app.status}</span>
                        </span>
                        {app.interviewDate && (
                          <span className="text-xs font-semibold text-amber-950 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                            🗓️ {app.interviewDate}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: COMPANIES (Institutions Directory) */}
        {/* ========================================================= */}
        {currentNav === "companies" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
              {role === "admin" && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-semibold mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Admin Company Verification: Verify business permits and employer status to protect Caraga jobseekers.</span>
                  </div>
                  <span className="font-bold bg-white px-3 py-1 rounded-full text-rose-800 border border-rose-200 self-start sm:self-auto">
                    1,240 Verified
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-900">Caraga Companies &amp; Institutions</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Verified local partners in Butuan City and nearby Caraga provinces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STARTUPS.map((org) => (
                  <div
                    key={org.id}
                    className="p-6 rounded-[28px] bg-neutral-50/70 border border-neutral-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${org.logoBg} text-white flex items-center justify-center font-bold text-lg shadow-xs`}>
                          {org.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 mb-1">{org.name}</h4>
                      <p className="text-xs text-neutral-500 mb-3">{org.location} • {org.type}</p>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-6">{org.description}</p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700">{org.jobsCount} Openings</span>
                      <button
                        onClick={() => {
                          setCurrentNav("jobs");
                          showToast(`Viewing vacancies at ${org.name}`, "info");
                        }}
                        className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Roles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: USERS / DIRECTORY (Role-Protected) */}
        {/* ========================================================= */}
        {currentNav === "users" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {role === "jobseeker" ? (
              <div className="p-10 sm:p-14 rounded-[32px] bg-white border border-black/[0.04] text-center max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Talent Sourcing Directory</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                  The Regional Talent Directory is an employer sourcing tool used by verified companies to discover local candidates. Your profile is active and visible to hiring teams in Butuan!
                </p>
                <button
                  onClick={() => setCurrentNav("resume")}
                  className="px-7 py-3 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  Manage Your Public Profile
                </button>
              </div>
            ) : (
              <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
                {role === "admin" && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-semibold mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Admin User Moderation: Manage accounts, verify university credentials, and handle flags.</span>
                    </div>
                    <span className="font-bold bg-white px-3 py-1 rounded-full text-rose-800 border border-rose-200 self-start sm:self-auto">
                      15,420 Active Accounts
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {role === "admin" ? "Platform User Accounts & Moderation" : "Caraga Talent Directory"}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {role === "admin"
                        ? "Verify graduates from Caraga State University (CSU), FSUU, and regional applicants."
                        : "Source top tech, creative, and professional graduates in Butuan City."}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-4 py-2 rounded-full self-start">
                    15,420 Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Juan Dela Cruz",
                      role: "Product Designer",
                      univ: "Caraga State University",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
                      skills: ["Figma", "Design Systems", "Next.js"]
                    },
                    {
                      name: "Maria Santos",
                      role: "Frontend Developer",
                      univ: "Father Saturnino Urios University",
                      avatar: "/hero-applicant.png",
                      skills: ["React", "TypeScript", "Tailwind CSS"]
                    },
                    {
                      name: "Christian Morales",
                      role: "Mobile App Dev",
                      univ: "SJIT Butuan",
                      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
                      skills: ["Flutter", "Dart", "Supabase"]
                    }
                  ].map((seeker) => (
                    <div key={seeker.name} className="p-6 rounded-[28px] bg-neutral-50/80 border border-neutral-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3.5 mb-4">
                          <img src={seeker.avatar} alt={seeker.name} className="w-12 h-12 rounded-full object-cover border border-neutral-300" />
                          <div>
                            <div className="text-base font-bold text-neutral-900">{seeker.name}</div>
                            <div className="text-xs text-neutral-500">{seeker.role}</div>
                          </div>
                        </div>
                        <div className="text-xs text-neutral-400 mb-4">{seeker.univ}</div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {seeker.skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-neutral-200 text-neutral-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-200/80">
                        {role === "admin" ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              Verified CSU Alumni
                            </span>
                            <button
                              onClick={() => showToast(`Moderated status for ${seeker.name}`, "info")}
                              className="text-xs text-neutral-500 hover:text-black underline font-semibold cursor-pointer"
                            >
                              Manage
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => showToast(`Inviting ${seeker.name} to apply for open roles`, "info")}
                            className="w-full py-2.5 rounded-full bg-[#111116] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-xs active:scale-95"
                          >
                            Connect &amp; Invite
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: SAVED JOBS */}
        {/* ========================================================= */}
        {currentNav === "saved" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Saved Jobs</h3>
                  <p className="text-sm text-neutral-500 mt-1">Opportunities you shortlisted in Butuan.</p>
                </div>
                <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-4 py-2 rounded-full">
                  {savedJobs.length} Saved
                </span>
              </div>

              {savedJobs.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">You haven&apos;t saved any jobs yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-7 rounded-[28px] bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-neutral-700">{job.company}</span>
                          <span className="text-base font-black text-neutral-900">{job.salary}</span>
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900 mb-1">{job.title}</h4>
                        <p className="text-sm text-neutral-500">{job.location} • {job.type}</p>
                      </div>

                      <div className="pt-5 mt-4 border-t border-neutral-200 flex items-center justify-between">
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className="text-sm text-neutral-400 hover:text-rose-600 font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setApplyModalJob(job)}
                          className="px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: RESUME & PORTFOLIO */}
        {/* ========================================================= */}
        {currentNav === "resume" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 sm:p-12 rounded-[32px] bg-white border border-black/[0.04] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <img
                    src="/hero-applicant.png"
                    alt={userProfile.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-2xl font-bold text-neutral-900">{userProfile.fullName}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Verified Member
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-600 mt-1">{userProfile.headline}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{userProfile.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 mb-8">
                <div className="text-xs font-bold text-neutral-700 mb-1.5">About Me</div>
                <p className="text-sm text-neutral-700 leading-relaxed">{userProfile.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-3xl bg-neutral-50/70 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1.5">
                    <GraduationCap className="w-4 h-4 text-neutral-800" />
                    <span>Education</span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900">{userProfile.education}</div>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-50/70 border border-neutral-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 mb-1.5">
                    <Globe className="w-4 h-4 text-neutral-800" />
                    <span>Portfolio</span>
                  </div>
                  <a
                    href={userProfile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1.5"
                  >
                    <span>{userProfile.portfolioUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-neutral-700 mb-2.5">Skills</div>
                <div className="flex flex-wrap items-center gap-2">
                  {userProfile.skills.map((skill) => (
                    <span key={skill} className="px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#111116] text-white flex items-center justify-center shadow-xs">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{userProfile.resumeFileName}</div>
                    <div className="text-xs text-neutral-500 font-medium">
                      {userProfile.resumeUpdated} • Target: <strong className="text-neutral-800">{userProfile.expectedSalary}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="text-xs font-bold text-neutral-800 hover:text-black underline cursor-pointer"
                >
                  Update CV
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Interactive Modals */}
      <ApplyModal />
      <PostJobModal />
      <ResumePortfolioModal />
      <AuthModal />
    </div>
  );
}
