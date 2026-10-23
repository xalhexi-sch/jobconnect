"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  MapPin,
  Bookmark,
  Send,
  FileText,
  Edit3,
  CheckCircle2,
  Clock,
  Briefcase
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
  const [selectedBarangay, setSelectedBarangay] = useState("All");

  // Filter jobs for the "Find Work" stream
  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    if (selectedCity !== "All" && job.city !== selectedCity) return false;
    if (selectedBarangay !== "All" && job.barangay !== selectedBarangay) return false;
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top App Tab Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("find")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "find"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Jobs</span>
            <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded-md">
              {filteredJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("applications")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "applications"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>My Applications</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
              activeSubTab === "applications" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800 font-bold"
            }`}>
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("saved")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "saved"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            <span className="text-[11px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded-md">
              {savedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("resume")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "resume"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>

        {/* Quick action: Edit Profile button */}
        <button
          onClick={() => setIsResumeModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-VIEW 1: FIND WORK NOW */}
      {/* ========================================================= */}
      {activeSubTab === "find" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Quick Search & Local Filter Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 w-full sm:flex-1">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or keyword..."
                className="w-full text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="hidden sm:block w-px h-6 bg-neutral-200" />

            {/* City / Province Filter */}
            <div className="flex items-center gap-2 px-2 w-full sm:w-auto">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedBarangay("All");
                }}
                className="text-xs font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer py-1"
              >
                <option value="All">All Caraga</option>
                <option value="Butuan City">Butuan City</option>
                <option value="Cabadbaran City">Cabadbaran</option>
                <option value="Surigao City">Surigao</option>
                <option value="Bayugan City">Bayugan</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer py-1 px-2 border-l border-neutral-200"
            >
              <option value="All">All Categories</option>
              <option value="Developer">Developer</option>
              <option value="Design">Design</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Hospitality">Hospitality &amp; Cafes</option>
              <option value="Trades & Logistics">Trades &amp; Logistics</option>
              <option value="Marketing">Marketing</option>
              <option value="Admin & Support">Admin &amp; Support</option>
            </select>
          </div>

          {/* Job Cards Stream */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-neutral-200 text-center">
                <Briefcase className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-800">No jobs match your current search</h4>
                <p className="text-xs text-neutral-500 mt-1">Try resetting the filters or searching a different term.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("All");
                    setSelectedCategory("All");
                    setSelectedBarangay("All");
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSaved = bookmarkedJobIds.includes(job.id);
                const hasApplied = applications.some((a) => a.jobId === job.id);

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="max-w-full max-h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                            {job.title}
                          </h4>
                          {job.featured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-md">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-neutral-600 font-medium mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-neutral-800">{job.company}</span>
                          <span className="text-neutral-300">&bull;</span>
                          <span className="flex items-center gap-1 text-neutral-500">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {job.location}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                            {job.salary}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {job.type}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {job.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? "text-amber-500 bg-amber-50 border-amber-200"
                            : "text-neutral-400 hover:text-black bg-neutral-50 border-neutral-200"
                        }`}
                        title="Save job"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                      </button>

                      {hasApplied ? (
                        <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setApplyModalJob(job)}
                          className="px-4 py-1.5 rounded-lg btn-supabase-emerald text-xs font-bold transition-all cursor-pointer"
                        >
                          Easy Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 2: MY APPLICATIONS TRACKER */}
      {/* ========================================================= */}
      {activeSubTab === "applications" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Application Pipeline</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Track your application status with hiring employers across Butuan &amp; Caraga.
                </p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                {applications.length} Total
              </span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => {
                const getStatusStyle = (status: string) => {
                  switch (status) {
                    case "Submitted":
                      return "bg-neutral-100 text-neutral-700 border-neutral-200";
                    case "Under Review":
                      return "bg-blue-50 text-blue-700 border-blue-200";
                    case "Interview Scheduled":
                      return "bg-amber-50 text-amber-800 border-amber-200";
                    case "Offer Extended":
                      return "bg-emerald-50 text-emerald-800 border-emerald-200";
                    case "Rejected":
                      return "bg-rose-50 text-rose-700 border-rose-200";
                    default:
                      return "bg-neutral-100 text-neutral-700 border-neutral-200";
                  }
                };

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{app.jobTitle}</div>
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {app.company} &bull; {app.location} &bull; {app.salary}
                      </div>
                      {app.interviewDate && (
                        <div className="text-xs text-amber-800 font-medium mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Interview: {app.interviewDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {app.appliedDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 3: SAVED JOBS */}
      {/* ========================================================= */}
      {activeSubTab === "saved" && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {savedJobs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">No saved jobs yet. Click the bookmark icon on any job to save it.</p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-bold text-neutral-900">{job.title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{job.company} &bull; {job.location} &bull; {job.salary}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(job.id)}
                    className="p-1.5 text-amber-500 hover:text-neutral-400"
                    title="Remove from bookmarks"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => setApplyModalJob(job)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#111116] text-white text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 4: RESUME & PROFILE */}
      {/* ========================================================= */}
      {activeSubTab === "resume" && (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">{userProfile.fullName}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{userProfile.headline} &bull; {userProfile.location}</p>
            </div>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#111116] text-white text-xs font-bold cursor-pointer"
            >
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold text-neutral-400 mb-0.5">Education</div>
              <div className="text-neutral-900 font-medium">{userProfile.education || "None listed"}</div>
            </div>
            <div>
              <div className="font-semibold text-neutral-400 mb-0.5">Expected Pay</div>
              <div className="text-neutral-900 font-medium">{userProfile.expectedSalary || "Negotiable"}</div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-neutral-400 text-xs mb-1.5">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {userProfile.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
