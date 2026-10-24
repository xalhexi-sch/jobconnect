"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Building2, Check, Inbox, Loader2, Undo2, X } from "lucide-react";
import { adminListPendingJobsAction, adminReviewJobAction } from "@/app/actions/jobs";
import { adminListEmployersAction, adminSetSuspendedAction, adminVerifyCompanyAction } from "@/app/actions/admin";
import { timeAgo } from "@/lib/format";
import type { Job, UserProfile } from "@/lib/types";

type Tab = "jobs" | "employers";

export default function AdminConsole() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employers, setEmployers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [j, e] = await Promise.all([adminListPendingJobsAction(), adminListEmployersAction()]);
    if (!j.ok) setError(j.error);
    else if (!e.ok) setError(e.error);
    else {
      setError("");
      setJobs(j.jobs);
      setEmployers(e.employers);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const act = async (id: string, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusyId(id);
    const res = await fn();
    if (!res.ok) setError(res.error ?? "Action failed");
    else await load();
    setBusyId(null);
  };

  if (loading) return <div className="py-20 flex justify-center text-fg-muted"><Loader2 className="w-6 h-6 animate-spin" aria-label="Loading" /></div>;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "jobs", label: "Job approvals", count: jobs.length },
    { id: "employers", label: "Employers", count: employers.length },
  ];

  return (
    <div className="space-y-5">
      <div role="tablist" className="flex gap-1.5 p-1.5 rounded-2xl bg-surface border border-line w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer ${tab === t.id ? "bg-blue-600 text-white" : "text-fg-muted hover:text-fg"}`}
          >
            {t.label} <span className="text-xs opacity-80">{t.count}</span>
          </button>
        ))}
      </div>

      {error && <p role="alert" className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</p>}

      {tab === "jobs" &&
        (jobs.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-line text-fg-muted">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-60" /> Nothing waiting for review.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <article key={job.id} className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-card space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-fg-muted">{job.company} · {job.location} · {job.salary} · {timeAgo(job.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === job.id}
                      onClick={() => act(job.id, () => adminReviewJobAction(job.id, false))}
                      className="h-10 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button
                      disabled={busyId === job.id}
                      onClick={() => act(job.id, () => adminReviewJobAction(job.id, true))}
                      className="btn-brand-primary h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
                <p className="text-sm text-fg/80 leading-relaxed line-clamp-3">{job.description}</p>
              </article>
            ))}
          </div>
        ))}

      {tab === "employers" &&
        (employers.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-line text-fg-muted">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-60" /> No employers have signed up yet.
          </div>
        ) : (
          <div className="space-y-3">
            {employers.map((emp) => (
              <article key={emp.id} className="p-4 rounded-2xl bg-surface border border-line shadow-card flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold flex items-center gap-1.5">
                    {emp.companyName || emp.fullName}
                    {emp.companyVerified && <BadgeCheck className="w-5 h-5 text-blue-600" aria-label="Verified" />}
                  </h3>
                  <p className="text-sm text-fg-muted truncate">{emp.fullName} · {emp.email} · {emp.companyIndustry}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busyId === emp.id}
                    onClick={() => act(emp.id, () => adminVerifyCompanyAction(emp.id, !emp.companyVerified))}
                    className={`h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer ${emp.companyVerified ? "border border-line bg-surface-2" : "btn-brand-primary"}`}
                  >
                    {emp.companyVerified ? <><Undo2 className="w-4 h-4" /> Unverify</> : <><BadgeCheck className="w-4 h-4" /> Verify</>}
                  </button>
                  <button
                    disabled={busyId === emp.id}
                    onClick={() => {
                      if (confirm(`Suspend ${emp.companyName || emp.fullName}? They will lose access immediately.`)) act(emp.id, () => adminSetSuspendedAction(emp.id, true));
                    }}
                    className="h-10 px-4 rounded-xl border border-line bg-surface-2 text-sm font-semibold text-red-600 cursor-pointer"
                  >
                    Suspend
                  </button>
                </div>
              </article>
            ))}
          </div>
        ))}
    </div>
  );
}
