"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Dialog from "@/components/ui/Dialog";
import type { UserProfile } from "@/lib/types";

export default function ResumePortfolioModal() {
  const { isResumeModalOpen, setIsResumeModalOpen, userProfile, updateUserProfile } = useApp();
  return (
    <Dialog open={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} title="Edit profile" description="This is what employers see when you apply." size="lg">
      <ProfileForm profile={userProfile} onSave={updateUserProfile} />
    </Dialog>
  );
}

function ProfileForm({ profile, onSave }: { profile: UserProfile; onSave: (p: Partial<UserProfile>) => void }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [headline, setHeadline] = useState(profile.headline);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);
  const [education, setEducation] = useState(profile.education);
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl);
  const [expectedSalary, setExpectedSalary] = useState(profile.expectedSalary);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    const s = skill.trim();
    if (s && !skills.includes(s) && skills.length < 40) setSkills([...skills, s]);
    setSkill("");
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ fullName, phone, headline, location, bio, education, portfolioUrl, expectedSalary, skills });
      }}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pf-name" className="block text-sm font-medium mb-1.5">Full name</label>
          <input id="pf-name" className="field" required minLength={2} maxLength={120} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pf-phone" className="block text-sm font-medium mb-1.5">Mobile number</label>
          <input id="pf-phone" className="field" type="tel" inputMode="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="pf-head" className="block text-sm font-medium mb-1.5">Headline</label>
        <input id="pf-head" className="field" maxLength={160} placeholder="e.g. Junior front-end developer" value={headline} onChange={(e) => setHeadline(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pf-loc" className="block text-sm font-medium mb-1.5">Location</label>
          <input id="pf-loc" className="field" maxLength={160} value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pf-sal" className="block text-sm font-medium mb-1.5">Expected salary</label>
          <input id="pf-sal" className="field" maxLength={60} placeholder="₱20,000 / month" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="pf-edu" className="block text-sm font-medium mb-1.5">Education</label>
        <input id="pf-edu" className="field" maxLength={300} value={education} onChange={(e) => setEducation(e.target.value)} />
      </div>

      <div>
        <label htmlFor="pf-url" className="block text-sm font-medium mb-1.5">Portfolio link</label>
        <input id="pf-url" className="field" type="url" maxLength={500} placeholder="https://" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
      </div>

      <div>
        <label htmlFor="pf-skill" className="block text-sm font-medium mb-1.5">Skills</label>
        <div className="flex gap-2">
          <input
            id="pf-skill"
            className="field"
            maxLength={40}
            placeholder="Type a skill, press Enter"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <button type="button" onClick={addSkill} aria-label="Add skill" className="w-12 shrink-0 rounded-xl border border-line bg-surface-2 flex items-center justify-center cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {skills.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-3">
            {skills.map((s) => (
              <li key={s} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} aria-label={`Remove ${s}`} className="w-5 h-5 rounded-md hover:bg-blue-100 flex items-center justify-center cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="pf-bio" className="block text-sm font-medium mb-1.5">About you</label>
        <textarea id="pf-bio" className="field resize-y" rows={4} maxLength={2000} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <button type="submit" className="btn-brand-primary w-full h-12 rounded-xl text-sm font-semibold cursor-pointer">Save profile</button>
    </form>
  );
}
