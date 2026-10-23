"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Search, ChevronLeft, Bookmark, ArrowRight, Check } from "lucide-react";

export default function MobileMockupModal() {
  const { isMobileMockupOpen, setIsMobileMockupOpen } = useApp();
  const [activeScreen, setActiveScreen] = useState<"onboarding" | "matching" | "search">("matching");
  const [selectedFilter, setSelectedFilter] = useState("UX Designer");

  if (!isMobileMockupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold">
            <button
              onClick={() => setActiveScreen("onboarding")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeScreen === "onboarding" ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Intro
            </button>
            <button
              onClick={() => setActiveScreen("matching")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeScreen === "matching" ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Matching
            </button>
            <button
              onClick={() => setActiveScreen("search")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeScreen === "search" ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Results
            </button>
          </div>

          <button
            onClick={() => setIsMobileMockupOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iPhone Chassis */}
        <div className="w-[330px] rounded-[48px] p-2.5 bg-neutral-900 shadow-2xl ring-1 ring-white/20 relative">
          
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30" />

          {/* Screen Content */}
          <div className="w-full bg-white rounded-[40px] pt-7 pb-6 px-4 min-h-[580px] overflow-hidden flex flex-col justify-between text-left text-neutral-900">
            
            {/* SCREEN 1: ONBOARDING (From Image 7 left) */}
            {activeScreen === "onboarding" && (
              <div className="flex flex-col justify-between h-full py-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold mb-2">
                  <span>4/4</span>
                  <button onClick={() => setActiveScreen("matching")} className="hover:text-black">
                    Skip
                  </button>
                </div>

                {/* Illustration */}
                <div className="flex items-center justify-center my-4">
                  <div className="w-44 h-44 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border-4 border-black/80 flex items-center justify-center">
                      <span className="text-4xl">🔍</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
                    Getting<br />remote jobs
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                    Find your perfect remote job faster with smart online tools.
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveScreen("matching")}
                      className="w-full py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition-colors"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => setActiveScreen("matching")}
                      className="w-full py-3 rounded-full bg-[#111116] text-white hover:bg-black text-xs font-bold transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: MATCHING JOBS (From Image 7 middle) */}
            {activeScreen === "matching" && (
              <div className="py-1">
                {/* User bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="George"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-medium">Hi</div>
                      <div className="text-xs font-bold text-neutral-900">George</div>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <span className="text-xs">≡</span>
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center justify-between my-2">
                  <h3 className="text-xl font-bold text-neutral-900 leading-tight">
                    Matching<br />Jobs
                  </h3>
                  <button
                    onClick={() => setActiveScreen("search")}
                    className="w-10 h-10 rounded-2xl bg-[#111116] text-white flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Tag Pills */}
                <div className="flex items-center gap-1.5 my-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 flex items-center gap-1">
                    UX Designer <X className="w-2.5 h-2.5" />
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 flex items-center gap-1">
                    Remote <X className="w-2.5 h-2.5" />
                  </span>
                </div>

                {/* Job matched cards */}
                <div className="text-[11px] font-bold text-neutral-800 my-2">Job matched</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="text-[10px] font-bold text-neutral-400">Google</div>
                    <div className="text-xs font-bold text-neutral-900 mt-1">$120/h</div>
                    <div className="text-[10px] text-neutral-500">Led UX Designer</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111116] text-white shadow-sm">
                    <div className="text-[10px] font-bold text-neutral-300">Adobe</div>
                    <div className="text-xs font-bold text-white mt-1">$150K/yr</div>
                    <div className="text-[10px] text-neutral-300">Sr. UX Designer</div>
                  </div>
                </div>

                {/* Categories */}
                <div className="text-[11px] font-bold text-neutral-800 mt-4 mb-2">Job categories</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-neutral-50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-800">Designer</div>
                      <div className="text-[9px] text-neutral-400">3.2k Jobs</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-neutral-400 -rotate-45" />
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-800">Security</div>
                      <div className="text-[9px] text-neutral-400">3.2k Jobs</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-neutral-400 -rotate-45" />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: SEARCH RESULTS (From Image 7 right) */}
            {activeScreen === "search" && (
              <div className="py-1">
                {/* Header with back arrow */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setActiveScreen("matching")}
                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-neutral-800">Jobs</span>
                  <div className="w-7" />
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                      UX Designer
                    </h3>
                    <div className="text-[10px] text-neutral-400 font-medium">
                      24 Job Opportunity Found
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Filter tags */}
                <div className="flex items-center gap-1.5 my-3">
                  {["UX Designer", "Product Designer", "UI/UX"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        selectedFilter === f
                          ? "bg-[#111116] text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Vertical job list */}
                <div className="space-y-2 mt-2">
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800">Adobe</span>
                      <Bookmark className="w-3 h-3 text-neutral-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">Sr. UX Designer</span>
                      <span className="text-xs font-bold text-neutral-800">$150/year</span>
                    </div>
                    <div className="text-[9px] text-neutral-400">25 days ago • 60+ Submitted</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800">Google</span>
                      <Bookmark className="w-3 h-3 text-neutral-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">Led UX Designer</span>
                      <span className="text-xs font-bold text-neutral-800">$120/h</span>
                    </div>
                    <div className="text-[9px] text-neutral-400">2 days ago • 80+ Submitted</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800">HP Company</span>
                      <Bookmark className="w-3 h-3 text-neutral-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">Graphic Designer</span>
                      <span className="text-xs font-bold text-neutral-800">$80/h</span>
                    </div>
                    <div className="text-[9px] text-neutral-400">16 days ago • 100+ Submitted</div>
                  </div>
                </div>

              </div>
            )}

            {/* Home indicator bar at bottom */}
            <div className="w-24 h-1 bg-neutral-300 rounded-full mx-auto mt-2" />

          </div>
        </div>

      </div>
    </div>
  );
}
