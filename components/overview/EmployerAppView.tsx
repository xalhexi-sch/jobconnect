"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Briefcase,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building2,
  RefreshCw
} from "lucide-react";
import { Application } from "@/lib/types";
import { fetchEmployerApplicationsAction } from "@/app/actions/applications";

export default function EmployerAppView() {
  const {
    jobs,
    user,
    userProfile,
    updateApplicationStage,
    setIsPostJobOpen,
    showToast
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [employerApps, setEmployerApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employer-specific applications (strict security boundary)
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchEmployerApplicationsAction(user.id)
      .then((apps) => {
        if (mounted) {
          setEmployerApps(apps || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("fetchEmployerApplications error:", err);
        if (mounted) {
          setEmployerApps([]);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [user.id]);

  const filteredApplications = employerApps.filter((app) => {
    if (selectedStatusFilter !== "All" && app.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleStageChange = async (appId: string, newStage: Application["status"]) => {
    setEmployerApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStage } : a))
    );
    await updateApplicationStage(appId, newStage);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Title,Company,Location,Status,PostedDate,Salary"]
        .concat(
          jobs.map(
            (j) =>
              `"${j.title}","${j.company}","${j.location}","${j.status}","${j.postedDate}","${j.salary}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobconnect_bxu_jobs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported listings to CSV", "success");
  };

  const interviewingCount = employerApps.filter((a) => a.status === "Interview Scheduled").length;
  const offersCount = employerApps.filter((a) => a.status === "Offer Extended").length;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-28 sm:pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Employer</span>
            </span>
            <span className="text-xs text-neutral-400 font-medium hidden sm:inline">&bull;</span>
            <span className="text-xs text-neutral-600 font-semibold hidden sm:inline">
              {userProfile.companyName ? `${userProfile.companyName} (${user.fullName || "Manager"})` : (user.fullName || "Manager")}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900">
            {userProfile.companyName ? `${userProfile.companyName} Hiring Portal` : "Employer Hiring Portal"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage candidates, schedule interviews, and publish verified openings in Butuan City.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl btn-clerk-outline text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsPostJobOpen(true)}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl btn-brand-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Vacancy</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards (Mobile 2x2 grid with balanced padding) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
            <span>Openings</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900">{jobs.length}</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
            <span>Applicants</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900">{employerApps.length}</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
            <span>In Interview</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900">{interviewingCount}</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-[11px] sm:text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
            <span>Offers</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900">{offersCount}</div>
        </div>
      </div>

      {/* Candidate Pipeline */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-900">Candidate Pipeline &amp; Applications</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Review applicant qualifications and update hiring stages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">Filter:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs font-semibold text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="All">All Stages</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-xs text-neutral-500 flex flex-col items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading applicant pipeline...</span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-8 text-center rounded-xl bg-neutral-50 border border-dashed border-neutral-200 p-6">
            <Building2 className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-neutral-800">No applications in this view</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              New candidate submissions from Butuan City jobseekers will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-neutral-900">
                      {app.applicantName || "Candidate Applicant"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                      {app.jobTitle}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    {app.applicantEmail && <span className="font-medium text-neutral-700">{app.applicantEmail} &bull; </span>}
                    Applied: {app.appliedDate}
                    {app.location && <span> &bull; {app.location}</span>}
                  </div>
                  {app.coverLetter && (
                    <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 italic bg-white/70 p-2 rounded border border-neutral-200/60">
                      &quot;{app.coverLetter}&quot;
                    </p>
                  )}
                  {app.interviewDate && (
                    <div className="text-xs text-amber-800 font-semibold mt-1">
                      Scheduled: {app.interviewDate}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                  <select
                    value={app.status}
                    onChange={(e) => handleStageChange(app.id, e.target.value as Application["status"])}
                    className="flex-1 sm:flex-initial px-2.5 py-2 sm:py-1.5 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => {
                      if (app.resumeUrl) {
                        window.open(app.resumeUrl, "_blank");
                      } else {
                        showToast("Candidate resume submitted directly with application", "info");
                      }
                    }}
                    className="px-3.5 py-2 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
                  >
                    View CV
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Posted Vacancies */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Your Posted Vacancies</h3>
        <p className="text-xs text-neutral-500 mb-3 sm:mb-4">Live job listings visible to Butuan &amp; Caraga seekers.</p>

        <div className="space-y-2 sm:space-y-2.5">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="p-3 sm:p-3.5 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-900">{job.title}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{job.company} &bull; {job.location} &bull; {job.salary}</div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  {job.status}
                </span>
                <span className="text-xs text-neutral-400">
                  {job.appliedCount} applicants
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
