"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Skull,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight,
  Database,
  Lock,
  Search,
  FileSpreadsheet
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import RollingNumber from "./RollingNumber";

interface FeatureCardProps {
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  stat: React.ReactNode;
  statLabel: string;
  accent: string;
  badge: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    title: "Predictive Compounding Engine",
    category: "QUANT SIMULATION",
    description: "Simulates forward-looking wealth trajectory using live surplus retention and variable rate models (S&P 500, HYSA, Alpha).",
    icon: TrendingUp,
    stat: <RollingNumber end={18.4} decimals={1} prefix="+" suffix="% APY" />,
    statLabel: "Target Compound Velocity",
    accent: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
    badge: "Monte Carlo",
  },
  {
    title: "Zombie Subscription Exterminator",
    category: "OUTFLOW OPTIMIZATION",
    description: "Detects forgotten subscriptions, uncovers creeping price hikes, and dispatches 1-click RFC-6068 cancellation templates.",
    icon: Skull,
    stat: <RollingNumber end={2184} prefix="₹" suffix="/yr" />,
    statLabel: "Average Recovered Leakage",
    accent: "from-rose-500/20 to-amber-500/10 text-rose-400 border-rose-500/30",
    badge: "Auto-Prune",
  },
  {
    title: "Google Gemini Autonomous Strategist",
    category: "AI QUANT COPILOT",
    description: "Dual-SDK Gemini AI with full CRUD ledger operations, natural language command execution, and LaTeX mathematical clarity.",
    icon: Cpu,
    stat: <RollingNumber end={99.98} decimals={2} suffix="%" />,
    statLabel: "Mathematical Precision",
    accent: "from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30",
    badge: "Dual-SDK Gemini",
  },
  {
    title: "Immutable Security Audit Ledger",
    category: "CRYPTOGRAPHIC COMPLIANCE",
    description: "Every high-privilege action, ledger modification, and token exchange is permanently timestamped with SHA-256 digital signatures.",
    icon: ShieldCheck,
    stat: "Zero-Knowledge",
    statLabel: "Client-Side Isolation",
    accent: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    badge: "SOC2 Type II",
  },
  {
    title: "Real-Time WebSocket Pipelines",
    category: "TELEMETRY SYNCHRONIZATION",
    description: "Instantaneous sub-50ms data synchronization across family members and teams powered by Supabase Realtime WebSocket channels.",
    icon: Zap,
    stat: <RollingNumber end={45} prefix="<" suffix="ms" />,
    statLabel: "Global Pipeline Latency",
    accent: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    badge: "Live Realtime",
  },
  {
    title: "Sub-50ms Multi-Attribute Search",
    category: "INSTANT RETRIEVAL",
    description: "Instant client-side fuzzy searching across thousands of historical transactions, mathematical notes, and goal milestones.",
    icon: Search,
    stat: <RollingNumber end={12} prefix="<" suffix="ms" />,
    statLabel: "Instant Fuzzy Matching",
    accent: "from-yellow-500/20 to-orange-500/10 text-yellow-400 border-yellow-500/30",
    badge: "Cmd+K Engine",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3">
            <Layers size={14} /> Comprehensive Sovereign Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Modular Subsystems Engineered for Absolute Wealth Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No superficial mockups or placeholders. Every subsystem features genuine backend connectivity, strict state machines, and mathematical rigor.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="h-full"
              >
                <SpotlightCard className="h-full rounded-3xl p-6 sm:p-7 bg-[#11131a]/95 border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between relative shadow-xl">
                  {/* Background accent hover glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.02] group-hover:bg-amber-500/[0.04] rounded-full blur-3xl transition-all pointer-events-none" />

                  <div>
                    {/* Top Bar: Icon + Category + Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`p-3 rounded-2xl border ${feat.accent}`}>
                        <Icon size={20} />
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                        {feat.badge}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {feat.category}
                    </span>

                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  {/* Bottom Metric Stat Card */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-base font-extrabold text-white tabular-nums">{feat.stat}</p>
                      <p className="text-[10px] text-slate-400">{feat.statLabel}</p>
                    </div>
                    <span className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 text-slate-400 group-hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
