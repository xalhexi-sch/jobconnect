"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "./JobgioLogo";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight, LogIn, Plus } from "lucide-react";
import { motion } from "motion/react";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { openAuthModal, isSignedIn, setIsPostJobOpen } = useApp();
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
      className="sticky top-5 z-40 w-full px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl px-5 sm:px-6 py-2.5 flex items-center justify-between bg-white/90 backdrop-blur-md shadow-sm border border-neutral-200/80 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <JobgioLogo variant="dark" size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-neutral-600 relative"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.href)}
                className="relative px-3.5 py-1.5 rounded-lg hover:text-black transition-colors duration-200"
              >
                {hoveredNav === item.href && (
                  <motion.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-lg bg-neutral-100 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{item.label}</span>
              </Link>
            ))}

            <Link
              href="/overview"
              onMouseEnter={() => setHoveredNav("/overview")}
              className="relative px-3 py-1.5 rounded-lg hover:text-black transition-colors duration-200 flex items-center gap-1.5"
            >
              {hoveredNav === "/overview" && (
                <motion.span
                  layoutId="navbar-hover-pill"
                  className="absolute inset-0 rounded-lg bg-neutral-100 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span>App Portal</span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                BXU
              </span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Post Opening button */}
            <button
              onClick={() => setIsPostJobOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Post a Job</span>
            </button>

            {/* Clerk Authentication or Fallback Button */}
            {isClerkConfigured ? (
              <>
                <Show when="signed-out">
                  <Link
                    href="/sign-in"
                    className="btn-supabase-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </Show>

                <Show when="signed-in">
                  <div className="flex items-center gap-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 border border-neutral-300",
                        }
                      }}
                    />
                  </div>
                </Show>
              </>
            ) : (
              !isSignedIn ? (
                <button
                  onClick={() => openAuthModal("sign-in")}
                  className="btn-supabase-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : null
            )}

            {/* Launch App Portal Button */}
            <Link
              href="/overview"
              className="btn-supabase-dark px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5"
            >
              <span>Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
