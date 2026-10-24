"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/mock-data";
import { motion, AnimatePresence } from "motion/react";

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState(FAQS[0]?.category || "Jobseekers in Caraga");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);

  const currentCategoryData = FAQS.find((f) => f.category === activeCategory) || FAQS[0];

  const toggleQuestion = (index: number) => {
    setOpenQuestionIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14"
      >
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111116] leading-tight">
          Frequently<br />asked questions
        </h2>
        <p className="text-base sm:text-lg text-neutral-500 mt-2 max-w-md">
          Clear answers about verified employers, regional compensation, and web application flow.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Category selector pills */}
        <div className="lg:col-span-4 flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar relative">
          {FAQS.map((faqGroup) => {
            const isSelected = activeCategory === faqGroup.category;

            return (
              <button
                key={faqGroup.category}
                onClick={() => {
                  setActiveCategory(faqGroup.category);
                  setOpenQuestionIndex(0);
                }}
                className={`relative px-6 py-3.5 rounded-2xl text-sm font-bold text-left transition-colors cursor-pointer whitespace-nowrap z-10 ${
                  isSelected ? "text-white" : "text-neutral-600 hover:text-black bg-[#F8F9FA]"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="faqCategoryActive"
                    className="absolute inset-0 rounded-2xl bg-[#111116] -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{faqGroup.category}</span>
              </button>
            );
          })}
        </div>

        {/* Right Accordion Questions with smooth AnimatePresence expansion */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentCategoryData.questions.map((item, idx) => {
                const isOpen = openQuestionIndex === idx;

                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-black/[0.05] bg-white transition-all duration-200 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleQuestion(idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-base sm:text-lg font-bold text-[#111116]">
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed border-t border-black/[0.04] pt-4">
                              {item.a}
                            </p>
                          </div>
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
