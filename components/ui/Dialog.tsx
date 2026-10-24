"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

type Size = "sm" | "md" | "lg";
const WIDTH: Record<Size, string> = { sm: "26rem", md: "32rem", lg: "42rem" };

/**
 * Accessible modal built on the native <dialog> element: focus trap, Escape to close,
 * inert background and top-layer stacking come from the browser. Becomes a bottom sheet on phones.
 * Children mount only while open, so forms reset naturally each time.
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  hideHeader = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: Size;
  footer?: React.ReactNode;
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dlg"
      style={{ "--dlg-w": WIDTH[size] } as React.CSSProperties}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      data-lenis-prevent
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <div className="sm:hidden w-10 h-1 rounded-full bg-neutral-300 mx-auto mt-2.5 shrink-0" aria-hidden />
          <header className={`flex items-start justify-between gap-4 px-5 sm:px-6 pt-4 sm:pt-5 pb-3 shrink-0 ${hideHeader ? "sr-only" : ""}`}>
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
                {title}
              </h2>
              {description && (
                <p id={descId} className="text-sm text-fg-muted mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0 -mr-1.5 w-9 h-9 rounded-full flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
          <div className="px-5 sm:px-6 pb-5 overflow-y-auto overscroll-contain flex-1">{children}</div>
          {footer && (
            <footer className="px-5 sm:px-6 py-4 border-t border-line bg-surface shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </footer>
          )}
        </>
      )}
    </dialog>
  );
}
