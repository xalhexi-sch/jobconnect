"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { X, ArrowRight, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import JobgioLogo from "./JobgioLogo";
import { isClerkConfigured } from "@/lib/clerk";

export default function AuthModal() {
  const { isAuthOpen, closeAuthModal, authMode, setAuthMode, loginUser, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Escape key listener
  React.useEffect(() => {
    if (isAuthOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeAuthModal();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isAuthOpen, closeAuthModal]);

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
    }, 500);
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
    }, 500);
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3 sm:hidden" />
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-600 hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xs z-10"
          aria-label="Close dialog"
          title="Close (Esc)"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {isClerkConfigured ? (
          <div className="flex flex-col items-center text-center pt-2">
            <JobgioLogo variant="dark" size="sm" />
            <h3 className="text-lg font-bold text-neutral-900 mt-4 mb-1">
              Sign in to JobConnect Butuan
            </h3>
            <p className="text-xs text-neutral-500 mb-6 max-w-xs leading-relaxed">
              Access your verified Butuan job applications, applicant tracker, and local employer portal.
            </p>
            <Link
              href="/sign-in"
              onClick={closeAuthModal}
              className="btn-brand-primary w-full py-2.5 rounded-xl text-xs font-bold text-center block mb-2.5 shadow-xs cursor-pointer text-white"
            >
              Continue to Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={closeAuthModal}
              className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold text-center block transition-colors cursor-pointer"
            >
              Create Free Account
            </Link>
          </div>
        ) : (
          <>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === "sign-up" && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl btn-brand-primary text-white text-xs font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-xs"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === "sign-in" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Social logins */}
            <div className="mt-5 pt-5 border-t border-neutral-100">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("GitHub")}
                  className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            {/* Toggle sign in / sign up */}
            <p className="mt-5 text-center text-xs text-neutral-500">
              {authMode === "sign-in" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("sign-up")}
                    className="font-bold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("sign-in")}
                    className="font-bold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
