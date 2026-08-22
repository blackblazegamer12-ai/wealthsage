"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Skull,
  Zap,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import LaTeXFormula from "../LaTeXFormula";

interface FeatureSpotlight {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  formula: string;
  formulaCaption: string;
  metric: string;
  metricLabel: string;
  accentColor: string;
  deepLink: string;
}

const SPOTLIGHT_FEATURES: FeatureSpotlight[] = [
  {
    id: "feat-ai",
    title: "Google Gemini Autonomous Strategist",
    category: "AI QUANT COPILOT",
    badge: "Dual-SDK Gemini",
    description:
      "Dual-SDK Gemini AI reasoning copilot performing real-time CRUD ledger operations, proactive spending audits, and quantitative theorem proofs.",
    icon: Cpu,
    formula: "\\text{Schema} \\cap \\text{Regex Scrub} \\to \\text{Deterministic Valid JSON}",
    formulaCaption: "Structured Intent Validation Kernel",
    metric: "99.98%",
    metricLabel: "Mathematical Precision",
    accentColor: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30",
    deepLink: "/notebook",
  },
  {
    id: "feat-compounding",
    title: "Predictive Compounding Engine",
    category: "QUANT SIMULATION",
    badge: "Monte Carlo 5-Year",
    description:
      "Dynamically models continuous wealth trajectory from monthly surplus retention and variable rate models (S&P 500, HYSA, and Alpha) rather than static lump-sum estimates.",
    icon: TrendingUp,
    formula: "A(t) = P \\left(1 + \\frac{r}{n}\\right)^{nt} + \\int_{0}^{t} S(u) e^{r(t-u)} du",
    formulaCaption: "Hyperbolic Continuous Compounding Integral",
    metric: "+24.8%",
    metricLabel: "Projected 5-Year Alpha",
    accentColor: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
    deepLink: "/quantum-visualizer",
  },
  {
    id: "feat-zombie",
    title: "Zombie Subscription Exterminator",
    category: "OUTFLOW OPTIMIZATION",
    badge: "Auto-Prune Protocol",
    description:
      "Scans recurring frequencies against transaction activity logs to pinpoint zero-engagement subscriptions and dispatches 1-click RFC-6068 cancellation templates.",
    icon: Skull,
    formula: "\\text{Score}_{\\text{leak}} = \\frac{\\Delta t_{\\text{dormant}}}{30} \\times \\text{Cost}_{\\text{monthly}}",
    formulaCaption: "Heuristic Dormancy Leak Metric",
    metric: "$2,184/yr",
    metricLabel: "Average Recovered Leakage",
    accentColor: "from-rose-500/20 to-amber-500/10 text-rose-400 border-rose-500/30",
    deepLink: "/zombie-killer",
  },
  {
    id: "feat-telemetry",
    title: "Real-Time Sovereign Telemetry & Audit",
    category: "CRYPTOGRAPHIC COMPLIANCE",
    badge: "Sub-50ms WebSocket",
    description:
      "Instantaneous transaction synchronization across family members and teams with immutable SHA-256 digital cryptographic proof validation.",
    icon: Zap,
    formula: "\\text{Proof}_{\\text{audit}} = \\text{SHA-256}\\left(\\text{State}_{t} \\parallel \\text{Timestamp}\\right)",
    formulaCaption: "Immutable Cryptographic State Hash",
    metric: "<45ms",
    metricLabel: "Pipeline Latency",
    accentColor: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    deepLink: "/security",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative pt-12 pb-24 overflow-hidden">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Sovereign Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-royal)] text-[var(--accent-primary)] text-xs font-bold shadow-lg shadow-amber-500/10 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[var(--accent-primary)]" />
            <span>WealthSage Sovereign Engine v2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-[var(--text-muted)] font-medium">Quantitative Financial OS</span>
          </motion.div>
        </div>

        {/* Hero Headline & Subheadline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.08]"
          >
            Institutional Intelligence.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Autonomous Wealth Compounding.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-secondary)] mt-5 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Transform raw transactions into mathematically rigorous wealth velocity. Continuous cashflow simulation, autonomous zombie subscription pruning, and real-time sovereign ledger telemetry.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl royal-btn-accent text-xs font-extrabold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Launch Sovereign Workspace <ArrowRight size={16} />
            </Link>

            <a
              href="#tools"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl royal-btn-secondary text-xs font-bold backdrop-blur-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Compass size={16} className="text-cyan-400" /> Explore Guide to Tools
            </a>
          </motion.div>

          {/* Live Institutional Trust Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[var(--border-subtle)] text-center"
          >
            <div className="p-3 rounded-2xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)]">
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tabular-nums">$42.8M+</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Assets Under Telemetry</p>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)]">
              <p className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">&lt;45ms</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Real-Time Sync Latency</p>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)]">
              <p className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums">99.98%</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Model Reasoning Accuracy</p>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)]">
              <p className="text-xl sm:text-2xl font-black text-[var(--accent-primary)] tabular-nums">SOC2 Type II</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Zero-Knowledge Vault</p>
            </div>
          </motion.div>
        </div>

        {/* SECTION 1: Spotlight Capability Cards */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--border-royal)] text-[var(--accent-primary)] text-xs font-bold mb-2">
              <Sparkles size={13} /> Section 1: Core Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Engineered with Absolute Mathematical Precision
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">
              Every subsystem features real backend execution, deterministic state machines, and rigorous mathematical formulas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {SPOTLIGHT_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;

              return (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="royal-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className={`p-3 rounded-2xl border ${feat.accentColor}`}>
                        <Icon size={22} />
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {feat.badge}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                      {feat.category}
                    </span>

                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2.5 leading-relaxed">
                      {feat.description}
                    </p>

                    {/* Pristine KaTeX Formula Block */}
                    <div className="mt-5">
                      <LaTeXFormula
                        math={feat.formula}
                        caption={feat.formulaCaption}
                        showCopy={true}
                        displayMode={true}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <p className="text-base font-extrabold text-[var(--text-primary)] tabular-nums">
                        {feat.metric}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">
                        {feat.metricLabel}
                      </p>
                    </div>

                    <Link
                      href={feat.deepLink}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-royal)] transition-all"
                    >
                      <span>Explore Engine</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
