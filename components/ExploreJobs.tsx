"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "motion/react";

export default function ExploreJobs() {
  const {
    jobs,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedJobType,
    setSelectedJobType,
    bookmarkedJobIds,
    toggleBookmark,
    setApplyModalJob
  } = useApp();

  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== "All" && job.category !== selectedCategory) return false;
    if (selectedCity !== "All" && job.city !== selectedCity) return false;
    if (selectedJobType !== "All" && job.type !== selectedJobType) return false;
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

  return (
    <section id="opportunities" className="py-20 bg-[#F8F9FA] border-y border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111116] leading-tight">
              Featured Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg">
              Verified local jobs in Butuan City &amp; Caraga with direct 1-click application.
            </p>
          </div>

          {/* Quick type filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-neutral-200/90 self-start sm:self-auto overflow-x-auto no-scrollbar shadow-xs">
            {["All", "On-site", "Hybrid", "Remote (Caraga)"].map((tab) => {
              const isSelected = selectedJobType === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedJobType(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  }`}
                >
                  {tab === "Remote (Caraga)" ? "Remote" : tab}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredJobs.slice(0, 6).map((job, idx) => {
              const isBookmarked = bookmarkedJobIds.includes(job.id);

              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="rounded-2xl p-5 bg-white border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Card Top: Company info & salary */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="max-w-full max-h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-neutral-900 block leading-tight">
                            {job.company}
                          </span>
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-blue-800 bg-blue-50/90 border border-blue-200/60 px-2 py-0.5 rounded-md block">
                          {job.salary}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-1.5 leading-snug">
                      {job.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Card Bottom: Metadata & Apply */}
                  <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                        {job.type}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                        {job.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isBookmarked
                            ? "text-amber-500 bg-amber-50 border-amber-200"
                            : "text-neutral-400 hover:text-black border-neutral-200"
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={() => setApplyModalJob(job)}
                        className="btn-brand-primary px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Easy Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View all in App link */}
        <div className="mt-8 text-center">
          <Link
            href="/overview"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-neutral-300 hover:border-black text-xs font-bold text-neutral-800 transition-all shadow-xs"
          >
            <span>Open JobConnect Portal to See All ({jobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
