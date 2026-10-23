"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Briefcase, Plus, ArrowRight } from "lucide-react";
import { JobType } from "@/lib/types";

export default function PostJobModal() {
  const { isPostJobOpen, setIsPostJobOpen, postJob } = useApp();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState<"Butuan City" | "Cabadbaran City" | "Surigao City" | "Bayugan City" | "Bislig City" | "Caraga Region">("Butuan City");
  const [location, setLocation] = useState("Butuan City");
  const [salary, setSalary] = useState("₱35,000/mo");
  const [type, setType] = useState<JobType>("On-site");
  const [category, setCategory] = useState<"Design" | "Developer" | "Security" | "Marketing" | "Healthcare" | "Admin & Support">("Developer");
  const [description, setDescription] = useState("");

  if (!isPostJobOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    postJob({
      title,
      company,
      companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
      location: `${location}, ${city}`,
      barangay: "Poblacion",
      city,
      salary,
      salaryPhp: parseInt(salary.replace(/\D/g, "")) || 35000,
      type,
      category,
      status: "Active",
      description: description || "Looking for a dedicated team member in Butuan City.",
      requirements: ["Experience in related field", "Good communication skills"]
    });

    setTitle("");
    setCompany("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar text-left"
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
            Share a job opening with people in Butuan and Caraga.
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
              placeholder="e.g. Graphic Designer, Web Dev, Store Clerk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Company / Store
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Butuan Cafe, Tech Lab"
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
                placeholder="e.g. ₱35,000/mo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                City / Town
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value as any);
                  setLocation(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="Butuan City">Butuan City</option>
                <option value="Cabadbaran City">Cabadbaran City</option>
                <option value="Surigao City">Surigao City</option>
                <option value="Bayugan City">Bayugan City</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Work Setup
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote (Caraga)">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this person be doing? Keep it short..."
              className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-[#111116] text-white hover:bg-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Publish Job</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
