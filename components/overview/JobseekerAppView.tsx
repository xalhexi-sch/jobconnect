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

export default function JobseekerAppView({
  activeSubTab: externalSubTab,
  onSubTabChange,
  hideTopTabs = false,
}: {
  activeSubTab?: "find" | "applications" | "saved" | "resume";
  onSubTabChange?: (tab: "find" | "applications" | "saved" | "resume") => void;
  hideTopTabs?: boolean;
} = {}) {
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

  const [internalSubTab, setInternalSubTab] = useState<"find" | "applications" | "saved" | "resume">("find");
  const activeSubTab = externalSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: "find" | "applications" | "saved" | "resume") => {
    if (onSubTabChange) onSubTabChange(tab);
    setInternalSubTab(tab);
  };

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
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-28 sm:pb-24">
      
      {/* Top App Tab Pills (hidden when Dock is active) */}
      {!hideTopTabs && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab("find")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === "find"
                  ? "bg-blue-600 text-white shadow-xs"
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
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === "applications"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Applications</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                activeSubTab === "applications" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800 font-bold"
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("saved")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === "saved"
                  ? "bg-blue-600 text-white shadow-xs"
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
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === "resume"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </div>

          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 1: FIND WORK NOW */}
      {/* ========================================================= */}
      {activeSubTab === "find" && (
        <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-150">
          
          {/* Quick Search & Local Filter Bar (Mobile Optimized) */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 px-3 py-2 sm:py-1.5 rounded-xl bg-neutral-50 md:bg-transparent border md:border-0 border-neutral-200/70 flex-1">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, skills, or business in Butuan..."
                className="w-full text-xs sm:text-sm font-medium text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              {/* Barangay selector */}
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="text-xs font-semibold text-neutral-700 bg-neutral-50 md:bg-transparent border border-neutral-200/70 md:border-0 md:border-l md:border-neutral-200 rounded-xl md:rounded-none py-2 px-2.5 focus:outline-none cursor-pointer"
              >
                <option value="All">All Barangays</option>
                <option value="Montilla Blvd">Montilla Blvd</option>
                <option value="Libertad">Libertad</option>
                <option value="Ampayon">Ampayon</option>
                <option value="Bancasi">Bancasi</option>
                <option value="JC Aquino">JC Aquino</option>
                <option value="Doongan">Doongan</option>
                <option value="Villa Kananga">Villa Kananga</option>
                <option value="Holy Redeemer">Holy Redeemer</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-semibold text-neutral-700 bg-neutral-50 md:bg-transparent border border-neutral-200/70 md:border-0 md:border-l md:border-neutral-200 rounded-xl md:rounded-none py-2 px-2.5 focus:outline-none cursor-pointer"
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
          </div>

          {/* Job Cards Stream */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200 text-center">
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
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer"
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
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="max-w-full max-h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
                            {job.title}
                          </h4>
                          {job.featured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-md shrink-0">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-neutral-600 font-medium mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="font-semibold text-neutral-800">{job.company}</span>
                          <span className="text-neutral-300">&bull;</span>
                          <span className="flex items-center gap-1 text-neutral-500">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50/90 border border-blue-200/50 px-2 py-0.5 rounded-md">
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

                    {/* Touch Friendly Action Buttons */}
                    <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-2.5 sm:p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                          isSaved
                            ? "text-amber-500 bg-amber-50 border-amber-200"
                            : "text-neutral-400 hover:text-black bg-neutral-50 border-neutral-200"
                        }`}
                        title="Save job"
                      >
                        <Bookmark className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isSaved ? "fill-current" : ""}`} />
                      </button>

                      {hasApplied ? (
                        <span className="flex-1 sm:flex-initial justify-center px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setApplyModalJob(job)}
                          className="flex-1 sm:flex-initial justify-center px-4 py-2 sm:py-1.5 rounded-xl btn-brand-primary text-xs font-bold transition-all cursor-pointer shadow-xs"
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
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">Application Pipeline</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Track your status with hiring employers across Butuan &amp; Caraga.
                </p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md shrink-0">
                {applications.length} Total
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="py-10 sm:py-12 text-center">
                <Send className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-800">No applications submitted yet</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Browse open positions in Butuan City and tap &ldquo;Easy Apply&rdquo; to send your resume directly to employers.
                </p>
                <button
                  onClick={() => setActiveSubTab("find")}
                  className="mt-3.5 px-4 py-2 rounded-xl btn-brand-primary text-xs font-bold text-white cursor-pointer shadow-xs"
                >
                  Browse Open Vacancies
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
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
                        return "bg-blue-50 text-blue-800 border-blue-200";
                      case "Rejected":
                        return "bg-rose-50 text-rose-700 border-rose-200";
                      default:
                        return "bg-neutral-100 text-neutral-700 border-neutral-200";
                    }
                  };

                  return (
                    <div
                      key={app.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-neutral-900">{app.jobTitle}</div>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          {app.company} &bull; {app.location} &bull; {app.salary}
                        </div>
                        {app.interviewDate && (
                          <div className="text-xs text-amber-800 font-medium mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>Interview: {app.interviewDate}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
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
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 3: SAVED JOBS */}
      {/* ========================================================= */}
      {activeSubTab === "saved" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Saved Job Bookmarks</h3>
            <p className="text-xs text-neutral-500 mb-4 sm:mb-5">Openings you bookmarked for later application.</p>

            {savedJobs.length === 0 ? (
              <div className="py-10 sm:py-12 text-center">
                <Bookmark className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-800">No saved jobs yet</h4>
                <p className="text-xs text-neutral-500 mt-1">Tap the bookmark icon on any job card to save it here.</p>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-neutral-900">{job.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {job.company} &bull; {job.location} &bull; {job.salary}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className="text-xs text-neutral-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setApplyModalJob(job)}
                        className="px-3.5 py-1.5 rounded-xl btn-brand-primary text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Apply Now
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
      {/* SUB-VIEW 4: CANDIDATE PROFILE & CREDENTIALS */}
      {/* ========================================================= */}
      {activeSubTab === "resume" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 sm:p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-5 sm:space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-neutral-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">{userProfile.fullName}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{userProfile.headline || "Jobseeker in Butuan City"}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{userProfile.location}</p>
              </div>

              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="btn-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile Details</span>
              </button>
            </div>

            {/* Quick Overview Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-xs font-semibold text-neutral-500 mb-1">Education &amp; Degree</div>
                <div className="text-xs font-bold text-neutral-800">{userProfile.education || "Not specified"}</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="text-xs font-semibold text-neutral-500 mb-1">Expected Monthly Pay</div>
                <div className="text-xs font-bold text-blue-700">{userProfile.expectedSalary || "Negotiable"}</div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-xs font-semibold text-neutral-700 mb-2">Verified Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="text-xs font-semibold text-neutral-700 mb-1">Professional Summary</div>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 sm:p-4 rounded-xl border border-neutral-200/80">
                {userProfile.bio || "No summary provided."}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
