"use client";

import React from "react";
import { CheckCircle2, MapPin, Building2, Users } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Marquee from "@/components/ui/Marquee";

const PILLARS = [
  {
    icon: Building2,
    tone: "bg-brand/12 text-brand",
    title: "Local business focus",
    body: "Built for Butuan shops, cafes, clinics, logistics hubs and regional employers who want local staff without agency fees.",
  },
  {
    icon: Users,
    tone: "bg-violet-500/12 text-violet-600",
    title: "Direct contact",
    body: "Send your resume and contact info straight to the employer. They review, message you, and update your interview status in real time.",
  },
  {
    icon: CheckCircle2,
    tone: "bg-emerald-500/12 text-emerald-600",
    title: "Zero placement fees",
    body: "100% free for applicants. No agency commissions, salary deductions or hidden charges, ever.",
  },
];

const DISTRICTS = [
  "Montilla Boulevard",
  "Libertad",
  "Ampayon",
  "Bancasi",
  "JC Aquino Avenue",
  "Doongan",
  "Villa Kananga",
  "Holy Redeemer",
];

export default function StatsProof() {
  return (
    <section className="py-14 sm:py-16 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {PILLARS.map(({ icon: Icon, tone, title, body }) => (
            <SpotlightCard
              key={title}
              className="p-6 rounded-2xl bg-surface-2/60 border border-line transition-colors"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tone}`} aria-hidden>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-1.5">{title}</h3>
              <p className="text-base text-fg-muted leading-relaxed text-pretty">{body}</p>
            </SpotlightCard>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pt-7 border-t border-line">
          <span className="font-semibold flex items-center gap-2 shrink-0 text-sm">
            <MapPin className="w-4 h-4 text-brand" aria-hidden />
            Serving Butuan City areas
          </span>
          <div className="min-w-0 flex-1">
            <Marquee label="Butuan City areas served">
              {DISTRICTS.map((d) => (
                <span key={d} className="chip whitespace-nowrap">
                  {d}
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
