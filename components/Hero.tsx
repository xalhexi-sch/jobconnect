"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, UserCheck, Briefcase, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Highlighter } from "@/components/ui/highlighter";

export default function Hero() {
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, setRole } = useApp();

  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden">
      {/* Background ambient radial gradients for soft Apple glow */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.55, 0.35]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-gradient-to-tr from-neutral-200/50 via-neutral-100/30 to-transparent blur-3xl -z-10 pointer-events-none rounded-full"
      />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-emerald-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Refined typography, crisp hierarchy, natural geometry */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            
            {/* Regional Status Badge - 100% visible, high-contrast & razor-sharp */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 self-start px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-xs font-semibold tracking-tight text-emerald-950">
                Verified Hiring &bull; Butuan City &amp; Caraga Region
              </span>
            </motion.div>

            {/* Main Headline - Golden Ratio Hierarchy, Authoritative & Balanced */}
            <div className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-[-0.035em] font-extrabold text-[#111116]">
              <span>Get hired faster.</span>{" "}
              <span className="text-neutral-500 font-bold block sm:inline">
                Work with verified local teams.
              </span>
            </div>

            {/* Subtitle - Clean, balanced and natural (no awkward SVG scribble) */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl"
            >
              Browse verified career opportunities across Butuan, Cabadbaran, and Surigao. Connect directly with local founders and hiring managers with transparent ₱ compensation.
            </motion.p>

            {/* Direct Web Action Buttons - Natural Apple/Linear Geometry (Not forced stadium pills) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/overview"
                  onClick={() => setRole("jobseeker")}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 transition-all shadow-sm group cursor-pointer text-sm font-semibold tracking-tight"
                >
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>I&apos;m Looking for a Job</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/overview"
                  onClick={() => setRole("employer")}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50 transition-all shadow-xs group cursor-pointer text-sm font-semibold tracking-tight"
                >
                  <Briefcase className="w-4 h-4 text-neutral-600 shrink-0 group-hover:text-black transition-colors" />
                  <span>Hire Caraga Talent</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Spacious Search Bar - Natural 16px Squircle (Not extreme balloon) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 max-w-2xl"
            >
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-neutral-200/90 shadow-md shadow-black/[0.03] flex flex-col sm:flex-row items-center gap-2.5 transition-shadow hover:shadow-lg">
                <div className="flex items-center gap-3 px-3.5 w-full sm:flex-1">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, skill, or keyword..."
                    className="w-full text-sm font-medium text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
                  />
                </div>

                <div className="hidden sm:block w-px h-6 bg-neutral-200" />

                <div className="flex items-center gap-2 px-3 w-full sm:w-48">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Filter city in Caraga"
                    className="w-full text-xs sm:text-sm font-semibold text-neutral-700 bg-transparent focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All">All Caraga Region</option>
                    <option value="Butuan City">Butuan City</option>
                    <option value="Cabadbaran City">Cabadbaran City</option>
                    <option value="Surigao City">Surigao City</option>
                    <option value="Bayugan City">Bayugan City</option>
                    <option value="Bislig City">Bislig City</option>
                  </select>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    href="/overview"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold tracking-tight transition-all text-center flex items-center justify-center gap-2 shrink-0 shadow-xs"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Proof Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="pt-1 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-neutral-500"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real Companies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clear Pay in ₱</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Web-Native</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High-Quality Photo with Apple-style Squircle Framing */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Photo Canvas Container with Natural Squircle Geometry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0]
              }}
              transition={{
                opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-100 group"
            >
              <img
                src="/hero-applicant.png"
                alt="Caraga Professional using JobConnect"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Subtle inner shadow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Photo Bottom Caption */}
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-md text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">Hired in Butuan City</div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">Lead UI/UX Designer • ₱65,000/mo</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </motion.div>

            {/* Floating Card Top-Right: 15K+ Active Jobseekers */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, 5, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 },
                x: { duration: 0.6, delay: 0.4 },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute -top-5 -right-3 sm:-right-6 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
                ₱
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-extrabold text-neutral-900 leading-tight">15,000+</div>
                <div className="text-[11px] text-neutral-500 font-semibold">Active Seekers</div>
              </div>
            </motion.div>

            {/* Floating Card Bottom-Left: 450+ Verified Companies */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -5, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.5 },
                x: { duration: 0.6, delay: 0.5 },
                y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }
              }}
              className="absolute -bottom-5 -left-3 sm:-left-6 p-3.5 rounded-2xl bg-[#111116] text-white shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-base sm:text-lg font-extrabold leading-tight">450+</div>
                <div className="text-[11px] text-neutral-400 font-semibold">Verified Employers</div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
