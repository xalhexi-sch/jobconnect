"use client";

import React, { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Dialog from "@/components/ui/Dialog";
import { BUTUAN_BARANGAYS } from "@/lib/constants";
import { CITIES, JOB_CATEGORIES, JOB_TYPES } from "@/lib/validation";
import { formatPhp } from "@/lib/format";
import type { Job, JobCategory, JobType } from "@/lib/types";

export default function PostJobModal() {
  const { isPostJobOpen, setIsPostJobOpen, userProfile } = useApp();
  return (
    <Dialog
      open={isPostJobOpen}
      onClose={() => setIsPostJobOpen(false)}
      title="Post a job"
      description="Reach job seekers across Butuan and Caraga. It takes about two minutes."
      size="lg"
    >
      <PostJobForm defaultCompany={userProfile.companyName ?? ""} verified={Boolean(userProfile.companyVerified)} />
    </Dialog>
  );
}

function PostJobForm({ defaultCompany, verified }: { defaultCompany: string; verified: boolean }) {
  const { postJob } = useApp();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [category, setCategory] = useState<JobCategory>("Developer");
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
      {!verified && (
        <p className="flex gap-2.5 p-3 rounded-xl bg-amber-50 text-sm leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Your business isn’t verified yet, so this listing will be reviewed by an admin before it goes live.</span>
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pj-title" className="block text-sm font-medium mb-1.5">Job title</label>
          <input id="pj-title" className="field" required minLength={3} maxLength={120} placeholder="e.g. Barista" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pj-company" className="block text-sm font-medium mb-1.5">Company</label>
          <input id="pj-company" className="field" required minLength={2} maxLength={120} value={company} onChange={(e) => setCompany(e.target.value)} />
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
        <div>
          {city === "Butuan City" ? (
            <>
              <label htmlFor="pj-brgy" className="block text-sm font-medium mb-1.5">Barangay</label>
              <select id="pj-brgy" className="field cursor-pointer" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
                {BUTUAN_BARANGAYS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </>
          ) : (
            <>
              <label htmlFor="pj-place" className="block text-sm font-medium mb-1.5">Area <span className="text-fg-muted font-normal">(optional)</span></label>
              <input id="pj-place" className="field" maxLength={100} value={place} onChange={(e) => setPlace(e.target.value)} />
            </>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-1.5">Monthly pay (₱)</legend>
        <div className="grid grid-cols-2 gap-3">
          <input className="field" type="number" inputMode="numeric" min={0} step={500} required aria-label="Minimum monthly pay" placeholder="Min e.g. 18000" value={minPay} onChange={(e) => setMinPay(e.target.value)} />
          <input className="field" type="number" inputMode="numeric" min={0} step={500} aria-label="Maximum monthly pay" aria-invalid={payInvalid} placeholder="Max (optional)" value={maxPay} onChange={(e) => setMaxPay(e.target.value)} />
        </div>
        {payInvalid && <p className="text-sm text-red-600 mt-1.5">Maximum must be higher than minimum.</p>}
      </fieldset>

      <div>
        <label htmlFor="pj-desc" className="block text-sm font-medium mb-1.5">Description</label>
        <textarea id="pj-desc" className="field resize-y" rows={4} required minLength={20} maxLength={5000} placeholder="What will they do day to day? Schedule, benefits, team…" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label htmlFor="pj-req" className="block text-sm font-medium mb-1.5">Requirements <span className="text-fg-muted font-normal">(one per line)</span></label>
        <textarea id="pj-req" className="field resize-y" rows={3} placeholder={"Experience with…\nWilling to work shifts"} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
      </div>

      <button type="submit" disabled={busy || payInvalid} className="btn-brand-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? "Posting…" : verified ? "Publish job" : "Submit for review"}
      </button>
    </form>
  );
}
