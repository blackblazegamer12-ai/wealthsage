"use client";

import React from "react";
import LandingNavbar from "../components/landing/LandingNavbar";
import FeaturesSection from "../components/landing/FeaturesSection";
import GuideToToolsSection from "../components/landing/GuideToToolsSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-amber-400 selection:text-black transition-colors">
      {/* Sticky Glassmorphic Navbar */}
      <LandingNavbar />

      <main className="flex-1">
        {/* SECTION 1: Features Section (Hero, Value Props, Trust Metrics & 4 Core Spotlight Capabilities with LaTeX Formulas) */}
        <FeaturesSection />

        {/* SECTION 2: Guide to the Tools Section (Direct Pathways & Deep Links to Dedicated Workspaces & Tools) */}
        <GuideToToolsSection />
      </main>

      {/* Sovereign Platform Footer */}
      <LandingFooter />
    </div>
  );
}