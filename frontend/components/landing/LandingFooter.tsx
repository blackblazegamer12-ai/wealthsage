"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Code2, ExternalLink, Terminal, CheckCircle2 } from "lucide-react";
import WealthSageLogo from "../WealthSageLogo";

export default function LandingFooter() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-16 pb-12 text-xs text-[var(--text-muted)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[var(--border-subtle)]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <WealthSageLogo className="w-9 h-9 group-hover:scale-105 transition-all" />
              <span className="font-extrabold text-lg text-[var(--text-primary)] tracking-tight">
                WealthSage
              </span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              The sovereign financial intelligence platform. High-velocity cashflow modeling, autonomous leak pruning, and Gemini AI wealth reasoning.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational · SOC2 Type II Certified</span>
            </div>
          </div>

          {/* Nav Col 1: Dedicated Tools */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase text-[11px] tracking-wider mb-3">
              Dedicated Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
                  Sovereign Dashboard
                </Link>
              </li>
              <li>
                <Link href="/quantum-visualizer" className="hover:text-[var(--text-primary)] transition-colors">
                  Quantum Visualizer
                </Link>
              </li>
              <li>
                <Link href="/subsystems" className="hover:text-[var(--text-primary)] transition-colors">
                  Subsystems Architecture
                </Link>
              </li>
              <li>
                <Link href="/notebook" className="hover:text-[var(--text-primary)] transition-colors">
                  Formula Notebook & Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Platform & Security */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase text-[11px] tracking-wider mb-3">
              Engines & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/zombie-killer" className="hover:text-[var(--text-primary)] transition-colors">
                  Zombie Sub Exterminator
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[var(--text-primary)] transition-colors">
                  Cryptographic Security
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[var(--text-primary)] transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
                  Core Capabilities
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Compliance & Tech */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] uppercase text-[11px] tracking-wider mb-3">
              Compliance & Stack
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-muted)]">
              <li>FastAPI 2.0.0 Microkernel</li>
              <li>Next.js 16 App Router</li>
              <li>KaTeX Math Engine</li>
              <li>Google Gemini AI</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} WealthSage Technologies, Inc. All rights reserved. Sovereign Financial Intelligence.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
