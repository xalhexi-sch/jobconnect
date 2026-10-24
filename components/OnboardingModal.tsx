"use client";

import React, { useState } from "react";
import { ArrowLeft, Building2, Loader2, UserCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import Dialog from "@/components/ui/Dialog";
import { BUTUAN_BARANGAYS, INDUSTRIES, SEEKER_FIELDS } from "@/lib/constants";

type Role = "jobseeker" | "employer";

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Welcome to JobConnect"
      description="Tell us how you’ll use it. This takes under a minute and can’t be changed later."
    >
      <OnboardingFlow onDone={onClose} />
    </Dialog>
  );
}

const ROLE_CARDS: { role: Role; icon: React.ReactNode; title: string; hint: string }[] = [
  { role: "jobseeker", icon: <UserCheck className="w-6 h-6" />, title: "I’m looking for work", hint: "Browse local jobs, save them and apply in a tap." },
  { role: "employer", icon: <Building2 className="w-6 h-6" />, title: "I’m hiring", hint: "Post vacancies and manage candidates for your business." },
];

function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const { user, userProfile, completeOnboarding, showToast } = useApp();
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState(user.fullName || userProfile.fullName || "");
  const [phone, setPhone] = useState(userProfile.phone || "");
  const [barangay, setBarangay] = useState<string>(BUTUAN_BARANGAYS[0]);
  const [field, setField] = useState<string>(SEEKER_FIELDS[0]);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || busy) return;
    setBusy(true);
    const ok = await completeOnboarding(
      role === "jobseeker"
        ? { role, fullName, phone, headline: `${field} specialist`, location: `${barangay}, Butuan City` }
        : { role, fullName, phone, companyName: companyName.trim(), companyIndustry: industry, location: `${barangay}, Butuan City`, headline: `Hiring at ${companyName.trim()}` }
    );
    setBusy(false);
    if (!ok) return;
    showToast(role === "jobseeker" ? "You’re all set. Happy job hunting!" : "Employer workspace created. Listings go live once your business is verified.", "success");
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    } catch {
      // decorative only
    }
    onDone();
  };

  if (!role) {
    return (
      <div className="grid gap-3 pt-1">
        {ROLE_CARDS.map((c) => (
          <button
            key={c.role}
            type="button"
            onClick={() => setRole(c.role)}
            className="text-left p-4 rounded-2xl border border-line bg-surface-2 hover:border-brand hover:bg-blue-50 transition-colors flex items-start gap-4 cursor-pointer"
          >
            <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">{c.icon}</span>
            <span>
              <span className="block font-semibold text-base">{c.title}</span>
              <span className="block text-sm text-fg-muted mt-0.5 leading-relaxed">{c.hint}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <button type="button" onClick={() => setRole(null)} className="text-sm font-medium text-fg-muted hover:text-fg flex items-center gap-1.5 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="ob-name" className="block text-sm font-medium mb-1.5">{role === "employer" ? "Your name" : "Full name"}</label>
          <input id="ob-name" className="field" required minLength={2} maxLength={120} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="ob-phone" className="block text-sm font-medium mb-1.5">Mobile number</label>
          <input id="ob-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="0917 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {role === "employer" && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="ob-co" className="block text-sm font-medium mb-1.5">Business name</label>
            <input id="ob-co" className="field" required minLength={2} maxLength={120} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ob-ind" className="block text-sm font-medium mb-1.5">Industry</label>
            <select id="ob-ind" className="field cursor-pointer" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="ob-brgy" className="block text-sm font-medium mb-1.5">Barangay</label>
          <select id="ob-brgy" className="field cursor-pointer" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
            {BUTUAN_BARANGAYS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        {role === "jobseeker" && (
          <div>
            <label htmlFor="ob-field" className="block text-sm font-medium mb-1.5">Field you’re interested in</label>
            <select id="ob-field" className="field cursor-pointer" value={field} onChange={(e) => setField(e.target.value)}>
              {SEEKER_FIELDS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        )}
      </div>

      <button type="submit" disabled={busy} className="btn-brand-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? "Setting up…" : "Finish setup"}
      </button>
    </form>
  );
}
