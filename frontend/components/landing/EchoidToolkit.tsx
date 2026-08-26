"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, TrendingUp, BookOpen, ArrowRight, ChevronRight, Activity, Shield, Eye } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

export default function EchoidToolkit() {
  return (
    <section className="relative w-full bg-black py-32 px-[var(--gutter)] flex flex-col items-center border-t border-[var(--line)]">
      
      {/* Header */}
      <div className="text-center mb-24 flex flex-col items-center">
        <h2 className="font-sans font-light text-5xl md:text-7xl text-white mb-4 tracking-tight">
          Your Financial Toolkit
        </h2>
        <p className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase tracking-[0.2em] max-w-xl">
          Click any tool card to open that workspace. Each tool works with your real financial data.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1400px]">
        
        {/* Card 1: Dashboard */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <LayoutDashboard size={20} className="text-[#d4af37]" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-12 -right-8 w-48 h-32 opacity-10 pointer-events-none flex items-end gap-1.5 px-4 blur-[1px]">
            <div className="w-4 h-12 bg-white/40 rounded-t-sm" />
            <div className="w-4 h-16 bg-white/40 rounded-t-sm" />
            <div className="w-4 h-10 bg-white/40 rounded-t-sm" />
            <div className="w-4 h-24 bg-[#d4af37] shadow-[0_0_15px_#d4af37] rounded-t-sm" />
            <div className="w-4 h-20 bg-white/40 rounded-t-sm" />
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            Financial Dashboard
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Your financial command center with net worth tracking, cash flow charts, and AI-powered insights.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> Income & Expense Tracking</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> Predictive Cashflow Charts</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> AI Financial Briefings</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><LayoutDashboard size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

        {/* Card 2: Visualizer */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <TrendingUp size={20} className="text-cyan-400" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-1/4 -right-4 w-56 h-32 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              <path d="M0 50 Q 25 40 50 25 T 100 5" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <path d="M0 50 Q 30 45 60 40 T 100 35" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" strokeDasharray="2 2"/>
            </svg>
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            Interactive Wealth Growth Visualizer
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Interactive wealth growth visualizer with real-time charts. Drag the sliders to see how savings rate and return affect your financial future.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-cyan-400" /> Interactive Wealth Growth Waves</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-cyan-400" /> Adjustable Savings & Return Sliders</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-cyan-400" /> Real-Time Visual Feedback</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><TrendingUp size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

        {/* Card 3: Notes & AI Tutor */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <BookOpen size={20} className="text-emerald-400" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-8 right-0 rotate-12 w-48 opacity-20 pointer-events-none">
            <pre className="text-[7px] font-mono leading-relaxed text-emerald-400 bg-white/5 p-3 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <code>
                # Yield Formula{"\n"}
                $A = P(1 + r/n)^{"{nt}"}${"\n"}
                {"\n"}
                &gt; AI Tutor: Compounding{"\n"}
                velocity scales...
              </code>
            </pre>
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            Finance Notes & AI Tutor
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Take financial notes with rich formatting, or ask the AI tutor to explain concepts step by step.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-400" /> Rich Markdown Notes</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-400" /> AI Tutor Explanations</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-emerald-400" /> Persistent Research Scratchpad</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><BookOpen size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

        {/* Card 4: Subscriptions */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <Activity size={20} className="text-[#d4af37]" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-10 -right-6 rotate-6 w-52 opacity-30 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
               <div className="w-6 h-6 rounded bg-red-600/20 text-red-500 flex flex-col items-center justify-center font-bold text-[8px]">N</div>
               <div>
                 <p className="text-[9px] text-white font-bold leading-tight">Netflix Premium</p>
                 <p className="text-[7px] text-[#d4af37] font-mono tracking-widest uppercase mt-0.5">Auto-Audit: Ready</p>
               </div>
            </div>
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            Zombie Subs & Commitments
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Finds forgotten subscriptions, spots creeping price hikes, and lets you cancel them with one click.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> Find & Cancel Unused Subscriptions</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> 1-Click Auto-Cancel</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#d4af37]" /> See How Much You Save Per Year</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><Activity size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

        {/* Card 5: Security */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <Shield size={20} className="text-red-400" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-12 -right-4 rotate-[-10deg] w-40 opacity-20 pointer-events-none">
            <div className="bg-black/60 border border-red-500/30 rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(248,113,113,0.3)]">
               <Shield size={12} className="text-red-400" />
               <p className="text-[8px] font-mono text-red-300 tracking-widest uppercase">SHA-256 Verified</p>
            </div>
            <p className="text-[6px] font-mono text-white/30 text-center mt-1 break-all">
              0x9f86d081884c7d659a2fe...
            </p>
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            Immutable Audit Log
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Secure audit trail with encrypted signatures and biometric login to keep your data safe.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-red-400" /> Tamper-Proof Activity Log</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-red-400" /> Bank-Grade Encryption</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-red-400" /> Face ID & Fingerprint Login</li>
            </ul>
          </div>
          
          <Link href="/security" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><Shield size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

        {/* Card 6: Transparency */}
        <SpotlightCard className="glass-panel p-8 md:p-10 flex flex-col group h-full relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8 relative z-10">
            <Eye size={20} className="text-blue-400" />
          </div>
          
          {/* Background Micro-Visual */}
          <div className="absolute top-10 right-0 w-44 h-32 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
              <circle cx="20" cy="50" r="4" fill="#60a5fa" />
              <circle cx="50" cy="20" r="4" fill="#60a5fa" />
              <circle cx="50" cy="80" r="4" fill="#60a5fa" />
              <circle cx="80" cy="50" r="4" fill="#60a5fa" />
              <line x1="24" y1="50" x2="46" y2="24" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="24" y1="50" x2="46" y2="76" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="54" y1="24" x2="76" y2="50" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="54" y1="76" x2="76" y2="50" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>

          <h3 className="font-sans text-2xl text-white mb-4 relative z-10">
            System Transparency
          </h3>
          
          <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed mb-8 flex-1">
            Explore how WealthSage works under the hood — from high-level features down to the code.
          </p>
          
          <div className="mb-10">
            <h4 className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase mb-4">KEY FEATURES:</h4>
            <ul className="flex flex-col gap-3 font-sans text-[13px] text-white/80">
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> Feature Walkthrough</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> See the Code & Design</li>
              <li className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-400" /> How Each Tool Works</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="mt-auto flex items-center justify-between font-mono text-xs text-[var(--text-dim)] tracking-[0.15em] uppercase border border-[var(--line)] rounded-xl p-4 hover:text-white hover:border-white/30 transition-all duration-300">
            <span className="flex items-center gap-2"><Eye size={14} /> Open Tool</span>
            <ArrowRight size={16} />
          </Link>
        </SpotlightCard>

      </div>
    </section>
  );
}
