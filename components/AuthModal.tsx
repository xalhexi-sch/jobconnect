"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, ArrowRight, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import JobgioLogo from "./JobgioLogo";
import { motion, AnimatePresence } from "motion/react";

export default function AuthModal() {
  const { isAuthOpen, closeAuthModal, authMode, setAuthMode, loginUser, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      loginUser(email, fullName || (email.split("@")[0]));
      setIsLoading(false);
      setEmail("");
      setPassword("");
      setFullName("");
    }, 600);
  };

  const handleSocialLogin = (provider: "Google" | "GitHub") => {
    setIsLoading(true);
    setTimeout(() => {
      loginUser(
        provider === "Google" ? "juan.delacruz@gmail.com" : "juan.delacruz@github.com",
        "Juan Dela Cruz"
      );
      setIsLoading(false);
      showToast(`Signed in with ${provider}`, "success");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] animate-in zoom-in-95 duration-200 text-left"
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Logo */}
        <div className="mb-6">
          <div className="mb-3">
            <JobgioLogo variant="dark" size="sm" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#111116]">
            {authMode === "sign-in" ? "Sign in to JobConnect" : "Create your account"}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {authMode === "sign-in"
              ? "Welcome back! Enter your details to continue."
              : "Find jobs or hire talent across Butuan & Caraga."}
          </p>
        </div>

        {/* Clerk-Style Segmented Pill Switcher */}
        <div className="flex p-1 rounded-full bg-neutral-100 border border-neutral-200/80 mb-5">
          <button
            type="button"
            onClick={() => setAuthMode("sign-in")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === "sign-in"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("sign-up")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              authMode === "sign-up"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Auth Buttons (Google & GitHub) */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("GitHub")}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4 fill-current text-neutral-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-neutral-400">
            <span className="bg-white px-2">or email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authMode === "sign-up" && (
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-full bg-[#111116] text-white hover:bg-black font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Clerk Badge Footer */}
        <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
          <Lock className="w-3 h-3 text-neutral-400" />
          <span>Secured by</span>
          <span className="font-bold text-neutral-700">Clerk</span>
        </div>

      </div>
    </div>
  );
}
