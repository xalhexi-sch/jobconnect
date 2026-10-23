"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Briefcase,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Download
} from "lucide-react";
import { Application } from "@/lib/types";

export default function EmployerAppView() {
  const {
    jobs,
    applications,
    updateApplicationStage,
    setIsPostJobOpen,
    showToast
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  const filteredApplications = applications.filter((app) => {
    if (selectedStatusFilter !== "All" && app.status !== selectedStatusFilter) return false;
    return true;
  });

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
    link.setAttribute("download", `jobconnect_caraga_jobs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported listings to CSV", "success");
  };

  const interviewingCount = applications.filter((a) => a.status === "Interview Scheduled").length;
  const offersCount = applications.filter((a) => a.status === "Offer Extended").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Employer Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Post vacancies and manage local candidates in Butuan City &amp; Caraga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl btn-clerk-outline text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsPostJobOpen(true)}
            className="px-4 py-2 rounded-xl btn-supabase-emerald text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post a Vacancy</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
            <span>Active Openings</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{jobs.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span>Applications</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{applications.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>In Interview</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{interviewingCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Offers Extended</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{offersCount}</div>
        </div>
      </div>

      {/* Candidate Pipeline */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Received Applications</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Update candidate stages to notify applicants of hiring progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">Filter:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs font-semibold text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
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

        {filteredApplications.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No applications found for this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-100/60 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    Candidate for: {app.jobTitle}
                  </div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    {app.company} &bull; Applied: {app.appliedDate}
                  </div>
                  {app.interviewDate && (
                    <div className="text-xs text-amber-800 font-medium mt-1">
                      Scheduled: {app.interviewDate}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStage(app.id, e.target.value as Application["status"])}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => showToast("Applicant resume is attached to this application", "info")}
                    className="px-3 py-1.5 rounded-lg bg-[#111116] hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
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
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 mb-1">Your Posted Vacancies</h3>
        <p className="text-xs text-neutral-500 mb-4">Live job listings visible to Butuan &amp; Caraga seekers.</p>

        <div className="space-y-2.5">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="p-3.5 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-900">{job.title}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{job.company} &bull; {job.location} &bull; {job.salary}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
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
