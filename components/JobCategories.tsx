"use client";

import React from "react";
import { Code, PenTool, Stethoscope, TrendingUp, ShieldCheck, FileSpreadsheet, Coffee, Truck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";

export default function JobCategories() {
  const { selectedCategory, setSelectedCategory } = useApp();

  const categories = [
    { id: "Developer", name: "Developer & IT", icon: Code },
    { id: "Hospitality", name: "Hospitality & Cafes", icon: Coffee },
    { id: "Trades & Logistics", name: "Trades & Logistics", icon: Truck },
    { id: "Healthcare", name: "Healthcare & Clinic", icon: Stethoscope },
    { id: "Marketing", name: "Sales & Retail", icon: TrendingUp },
    { id: "Design", name: "Design & Media", icon: PenTool },
    { id: "Admin & Support", name: "Admin & Operations", icon: FileSpreadsheet },
    { id: "Security", name: "Security & Tech", icon: ShieldCheck },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            Browse by sector
          </h2>
          <p className="text-base text-fg-muted mt-2">
            Explore active openings across key industries in Butuan City &amp; Caraga.
          </p>
        </div>
      </motion.div>

      {/* Grid of Category cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.04,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(isActive ? "All" : cat.id);
                document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-pressed={isActive}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
                isActive
                  ? "bg-[#111116] text-white border-black shadow-xs"
                  : "bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-400 hover:shadow-xs"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-white/20 text-white" : "bg-brand/10 text-brand group-hover:bg-brand/15"
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold truncate">{cat.name}</div>
                <div className={`text-sm ${isActive ? "text-white/80" : "text-fg-muted"}`}>
                  View Openings
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
