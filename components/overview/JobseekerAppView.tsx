"use client";

import React, { useMemo, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import JobDetailModal from "@/components/JobDetailModal";
import JobCard from "@/components/JobCard";
import CompanyLogo from "@/components/CompanyLogo";
import { JobListSkeleton } from "@/components/ui/Skeleton";
import { getMyResumeLinkAction } from "@/app/actions/resume";
import { Job } from "@/lib/types";
import { useT } from "@/lib/i18n";
import {
  Search,
  Bookmark,
  Send,
  Edit3,
  Briefcase,
  FileText,
  UploadCloud,
  Loader2,
  ExternalLink,
  Mail,
  Phone,
  GraduationCap,
  Clock,
} from "lucide-react";

type SubTab = "find" | "applications" | "saved" | "resume";

const CATEGORIES = ["All", "Developer", "Design", "Healthcare", "Hospitality", "Trades & Logistics", "Marketing", "Admin & Support", "Security"];
const TYPES = ["All", "On-site", "Hybrid", "Remote (Caraga)", "Remote"];

const STATUS_STYLE: Record<string, string> = {
  Submitted: "bg-surface-2 text-fg-muted",
  "Under Review": "bg-blue-50 text-blue-700",
  "Interview Scheduled": "bg-purple-50 text-purple-700",
  "Offer Extended": "bg-emerald-500/15 text-emerald-600",
  Rejected: "bg-neutral-100 text-neutral-500",
  Withdrawn: "bg-neutral-100 text-neutral-500",
};

function EmptyState({ icon, title, hint, action }: { icon: React.ReactNode; title: string; hint: string; action?: React.ReactNode }) {
  return (
    <div className="py-14 px-6 text-center rounded-2xl border border-dashed border-line bg-surface">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-2 flex items-center justify-center text-fg-muted">{icon}</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-fg-muted mt-1 max-w-sm mx-auto leading-relaxed">{hint}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default function JobseekerAppView({
  activeSubTab: externalSubTab,
  onSubTabChange,
  hideTopTabs = false,
}: {
  activeSubTab?: SubTab;
  onSubTabChange?: (tab: SubTab) => void;
  hideTopTabs?: boolean;
} = {}) {
  const {
    jobs,
    jobsLoading,
    applications,
    bookmarkedJobIds,
    toggleBookmark,
    setApplyModalJob,
    userProfile,
    setIsResumeModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedJobType,
    setSelectedJobType,
    isSignedIn,
    openAuthModal,
    uploadResume,
    showToast,
    updateApplicationStage,
  } = useApp();

  const { t } = useT();
  const [internalSubTab, setInternalSubTab] = useState<SubTab>("find");
  const [inspectingJob, setInspectingJob] = useState<Job | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeSubTab = externalSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: SubTab) => {
    onSubTabChange?.(tab);
    setInternalSubTab(tab);
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      if (job.status !== "Active") return false;
      if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
      if (selectedJobType !== "All" && job.type !== selectedJobType) return false;
      if (!q) return true;
      return [job.title, job.company, job.location, job.category].some((v) => v.toLowerCase().includes(q));
    });
  }, [jobs, searchQuery, selectedCategory, selectedJobType]);

  const savedJobs = jobs.filter((job) => bookmarkedJobIds.includes(job.id));
  const hasFilters = Boolean(searchQuery) || selectedCategory !== "All" || selectedJobType !== "All";

  const requireAuth = (fn: () => void) => (isSignedIn ? fn() : openAuthModal("sign-in"));

  const openResume = async () => {
    const res = await getMyResumeLinkAction();
    if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    else showToast(res.error, "warning");
  };

  const pickResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    await uploadResume(file);
    setUploading(false);
  };

  const tabs: { id: SubTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "find", label: t("findJobs"), icon: <Search className="w-4 h-4" />, count: filteredJobs.length },
    { id: "applications", label: t("applications"), icon: <Send className="w-4 h-4" />, count: applications.length },
    { id: "saved", label: t("saved"), icon: <Bookmark className="w-4 h-4" />, count: savedJobs.length },
    { id: "resume", label: t("profile"), icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-28 sm:pb-24">
      {!hideTopTabs && (
        <div role="tablist" aria-label="Job seeker sections" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-surface border border-line">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeSubTab === t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeSubTab === t.id ? "bg-blue-600 text-white" : "text-fg-muted hover:text-fg hover:bg-surface-2"
              }`}
            >
              {t.icon}
              {t.label}
              {t.count !== undefined && <span className="text-xs opacity-80">{t.count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* ------------------------------- FIND ------------------------------ */}
      {activeSubTab === "find" && (
        <section className="space-y-4 animate-in fade-in duration-200" aria-label="Find jobs">
          <div className="p-3 sm:p-4 rounded-2xl bg-surface border border-line shadow-card space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-fg-muted pointer-events-none" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label="Search jobs"
                className="field pl-11"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1" role="group" aria-label="Category">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  aria-pressed={selectedCategory === c}
                  className={`h-9 px-3.5 rounded-full text-sm font-medium whitespace-nowrap border cursor-pointer transition-colors ${
                    selectedCategory === c ? "bg-blue-600 text-white border-blue-600" : "bg-surface-2 text-fg-muted border-line hover:text-fg"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)} aria-label="Work setup" className="field !w-auto !py-2 cursor-pointer">
                {TYPES.map((ty) => (
                  <option key={ty} value={ty}>{ty === "All" ? t("anySetup") : ty}</option>
                ))}
              </select>
              <p className="text-sm text-fg-muted" aria-live="polite">
                {filteredJobs.length} {filteredJobs.length === 1 ? t("job") : t("jobs")}
              </p>
            </div>
          </div>

          {jobsLoading && filteredJobs.length === 0 ? (
            <JobListSkeleton />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title={hasFilters ? t("noMatchTitle") : t("noJobsTitle")}
              hint={hasFilters ? t("noMatchHint") : t("noJobsHint")}
              action={
                hasFilters && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedJobType("All");
                    }}
                    className="h-10 px-5 rounded-xl bg-surface-2 border border-line text-sm font-semibold cursor-pointer"
                  >
                    {t("clearFilters")}
                  </button>
                )
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={bookmarkedJobIds.includes(job.id)}
                  applied={applications.some((a) => a.jobId === job.id)}
                  onOpen={setInspectingJob}
                  onToggleSave={toggleBookmark}
                  onApply={(j) => requireAuth(() => setApplyModalJob(j))}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* --------------------------- APPLICATIONS -------------------------- */}
      {activeSubTab === "applications" && (
        <section className="space-y-3 animate-in fade-in duration-200" aria-label="My applications">
          <h2 className="text-xl font-bold tracking-tight">{t("myApplications")}</h2>
          {applications.length === 0 ? (
            <EmptyState
              icon={<Send className="w-6 h-6" />}
              title={t("noAppsTitle")}
              hint={t("noAppsHint")}
              action={
                <button onClick={() => setActiveSubTab("find")} className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold cursor-pointer">
                  {t("browseJobs")}
                </button>
              }
            />
          ) : (
            applications.map((app) => (
              <article key={app.id} className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <CompanyLogo name={app.company} src={app.companyLogo} size={46} />
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{app.jobTitle}</h3>
                    <p className="text-sm text-fg-muted truncate">{app.company} · Applied {app.appliedDate}</p>
                    {app.interviewDate && (
                      <p className="text-sm text-purple-700 mt-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Interview: {app.interviewDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${STATUS_STYLE[app.status] ?? STATUS_STYLE.Submitted}`}>{app.status}</span>
                  {(app.status === "Submitted" || app.status === "Under Review" || app.status === "Interview Scheduled") && (
                    <button
                      onClick={() => {
                        if (confirm("Withdraw this application?")) updateApplicationStage(app.id, "Withdrawn");
                      }}
                      className="text-sm text-fg-muted hover:text-red-600 underline underline-offset-2 cursor-pointer"
                    >
                      {t("withdraw")}
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {/* ------------------------------ SAVED ------------------------------ */}
      {activeSubTab === "saved" && (
        <section className="space-y-3 animate-in fade-in duration-200" aria-label="Saved jobs">
          <h2 className="text-xl font-bold tracking-tight">{t("savedJobs")}</h2>
          {savedJobs.length === 0 ? (
            <EmptyState icon={<Bookmark className="w-6 h-6" />} title={t("noSavedTitle")} hint={t("noSavedHint")} />
          ) : (
            savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved
                applied={applications.some((a) => a.jobId === job.id)}
                onOpen={setInspectingJob}
                onToggleSave={toggleBookmark}
                onApply={(j) => requireAuth(() => setApplyModalJob(j))}
              />
            ))
          )}
        </section>
      )}

      {/* ----------------------------- PROFILE ----------------------------- */}
      {activeSubTab === "resume" && (
        <section className="space-y-4 animate-in fade-in duration-200" aria-label="My profile">
          {!isSignedIn ? (
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="Sign in to build your profile"
              hint="Your profile and resume are saved to your account and reused on every application."
              action={<button onClick={() => openAuthModal("sign-in")} className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold cursor-pointer">Sign in</button>}
            />
          ) : (
            <>
              <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-tight truncate">{userProfile.fullName || "Your profile"}</h2>
                  <p className="text-fg-muted mt-0.5">{userProfile.headline || "Add a headline so employers know what you do"}</p>
                  <p className="text-sm text-fg-muted mt-1">{userProfile.location}</p>
                </div>
                <button onClick={() => setIsResumeModalOpen(true)} className="h-11 px-5 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:border-neutral-300">
                  <Edit3 className="w-4 h-4" /> Edit profile
                </button>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-card">
                <h3 className="font-semibold mb-3">Resume</h3>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={pickResume} aria-label="Upload resume" />
                {userProfile.resumeFileName ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-2">
                    <span className="flex items-center gap-2.5 min-w-0 font-medium"><FileText className="w-5 h-5 text-blue-600 shrink-0" /><span className="truncate">{userProfile.resumeFileName}</span></span>
                    <span className="flex items-center gap-4 text-sm font-semibold">
                      <button onClick={openResume} className="text-brand hover:underline flex items-center gap-1.5 cursor-pointer"><ExternalLink className="w-4 h-4" /> View</button>
                      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="text-brand hover:underline cursor-pointer">{uploading ? "Uploading…" : "Replace"}</button>
                    </span>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full p-6 rounded-xl border-2 border-dashed border-neutral-300 hover:border-brand hover:bg-blue-50 text-fg-muted flex flex-col items-center gap-2 cursor-pointer transition-colors">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6 text-brand" />}
                    <span className="font-medium">{uploading ? "Uploading…" : "Upload your resume"}</span>
                    <span className="text-sm">PDF or Word, up to 5 MB. Only employers you apply to can open it.</span>
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-surface border border-line flex items-start gap-3"><Mail className="w-5 h-5 text-fg-muted mt-0.5" /><div className="min-w-0"><p className="text-xs text-fg-muted">Email</p><p className="font-medium truncate">{userProfile.email || "—"}</p></div></div>
                <div className="p-4 rounded-2xl bg-surface border border-line flex items-start gap-3"><Phone className="w-5 h-5 text-fg-muted mt-0.5" /><div><p className="text-xs text-fg-muted">Mobile</p><p className="font-medium">{userProfile.phone || "—"}</p></div></div>
                <div className="p-4 rounded-2xl bg-surface border border-line flex items-start gap-3 sm:col-span-2"><GraduationCap className="w-5 h-5 text-fg-muted mt-0.5" /><div><p className="text-xs text-fg-muted">Education</p><p className="font-medium">{userProfile.education || "—"}</p></div></div>
              </div>

              {userProfile.skills.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-card">
                  <h3 className="font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((s) => (
                      <span key={s} className="text-sm font-medium px-3 py-1 rounded-lg bg-blue-50 text-blue-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {userProfile.bio && (
                <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-card">
                  <h3 className="font-semibold mb-2">About me</h3>
                  <p className="text-[15px] leading-7 text-fg/85 whitespace-pre-line">{userProfile.bio}</p>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <JobDetailModal
        job={inspectingJob}
        onClose={() => setInspectingJob(null)}
        onApply={(job) => {
          setInspectingJob(null);
          requireAuth(() => setApplyModalJob(job));
        }}
        isSaved={inspectingJob ? bookmarkedJobIds.includes(inspectingJob.id) : false}
        hasApplied={inspectingJob ? applications.some((a) => a.jobId === inspectingJob.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
