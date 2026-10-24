"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserCheck, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl bg-[#111116] text-white p-8 sm:p-12 md:p-14 text-center overflow-hidden shadow-xl border border-white/10"
      >
        {/* Soft radial glowing gradients with ambient breathing */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-60 bg-gradient-to-b from-white/10 to-transparent blur-3xl pointer-events-none rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-10 w-[450px] h-44 bg-blue-500/15 blur-3xl pointer-events-none rounded-full"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-tight text-white/90">
              JobConnect Butuan &bull; Web Application
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            Start Your Career in<br />
            <AnimatedGradientText colorFrom="#FFFFFF" colorTo="#60A5FA" speed={1.2}>
              Butuan &amp; Caraga Today
            </AnimatedGradientText>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-lg mx-auto">
            100% web-native app experience. Submit one-click applications, track HR screening stages, and connect with regional employers directly from your browser.
          </p>

          {/* Action Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/overview"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl btn-supabase-emerald text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
              >
                <UserCheck className="w-4 h-4 text-blue-100" />
                <span>Launch Jobseeker Hub</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/overview"
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors text-xs sm:text-sm font-semibold cursor-pointer text-white"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Employer Recruitment Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
