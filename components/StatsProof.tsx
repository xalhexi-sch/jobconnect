"use client";

import React from "react";
import { Users, ShieldCheck, MapPin, Award } from "lucide-react";
import { motion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function StatsProof() {
  const regionalPartners = [
    { name: "CARAGA STATE UNIVERSITY", font: "tracking-wider font-extrabold" },
    { name: "FSUU BUTUAN", font: "tracking-widest font-black" },
    { name: "SM CITY BUTUAN", font: "font-serif font-bold text-lg" },
    { name: "ROBINSONS PLACE BUTUAN", font: "tracking-tight font-black" },
    { name: "BUTUAN DOCTORS HOSPITAL", font: "tracking-[0.15em] font-semibold text-base" },
    { name: "DTI REGION XIII", font: "tracking-tight font-bold text-lg" },
    { name: "TECHVENTURE CARAGA", font: "tracking-wider font-black" },
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-y border-black/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Top Header & Testimonial quote card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16"
        >
          {/* Quote Card */}
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-2xl bg-[#F8F9FB] border border-black/[0.06] shadow-xs relative">
            <div className="w-11 h-11 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white mb-6 shadow-sm shadow-[#FF7A00]/20">
              <span className="text-xl font-serif font-black leading-none">“</span>
            </div>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-neutral-800 font-normal leading-relaxed italic">
              &quot;Finding high-paying professional design and tech roles in Butuan used to be difficult. With JobConnect Caraga, I received direct employer responses and landed a ₱65,000/mo remote role in under two weeks.&quot;
            </p>

            <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-black/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80"
                alt="Michael John B."
                className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 shadow-sm"
              />
              <div>
                <div className="text-base font-bold text-[#111116]">Michael John B.</div>
                <div className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <span>Lead UI/UX Designer</span> • <MapPin className="w-3.5 h-3.5 text-neutral-400" /> Libertad, Butuan City
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold self-start border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Region XIII Verified Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111116] leading-tight">
              Empowering<br />Caraga Talent
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Connecting jobseekers from Butuan, Cabadbaran, and Surigao directly with verified local businesses, universities, healthcare centers, and remote employers without middlemen.
            </p>
          </div>

        </motion.div>

        {/* 3 Metric Cards with MagicUI NumberTicker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          
          {/* Card 1: ₱25M+ Local Payroll (Obsidian Card) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-7 lg:p-8 rounded-2xl bg-[#111116] text-white flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[210px] cursor-default"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 mb-6 border border-white/10 font-bold text-lg">
              ₱
            </div>

            <div>
              <div className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-1 flex items-baseline">
                <span>₱</span>
                <NumberTicker value={25} className="text-white" />
                <span>M+</span>
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 font-medium">
                Annual payroll facilitated in Caraga
              </div>
            </div>
          </motion.div>

          {/* Card 2: 15K+ Local Jobseekers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-7 lg:p-8 rounded-2xl bg-[#F8F9FB] border border-black/[0.06] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow min-h-[210px] cursor-default"
          >
            <div className="w-11 h-11 rounded-xl bg-black/[0.04] flex items-center justify-center text-neutral-800 mb-6 border border-black/[0.04]">
              <Users className="w-5 h-5 text-neutral-800" />
            </div>

            <div>
              <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111116] mb-1 flex items-baseline">
                <NumberTicker value={15} className="text-[#111116]" />
                <span>K+</span>
              </div>
              <div className="text-xs sm:text-sm text-neutral-600 font-medium">
                Active jobseekers across Region XIII
              </div>
            </div>
          </motion.div>

          {/* Card 3: 450+ Local Companies */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-7 lg:p-8 rounded-2xl bg-[#F8F9FB] border border-black/[0.06] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow min-h-[210px] cursor-default"
          >
            <div className="w-11 h-11 rounded-xl bg-black/[0.04] flex items-center justify-center text-neutral-800 mb-6 border border-black/[0.04]">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111116] mb-1 flex items-baseline">
                <NumberTicker value={450} className="text-[#111116]" />
                <span>+</span>
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Accredited Butuan & Caraga enterprises
              </div>
            </div>
          </motion.div>

        </div>

        {/* Marquee Ticker for Regional Partners */}
        <div className="pt-8 border-t border-black/[0.04]">
          <div className="text-center text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-6">
            Trusted by Top Educational & Commercial Institutions in Caraga
          </div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex items-center gap-12 whitespace-nowrap will-change-transform"
            >
              {[...regionalPartners, ...regionalPartners, ...regionalPartners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className={`text-neutral-400 hover:text-neutral-900 transition-colors text-sm select-none shrink-0 ${partner.font}`}
                >
                  {partner.name}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
