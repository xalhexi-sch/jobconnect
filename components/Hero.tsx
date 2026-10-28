"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight, Briefcase, ShieldCheck, BadgeCheck, Wallet, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion, useReducedMotion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";
import CompanyLogo from "@/components/CompanyLogo";

const POPULAR = ["Barista", "Nurse", "Cashier", "Web Developer", "Delivery Rider"];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { jobs, searchQuery, setSearchQuery, selectedCity, setSelectedCity, setIsPostJobOpen } = useApp();
  const reduce = useReducedMotion();

  const active = jobs.filter((j) => j.status === "Active");
  const employers = new Set(active.map((j) => j.company)).size;
  const live = active.slice(0, 3);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  });

  const goToJobs = () => document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16">
      <div className="aurora" aria-hidden />
      <div className="dot-grid" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Copy + search */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <motion.div
              {...rise(0)}
              className="inline-flex items-center gap-2 self-start pl-2.5 pr-3.5 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-line shadow-card"
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {active.length} jobs open in Butuan
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              className="text-[1.95rem] leading-[1.08] sm:text-5xl lg:text-[3.1rem] tracking-[-0.028em] font-bold text-balance"
            >
              Find a job in <span className="text-gradient">Butuan</span>.
              <span className="block text-fg/65">Apply directly. No fees.</span>
            </motion.h1>

            <motion.p {...rise(0.16)} className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl text-pretty">
              Apply directly to cafes, clinics, shops and offices near you. See the pay before you apply. It is always free.
            </motion.p>

            <motion.div {...rise(0.24)} className="w-full max-w-2xl">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  goToJobs();
                }}
                className="search-shell bg-surface p-2 rounded-2xl border border-line shadow-xl flex flex-col sm:flex-row items-stretch gap-2"
              >
                <label className="flex items-center gap-3 px-3.5 h-14 sm:flex-1 rounded-xl bg-surface-2 sm:bg-transparent cursor-text">
                  <Search className="w-5 h-5 text-brand shrink-0" aria-hidden />
                  <span className="sr-only">Job title, skill, or business</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title or business"
                    className="w-full text-base font-medium bg-transparent placeholder:text-fg-muted/70 focus:outline-none"
                  />
                </label>

                <div className="hidden sm:block w-px my-2.5 bg-line" aria-hidden />

                <label className="flex items-center gap-2.5 px-3.5 h-14 sm:w-52 rounded-xl bg-surface-2 sm:bg-transparent">
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
                  className="btn-brand-primary h-14 px-7 rounded-xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Search jobs
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-fg-muted mr-1">Popular:</span>
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      goToJobs();
                    }}
                    className="chip cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div {...rise(0.32)} className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/overview" className="btn-clerk-outline h-12 px-5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand" aria-hidden />
                Open job portal
              </Link>
              <button
                type="button"
                onClick={() => setIsPostJobOpen(true)}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand cursor-pointer min-h-11"
              >
                Hiring? Post a job for free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            </motion.div>
          </div>

          {/* Visual: photo + live openings */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="relative ml-auto w-[88%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-line bg-surface-2"
            >
              <Image
                src="/hero-applicant.png"
                alt="Job seeker in Butuan checking openings on a phone"
                fill
                priority
                sizes="(min-width: 1024px) 440px, 90vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="absolute -bottom-6 left-0 w-[82%] sm:w-[78%] rounded-2xl bg-surface/95 backdrop-blur-xl border border-line shadow-2xl p-3.5"
            >
              <div className="flex items-center justify-between px-1 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                  New jobs
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                  Checked
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {live.map((job) => (
                  <li key={job.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(job.title);
                        goToJobs();
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-2 transition-colors text-left cursor-pointer"
                    >
                      <CompanyLogo name={job.company} src={job.companyLogo} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-tight truncate">{job.title}</span>
                        <span className="block text-xs text-fg-muted truncate">{job.company}</span>
                      </span>
                      <span className="text-xs font-bold text-brand tabular-nums shrink-0">{job.salary}</span>
                    </button>
                  </li>
                ))}
                {live.length === 0 && <li className="p-3 text-sm text-fg-muted">New jobs will show up here.</li>}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Trust strip */}
        <motion.dl
          {...rise(0.5)}
          className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-line bg-surface/80 backdrop-blur divide-x divide-y md:divide-y-0 divide-line shadow-card"
        >
          {[
            { icon: Briefcase, label: "Open jobs", value: <NumberTicker value={active.length} /> },
            { icon: Building2, label: "Local employers", value: <NumberTicker value={employers} /> },
            { icon: Wallet, label: "Fees to apply", value: <>₱0</> },
            { icon: BadgeCheck, label: "Jobs checked first", value: <>100%</> },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3.5 p-4 sm:p-5">
              <span className="hidden sm:flex w-10 h-10 rounded-xl bg-brand/12 text-brand items-center justify-center shrink-0" aria-hidden>
                <Icon className="w-5 h-5" />
              </span>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-xs sm:text-sm font-medium text-fg-muted">{label}</dt>
                <dd className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums leading-none">{value}</dd>
              </div>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
