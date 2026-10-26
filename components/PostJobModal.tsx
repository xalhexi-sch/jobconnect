"use client";

import React, { useState } from "react";
import { Loader2, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Dialog from "@/components/ui/Dialog";
import { BUTUAN_BARANGAYS } from "@/lib/constants";
import { CITIES, JOB_CATEGORIES, JOB_TYPES } from "@/lib/validation";
import { formatPhp } from "@/lib/format";
import type { Job, JobCategory, JobType } from "@/lib/types";

export default function PostJobModal() {
  const { isPostJobOpen, setIsPostJobOpen, userProfile, isSignedIn, openAuthModal } = useApp();
  return (
    <Dialog
      open={isPostJobOpen}
      onClose={() => setIsPostJobOpen(false)}
      title="Post a job opening"
      description="Publish your vacancy to jobseekers across Butuan City & Caraga. Goes live immediately."
      size="lg"
    >
      {!isSignedIn ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-base">Sign In Required</h3>
          <p className="text-sm text-fg-muted max-w-sm mx-auto">
            Please sign in to post and manage your job vacancies.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIsPostJobOpen(false);
                openAuthModal("sign-in");
              }}
              className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Sign In to Post Job
            </button>
          </div>
        </div>
      ) : (
        <PostJobForm defaultCompany={userProfile.companyName || userProfile.fullName || ""} />
      )}
    </Dialog>
  );
}

function PostJobForm({ defaultCompany }: { defaultCompany: string }) {
  const { postJob } = useApp();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [category, setCategory] = useState<JobCategory>("Hospitality");
  const [type, setType] = useState<JobType>("On-site");
  const [city, setCity] = useState<Job["city"]>("Butuan City");
  const [barangay, setBarangay] = useState<string>(BUTUAN_BARANGAYS[0]);
  const [place, setPlace] = useState("");
  const [minPay, setMinPay] = useState("");
  const [maxPay, setMaxPay] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [busy, setBusy] = useState(false);

  const min = Number(minPay) || 0;
  const max = Number(maxPay) || 0;
  const payInvalid = max > 0 && max < min;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || payInvalid) return;
    setBusy(true);
    const inButuan = city === "Butuan City";
    await postJob({
      title,
      company,
      location: inButuan ? `${barangay}, Butuan City` : place ? `${place}, ${city}` : city,
      barangay: inButuan ? barangay : undefined,
      city,
      salary: max > min ? `${formatPhp(min)} – ${formatPhp(max)} / month` : `${formatPhp(min)} / month`,
      salaryPhp: min,
      type,
      category,
      description,
      requirements: requirements.split("\n").map((r) => r.trim()).filter(Boolean).slice(0, 20),
    });
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pj-title" className="block text-sm font-medium mb-1.5">Job title</label>
          <input id="pj-title" className="field" required minLength={3} maxLength={120} placeholder="e.g. Service Crew or Barista" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pj-company" className="block text-sm font-medium mb-1.5">Hiring Company or Business</label>
          <input id="pj-company" className="field" required minLength={2} maxLength={120} placeholder="e.g. Chowking Libertad" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pj-cat" className="block text-sm font-medium mb-1.5">Category</label>
          <select id="pj-cat" className="field cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value as JobCategory)}>
            {JOB_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pj-type" className="block text-sm font-medium mb-1.5">Work setup</label>
          <select id="pj-type" className="field cursor-pointer" value={type} onChange={(e) => setType(e.target.value as JobType)}>
            {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pj-city" className="block text-sm font-medium mb-1.5">City</label>
          <select id="pj-city" className="field cursor-pointer" value={city} onChange={(e) => setCity(e.target.value as Job["city"])}>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {city === "Butuan City" ? (
          <div>
            <label htmlFor="pj-bg" className="block text-sm font-medium mb-1.5">Barangay</label>
            <select id="pj-bg" className="field cursor-pointer" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
              {BUTUAN_BARANGAYS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor="pj-place" className="block text-sm font-medium mb-1.5">Location details</label>
            <input id="pj-place" className="field" placeholder="e.g. Downtown" maxLength={80} value={place} onChange={(e) => setPlace(e.target.value)} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Monthly salary (PHP)</label>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="field" type="number" min={0} max={10000000} placeholder="Minimum (e.g. 15000)" value={minPay} onChange={(e) => setMinPay(e.target.value)} />
          <input className="field" type="number" min={0} max={10000000} placeholder="Maximum (optional)" value={maxPay} onChange={(e) => setMaxPay(e.target.value)} />
        </div>
        {payInvalid && <p className="text-xs text-red-600 mt-1">Maximum salary must be greater than minimum.</p>}
      </div>

      <div>
        <label htmlFor="pj-desc" className="block text-sm font-medium mb-1.5">Job description</label>
        <textarea id="pj-desc" className="field min-h-28" required minLength={20} maxLength={5000} placeholder="Describe the role and day-to-day responsibilities..." value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label htmlFor="pj-req" className="block text-sm font-medium mb-1.5">Requirements (one per line, up to 20)</label>
        <textarea id="pj-req" className="field min-h-24" placeholder="High school or college level&#10;Food handling experience&#10;Customer-friendly attitude" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" disabled={busy || payInvalid} className="btn-brand-primary h-11 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Publish job live</span>
        </button>
      </div>
    </form>
  );
}
