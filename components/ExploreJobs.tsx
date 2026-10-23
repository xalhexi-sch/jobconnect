"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
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

  // Filter jobs based on active search, category, location, and type
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
    <section id="opportunities" className="py-24 bg-[#F8F9FA] border-y border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111116] leading-tight">
              Featured Roles<br />in Region XIII
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-lg">
              Explore verified career opportunities in Butuan and Caraga with direct 1-click Easy Apply.
            </p>
          </div>

          {/* Quick type filter tabs with natural squircle layout */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-black/[0.06] shadow-xs self-start md:self-auto overflow-x-auto no-scrollbar relative">
            {["All", "On-site", "Hybrid", "Remote (Caraga)"].map((type) => {
              const isSelected = selectedJobType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedJobType(type)}
                  className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap z-10 ${
                    isSelected ? "text-white" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="jobTypeIndicator"
                      className="absolute inset-0 rounded-lg bg-[#111116] -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Jobs Grid - Large, breathable cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.slice(0, 5).map((job, idx) => {
              const isBookmarked = bookmarkedJobIds.includes(job.id);
              const isFeaturedBlack = idx === 1; // Signature dark card

              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isFeaturedBlack
                      ? "bg-[#111116] text-white shadow-xl"
                      : "bg-white text-neutral-900 border border-black/[0.06] shadow-xs hover:shadow-lg"
                  }`}
                >
                  {/* Card Top: Company info & salary */}
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2 overflow-hidden ${
                          isFeaturedBlack ? "bg-white/10" : "bg-neutral-50 border border-neutral-100"
                        }`}>
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="max-w-full max-h-full object-cover rounded-xl"
                          />
                        </div>
                        <div>
                          <span className={`text-base font-bold block ${isFeaturedBlack ? "text-white" : "text-neutral-900"}`}>
                            {job.company}
                          </span>
                          <span className={`text-xs block flex items-center gap-1 mt-0.5 ${isFeaturedBlack ? "text-neutral-400" : "text-neutral-500"}`}>
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-lg font-black block tracking-tight ${isFeaturedBlack ? "text-white" : "text-neutral-900"}`}>
                          {job.salary}
                        </span>
                        <span className={`text-xs font-semibold ${isFeaturedBlack ? "text-emerald-400" : "text-emerald-600"}`}>
                          Verified ₱
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-2xl font-bold tracking-tight mb-3 ${isFeaturedBlack ? "text-white" : "text-neutral-900"}`}>
                      {job.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-6 line-clamp-2 ${isFeaturedBlack ? "text-neutral-300" : "text-neutral-600"}`}>
                      {job.description}
                    </p>
                  </div>

                  {/* Card Bottom: Metadata & Apply */}
                  <div className={`pt-6 border-t flex items-center justify-between ${
                    isFeaturedBlack ? "border-white/10" : "border-neutral-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        isFeaturedBlack ? "bg-white/10 text-neutral-200" : "bg-neutral-100 text-neutral-700"
                      }`}>
                        {job.type}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${
                        isFeaturedBlack ? "text-neutral-400" : "text-neutral-400"
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {job.postedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          isFeaturedBlack
                            ? "hover:bg-white/10 text-neutral-300"
                            : "hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                        }`}
                        title="Save Job"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setApplyModalJob(job)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                          isFeaturedBlack
                            ? "bg-white text-black hover:bg-neutral-100"
                            : "bg-[#111116] text-white hover:bg-neutral-800"
                        }`}
                      >
                        Apply
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* 6th Card: Explore All 1.4K+ Jobs in Overview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl p-7 sm:p-8 bg-white border border-black/[0.06] shadow-xs hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#111116] tracking-tight mb-2">
                1.4K+
              </div>
              <div className="text-lg font-bold text-neutral-900 mb-2">
                More Jobs in Caraga
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Unlock hundreds of verified openings across Agusan del Norte, Surigao, and Dinagat Islands.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/overview"
                className="w-full mt-6 py-3 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Open Jobs Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
