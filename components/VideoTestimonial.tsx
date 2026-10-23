"use client";

import React, { useState } from "react";
import { Play, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { REVIEWS } from "@/lib/mock-data";
import { motion, AnimatePresence } from "motion/react";

export default function VideoTestimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentReview = REVIEWS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
    setIsPlaying(false);
  };

  return (
    <section id="reviews" className="py-24 md:py-36 bg-white border-t border-black/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          
          {/* Left Column: Scaled up quote & author info with spring cross-fade */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-14 h-14 rounded-3xl bg-[#FF7A00] flex items-center justify-center text-white shadow-md shadow-[#FF7A00]/25"
            >
              <span className="text-3xl font-serif font-black leading-none">“</span>
            </motion.div>

            <div className="min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={currentReview.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#111116] leading-snug"
                >
                  &quot;{currentReview.quote}&quot;
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${currentReview.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-neutral-100 gap-4"
              >
                <div>
                  <div className="text-xl font-bold text-[#111116]">{currentReview.name}</div>
                  <div className="text-sm sm:text-base text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>{currentReview.role}</span> • <MapPin className="w-4 h-4 text-neutral-400" /> {currentReview.location}
                  </div>
                </div>

                {/* Company tag */}
                <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-100 px-4 py-2 rounded-full">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Hired at</span>
                  <span className="text-sm font-extrabold text-neutral-900">{currentReview.company}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Video thumbnail with Play button */}
          <div className="lg:col-span-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`media-${currentReview.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-[44px] overflow-hidden aspect-[16/11] bg-neutral-900 shadow-2xl border-4 border-white group cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <img
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="w-full h-full object-cover object-top filter contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-8 left-8 w-16 h-16 rounded-full bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-2xl border border-white/20"
                >
                  <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
                </motion.div>

                {/* Status pill */}
                <div className="absolute bottom-8 right-8 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-medium">
                  {isPlaying ? "Playing interview..." : `${currentReview.videoDuration || "1:30"} min story`}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Avatar Switcher and Next Review navigation */}
        <div className="mt-16 pt-10 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-8">
          
          {/* Avatar selector row */}
          <div className="flex items-center gap-4">
            {REVIEWS.map((rev, idx) => (
              <motion.button
                key={rev.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`relative rounded-full transition-all duration-300 p-1 cursor-pointer ${
                  currentIndex === idx
                    ? "ring-2 ring-black scale-110 shadow-lg"
                    : "opacity-40 hover:opacity-100 ring-1 ring-neutral-200"
                }`}
              >
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </motion.button>
            ))}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-3.5 rounded-full border border-black/10 hover:border-black hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Previous Story"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#111116] text-white hover:bg-black font-bold text-sm tracking-tight transition-colors shadow-sm cursor-pointer"
            >
              <span>Next Story</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>
    </section>
  );
}
