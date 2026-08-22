"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, Code2, Cpu, TrendingUp, Skull } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import ProgressiveFeatureDive from "../../components/landing/ProgressiveFeatureDive";

export default function SubsystemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold mb-3">
            <Layers size={14} /> Comprehensive Sovereign Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Six Modular Subsystems & Execution Kernels
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Inspect the underlying quantitative architecture, typed schemas, and mathematical governing equations powering WealthSage&apos;s autonomous ledger.
          </p>
        </div>

        {/* Progressive Feature Dive Component */}
        <div className="mb-12">
          <ProgressiveFeatureDive />
        </div>

        {/* Bottom Workspace Action */}
        <div className="royal-card p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Ready to experience these subsystems live?</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Launch the Sovereign Workspace to log real transactions, detect zombie subscriptions, and query Google Gemini AI.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-2xl royal-btn-accent text-xs font-extrabold shadow-lg shrink-0 flex items-center gap-2"
          >
            Launch Sovereign Workspace <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
