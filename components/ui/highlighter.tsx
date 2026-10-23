"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface HighlighterProps {
  children: React.ReactNode;
  action?: "highlight" | "underline";
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#E5E7EB",
  className,
  strokeWidth = 12,
}: HighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  if (action === "underline") {
    return (
      <span ref={ref} className={cn("relative inline-block", className)}>
        <span>{children}</span>
        <svg
          className="absolute -bottom-1.5 left-0 w-full overflow-visible pointer-events-none"
          height="8"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 1 6 Q 50 1, 99 5"
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
      </span>
    );
  }

  // Action: "highlight" (Apple-style subtle squircle marker backdrop)
  return (
    <span ref={ref} className={cn("relative inline-block px-1.5 py-0.5", className)}>
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        style={{ backgroundColor: color, originX: 0 }}
        className="absolute inset-0 rounded-lg -z-10"
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
