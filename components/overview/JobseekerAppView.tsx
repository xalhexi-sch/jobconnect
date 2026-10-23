"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  MapPin,
  Bookmark,
  Calendar,
  Send,
  FileText,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Globe
} from "lucide-react";

export default function JobseekerAppView() {
  const {
    jobs,
    applications,
    bookmarkedJobIds,
    toggleBookmark,
    setApplyModalJob,
    userProfile,
    setIsResumeModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");

  // Filter jobs for the "Find Work" stream
  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    if (selectedCity !== "All" && job.city !== selectedCity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const savedJobs = jobs.filter((job) => bookmarkedJobIds.includes(job.id));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top App Tab Pills: Scaled up with generous touch targets */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-[28px] border border-black/[0.04] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("find")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeSubTab === "find"
                ? "bg-[#111116] text-white shadow-md"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Work Now</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {filteredJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("applications")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeSubTab === "applications"
                ? "bg-[#111116] text-white shadow-md"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Applications</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeSubTab === "applications" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("saved")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeSubTab === "saved"
                ? "bg-[#111116] text-white shadow-md"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs</span>
            <span className="text-xs bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
              {savedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("resume")}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeSubTab === "resume"
                ? "bg-[#111116] text-white shadow-md"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume & Portfolio</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </button>
        </div>

        {/* Quick action: Edit Profile button */}
        <button
          onClick={() => setIsResumeModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-VIEW 1: FIND WORK NOW */}
      {/* ========================================================= */}
      {activeSubTab === "find" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Quick Search & Local Filter Bar */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-white border border-black/[0.04] shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 px-4 w-full sm:flex-1">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, skill, or keyword in Caraga..."
                className="w-full text-base text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Cities</option>
                <option value="Butuan City">Butuan City</option>
                <option value="Cabadbaran City">Cabadbaran City</option>
                <option value="Surigao City">Surigao City</option>
                <option value="Bayugan City">Bayugan City</option>
                <option value="Bislig City">Bislig City</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-neutral-100 text-sm font-semibold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Sectors</option>
                <option value="Developer">Developer & IT</option>
                <option value="Design">Design & Media</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Marketing">Marketing</option>
                <option value="Security">Systems & Security</option>
                <option value="Admin & Support">Admin & Support</option>
              </select>
            </div>
          </div>

          {/* Jobs Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const isSaved = bookmarkedJobIds.includes(job.id);
              const hasApplied = applications.some((a) => a.jobId === job.id);

              return (
                <div
                  key={job.id}
                  className="p-8 sm:p-9 rounded-[36px] bg-white border border-black/[0.04] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 p-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="max-w-full max-h-full object-cover rounded-xl"
                          />
                        </div>
                        <div>
                          <div className="text-base font-bold text-neutral-900">{job.company}</div>
                          <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-full">
                          {job.salary}
                        </span>
                        <button
                          onClick={() => toggleBookmark(job.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isSaved ? "text-amber-500 bg-amber-50" : "text-neutral-300 hover:text-black bg-neutral-50"
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 tracking-tight">
                      {job.title}
                    </h4>

                    <div className="flex items-center gap-2.5 mb-4 text-xs font-semibold">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                        {job.category}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-mono">
                      Posted: {job.postedDate}
                    </span>

                    {hasApplied ? (
                      <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setApplyModalJob(job)}
                        className="px-6 py-2.5 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                      >
                        Easy Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 2: MY APPLICATIONS TRACKER */}
      {/* ========================================================= */}
      {activeSubTab === "applications" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-black/[0.04] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">Application Status & Pipeline</h3>
                <p className="text-sm sm:text-base text-neutral-500 mt-1">
                  Real-time status updates synced directly with Butuan and Caraga recruitment teams.
                </p>
              </div>
              <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-4 py-2 rounded-full self-start sm:self-auto">
                {applications.length} Submissions Active
              </span>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-6 sm:p-7 rounded-[28px] bg-neutral-50/70 border border-neutral-200 hover:bg-neutral-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={app.companyLogo}
                        alt={app.company}
                        className="max-w-full max-h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-neutral-900">{app.jobTitle}</div>
                      <div className="text-sm sm:text-base text-neutral-600 font-medium mt-0.5">
                        {app.company} • {app.location}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        Submitted: {app.appliedDate} • Expected: <strong className="text-neutral-700">{app.salary}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2.5">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold self-start md:self-auto ${
                        app.status === "Interview Scheduled"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : app.status === "Under Review"
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : app.status === "Offer Extended"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-neutral-200 text-neutral-800"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{app.status}</span>
                    </span>

                    {app.interviewDate && (
                      <span className="text-xs font-semibold text-amber-950 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                        🗓️ {app.interviewDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 3: SAVED JOBS */}
      {/* ========================================================= */}
      {activeSubTab === "saved" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-black/[0.04] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">Your Bookmarked Roles</h3>
                <p className="text-sm sm:text-base text-neutral-500 mt-1">
                  Shortlisted positions ready for 1-click Easy Apply.
                </p>
              </div>
              <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-4 py-2 rounded-full">
                {savedJobs.length} Saved
              </span>
            </div>

            {savedJobs.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <Bookmark className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-base font-medium">No jobs bookmarked yet. Tap the bookmark icon on any job in Find Work.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-7 rounded-[32px] bg-neutral-50/70 border border-neutral-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-neutral-700">{job.company}</span>
                        <span className="text-base font-black text-neutral-900">{job.salary}</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1.5">{job.title}</h4>
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
                        className="px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                      >
                        Easy Apply
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
      {/* SUB-VIEW 4: RESUME & PORTFOLIO */}
      {/* ========================================================= */}
      {activeSubTab === "resume" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Visual Profile Card */}
          <div className="p-8 sm:p-12 rounded-[40px] bg-white border border-black/[0.04] shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div className="flex items-center gap-5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80"
                  alt={userProfile.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">{userProfile.fullName}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Verified Caraga Seeker
                    </span>
                  </div>
                  <div className="text-base font-semibold text-neutral-600 mt-1">
                    {userProfile.headline}
                  </div>
                  <div className="text-sm text-neutral-400 flex items-center gap-1.5 mt-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>{userProfile.location}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#111116] text-white hover:bg-black text-sm font-bold transition-all flex items-center gap-2 shadow-md active:scale-95 self-start cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Credentials</span>
              </button>
            </div>

            {/* Bio */}
            <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 mb-8">
              <div className="text-sm font-bold text-neutral-700 mb-2">Professional Summary</div>
              <p className="text-base text-neutral-700 leading-relaxed">
                {userProfile.bio}
              </p>
            </div>

            {/* Two column grid: Education & Portfolio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-3xl bg-neutral-50/70 border border-neutral-100">
                <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-700 mb-2">
                  <GraduationCap className="w-5 h-5 text-neutral-800" />
                  <span>Education & Alma Mater</span>
                </div>
                <div className="text-base font-semibold text-neutral-900">{userProfile.education}</div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-50/70 border border-neutral-100">
                <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-700 mb-2">
                  <Globe className="w-5 h-5 text-neutral-800" />
                  <span>Portfolio & Projects</span>
                </div>
                <a
                  href={userProfile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold text-emerald-600 hover:underline flex items-center gap-1.5"
                >
                  <span>{userProfile.portfolioUrl}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="mb-8">
              <div className="text-sm font-bold text-neutral-700 mb-3">Verified Skill Stack</div>
              <div className="flex flex-wrap items-center gap-2">
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume File Chip */}
            <div className="p-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#111116] text-white flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-base font-bold text-neutral-900">{userProfile.resumeFileName}</div>
                  <div className="text-xs text-neutral-500 font-medium">{userProfile.resumeUpdated} • Target: <strong className="text-neutral-800">{userProfile.expectedSalary}</strong></div>
                </div>
              </div>

              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="text-sm font-bold text-neutral-800 hover:text-black underline cursor-pointer self-start sm:self-auto"
              >
                Update CV
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
