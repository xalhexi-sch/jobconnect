"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Card with a cursor-following glow. Writes CSS variables directly so pointer moves never re-render. */
export default function SpotlightCard({ className, onPointerMove, ...props }: ComponentPropsWithoutRef<"div">) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  return <div {...props} onPointerMove={move} className={cn("spotlight", className)} />;
}
