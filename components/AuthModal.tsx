"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import JobgioLogo from "./JobgioLogo";

export default function AuthModal() {
  const { isAuthOpen, closeAuthModal, authMode } = useApp();

  if (!isAuthOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />
        <button
          onClick={closeAuthModal}
          aria-label="Close"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <JobgioLogo variant="dark" size="sm" />
          <h3 id="auth-title" className="text-lg font-bold text-neutral-900 mt-4 mb-1">
            {authMode === "sign-up" ? "Create your JobConnect account" : "Sign in to JobConnect Butuan"}
          </h3>
          <p className="text-sm text-neutral-500 mb-6 max-w-xs leading-relaxed">
            Access your job applications, applicant tracker, and local employer portal.
          </p>
          <Link
            href={authMode === "sign-up" ? "/sign-up" : "/sign-in"}
            onClick={closeAuthModal}
            className="btn-brand-primary w-full py-3 rounded-xl text-sm font-bold text-center block mb-2.5 shadow-xs cursor-pointer text-white"
          >
            {authMode === "sign-up" ? "Create Free Account" : "Continue to Sign In"}
          </Link>
          <Link
            href={authMode === "sign-up" ? "/sign-in" : "/sign-up"}
            onClick={closeAuthModal}
            className="w-full py-3 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold text-center block transition-colors cursor-pointer"
          >
            {authMode === "sign-up" ? "I already have an account" : "Create Free Account"}
          </Link>
        </div>
      </div>
    </div>
  );
}
