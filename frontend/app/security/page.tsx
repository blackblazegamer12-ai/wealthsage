"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileCheck2, Server, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import LaTeXFormula from "../../components/LaTeXFormula";

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck size={14} /> Institutional Trust & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Cryptographic Integrity & Zero-Knowledge Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Built from the ground up for high-net-worth quants, family offices, and developers who demand mathematically verified security and absolute vault isolation.
          </p>
        </div>

        {/* Mathematical Cryptographic Proof Formula */}
        <div className="mb-10 royal-card p-6 sm:p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <FileCheck2 size={18} className="text-cyan-400" /> Immutable SHA-256 Audit Signature
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Every transaction mutation, ledger reset, and token exchange produces an unforgeable cryptographic state digest:
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[280px]">
              <LaTeXFormula
                math="\text{Proof}_{\text{audit}} = \text{SHA-256}\left(\text{Tx}_{\text{state}} \parallel \text{User}_{\text{ID}} \parallel \text{Timestamp}\right)"
                showCopy={true}
                displayMode={true}
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Institutional Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pillar 1 */}
          <div className="royal-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
                <Lock size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">256-Bit Vault Isolation</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Bank credentials and sensitive tokens are encrypted via envelope encryption with zero plain-text storage.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-emerald-400 font-mono">
              <span>NIST FIPS 140-2</span>
              <span>COMPLIANT</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="royal-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mb-4">
                <FileCheck2 size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">Immutable Audit Trail</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Every ledger reset, bulk mutation, and export creates an immutable SHA-256 digital cryptographic proof.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-cyan-400 font-mono">
              <span>SHA-256 Signatures</span>
              <span>VERIFIED</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="royal-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
                <Server size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">Dual-SDK AI Determinism</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                AI requests utilize strict JSON schemas, automatic markdown regex scrubbing, and offline fallback engines.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-amber-400 font-mono">
              <span>Deterministic JSON</span>
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="royal-card p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4">
                <KeyRound size={20} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">Clerk WebAuthn MFA</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Enterprise session management with biometric WebAuthn, OAuth providers, and automated token refresh cycles.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-purple-400 font-mono">
              <span>Clerk Auth Guard</span>
              <span>SECURED</span>
            </div>
          </div>
        </div>

        {/* Security Audit Telemetry Banner */}
        <div className="royal-card p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <span className="text-[var(--text-primary)] font-bold">Automated Security Audit Passed</span>
              <p className="text-xs text-[var(--text-muted)]">Zero critical vulnerabilities detected across API boundaries and client session tokens.</p>
            </div>
          </div>

          <Link
            href="/dashboard?tab=settings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl royal-btn-accent text-xs font-bold shadow-md"
          >
            Inspect Audit Logs in Workspace <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
