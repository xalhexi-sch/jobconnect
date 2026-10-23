"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#111116] text-white shadow-xl border border-white/10 backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {toast.type === "warning" && (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <p className="text-sm font-medium tracking-tight text-white/90">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/40 hover:text-white/80 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
