"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileText, Check, Plus, Trash2, Globe, GraduationCap, MapPin } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close button */}
        <button
          onClick={() => setIsResumeModalOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#111116] text-white flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 leading-tight">
            Edit Resume & Portfolio
          </h3>
          <p className="text-xs text-neutral-500">
            Keep your credentials up-to-date for employers in Butuan and the Caraga Region.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Location in Caraga
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Doongan, Butuan City"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Developer & UI Designer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Professional Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Education / University
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. BS IT — Caraga State University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Portfolio or GitHub URL
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Target Compensation (₱ PHP)
            </label>
            <input
              type="text"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              placeholder="e.g. ₱45,000 - ₱65,000 / month"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          {/* Skills Tag Management */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Verified Skills & Tools
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Next.js, Figma, SQL, Nursing)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-xs font-bold text-neutral-800 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsResumeModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-500 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold tracking-tight transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
