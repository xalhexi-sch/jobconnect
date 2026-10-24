"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";

export default function Hero() {
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, setIsPostJobOpen } = useApp();

  return (
    <section className="relative pt-4 pb-12 sm:pt-8 sm:pb-20 md:pt-12 md:pb-24 overflow-hidden">
      {/* Background ambient radial gradients for soft glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.55, 0.35]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[850px] h-[500px] sm:h-[600px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full"
      />
      <div className="absolute top-10 right-10 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-blue-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Refined typography */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5 text-left">
            
            {/* Regional Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="text-xs font-semibold tracking-tight text-blue-950">
                Active Openings &bull; Butuan City (BXU)
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="text-2xl sm:text-4xl lg:text-5xl leading-[1.18] sm:leading-[1.12] tracking-tight font-extrabold text-[#111116]">
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
              className="text-xs sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl"
            >
              The dedicated employment portal for Butuan City. Connect directly with local retail shops, cafes, clinics, logistics teams, and tech hubs with transparent compensation.
            </motion.p>

            {/* Direct Action Buttons with Royal Blue gradient */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1"
            >
              <Link
                href="/overview"
                className="btn-brand-primary flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl transition-all shadow-md group cursor-pointer text-xs sm:text-sm font-semibold tracking-tight"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Browse Butuan Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setIsPostJobOpen(true)}
                className="btn-clerk-outline flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl transition-all shadow-xs group cursor-pointer text-xs sm:text-sm font-semibold tracking-tight"
              >
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Post Vacancy (Hire)</span>
              </button>
            </motion.div>

            {/* Search Bar - Seamless on both mobile & desktop */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 max-w-2xl"
            >
              <div className="bg-white p-2 rounded-xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2.5 px-3 py-2 sm:py-1 w-full sm:flex-1 rounded-xl bg-neutral-50 sm:bg-transparent">
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

                <div className="flex items-center gap-2 px-3 py-2 sm:py-1 w-full sm:w-44 rounded-xl bg-neutral-50 sm:bg-transparent">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter city in Caraga"
                    className="w-full text-xs font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Butuan &amp; Caraga</option>
                    <option value="Butuan City">Butuan City Only</option>
                    <option value="Cabadbaran City">Cabadbaran</option>
                    <option value="Surigao City">Surigao</option>
                  </select>
                </div>

                <Link
                  href="/overview"
                  className="btn-supabase-dark w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-lg text-xs font-semibold tracking-tight transition-all text-center flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Quick Real Proof */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-medium text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Verified Local Businesses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Transparent Pay (₱)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>100% Free to Use</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Photo with Safe Mobile Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center pt-2 sm:pt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100 group"
            >
              <Image src="/hero-applicant.png" alt="Butuan Job Seeker using JobConnect" fill priority sizes="380px" className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />

              {/* Photo Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Hiring in Butuan City</div>
                    <div className="text-xs font-bold text-neutral-900 mt-0.5">Montilla &bull; Libertad &bull; Bancasi &bull; Ampayon</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                </div>
              </div>
            </motion.div>

            {/* Value Badge: Verified Openings (Safe-bounded on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-2 right-2 sm:-top-3 sm:-right-4 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md flex items-center gap-2 z-20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold text-neutral-900 leading-tight">Verified Openings</div>
                <div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium">Direct Hiring</div>
              </div>
            </motion.div>

            {/* Value Badge: Fast Direct Applications (Safe-bounded on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute bottom-16 sm:bottom-0 left-2 sm:-left-4 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-900 shadow-md flex items-center gap-2 z-20"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] sm:text-xs font-bold leading-tight">Direct Applications</div>
                <div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium">No Placement Fees</div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
