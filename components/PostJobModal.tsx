"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Briefcase, ArrowRight } from "lucide-react";
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

const CATEGORIES: JobCategory[] = [
  "Developer",
  "Design",
  "Healthcare",
  "Hospitality",
  "Trades & Logistics",
  "Marketing",
  "Security",
  "Admin & Support"
];

export default function PostJobModal() {
  const { isPostJobOpen, setIsPostJobOpen, postJob } = useApp();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState<Job["city"]>("Butuan City");
  const [barangay, setBarangay] = useState("Montilla Blvd");
  const [location, setLocation] = useState("Montilla Blvd, Butuan City");
  const [salary, setSalary] = useState("₱25,000 - ₱35,000 / month");
  const [type, setType] = useState<JobType>("On-site");
  const [category, setCategory] = useState<JobCategory>("Developer");
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
      description: description || `Hiring for ${title} at ${company} in ${city}.`,
      requirements: [
        "Relevant experience or educational background",
        "Strong teamwork and communication",
        "Punctual and reliable"
      ]
    });

    setTitle("");
    setCompany("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-neutral-200 text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close button */}
        <button
          onClick={() => setIsPostJobOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">Post a Job Opening</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Publish an active hiring vacancy for Butuan City &amp; Caraga job seekers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Service Crew, Nurse, Junior Developer"
              className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Company / Store Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Kape Butuanon"
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Monthly Pay (₱)
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₱18,000 - ₱25,000"
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Work Setup
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote (Caraga)">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                City / Province
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const val = e.target.value as Job["city"];
                  setCity(val);
                  setLocation(val);
                }}
                className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Butuan Barangay / Area
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Area / Street
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. City Proper"
                  className="w-full px-3 py-2.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Short Description &amp; Duties
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities, work schedule, or required skills..."
              className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 sm:py-2.5 rounded-xl btn-brand-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Publish Opening</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
