"use client";

import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 120,
}) => {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-block text-neutral-800/80 dark:text-neutral-200/80",
        // Shimmer effect classes
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        // Gradient color
        "bg-gradient-to-r from-neutral-800 via-neutral-400 to-neutral-800 dark:from-white/70 dark:via-white dark:to-white/70",
        className,
      )}
    >
      {children}
    </span>
  );
};
