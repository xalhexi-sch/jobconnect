"use client";

import React from "react";
import { Code, PenTool, Stethoscope, TrendingUp, ShieldCheck, FileSpreadsheet, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";

export default function JobCategories() {
  const { selectedCategory, setSelectedCategory } = useApp();

  const categories = [
    { id: "Developer", name: "Developer & IT", icon: Code, jobs: "180+" },
    { id: "Design", name: "Design & Media", icon: PenTool, jobs: "95+" },
    { id: "Healthcare", name: "Clinical & Health", icon: Stethoscope, jobs: "120+" },
    { id: "Marketing", name: "Marketing & Retail", icon: TrendingUp, jobs: "140+" },
    { id: "Security", name: "Systems & Security", icon: ShieldCheck, jobs: "65+" },
    { id: "Admin & Support", name: "Admin & Operations", icon: FileSpreadsheet, jobs: "210+" },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111116] leading-tight">
            Explore Careers<br />by Industry
          </h2>
        </div>
        <p className="text-sm sm:text-base text-neutral-500 max-w-md leading-relaxed">
          High-demand sectors actively recruiting across Butuan City, Agusan del Norte, and the greater Caraga region.
        </p>
      </motion.div>

      {/* Grid of Category cards - Spring motion & breathable squircle styling */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(isActive ? "All" : cat.id)}
              className={`p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[195px] ${
                isActive
                  ? "bg-[#111116] text-white shadow-xl scale-[1.02]"
                  : "bg-white text-neutral-800 border border-black/[0.06] hover:border-black/[0.15] hover:shadow-md"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  isActive ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-800"
                }`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <div>
                <div className="text-base sm:text-lg font-bold mb-1">{cat.name}</div>
                <div className={`text-xs sm:text-sm font-medium ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                  {cat.jobs} openings
                </div>
                {isActive && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span>Active filter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
