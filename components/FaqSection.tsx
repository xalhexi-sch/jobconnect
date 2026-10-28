"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { FAQS } from "@/lib/mock-data";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 34 } as const;

export default function FaqSection() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState(FAQS[0]?.category ?? "");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentCategoryData = FAQS.find((f) => f.category === activeCategory) || FAQS[0];

  const toggleQuestion = (index: number) => {
    setOpenQuestionIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-14"
      >
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg leading-tight text-balance">
          Questions<br />people ask
        </h2>
        <p className="text-base sm:text-lg text-fg-muted mt-2 max-w-md text-pretty">
          Short answers about jobs, pay and how to apply.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div
          role="tablist"
          aria-label="FAQ categories"
          className="lg:col-span-4 flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar relative"
        >
          {FAQS.map((faqGroup) => {
            const isSelected = activeCategory === faqGroup.category;

            return (
              <button
                key={faqGroup.category}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(faqGroup.category);
                  setOpenQuestionIndex(0);
                  setHoveredIndex(null);
                }}
                className={`relative px-6 py-3.5 rounded-2xl text-sm font-bold text-left transition-colors cursor-pointer whitespace-nowrap z-10 min-h-11 ${
                  isSelected ? "text-white" : "text-fg-muted hover:text-fg bg-surface-2"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="faqCategoryActive"
                    className="absolute inset-0 rounded-2xl bg-[#111116] -z-10 shadow-md"
                    transition={SPRING}
                  />
                )}
                <span>{faqGroup.category}</span>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              role="tabpanel"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col gap-1"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {currentCategoryData.questions.map((item, idx) => {
                const isOpen = openQuestionIndex === idx;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl border transition-colors duration-200 ${
                      isOpen ? "border-line bg-surface shadow-card" : "border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                  >
                    {/* Shared hover pill glides between rows (proximity hover) */}
                    {isHovered && !isOpen && (
                      <motion.span
                        layoutId="faqHoverPill"
                        className="absolute inset-0 rounded-2xl bg-surface-2"
                        transition={reduceMotion ? { duration: 0 } : SPRING}
                        aria-hidden
                      />
                    )}

                    <h3 className="relative">
                      <button
                        type="button"
                        id={`faq-q-${idx}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${idx}`}
                        onClick={() => toggleQuestion(idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span
                          className={`text-base sm:text-lg font-bold transition-colors ${
                            isOpen || isHovered ? "text-fg" : "text-fg-muted"
                          }`}
                        >
                          {item.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={reduceMotion ? { duration: 0 } : SPRING}
                          className="shrink-0 text-fg-muted"
                          aria-hidden
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-a-${idx}`}
                          role="region"
                          aria-labelledby={`faq-q-${idx}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                          className="relative overflow-hidden"
                        >
                          <p className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-fg-muted leading-relaxed text-pretty">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
