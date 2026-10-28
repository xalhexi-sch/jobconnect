"use client";

import React from "react";
import { UserCheck, Search, Send, BellRing } from "lucide-react";
import { motion } from "motion/react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const STEPS = [
  {
    num: "01",
    title: "Make your profile",
    desc: "Add your contact details, where you live, and your resume. It takes about 2 minutes.",
    icon: UserCheck,
  },
  {
    num: "02",
    title: "Find a job near you",
    desc: "Search by area or type of job. See which shops, clinics and offices are hiring.",
    icon: Search,
  },
  {
    num: "03",
    title: "Apply directly",
    desc: "Send your application to the employer. You can add a short message. No agency in between.",
    icon: Send,
  },
  {
    num: "04",
    title: "Get updates",
    desc: "See when the employer reads your application, messages you, or sets an interview.",
    icon: BellRing,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-14 max-w-2xl"
      >
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand mb-3">How it works</p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-fg text-balance">
          Get hired in 4 simple steps.
        </h2>
        <p className="text-base sm:text-lg text-fg-muted mt-4 leading-relaxed text-pretty">
          Find a job, apply from your phone or computer, and get updates from the employer.
        </p>
      </motion.div>

      <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* connector line behind the cards (desktop only) */}
        <div
          className="hidden lg:block absolute left-[12%] right-[12%] top-12 border-t-2 border-dashed border-line"
          aria-hidden
        />

        {STEPS.map(({ num, title, desc, icon: Icon }, idx) => (
          <motion.li
            key={num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <SpotlightCard className="h-full p-6 rounded-2xl bg-surface border border-line shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <span className="relative z-10 size-12 rounded-2xl bg-brand text-white flex items-center justify-center shadow-md ring-4 ring-surface">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <span className="font-mono text-sm font-bold text-fg-muted/70" aria-hidden>
                  {num}
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">{title}</h3>
              <p className="text-base text-fg-muted leading-relaxed text-pretty">{desc}</p>
            </SpotlightCard>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
