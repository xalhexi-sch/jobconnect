"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "./JobgioLogo";
import { ArrowRight, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "motion/react";

export default function Footer() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast("Subscribed to Caraga Job Alerts! We'll email you matching vacancies in Butuan.", "success");
    setEmail("");
  };

  return (
    <footer className="mt-14 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div className="rounded-3xl bg-[#111116] text-white p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl">
        
        {/* Top: Logo & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <JobgioLogo variant="light" size="md" />
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              The premier employment and talent ecosystem for Butuan City and the Caraga Region. Connecting local university graduates and seasoned professionals with trusted enterprises.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end">
            <div className="text-sm font-semibold text-neutral-300 mb-3">
              Get Weekly Caraga Job Alerts &amp; Hiring Trends
            </div>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@caraga.tech"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-[#111116] text-sm font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Middle: Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-white/10 text-sm">
          
          <div>
            <div className="font-bold text-neutral-200 uppercase tracking-wider mb-4 text-xs">Regional Center</div>
            <p className="text-neutral-400 leading-relaxed">
              J.C. Aquino Avenue,<br />
              Butuan City, 8600<br />
              Agusan del Norte, Caraga
            </p>
          </div>

          <div>
            <div className="font-bold text-neutral-200 uppercase tracking-wider mb-4 text-xs">Features</div>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/overview" className="hover:text-white transition-colors">Instant Job Search</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">My Applications Tracker</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Saved Jobs</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Resume & Portfolio</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Employer Pipeline</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-neutral-200 uppercase tracking-wider mb-4 text-xs">Caraga Coverage</div>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/overview" className="hover:text-white transition-colors">Butuan City</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Cabadbaran City</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Surigao City</Link></li>
              <li><Link href="/overview" className="hover:text-white transition-colors">Bayugan & Bislig</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-neutral-200 uppercase tracking-wider mb-4 text-xs">About</div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              A modern job board helping people in Butuan and Caraga find good work and local companies hire great talent.
            </p>
          </div>

        </div>

        {/* Bottom: Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © 2026 JobConnect Caraga. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Help &amp; Contact</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
