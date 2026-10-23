"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Zap, CreditCard, Heart, Send, Cpu } from "lucide-react";
import { STARTUPS } from "@/lib/mock-data";
import { motion } from "motion/react";

export default function StartupsSection() {
  const iconMap: Record<string, any> = {
    CreditCard,
    Heart,
    Send,
    Cpu,
    Zap
  };

  return (
    <section className="py-24 bg-[#F8F9FA] border-y border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111116] leading-tight">
              Featured Regional<br />Ventures
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 mt-2 max-w-md">
              Discover innovative startups and enterprises building the future in Caraga Region XIII.
            </p>
          </div>

          <Link
            href="/overview"
            className="text-sm font-bold text-neutral-900 hover:text-black flex items-center gap-1 self-start md:self-auto group"
          >
            <span>Explore all ventures</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STARTUPS.map((startup, idx) => {
            const Icon = iconMap[startup.iconName] || Zap;
            const isDarkCard = startup.name === "Balangay Commerce";

            return (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className={`rounded-[32px] p-7 flex flex-col justify-between transition-all duration-300 ${
                  isDarkCard
                    ? "bg-[#111116] text-white shadow-xl"
                    : "bg-white text-neutral-900 border border-black/[0.05] shadow-sm hover:shadow-md"
                }`}
              >
                <div>
                  {/* Top: Icon + Jobs count pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDarkCard ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-800"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isDarkCard ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-700"
                    }`}>
                      {startup.jobsCount} jobs
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold tracking-tight mb-2 ${isDarkCard ? "text-white" : "text-neutral-900"}`}>
                    {startup.name}
                  </h3>

                  <p className={`text-sm line-clamp-3 leading-relaxed mb-6 ${
                    isDarkCard ? "text-neutral-300" : "text-neutral-600"
                  }`}>
                    {startup.description}
                  </p>
                </div>

                {/* Bottom: Location & Type tags */}
                <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                  isDarkCard ? "border-white/10 text-neutral-400" : "border-neutral-100 text-neutral-500"
                }`}>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {startup.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {startup.location}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
