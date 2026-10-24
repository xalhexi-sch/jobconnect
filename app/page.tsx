"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsProof from "@/components/StatsProof";
import JobCategories from "@/components/JobCategories";
import ExploreJobs from "@/components/ExploreJobs";
import HowItWorks from "@/components/HowItWorks";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ApplyModal from "@/components/ApplyModal";
import PostJobModal from "@/components/PostJobModal";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Dark floating pill navigation bar */}
      <Navbar />

      <main id="main" className="flex-1">
        {/* Clean Hero Section */}
        <Hero />

        {/* Local Metrics & Regional Proof */}
        <StatsProof />

        {/* Categories Grid */}
        <JobCategories />

        {/* Live Filterable Job Feed */}
        <ExploreJobs />

        {/* Simple 3-Step Guide */}
        <HowItWorks />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Bottom Call to Action */}
        <CtaBanner />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Essential Interactive Modals */}
      <ApplyModal />
      <PostJobModal />
      <AuthModal />
    </div>
  );
}
