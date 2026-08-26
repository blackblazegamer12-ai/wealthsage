"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import EverythingYouNeed from "../components/landing/EverythingYouNeed";
import EchoidToolkit from "../components/landing/EchoidToolkit";
import ComparisonMatrix from "../components/landing/ComparisonMatrix";
import EchoidFooter from "../components/landing/EchoidFooter";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="bg-black text-white font-sans w-full min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen min-h-[640px] overflow-hidden grid grid-rows-[auto_1fr_auto] isolate">
        
        {/* Background Layer (Cinematic AI Video) */}
        <div className="absolute inset-0 -z-10 bg-black pointer-events-none">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4"
            poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center opacity-90"
          ></video>
          
          {/* Dual Gradient Scrim Desktop */}
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(to right, transparent 0%, transparent 45%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.72) 100%), linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.65) 100%)'
          }} />
          {/* Single Gradient Scrim Mobile */}
          <div className="absolute inset-0 md:hidden" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.75) 100%)'
          }} />
        </div>

        {/* ROW 1: NAVBAR */}
        <header className="flex justify-between items-center gap-[32px] px-[clamp(20px,2.4vw,34px)] py-6 z-20">
          <Link href="/" className="flex items-center gap-3 font-sans text-[clamp(18px,1.5vw,24px)] tracking-[0.2em] text-white no-underline leading-none uppercase group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            WEALTHSAGE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-[clamp(24px,3.2vw,62px)]">
            <div className="flex items-center gap-[clamp(20px,2.8vw,56px)] font-mono text-[12px] tracking-[0.18em] uppercase">
              <Link href="#features" className="text-white hover:text-[var(--text-dim)] transition-colors duration-250">Features</Link>
              <Link href="#tools" className="text-white hover:text-[var(--text-dim)] transition-colors duration-250">Tools</Link>
              <Link href="/security" className="text-white hover:text-[var(--text-dim)] transition-colors duration-250">Security</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="font-mono text-[12px] tracking-[0.18em] uppercase px-[24px] py-[14px] text-white transition-all duration-250 hover:text-[var(--text-dim)]">
                DASHBOARD
              </Link>
              {user && (
                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden flex items-center justify-center bg-white/10">
                  <UserButton />
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden relative w-[44px] h-[44px] flex flex-col items-center justify-center gap-1.5 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </header>

        {/* ROW 2: RIGHT ALIGNED FORM BODY */}
        <main className="flex items-center justify-end md:justify-end justify-center px-[var(--gutter)] min-h-0 overflow-y-auto z-10 w-full relative">
          <div className="flex flex-col items-start w-[min(38vw,620px)] min-w-[380px] max-lg:w-[min(70vw,520px)] max-lg:min-w-0 max-md:w-full translate-y-[-5%]">
            
            {/* OVERLINE CHIP */}
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase bg-white/[0.05] border border-white/[0.1] px-4 py-2 leading-none text-white mb-[clamp(28px,3vw,52px)]">
              [ AI WEALTH ENGINE ]
            </div>

            {/* H1 HEADLINE */}
            <h1 className="font-sans font-light text-[clamp(44px,5.2vw,98px)] tracking-tight leading-[0.95] text-white">
              WealthSage
            </h1>

            {/* TAGLINE */}
            <p className="font-mono font-medium uppercase text-[clamp(11px,0.85vw,14px)] tracking-[0.18em] text-white mt-[clamp(16px,2vw,32px)] leading-[1.6]">
              SMART FINANCIAL INTELLIGENCE.<br/>EFFORTLESS WEALTH GROWTH.
            </p>

            {/* FLOATING TELEMETRY HUD */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Financial Telemetry: Active • 99.9% Sync Precision
            </div>

            {/* SUBHEADLINE */}
            <p className="font-sans text-[clamp(13px,0.9vw,16px)] text-white/70 mt-6 leading-relaxed max-w-sm">
              Automate your savings, track every dollar, and simulate long-term compounding — all in one clean, intelligent command center.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-[clamp(48px,5vw,82px)] flex flex-col gap-6 w-full">
              <Link href="/dashboard" className="w-full flex items-center justify-start gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-white hover:text-[var(--text-dim)] transition-colors no-underline">
                <span>LAUNCH DASHBOARD</span>
                <ArrowRight size={14} />
              </Link>
              
              <Link href="#tools" className="w-full flex items-center justify-start gap-3 font-mono text-[12px] uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors no-underline">
                EXPLORE TOOLKIT
              </Link>
            </div>
            
            {/* INVISIBLE SPACER FOR MOBILE */}
            <div className="h-24 md:hidden"></div>
          </div>
        </main>

        <div className="absolute bottom-[clamp(18px,1.7vw,30px)] left-0 w-full flex flex-col items-center justify-center pointer-events-none z-20 gap-6">
          {/* TRUST BAR */}
          <div className="flex items-center justify-center gap-4 text-[9px] sm:text-[10px] font-mono text-white/40 tracking-widest uppercase text-center px-4">
            <span>256-Bit Bank-Grade Encryption</span>
            <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></span>
            <span className="hidden sm:block">Zero Data Selling</span>
            <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></span>
            <span className="hidden sm:block">Instant Automated Reconciliations</span>
          </div>

          <p className="font-sans text-[11px] text-[var(--text-dim)] leading-[1.5] text-center">
             Scroll down to explore features <br/> 
             <span className="inline-block mt-2 animate-bounce">↓</span>
          </p>
        </div>
      </section>

      {/* 2. EVERYTHING YOU NEED GRID (FEATURES) */}
      <EverythingYouNeed />

      {/* 4. TOOLKIT SECTION */}
      <section id="tools">
        <EchoidToolkit />
      </section>

      {/* 5. COMPARISON SECTION */}
      <ComparisonMatrix />

      {/* 6. CTA & FOOTER */}
      <EchoidFooter />
    </div>
  );
}