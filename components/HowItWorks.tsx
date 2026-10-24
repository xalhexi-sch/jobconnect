"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCheck, Search, Send, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: "01",
      title: "Set Up Your Profile",
      desc: "Add your contact info, location in Butuan or Caraga, and your resume in under 2 minutes.",
      icon: UserCheck
    },
    {
      num: "02",
      title: "Find Local Openings",
      desc: "Search by barangay or category across neighborhood shops, healthcare clinics, and tech teams.",
      icon: Search
    },
    {
      num: "03",
      title: "Direct Application",
      desc: "Apply directly to local hiring managers with your verified credentials and optional note without repetitive paperwork.",
      icon: Send
    },
    {
      num: "04",
      title: "Track Interview Updates",
      desc: "Get clear notifications when employers review your application and schedule interviews.",
      icon: BellRing
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Title with Golden Ratio spacing */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111116] mb-4">
          How it works
        </h2>
        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed">
          Find the right career, apply instantly from any browser, and start your journey with complete transparency.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        
        {/* Left: Lifestyle photo featuring regional applicant */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[440px]">
            {/* Background image container with subtle levitation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl overflow-hidden aspect-[4/5] bg-neutral-100 shadow-xl border-4 border-white"
            >
              <Image src="/hero-applicant.png" alt="Jobseeker finding opportunities in Butuan" fill sizes="440px" className="object-cover object-center contrast-105" />
            </motion.div>

            {/* Overlapping search badge with floating motion */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-4 sm:-right-8 w-[240px] sm:w-[260px] rounded-2xl p-3 bg-neutral-900 shadow-xl ring-1 ring-white/20"
            >
              <div className="bg-white rounded-xl p-3.5 text-left">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-600 mb-3 font-medium">
                  <Search className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Full-Stack Developer</span>
                </div>
                <div className="text-xs font-bold text-neutral-900 mb-2">Recent Matches in Butuan</div>
                <div className="space-y-1.5 text-xs text-neutral-500 font-medium">
                  <div className="flex items-center gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>CSU Innovation Hub</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>TechVenture Caraga</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>FSUU Systems</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: 4 Steps with spacious cards & smooth layout expansion */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.num}
                layout
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveStep(idx)}
                className={`p-7 sm:p-8 rounded-[32px] transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#111116] text-white shadow-xl scale-[1.01]"
                    : "bg-[#F8F9FB] text-neutral-800 hover:bg-neutral-100/90 border border-black/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <span className={`text-sm sm:text-base font-mono font-bold ${isSelected ? "text-emerald-400" : "text-neutral-400"}`}>
                      {step.num}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-white/10 text-white" : "bg-neutral-200/80 text-neutral-700"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 pt-4 border-t border-white/10 text-base sm:text-lg text-neutral-300 leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
