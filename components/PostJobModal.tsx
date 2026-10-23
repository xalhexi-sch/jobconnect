"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Briefcase, Plus, ArrowRight, MapPin } from "lucide-react";
import { JobType, JobCategory, Job } from "@/lib/types";

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

const CATEGORIES = [
  "Developer",
  "Design",
  "Healthcare",
  "Hospitality",
  "Trades & Logistics",
  "Marketing",
  "Security",
  "Admin & Support"
] as const;

export default function PostJobModal() {
  const { isPostJobOpen, setIsPostJobOpen, postJob } = useApp();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState<"Butuan City" | "Cabadbaran City" | "Surigao City" | "Bayugan City" | "Bislig City" | "Caraga Region">("Butuan City");
  const [barangay, setBarangay] = useState("Montilla Blvd");
  const [location, setLocation] = useState("Montilla Blvd, Butuan City");
  const [salary, setSalary] = useState("₱25,000 - ₱35,000 / month");
  const [type, setType] = useState<JobType>("On-site");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Developer");
  const [description, setDescription] = useState("");

  if (!isPostJobOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    const formattedLocation = city === "Butuan City" ? `${barangay}, Butuan City` : `${location}, ${city}`;

    postJob({
      title,
      company,
      companyLogo: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80",
      location: formattedLocation,
      barangay: city === "Butuan City" ? barangay : undefined,
      city,
      salary,
      salaryPhp: parseInt(salary.replace(/\D/g, "")) || 25000,
      type,
      category,
      status: "Active",
      description: description || `Looking for dedicated team members for ${company} in ${city}.`,
      requirements: [
        "Good communication skills and customer-first mindset",
        "Punctual and reliable team player",
        "Relevant certification or practical experience"
      ]
    });

    setTitle("");
    setCompany("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar text-left"
      >
        {/* Close button */}
        <button
          onClick={() => setIsPostJobOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#111116] text-white flex items-center justify-center mb-2.5">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 leading-tight">
            Post an Opening
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Share a vacancy with students & job seekers across Butuan City & Caraga.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Registered Nurse, Store Clerk, Web Developer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Company / Store Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Butuan Artisan Cafe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Monthly Pay (₱)
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₱20,000 - ₱30,000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Work Setup
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote (Caraga)">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                City / Region
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const val = e.target.value as Job["city"];
                  setCity(val);
                  setLocation(val);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="Butuan City">Butuan City</option>
                <option value="Cabadbaran City">Cabadbaran City</option>
                <option value="Surigao City">Surigao City</option>
                <option value="Bayugan City">Bayugan City</option>
                <option value="Caraga Region">Caraga Region</option>
              </select>
            </div>

            {city === "Butuan City" ? (
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Butuan Barangay / Area
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
                >
                  {BUTUAN_BARANGAYS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City Center"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Short Description & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this person do? Mention shift hours, key skills, or requirements..."
              className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-[#111116] text-white hover:bg-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Publish Vacancy to JobConnect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
