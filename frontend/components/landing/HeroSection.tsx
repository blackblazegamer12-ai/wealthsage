"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  ChevronRight,
  LineChart
} from "lucide-react";
import ParametricHeroCanvas from "./ParametricHeroCanvas";
import RollingNumber from "./RollingNumber";
import BeamButton from "./BeamButton";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hero Pill Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-cyan-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>WealthSage v2.0 Sovereign Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-normal">Next-Gen Google Gemini Intelligence</span>
          </motion.div>
        </div>

        {/* Hero Headline & Subheadline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
          >
            Institutional Financial Intelligence.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Autonomous Wealth Compounding.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 mt-5 leading-relaxed max-w-2xl mx-auto"
          >
            Transform raw transactions into mathematically rigorous wealth velocity. Continuous cashflow simulation, autonomous zombie subscription pruning, and real-time sovereign ledger telemetry.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full justify-start max-md:justify-center"
          >
            <BeamButton href="/dashboard">
              Initialize Workspace <ChevronRight size={16} className="text-black/80" />
            </BeamButton>

            <a
              href="#visualizer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
            >
              <Zap size={16} className="text-cyan-400" /> Interactive Simulation
            </a>
          </motion.div>

          {/* Live Trust Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-center"
          >
            <div>
              <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
                <RollingNumber end={42.8} decimals={1} prefix="₹" suffix="M+" />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Assets Under Telemetry</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                <RollingNumber end={45} prefix="<" suffix="ms" />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Real-Time Sync Latency</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-cyan-400 tabular-nums">
                <RollingNumber end={99.98} decimals={2} suffix="%" />
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Model Reasoning Accuracy</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">SOC2 Type II</p>
              <p className="text-xs text-slate-400 mt-0.5">Zero-Knowledge Vault</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Parametric Canvas Visualizer */}
        <div id="visualizer" className="mt-6 scroll-mt-24">
          <ParametricHeroCanvas />
        </div>
      </div>
    </section>
  );
}
