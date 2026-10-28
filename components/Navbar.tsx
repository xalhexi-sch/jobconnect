"use client";

import React, { useState } from "react";
import Link from "next/link";
import JobgioLogo from "./JobgioLogo";
import { useApp } from "@/context/AppContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleToggle from "@/components/ui/LocaleToggle";
import { ArrowUpRight, LogIn, Plus, Menu, X, Search, Briefcase, HelpCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { isClerkConfigured } from "@/lib/clerk";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { openAuthModal, isSignedIn, setIsPostJobOpen, setIsInboxOpen, unreadMessagesCount } = useApp();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      className="sticky top-3 sm:top-5 z-40 w-full px-3 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl px-3.5 sm:px-6 py-2.5 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-sm border border-neutral-200/80 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <JobgioLogo variant="dark" size="sm" />
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
              <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                BXU
              </span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LocaleToggle />
            <ThemeToggle />

            {/* Direct Inbox Messages Button on Top (with Send icon) */}
            <button
              type="button"
              onClick={() => (isSignedIn ? setIsInboxOpen(true) : openAuthModal("sign-in"))}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Inbox Messages"
              aria-label="Direct inbox messages"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Inbox</span>
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>

            {/* Quick Post Opening button (Desktop) */}
            <button
              onClick={() => (isSignedIn ? setIsPostJobOpen(true) : openAuthModal("sign-up"))}
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
                    className="hidden sm:inline-flex btn-brand-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </Show>

                <Show when="signed-in">
                  <div className="flex items-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 border border-neutral-300 shadow-xs",
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
                  className="hidden sm:inline-flex btn-brand-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : null
            )}

            {/* Launch App Portal Button */}
            <Link
              href="/overview"
              className="btn-supabase-dark px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center gap-1 shadow-xs"
            >
              <span>Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-neutral-200/90 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-neutral-900" />
              ) : (
                <Menu className="w-4 h-4 text-neutral-900" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Menu &bull; Butuan City
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Live Database
                </span>
              </div>

              <div className="space-y-1">
                {/* Inbox Messages on Mobile Menu */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!isSignedIn) openAuthModal("sign-in");
                    else setIsInboxOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>Inbox Messages</span>
                  </span>
                  {unreadMessagesCount > 0 ? (
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {unreadMessagesCount} new
                    </span>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>

                <Link
                  href="#opportunities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Browse Open Positions</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                <Link
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-neutral-500" />
                    <span>How It Works</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                <Link
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-neutral-500" />
                    <span>Frequently Asked Questions</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!isSignedIn) openAuthModal("sign-in");
                    else setIsPostJobOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Post a Job</span>
                </button>

                <Link
                  href="/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl btn-brand-primary text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Open job portal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {isClerkConfigured && (
                  <Show when="signed-out">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl btn-clerk-outline text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-neutral-500" />
                      <span>Sign in</span>
                    </Link>
                  </Show>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
