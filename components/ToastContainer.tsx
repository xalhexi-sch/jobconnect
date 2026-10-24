"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

const ICON = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();
  const host = useRef<HTMLDivElement>(null);

  // A popover lives in the top layer, so toasts stay visible above open dialogs.
  useEffect(() => {
    const el = host.current;
    if (!el || typeof el.showPopover !== "function") return;
    if (toasts.length === 0) {
      if (el.matches(":popover-open")) el.hidePopover();
      return;
    }
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }, [toasts.length]);

  return (
    <div ref={host} popover="manual" className="toast-host">
      <div className="flex flex-col gap-2.5 w-full sm:w-96" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start justify-between gap-3 px-4 py-3.5 rounded-2xl bg-[#14171f] text-white shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3"
          >
            <div className="flex items-start gap-3">
              {ICON[toast.type ?? "success"]}
              <p className="text-sm font-medium leading-snug text-white/95">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-white/50 hover:text-white p-1 -m-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
