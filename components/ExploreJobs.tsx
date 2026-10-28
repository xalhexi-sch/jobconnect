"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";
import JobDetailModal from "@/components/JobDetailModal";
import JobCard from "@/components/JobCard";
import { JobListSkeleton } from "@/components/ui/Skeleton";
import { Job } from "@/lib/types";
import { useT } from "@/lib/i18n";

const TABS = ["All", "On-site", "Hybrid", "Remote (Caraga)"];
const PREVIEW_COUNT = 6;

export default function ExploreJobs() {
  const {
    jobs,
    jobsLoading,
    applications,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedJobType,
    setSelectedJobType,
    bookmarkedJobIds,
    toggleBookmark,
    setApplyModalJob,
    isSignedIn,
    openAuthModal,
  } = useApp();

  const { t } = useT();
  const [inspectingJob, setInspectingJob] = useState<Job | null>(null);

  const q = searchQuery.trim().toLowerCase();
  const filtered = jobs.filter((job) => {
    if (job.status !== "Active") return false;
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    if (selectedCity !== "All" && job.city !== selectedCity) return false;
    if (selectedJobType !== "All" && job.type !== selectedJobType) return false;
    return !q || [job.title, job.company, job.location, job.category].some((v) => v.toLowerCase().includes(q));
  });
  const shown = filtered.slice(0, PREVIEW_COUNT);

  const apply = (job: Job) => (isSignedIn ? setApplyModalJob(job) : openAuthModal("sign-in"));

  return (
    <section id="opportunities" className="py-16 sm:py-20 bg-surface-2 border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{t("latestOpportunities")}</h2>
            <p className="text-fg-muted mt-2 max-w-lg">{t("latestHint")}</p>
          </div>

          <div role="group" aria-label="Work setup" className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-line self-start overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedJobType(tab)}
                aria-pressed={selectedJobType === tab}
                className={`h-9 px-3.5 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedJobType === tab ? "bg-blue-600 text-white" : "text-fg-muted hover:text-fg hover:bg-surface-2"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {jobsLoading && shown.length === 0 ? (
          <JobListSkeleton count={3} />
        ) : shown.length === 0 ? (
          <div className="py-14 px-6 text-center rounded-2xl border border-dashed border-neutral-300 bg-surface">
            <Briefcase className="w-8 h-8 mx-auto mb-3 text-fg-muted" />
            <h3 className="font-semibold">{jobs.length === 0 ? "No openings posted yet" : "No jobs match those filters"}</h3>
            <p className="text-sm text-fg-muted mt-1">{jobs.length === 0 ? "Be the first employer to post a vacancy." : "Try another category or work setup."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {shown.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={bookmarkedJobIds.includes(job.id)}
                applied={applications.some((a) => a.jobId === job.id)}
                onOpen={setInspectingJob}
                onToggleSave={toggleBookmark}
                onApply={apply}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/overview" className="btn-supabase-dark h-12 px-6 rounded-xl text-sm font-semibold flex items-center gap-2">
            {filtered.length > PREVIEW_COUNT ? `${t("seeAll")} ${filtered.length}` : t("openPortal")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <JobDetailModal
        job={inspectingJob}
        onClose={() => setInspectingJob(null)}
        onApply={(job) => {
          setInspectingJob(null);
          apply(job);
        }}
        isSaved={inspectingJob ? bookmarkedJobIds.includes(inspectingJob.id) : false}
        hasApplied={inspectingJob ? applications.some((a) => a.jobId === inspectingJob.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </section>
  );
}
