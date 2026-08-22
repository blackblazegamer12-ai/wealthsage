"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#181b24] via-[#11131a] to-[#08090d] border border-amber-500/30 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span>Ready for Sovereign Wealth Intelligence?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Take Absolute Control of Your Capital Velocity Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 max-w-xl mx-auto leading-relaxed">
            Eliminate wasteful recurring subscriptions, simulate exponential compound projections, and query your ledger with Google Gemini AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Launch Sovereign Workspace Now <ArrowRight size={16} />
            </Link>

            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 transition-all"
            >
              <Lock size={15} className="text-slate-400" /> Sign In to Vault
            </Link>
          </div>

          {/* Footer Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-6 border-t border-white/10 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> Instant Sandbox Setup
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-cyan-400" /> 256-Bit Vault Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> Zero Credit Card Required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
