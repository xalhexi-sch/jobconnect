"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Dialog from "@/components/ui/Dialog";

export default function AuthModal() {
  const { isAuthOpen, closeAuthModal, authMode } = useApp();
  const signUp = authMode === "sign-up";

  return (
    <Dialog
      open={isAuthOpen}
      onClose={closeAuthModal}
      size="sm"
      title={signUp ? "Create your account" : "Sign in to JobConnect"}
      description="Apply to jobs, save favourites and manage your hiring in one place."
    >
      <div className="space-y-2.5 pt-1">
        <Link
          href={signUp ? "/sign-up" : "/sign-in"}
          onClick={closeAuthModal}
          className="btn-brand-primary w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center"
        >
          {signUp ? "Create free account" : "Continue to sign in"}
        </Link>
        <Link
          href={signUp ? "/sign-in" : "/sign-up"}
          onClick={closeAuthModal}
          className="w-full h-12 rounded-xl border border-line bg-surface-2 text-sm font-semibold flex items-center justify-center hover:border-neutral-300 transition-colors"
        >
          {signUp ? "I already have an account" : "Create free account"}
        </Link>
      </div>
    </Dialog>
  );
}
