"use client";

import React from "react";
import { CheckCircle2, MapPin, Building2, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function StatsProof() {
  const { jobs } = useApp();

  const localDistricts = [
    "Montilla Boulevard",
    "Libertad",
    "Ampayon",
    "Bancasi",
    "JC Aquino Avenue",
    "Doongan",
    "Villa Kananga",
    "Holy Redeemer"
  ];

  return (
    <section className="py-12 bg-white border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Core Value Pillars - Honest, Real, Practical */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Local Business Focus</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Designed for Butuan shops, cafes, clinics, logistics hubs, and regional employers to find local staff without agency fees.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Direct Contact</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Job seekers submit applications directly with their resume and contact info. Employers review candidates and update interview status in real-time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Zero Placement Fees</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              100% free for applicants. No agency commissions, salary deductions, or hidden charges.
            </p>
          </div>
        </div>

        {/* Local Areas Covered Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-neutral-100 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700 flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Serving Butuan City Areas:</span>
          </span>
          <div className="flex flex-wrap gap-2 text-neutral-600">
            {localDistricts.map((d) => (
              <span key={d} className="px-2.5 py-1 rounded-lg bg-neutral-100 font-medium text-neutral-700">
                {d}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
