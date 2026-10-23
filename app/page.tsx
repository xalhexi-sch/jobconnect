"use client";

import React from "react";
import Crosshair from "@/components/Crosshair/Crosshair";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsProof from "@/components/StatsProof";
import JobCategories from "@/components/JobCategories";
import ExploreJobs from "@/components/ExploreJobs";
import HowItWorks from "@/components/HowItWorks";
import VideoTestimonial from "@/components/VideoTestimonial";
import StartupsSection from "@/components/StartupsSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import MobileMockupModal from "@/components/MobileMockupModal";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-[#111116] overflow-x-hidden relative">
      {/* Precision Crosshair Cursor Tracker (Landing Page Only) */}
      <Crosshair
        color="#059669"
        opacity={0.6}
        thickness={1}
        targetEffect="lock"
        targetSelector="a, button, [data-crosshair-target], input, select"
        showCoordinates={true}
        clickPulse={true}
        hideCursor={false}
        className="hidden md:block pointer-events-none"
      />

      {/* Dark floating pill navigation bar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Proof, Metrics & Logos */}
        <StatsProof />

        {/* Job Categories */}
        <JobCategories />

        {/* Live Filterable Explore Jobs Grid */}
        <ExploreJobs />

        {/* How It Works with Phone Overlay */}
        <HowItWorks />

        {/* Testimonial & Video Review */}
        <VideoTestimonial />

        {/* New Startups Showcase */}
        <StartupsSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Dark CTA Banner */}
        <CtaBanner />
      </main>

      {/* Dark Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <ApplyModal />
      <PostJobModal />
      <MobileMockupModal />
      <AuthModal />
    </div>
  );
}
