"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, Zap, Sparkles, Sliders, ShieldCheck } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import ParametricHeroCanvas from "../../components/landing/ParametricHeroCanvas";
import LaTeXFormula from "../../components/LaTeXFormula";
import QuantumCashflowChart from "../../components/QuantumCashflowChart";

export default function QuantumVisualizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
            <Activity size={14} /> Interactive Simulation Engine
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Parametric Quantum Yield Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Real-time multi-harmonic cash velocity modeling. Interact with the harmonic density, health index, and velocity flow sliders below to observe compounding curvature dynamics.
          </p>
        </div>

        {/* The Interactive Parametric Canvas with full controls */}
        <div className="mb-12 space-y-8">
          <QuantumCashflowChart currentBurn={120000} leakage={18000} />
          <ParametricHeroCanvas />
        </div>

        {/* Mathematical Modeling Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="royal-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> Harmonic Wave Equation
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Each quantum yield layer is governed by a multi-frequency sinusoidal waveform modulated by real-time cash retention and user interaction:
            </p>
            <LaTeXFormula
              math="y_i(x, t) = \sin(k x \omega + t \cdot v_i + \phi_i) \times A \times \left(\frac{H_{\text{score}}}{70}\right) \times \cos(2x + 0.5t)"
              caption="Harmonic Amplitude Dynamics"
              showCopy={true}
            />
          </div>

          <div className="royal-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" /> Continuous Yield Optimization
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                By modeling cashflow as a continuous velocity field rather than static discrete buckets, WealthSage identifies idle liquidity and triggers autonomous yield sweeps into high-interest sovereign instruments.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--text-muted)]">Target APY Alpha: <strong>+18.4%</strong></span>
              <Link
                href="/dashboard?tab=simulator"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl royal-btn-accent text-xs font-bold shadow-md"
              >
                Launch in Full Workspace <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
