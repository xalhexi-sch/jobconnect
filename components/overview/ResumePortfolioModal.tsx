"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileText, Check, Plus, Trash2 } from "lucide-react";

export default function ResumePortfolioModal() {
  const { isResumeModalOpen, setIsResumeModalOpen, userProfile, updateUserProfile } = useApp();

  const [fullName, setFullName] = useState(userProfile.fullName);
  const [headline, setHeadline] = useState(userProfile.headline);
  const [location, setLocation] = useState(userProfile.location);
  const [bio, setBio] = useState(userProfile.bio);
  const [education, setEducation] = useState(userProfile.education);
  const [portfolioUrl, setPortfolioUrl] = useState(userProfile.portfolioUrl);
  const [skills, setSkills] = useState<string[]>(userProfile.skills);
  const [newSkill, setNewSkill] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(userProfile.expectedSalary);

  if (!isResumeModalOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      headline,
      location,
      bio,
      education,
      portfolioUrl,
      skills,
      expectedSalary
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-neutral-200 text-left max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsResumeModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-neutral-700" />
            <h3 className="text-lg font-bold text-neutral-900">Profile &amp; Credentials</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Information shown to hiring managers when you apply for roles.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Location in Caraga
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bancasi, Butuan City"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Registered Nurse, Cashier, IT Graduate"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Expected Pay
              </label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. ₱20,000 - ₱30,000 / mo"
                className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Education / College
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. Caraga State University (CSU) / FSUU"
              className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          {/* Skills Badges */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Skills &amp; Specialties
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-neutral-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Customer Care, React, Excel)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brief Bio / Summary
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="1-2 sentences about your career goals and experience..."
              className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-2.5 rounded-xl bg-[#111116] text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
}
