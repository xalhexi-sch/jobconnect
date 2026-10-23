"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";

export default function Hero() {
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, setIsPostJobOpen } = useApp();

  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Background ambient radial gradients for soft glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.55, 0.35]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-gradient-to-tr from-neutral-200/50 via-neutral-100/30 to-transparent blur-3xl -z-10 pointer-events-none rounded-full"
      />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-emerald-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Refined typography */}
          <div className="lg:col-span-7 flex flex-col space-y-5 text-left">
            
            {/* Regional Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-xs font-semibold tracking-tight text-emerald-950">
                Active Openings &bull; Butuan City (BXU)
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="text-3xl sm:text-4xl lg:text-5xl leading-[1.12] tracking-tight font-extrabold text-[#111116]">
              <span>Find jobs in Butuan City.</span>{" "}
              <span className="text-neutral-500 font-bold block sm:inline">
                Hire local talent directly.
              </span>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl"
            >
              The dedicated employment portal for Butuan City. Connect directly with local retail shops, cafes, clinics, logistics teams, and tech hubs with transparent compensation.
            </motion.p>

            {/* Direct Action Buttons with gentle contrast */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/overview"
                  className="btn-supabase-emerald flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-md group cursor-pointer text-xs sm:text-sm font-semibold tracking-tight"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Browse Butuan Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  onClick={() => setIsPostJobOpen(true)}
                  className="btn-clerk-outline flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-xs group cursor-pointer text-xs sm:text-sm font-semibold tracking-tight"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Post Vacancy (Hire)</span>
                </button>
              </motion.div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 max-w-2xl"
            >
              <div className="bg-white p-2 rounded-xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2.5 px-3 w-full sm:flex-1">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, skill, or business..."
                    className="w-full text-xs sm:text-sm font-medium text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="hidden sm:block w-px h-5 bg-neutral-200" />

                <div className="flex items-center gap-2 px-2.5 w-full sm:w-44">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter city in Caraga"
                    className="w-full text-xs font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All">All Butuan &amp; Caraga</option>
                    <option value="Butuan City">Butuan City Only</option>
                    <option value="Cabadbaran City">Cabadbaran</option>
                    <option value="Surigao City">Surigao</option>
                  </select>
                </div>

                <Link
                  href="/overview"
                  className="btn-supabase-dark w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all text-center flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Quick Real Proof */}
            <div className="pt-1 flex flex-wrap items-center gap-5 text-xs font-medium text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Local Businesses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparent Pay (₱)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Free to Use</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Photo with Real-World Value Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100 group"
            >
              <img
                src="/hero-applicant.png"
                alt="Butuan Job Seeker using JobConnect"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Photo Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Hiring in Butuan City</div>
                    <div className="text-xs font-bold text-neutral-900 mt-0.5">Montilla &bull; Libertad &bull; Bancasi &bull; Ampayon</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </motion.div>

            {/* Value Badge: Verified Openings */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -top-3 -right-2 sm:-right-4 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md flex items-center gap-2.5 z-20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <div className="text-left">
                <div className="text-xs font-bold text-neutral-900 leading-tight">Verified Openings</div>
                <div className="text-[10px] text-neutral-500 font-medium">Direct Employer Hiring</div>
              </div>
            </motion.div>

            {/* Value Badge: Fast Direct Applications */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-3 -left-2 sm:-left-4 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-900 shadow-md flex items-center gap-2.5 z-20"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Direct Applications</div>
                <div className="text-[10px] text-neutral-500 font-medium">No Placement Fees</div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
