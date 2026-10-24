"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Briefcase, Clock, FileText, Loader2, Plus, ShieldCheck, Users, BadgeCheck, Download } from "lucide-react";
import type { Application } from "@/lib/types";
import { fetchEmployerApplicationsAction, updateApplicationStatusAction } from "@/app/actions/applications";
import { getApplicationResumeLinkAction } from "@/app/actions/resume";
import Dialog from "@/components/ui/Dialog";
import CompanyLogo from "@/components/CompanyLogo";
import { timeAgo } from "@/lib/format";

const STAGES = ["Submitted", "Under Review", "Interview Scheduled", "Offer Extended", "Rejected"] as const;

const STATUS_STYLE: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Expired: "bg-neutral-100 text-neutral-500",
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-card">
      <div className="flex items-center gap-2 text-sm text-fg-muted">{icon}{label}</div>
      <p className="text-3xl font-bold tracking-tight mt-1.5">{value}</p>
    </div>
  );
}

export default function EmployerAppView() {
  const { jobs, user, userProfile, updateJobStatus, setIsPostJobOpen, showToast } = useApp();

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [interviewFor, setInterviewFor] = useState<Application | null>(null);
  const [interviewAt, setInterviewAt] = useState("");

  const load = useCallback(async () => {
    const res = await fetchEmployerApplicationsAction();
    setApps(res.ok ? res.applications : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const myJobs = jobs.filter((j) => j.employerId === user.id);
  const visible = apps.filter((a) => filter === "All" || a.status === filter);
  const pendingCount = myJobs.filter((j) => j.status === "Pending").length;

  const setStage = async (app: Application, status: string, interviewDate?: string) => {
    const previous = apps;
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: status as Application["status"], interviewDate: interviewDate ?? a.interviewDate } : a)));
    const res = await updateApplicationStatusAction(app.id, status, interviewDate);
    if (!res.ok) {
      setApps(previous);
      showToast(res.error, "warning");
    } else {
      showToast(`Moved ${app.applicantName ?? "candidate"} to ${status}`, "success");
    }
  };

  const onStageChange = (app: Application, status: string) => {
    if (status === "Interview Scheduled") {
      setInterviewFor(app);
      setInterviewAt("");
    } else {
      setStage(app, status);
    }
  };

  const viewCv = async (app: Application) => {
    if (!app.resumeUrl) return showToast("This candidate didn’t attach a resume.", "info");
    const res = await getApplicationResumeLinkAction(app.id);
    if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    else showToast(res.error, "warning");
  };

  const exportCsv = () => {
    const esc = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""').replace(/^[=+\-@]/, "'$&")}"`;
    const rows = [["Candidate", "Email", "Job", "Status", "Applied"], ...apps.map((a) => [a.applicantName, a.applicantEmail, a.jobTitle, a.status, a.appliedDate])];
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-28 sm:pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 truncate">
            {userProfile.companyName || "Your company"}
            {userProfile.companyVerified && <BadgeCheck className="w-6 h-6 text-blue-600 shrink-0" aria-label="Verified employer" />}
          </h1>
          <p className="text-fg-muted">Manage your vacancies and candidates.</p>
        </div>
        <button onClick={() => setIsPostJobOpen(true)} className="btn-brand-primary h-11 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Post a job
        </button>
      </div>

      {!userProfile.companyVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Your business is awaiting verification.</strong> Jobs you post are reviewed by an admin before they appear publicly
            {pendingCount > 0 && <> — you have {pendingCount} waiting now</>}.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Briefcase className="w-4 h-4" />} label="Jobs" value={myJobs.length} />
        <Stat icon={<Users className="w-4 h-4" />} label="Applicants" value={apps.length} />
        <Stat icon={<Clock className="w-4 h-4" />} label="To review" value={apps.filter((a) => a.status === "Submitted").length} />
      </div>

      <section aria-label="Your jobs" className="space-y-3">
        <h2 className="text-lg font-bold">Your jobs</h2>
        {myJobs.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-line text-center text-fg-muted">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-60" />
            You haven’t posted anything yet.
          </div>
        ) : (
          myJobs.map((job) => (
            <article key={job.id} className="p-4 rounded-2xl bg-surface border border-line shadow-card flex flex-wrap items-center gap-3 justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{job.title}</h3>
                <p className="text-sm text-fg-muted">{job.appliedCount} applicants · {timeAgo(job.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${STATUS_STYLE[job.status]}`}>{job.status === "Expired" ? "Closed" : job.status}</span>
                {job.status !== "Pending" && (
                  <button
                    onClick={() => updateJobStatus(job.id, job.status === "Active" ? "Expired" : "Active")}
                    className="text-sm font-semibold text-brand hover:underline cursor-pointer"
                  >
                    {job.status === "Active" ? "Close" : "Reopen"}
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <section aria-label="Candidates" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Candidates</h2>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by stage" className="field !w-auto !py-2 cursor-pointer">
              <option value="All">All stages</option>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {apps.length > 0 && (
              <button onClick={exportCsv} className="h-10 px-3.5 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-2 cursor-pointer">
                <Download className="w-4 h-4" /> CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-10 flex justify-center text-fg-muted"><Loader2 className="w-6 h-6 animate-spin" aria-label="Loading candidates" /></div>
        ) : visible.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-line text-center text-fg-muted">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-60" />
            {apps.length === 0 ? "No applications yet. They’ll appear here as people apply." : "No candidates in this stage."}
          </div>
        ) : (
          visible.map((app) => (
            <article key={app.id} className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-card space-y-3">
              <div className="flex items-start gap-3.5">
                <CompanyLogo name={app.applicantName ?? "?"} size={44} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{app.applicantName}</h3>
                  <p className="text-sm text-fg-muted truncate">{app.applicantEmail}</p>
                  <p className="text-sm text-fg-muted mt-0.5">for <span className="font-medium text-fg/90">{app.jobTitle}</span> · {app.appliedDate}</p>
                  {app.interviewDate && <p className="text-sm text-purple-700 mt-1">Interview: {app.interviewDate}</p>}
                </div>
              </div>
              {app.coverLetter && <p className="text-sm text-fg/80 bg-surface-2 rounded-xl p-3 leading-relaxed line-clamp-3">“{app.coverLetter}”</p>}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={app.status}
                  onChange={(e) => onStageChange(app, e.target.value)}
                  disabled={app.status === "Withdrawn"}
                  aria-label={`Stage for ${app.applicantName}`}
                  className="field !w-auto !py-2 cursor-pointer"
                >
                  {app.status === "Withdrawn" && <option>Withdrawn</option>}
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => viewCv(app)} className="h-10 px-4 rounded-xl bg-neutral-900 text-white text-sm font-semibold flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" /> {app.resumeUrl ? "View resume" : "No resume"}
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <Dialog
        open={Boolean(interviewFor)}
        onClose={() => setInterviewFor(null)}
        title="Schedule interview"
        description={interviewFor ? `${interviewFor.applicantName} · ${interviewFor.jobTitle}` : undefined}
        size="sm"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!interviewFor || !interviewAt) return;
            const when = new Date(interviewAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
            setStage(interviewFor, "Interview Scheduled", when);
            setInterviewFor(null);
          }}
        >
          <div>
            <label htmlFor="iv-at" className="block text-sm font-medium mb-1.5">Date and time</label>
            <input id="iv-at" type="datetime-local" required className="field" value={interviewAt} onChange={(e) => setInterviewAt(e.target.value)} />
          </div>
          <button type="submit" className="btn-brand-primary w-full h-11 rounded-xl text-sm font-semibold cursor-pointer">Confirm interview</button>
        </form>
      </Dialog>
    </div>
  );
}
