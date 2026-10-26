"use client";

import { Bookmark, CheckCircle2, MapPin, Send, Wifi, Clock3 } from "lucide-react";
import type { Job } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import CompanyLogo from "@/components/CompanyLogo";
import { useT } from "@/lib/i18n";

/**
 * One job listing card. The whole card opens the detail view via a stretched title button
 * (single tab stop for keyboard/screen-reader users); secondary actions sit above it.
 */
export default function JobCard({
  job,
  saved,
  applied,
  onOpen,
  onToggleSave,
  onApply,
}: {
  job: Job;
  saved: boolean;
  applied: boolean;
  onOpen: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}) {
  const { t, intlLocale } = useT();
  const pending = job.status === "Pending";

  return (
    <article
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        // Subtle 3D tilt (max ~2deg), mouse only and never when the user prefers reduced motion
        if (e.pointerType === "mouse" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const rx = (0.5 - y / r.height) * 4;
          const ry = (x / r.width - 0.5) * 4;
          el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        }
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
      className="spotlight group relative p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex gap-3.5 sm:gap-4">
        <CompanyLogo name={job.company} src={job.companyLogo} size={52} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold leading-snug">
                <button
                  type="button"
                  onClick={() => onOpen(job)}
                  className="text-left cursor-pointer group-hover:text-brand transition-colors after:absolute after:inset-0 after:rounded-2xl"
                >
                  {job.title}
                </button>
              </h3>
              <p className="text-sm text-fg-muted mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-fg/90 truncate">{job.company}</span>
                {job.featured && (
                  <span className="text-xs font-bold uppercase tracking-wide bg-brand/12 text-brand px-1.5 py-0.5 rounded-md">
                    {t("featured")}
                  </span>
                )}
                {pending && (
                  <span className="text-xs font-bold uppercase tracking-wide bg-amber-500/15 text-amber-600 px-1.5 py-0.5 rounded-md">
                    {t("awaitingApproval")}
                  </span>
                )}
              </p>
            </div>
            <p className="hidden sm:block shrink-0 text-right text-base font-bold text-brand leading-snug tabular-nums">{job.salary}</p>
          </div>

          <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-muted">
            <li className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-4 h-4 shrink-0" aria-hidden />
              <span className="truncate">{job.location}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 shrink-0" aria-hidden />
              <span>{job.type}</span>
            </li>
            {job.createdAt && (
              <li className="flex items-center gap-1.5">
                <Clock3 className="w-4 h-4 shrink-0" aria-hidden />
                <span>{timeAgo(job.createdAt, intlLocale)}</span>
              </li>
            )}
          </ul>

          <p className="sm:hidden mt-2.5 text-base font-bold text-brand tabular-nums">{job.salary}</p>

          <div className="mt-3.5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-fg-muted bg-surface-2 px-2.5 py-1 rounded-lg">{job.category}</span>

            <div className="relative z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSave(job.id)}
                aria-pressed={saved}
                aria-label={saved ? `${t("saved")}: ${job.title}` : `${t("save")}: ${job.title}`}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  saved
                    ? "text-amber-600 bg-amber-50 border-amber-200"
                    : "text-fg-muted hover:text-fg bg-surface-2 border-line hover:border-neutral-300"
                }`}
              >
                <Bookmark key={String(saved)} className={`w-[18px] h-[18px] ${saved ? "fill-current bookmark-pop" : ""}`} />
              </button>

              {applied ? (
                <span className="h-11 px-4 rounded-xl text-sm font-semibold bg-emerald-500/12 text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden />
                  {t("applied")}
                </span>
              ) : pending ? null : (
                <button
                  type="button"
                  onClick={() => onApply(job)}
                  className="btn-brand-primary h-11 px-5 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden />
                  {t("apply")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
