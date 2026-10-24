"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  UserCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  User,
  ShieldCheck
} from "lucide-react";
import JobgioLogo from "./JobgioLogo";
import confetti from "canvas-confetti";

const BUTUAN_BARANGAYS = [
  "Montilla Blvd",
  "Libertad",
  "Ampayon",
  "Bancasi",
  "Doongan",
  "Villa Kananga",
  "JC Aquino Ave",
  "Holy Redeemer",
  "Poblacion",
  "San Vicente",
  "Baan",
  "Taguibo"
];

const JOB_CATEGORIES = [
  "Developer & IT",
  "Healthcare & Clinic",
  "Hospitality & Cafes",
  "Design & Creative",
  "Trades & Logistics",
  "Admin & Office Support",
  "Sales & Marketing"
];

const BUSINESS_INDUSTRIES = [
  "Technology & Software",
  "Hospitality & Food Service",
  "Healthcare & Medical",
  "Retail & Commerce",
  "Logistics & Warehousing",
  "Education & Academic",
  "Construction & Services"
];

export default function OnboardingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, userProfile, completeOnboarding, showToast } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState<"role-select" | "profile-details">("role-select");
  const [selectedRole, setSelectedRole] = useState<"jobseeker" | "employer">("jobseeker");

  // Jobseeker fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Developer & IT");
  const [barangay, setBarangay] = useState("Montilla Blvd");

  // Employer fields
  const [companyName, setCompanyName] = useState("");
  const [companyIndustry, setCompanyIndustry] = useState("Technology & Software");
  const [employerContactName, setEmployerContactName] = useState("");

  // Sync initial user information from Clerk or AppContext
  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || userProfile.fullName || "");
      setEmail(user.email || userProfile.email || "");
      setPhone(userProfile.phone || "");
      setEmployerContactName(user.fullName || userProfile.fullName || "");
    }
  }, [isOpen, user, userProfile]);

  if (!isOpen) return null;

  const handleRoleContinue = (role: "jobseeker" | "employer") => {
    setSelectedRole(role);
    setStep("profile-details");
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const ok =
      selectedRole === "jobseeker"
        ? await completeOnboarding({
            role: "jobseeker",
            fullName: fullName || "Jobseeker",
            phone,
            headline: `${category} Specialist`,
            location: `${barangay}, Butuan City`,
          })
        : await completeOnboarding({
            role: "employer",
            fullName: employerContactName || "Hiring Manager",
            phone,
            companyName: companyName.trim(),
            companyIndustry,
            location: `${barangay}, Butuan City`,
            headline: `Hiring Manager at ${companyName.trim()}`,
          });

    setSubmitting(false);
    if (!ok) return;

    showToast(
      selectedRole === "jobseeker"
        ? "Welcome to JobConnect Butuan! Your profile is ready."
        : "Employer workspace created. Listings go live once your business is verified.",
      "success"
    );
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-neutral-200 text-left max-h-[92vh] overflow-y-auto"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Top Branding Header */}
        <div className="text-center mb-5">
          <div className="inline-block mb-2">
            <JobgioLogo variant="dark" size="sm" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
            {step === "role-select" ? "Welcome to JobConnect Butuan" : "Set Up Your Profile"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {step === "role-select"
              ? "Connecting local candidates with hiring businesses across Butuan City & Caraga."
              : selectedRole === "jobseeker"
              ? "Tell us what kind of work you're looking for to receive verified local job matches."
              : "Register your business or organization to post vacancies and review local applicants."}
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {step === "role-select" && (
          <div className="space-y-3">
            {/* Jobseeker Option */}
            <button
              type="button"
              onClick={() => handleRoleContinue("jobseeker")}
              className="w-full p-4 rounded-xl border-2 border-neutral-200 hover:border-blue-600 hover:bg-blue-50/20 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    I am a Job Seeker
                  </h3>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Looking for verified employment in Butuan City. Apply directly to local shops, clinics, and tech teams with zero placement fees.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                    Direct Application
                  </span>
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                    Status Tracking
                  </span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    100% Free
                  </span>
                </div>
              </div>
            </button>

            {/* Employer Option */}
            <button
              type="button"
              onClick={() => handleRoleContinue("employer")}
              className="w-full p-4 rounded-xl border-2 border-neutral-200 hover:border-blue-600 hover:bg-blue-50/20 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    I am an Employer / Recruiter
                  </h3>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Hiring staff or professionals for your business in Butuan. Publish vacancies, review candidate CVs, and schedule interviews.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                    Post Vacancies
                  </span>
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                    Candidate Pipeline
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    Direct Hiring
                  </span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* STEP 2A: JOBSEEKER DETAILS */}
        {step === "profile-details" && selectedRole === "jobseeker" && (
          <form onSubmit={handleCompleteOnboarding} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Michael Tan"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Phone (For Interview SMS)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Primary Field of Work
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                >
                  {JOB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Butuan City Barangay / Area
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                >
                  {BUTUAN_BARANGAYS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep("role-select")}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl btn-brand-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Complete Profile &amp; Find Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2B: EMPLOYER DETAILS */}
        {step === "profile-details" && selectedRole === "employer" && (
          <form onSubmit={handleCompleteOnboarding} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Company / Store Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Kape Butuanon, Agusan Diagnostics"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Industry
                </label>
                <select
                  value={companyIndustry}
                  onChange={(e) => setCompanyIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                >
                  {BUSINESS_INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Business Location (Barangay)
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                >
                  {BUTUAN_BARANGAYS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Hiring Contact Person *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={employerContactName}
                    onChange={(e) => setEmployerContactName(e.target.value)}
                    placeholder="e.g. Maria Santos (HR)"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0917 123 4567"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-2 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Free registration for DTI/SEC registered entities, local schools, and clinics in Butuan.</span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep("role-select")}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl btn-brand-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Activate Employer Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
