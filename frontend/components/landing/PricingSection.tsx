"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Sliders
} from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [simCapital, setSimCapital] = useState(150000);

  const estimatedAlphaYield = Math.round(simCapital * 0.042); // 4.2% optimized yield

  return (
    <section id="pricing" className="py-20 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles size={14} /> Transparent Sovereign Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Power. Zero Hidden Fees.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Choose the quantitative tier that matches your capital velocity and portfolio scale.
          </p>

          {/* Billing Frequency Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-[#11131a] border border-white/10 mt-8">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isAnnual
                  ? "bg-white/10 text-white shadow-md border border-white/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAnnual
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Annual Billing <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px] text-amber-950 font-black">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Tier 1: Sovereign Free */}
          <div className="p-7 rounded-3xl bg-[#11131a]/95 border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                FREE SANDBOX
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Sovereign Community</h3>
              <p className="text-xs text-slate-400 mt-1">For individuals starting their financial compounding journey.</p>

              <div className="my-6">
                <span className="text-4xl font-black text-white tabular-nums">$0</span>
                <span className="text-xs text-slate-400 font-medium"> / forever</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Unlimited Manual & Sandbox Ledger Logging</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Zombie Subscription Detection (Up to 10 subs)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Basic Compounding Cash Flow Visualizer</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Clerk Multi-Device Session Sync</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full mt-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs text-center border border-white/10 transition-all block"
            >
              Start Free Today
            </Link>
          </div>

          {/* Tier 2: Quant Pro (Featured) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#181b24] to-[#11131a] border-2 border-amber-500/50 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-md">
              MOST POPULAR FOR INDIVIDUALS
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                QUANT PRO EDITION
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Autonomous Strategist</h3>
              <p className="text-xs text-slate-400 mt-1">For quants, engineers, and high-velocity earners.</p>

              <div className="my-6">
                <span className="text-4xl font-black text-white tabular-nums">
                  ${isAnnual ? "19" : "24"}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month {isAnnual && "(billed annually)"}</span>
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0" />
                  <span><strong>Live Plaid Multi-Bank Auto-Sync</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0" />
                  <span><strong>Unlimited Google Gemini 2.5 Briefings</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0" />
                  <span>1-Click Zombie Sub Cancellation Generator</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0" />
                  <span>LaTeX Financial Tutor & Notebook Explanations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0" />
                  <span>Sub-50ms Fuzzy Search & CSV Data Export</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold text-xs text-center shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all block"
            >
              Unlock Quant Pro <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>

          {/* Tier 3: Family Office Syndicate */}
          <div className="p-7 rounded-3xl bg-[#11131a]/95 border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                FAMILY OFFICE / SYNDICATE
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Multi-Vault Syndicate</h3>
              <p className="text-xs text-slate-400 mt-1">For multi-entity portfolios and collaborative budgets.</p>

              <div className="my-6">
                <span className="text-4xl font-black text-white tabular-nums">
                  ${isAnnual ? "54" : "69"}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month {isAnnual && "(billed annually)"}</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  <span>Everything in Quant Pro included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  <span>Supabase Realtime Multi-User WebSocket Channels</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  <span>Immutable SHA-256 Security Audit Trail</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  <span>Dedicated High-Throughput Gemini Endpoints</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check size={16} className="text-cyan-400 shrink-0" />
                  <span>Custom RLS Policy Management</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full mt-8 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs text-center shadow-lg shadow-cyan-600/20 transition-all block"
            >
              Initialize Syndicate
            </Link>
          </div>
        </div>

        {/* Interactive Value Reinforcement & ROI Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#11131a]/95 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Interactive Wealth Alpha Calculator
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Drag to estimate additional yield and recovered waste through automated compounding and zombie sub optimization:
            </p>
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-slate-400">Tracked Liquid Capital:</span>
                <span className="font-bold text-white tabular-nums">${simCapital.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={1000000}
                step={25000}
                value={simCapital}
                onChange={(e) => setSimCapital(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          <div className="text-center md:text-right bg-black/30 p-5 rounded-2xl border border-white/5 min-w-[220px]">
            <p className="text-[11px] font-mono text-slate-400 uppercase">Estimated Annual Wealth Alpha</p>
            <p className="text-3xl font-black text-emerald-400 tabular-nums mt-1">
              +${estimatedAlphaYield.toLocaleString()}/yr
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Exceeds annual Quant Pro cost by over 25x</p>
          </div>
        </div>
      </div>
    </section>
  );
}
