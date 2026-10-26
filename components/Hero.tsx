"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight, Briefcase, CheckCircle2, ShieldCheck, Building2, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";

const POPULAR = ["Barista", "Nurse", "Cashier", "Web Developer", "Delivery Rider"];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { jobs, searchQuery, setSearchQuery, selectedCity, setSelectedCity, setIsPostJobOpen } = useApp();

  const active = jobs.filter((j) => j.status === "Active");
  const employers = new Set(active.map((j) => j.company)).size;

  return (
    <section className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 md:pt-14 md:pb-28">
      <div className="aurora" aria-hidden />
      <div className="dot-grid" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 self-start pl-2.5 pr-3.5 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-line shadow-card"
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold tracking-tight">Now hiring in Butuan City (BXU)</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              className="text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.035em] font-extrabold text-balance"
            >
              Find work in <span className="text-gradient">Butuan</span>.
              <span className="block text-fg-muted font-bold">Hire local, direct.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl text-pretty"
            >
              Apply straight to cafes, clinics, shops, logistics teams and tech hubs around you. Clear pay in pesos, real replies, zero placement fees.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="max-w-2xl w-full"
            >
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="search-shell bg-surface p-2 rounded-2xl border border-line shadow-lg flex flex-col sm:flex-row items-stretch gap-2"
              >
                <label className="flex items-center gap-2.5 px-3 h-12 sm:flex-1 rounded-xl bg-surface-2 sm:bg-transparent cursor-text">
                  <Search className="w-5 h-5 text-fg-muted shrink-0" aria-hidden />
                  <span className="sr-only">Job title, skill, or business</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, skill, or business"
                    className="w-full text-base font-medium bg-transparent placeholder:text-fg-muted/70 focus:outline-none"
                  />
                </label>

                <div className="hidden sm:block w-px my-2 bg-line" aria-hidden />

                <label className="flex items-center gap-2 px-3 h-12 sm:w-52 rounded-xl bg-surface-2 sm:bg-transparent">
                  <MapPin className="w-5 h-5 text-fg-muted shrink-0" aria-hidden />
                  <span className="sr-only">City in Caraga</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-base sm:text-sm font-semibold bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Butuan &amp; Caraga</option>
                    <option value="Butuan City">Butuan City only</option>
                    <option value="Cabadbaran City">Cabadbaran</option>
                    <option value="Surigao City">Surigao</option>
                  </select>
                </label>

                <button
                  type="submit"
                  className="btn-brand-primary h-12 px-6 rounded-xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Search
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
              </form>

              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-sm text-fg-muted mr-1">Popular:</span>
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="chip cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1"
            >
              <Link
                href="/overview"
                className="btn-clerk-outline h-11 px-5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-brand" aria-hidden />
                Open job portal
              </Link>
              <button
                type="button"
                onClick={() => setIsPostJobOpen(true)}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand cursor-pointer min-h-11"
              >
                Hiring? Post a vacancy
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>

              <dl className="flex items-center gap-6 sm:ml-auto">
                <div>
                  <dt className="text-xs font-medium text-fg-muted">Open roles</dt>
                  <dd className="text-2xl font-extrabold tracking-tight tabular-nums">
                    <NumberTicker value={active.length} />
                  </dd>
                </div>
                <div className="w-px h-9 bg-line" aria-hidden />
                <div>
                  <dt className="text-xs font-medium text-fg-muted">Local employers</dt>
                  <dd className="text-2xl font-extrabold tracking-tight tabular-nums">
                    <NumberTicker value={employers} />
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-2xl ring-1 ring-line bg-surface-2 group"
            >
              <Image
                src="/hero-applicant.png"
                alt="Butuan job seeker using JobConnect"
                fill
                priority
                sizes="400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
              <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-line shadow-lg">
                <div className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Hiring around</div>
                <div className="text-sm font-bold mt-0.5">Montilla · Libertad · Bancasi · Ampayon</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="absolute -top-2 right-0 sm:-right-4 animate-float"
            >
              <div className="px-3.5 py-2.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-xl flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center" aria-hidden>
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-bold leading-tight">Verified openings</div>
                  <div className="text-xs text-fg-muted">Reviewed before going live</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
              className="absolute top-1/2 -left-2 sm:-left-8 hidden sm:block"
            >
              <div className="px-3.5 py-2.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-xl flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-brand/12 text-brand flex items-center justify-center" aria-hidden>
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-bold leading-tight">Apply directly</div>
                  <div className="text-xs text-fg-muted">No agency, no fees</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
              className="absolute bottom-24 -right-1 sm:-right-6 hidden sm:block"
            >
              <div className="px-3 py-2 rounded-full bg-surface/95 backdrop-blur-md border border-line shadow-lg flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-amber-500" aria-hidden />
                Free for job seekers
                <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
