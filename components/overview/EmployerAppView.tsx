"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Briefcase,
  FileText,
  Upload,
  Plus,
  MoreHorizontal,
  Search,
  XCircle,
  Clock
} from "lucide-react";

export default function EmployerAppView() {
  const {
    jobs,
    applications,
    pendingApprovals,
    approvePending,
    rejectPending,
    updateJobStatus,
    updateApplicationStage,
    setIsPostJobOpen,
    showToast
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [tableSearch, setTableSearch] = useState("");

  // Filter jobs for the table
  const filteredTableJobs = jobs.filter((job) => {
    if (selectedStatusFilter !== "All" && job.status !== selectedStatusFilter) return false;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Title,Company,Location,Status,PostedDate,Salary"]
        .concat(
          filteredTableJobs.map(
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
    showToast("Exported Caraga job listings to CSV!", "success");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Header: Caraga Employer Hub */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Caraga Regional Employer Hub
          </h2>
          <p className="text-base text-neutral-600 mt-1">
            Manage vacancies, review local applicants, and hire talent across Region XIII.
          </p>
        </div>

        <button
          onClick={() => setIsPostJobOpen(true)}
          className="px-7 py-3 rounded-full bg-[#111116] text-white hover:bg-black text-sm font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Vacancy</span>
        </button>
      </div>

      {/* 4 Soft Metric Cards - Spacious & readable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-7 rounded-[32px] bg-white border border-black/[0.04] shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">15.4K</div>
          <div className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">Caraga Candidate Pool</div>
        </div>

        <div className="p-7 rounded-[32px] bg-white border border-black/[0.04] shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{jobs.length}</div>
          <div className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">Active Postings</div>
        </div>

        <div className="p-7 rounded-[32px] bg-white border border-black/[0.04] shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{applications.length + 18}</div>
          <div className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">Total Applications</div>
        </div>

        <div className="p-7 rounded-[32px] bg-white border border-black/[0.04] shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 font-bold text-base">
            ₱
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900">₱25M+</div>
          <div className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">Payroll Matched</div>
        </div>
      </div>

      {/* Middle Row: Candidate Recruitment Pipeline & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Candidate Pipeline (8 cols) */}
        <div className="lg:col-span-8 p-8 sm:p-10 rounded-[36px] bg-white border border-black/[0.04] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">Incoming Candidate Pipeline</h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                Review submitted Caraga profiles and move candidates across hiring stages.
              </p>
            </div>
            <span className="text-sm font-bold text-neutral-800 bg-neutral-100 px-4 py-1.5 rounded-full self-start sm:self-auto">
              {applications.length} Candidates
            </span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-[24px] bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-100/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-neutral-900">Juan Dela Cruz</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      96% Match
                    </span>
                  </div>
                  <div className="text-sm text-neutral-700 font-medium mt-1">
                    Applied for: <strong>{app.jobTitle}</strong> ({app.company})
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    CSU IT Graduate • Libertad, Butuan City • Expected: <strong className="text-neutral-800">{app.salary}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <select
                    value={app.status}
                    onChange={(e) => updateApplicationStage(app.id, e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs sm:text-sm font-bold text-neutral-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => showToast("Viewing Juan's verified ATS resume preview", "info")}
                    className="px-4 py-2 rounded-xl bg-[#111116] text-white hover:bg-black text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    View CV
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pending Approvals (4 cols) */}
        <div className="lg:col-span-4 p-8 rounded-[36px] bg-white border border-black/[0.04] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Employer Verifications</h3>
              <button className="text-neutral-400 hover:text-black">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100 flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <div className="text-sm font-bold text-neutral-900 truncate">{item.company}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{item.location}</div>
                  </div>

                  {item.status === "Pending" ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approvePending(item.id)}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-200 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectPending(item.id)}
                        className="p-1.5 rounded-full hover:bg-rose-100 text-neutral-400 hover:text-rose-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-400 text-center font-medium">
            Compliant with DOLE Region XIII standards
          </div>
        </div>

      </div>

      {/* Bottom: Manage Jobs Table */}
      <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-black/[0.04] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900">Manage Caraga Postings</h3>
            <p className="text-sm text-neutral-500 mt-0.5">Live vacancies displayed across Region XIII.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-sm">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search postings..."
                className="w-32 sm:w-44 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-sm font-semibold text-neutral-700 cursor-pointer focus:outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#111116] text-white hover:bg-black text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Export CSV</span>
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-semibold pb-4">
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Company</th>
                <th className="py-4 px-4">Location</th>
                <th className="py-4 px-4">Salary (₱)</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Posted</th>
                <th className="py-4 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTableJobs.map((job) => (
                <tr key={job.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-neutral-900">
                    {job.title}
                  </td>
                  <td className="py-4 px-4 font-semibold text-neutral-700">
                    {job.company}
                  </td>
                  <td className="py-4 px-4 text-neutral-500">
                    {job.location}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-neutral-900">
                    {job.salary}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        job.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : job.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-neutral-400 font-mono text-xs">
                    {job.postedDate}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => {
                        const nextStatus =
                          job.status === "Active"
                            ? "Pending"
                            : job.status === "Pending"
                            ? "Expired"
                            : "Active";
                        updateJobStatus(job.id, nextStatus);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
