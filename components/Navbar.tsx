"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "./JobgioLogo";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight, UserCheck, Briefcase, LogIn, User, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function Navbar() {
  const { role, setRole, openAuthModal, isSignedIn, user } = useApp();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navLinks = [
    { href: "#opportunities", label: "Browse Jobs" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-6 z-40 w-full px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-pill rounded-2xl px-5 sm:px-7 py-3 flex items-center justify-between shadow-xl shadow-black/10 border border-white/10 transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <JobgioLogo variant="light" size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden md:flex items-center gap-1 text-sm font-medium text-white/80 relative"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.href)}
                className="relative px-3.5 py-1.5 rounded-lg hover:text-white transition-colors duration-200"
              >
                {hoveredNav === item.href && (
                  <motion.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{item.label}</span>
              </Link>
            ))}

            <Link
              href="/overview"
              onMouseEnter={() => setHoveredNav("/overview")}
              className="relative px-3.5 py-1.5 rounded-lg hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              {hoveredNav === "/overview" && (
                <motion.span
                  layoutId="navbar-hover-pill"
                  className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span>App</span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                Live
              </span>
            </Link>
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 3-Way Role Switcher for seamless testing */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-white/10 border border-white/10 text-[11px] font-medium text-white/80">
              <button
                onClick={() => setRole("jobseeker")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "jobseeker"
                    ? "bg-white text-[#111116] font-semibold shadow-xs"
                    : "hover:text-white"
                }`}
                title="Jobseeker mode"
              >
                <UserCheck className="w-3 h-3 text-emerald-600" />
                <span>Seeker</span>
              </button>

              <button
                onClick={() => setRole("employer")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "employer"
                    ? "bg-white text-[#111116] font-semibold shadow-xs"
                    : "hover:text-white"
                }`}
                title="Employer mode"
              >
                <Briefcase className="w-3 h-3 text-amber-600" />
                <span>Employer</span>
              </button>

              <button
                onClick={() => setRole("admin")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  role === "admin"
                    ? "bg-white text-[#111116] font-semibold shadow-xs"
                    : "hover:text-white"
                }`}
                title="Admin mode"
              >
                <Shield className="w-3 h-3 text-rose-600" />
                <span>Admin</span>
              </button>
            </div>

            {/* Clerk Sign In / Account Button */}
            {!isSignedIn ? (
              <button
                onClick={() => openAuthModal("sign-in")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-neutral-300" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal("sign-in")}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white/90 transition-colors cursor-pointer"
                title="Account"
              >
                <img src={user.avatar} alt={user.fullName} className="w-5 h-5 rounded-full object-cover" />
                <span className="truncate max-w-[90px]">{user.fullName.split(" ")[0]}</span>
              </button>
            )}

            {/* Launch Web App Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/overview"
                className="px-4 py-1.5 rounded-xl bg-white text-[#111116] text-xs sm:text-sm font-semibold tracking-tight hover:bg-neutral-100 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Open App</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
