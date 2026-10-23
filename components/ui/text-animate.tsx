"use client";

import React, { ElementType } from "react";
import { motion, useInView, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface TextAnimateProps {
  children: string;
  animation?: "blurInUp" | "fadeIn" | "slideUp";
  by?: "word" | "character" | "line" | "text";
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "word",
  as: Component = "span",
  className,
  delay = 0,
  duration = 0.5,
  stagger = 0.04,
}: TextAnimateProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const getVariants = (): Variants => {
    switch (animation) {
      case "blurInUp":
        return {
          hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              delay: delay + i * stagger,
              duration,
              ease: [0.16, 1, 0.3, 1] as const,
            },
          }),
        };
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              delay: delay + i * stagger,
              duration,
              ease: [0.16, 1, 0.3, 1] as const,
            },
          }),
        };
      case "fadeIn":
      default:
        return {
          hidden: { opacity: 0 },
          visible: (i: number) => ({
            opacity: 1,
            transition: {
              delay: delay + i * stagger,
              duration,
              ease: "easeOut",
            },
          }),
        };
    }
  };

  const variants = getVariants();

  let tokens: string[] = [];
  if (by === "word") {
    tokens = children.split(" ");
  } else if (by === "character") {
    tokens = children.split("");
  } else if (by === "line") {
    tokens = children.split("\n");
  } else {
    tokens = [children];
  }

  return (
    <Component ref={ref} className={cn("inline-block", className)}>
      {tokens.map((token, index) => (
        <React.Fragment key={index}>
          <motion.span
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className="inline-block will-change-transform"
          >
            {token}
          </motion.span>
          {by === "word" && index < tokens.length - 1 && " "}
        </React.Fragment>
      ))}
    </Component>
  );
}
