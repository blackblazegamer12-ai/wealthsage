"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Fingerprint, Database, Code, CheckCircle2, Server, Eye, FileText, HelpCircle } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-sans text-[clamp(18px,1.5vw,24px)] tracking-[0.2em] text-white no-underline leading-none uppercase">
            ECHOID
          </Link>
          <div className="hidden md:flex items-center gap-10 font-mono text-[11px] tracking-[0.2em] uppercase">
            <Link href="/#features" className="text-[var(--text-dim)] hover:text-white transition-colors duration-250">Features</Link>
            <Link href="/#tools" className="text-[var(--text-dim)] hover:text-white transition-colors duration-250">Tools</Link>
            <Link href="/security" className="text-white transition-colors duration-250">Security</Link>
            <Link href="/dashboard" className="text-[var(--text-dim)] hover:text-white transition-colors duration-250">Dashboard</Link>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 font-mono text-[11px] text-black tracking-[0.2em] uppercase bg-white px-6 py-3 rounded-full hover:bg-[#d4af37] transition-all">
            Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-[var(--gutter)] max-w-[1200px] mx-auto w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-white text-xs font-mono tracking-widest uppercase mb-6">
            <ShieldCheck size={14} className="text-emerald-400" /> System Integrity Validated
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            Absolute Security
          </h1>
          <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed max-w-xl mx-auto">
            Engineered from the ground up to protect sovereign financial data. Zero-knowledge architecture, military-grade encryption, and biometric enforcement.
          </p>
        </div>

        {/* Section 1: 5 Security Features */}
        <div className="mb-32">
          <h2 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.3em] uppercase mb-12 border-b border-white/10 pb-4">
            01 / Infrastructure Pillars
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-8">
              <Lock className="text-white mb-6" size={24} />
              <h3 className="text-xl mb-3">Bank-Grade AES-256</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">All ledger data, voice nodes, and API keys are encrypted at rest and in transit using state-of-the-art envelope encryption.</p>
            </div>
            
            <div className="glass-panel p-8">
              <Fingerprint className="text-[#d4af37] mb-6" size={24} />
              <h3 className="text-xl mb-3">Biometric Enforcement</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">Strict WebAuthn standards enforce FaceID, TouchID, and physical security keys for session initiation.</p>
            </div>

            <div className="glass-panel p-8">
              <Database className="text-emerald-400 mb-6" size={24} />
              <h3 className="text-xl mb-3">Immutable Audit Logs</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">Every mutation to your financial graph is hashed into a cryptographic ledger that cannot be altered or tampered with.</p>
            </div>

            <div className="glass-panel p-8">
              <Eye className="text-cyan-400 mb-6" size={24} />
              <h3 className="text-xl mb-3">Zero-Knowledge Design</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">We cannot see your balances, nor can we decrypt your transactions. Your keys, your data. Absolute privacy.</p>
            </div>

            <div className="glass-panel p-8">
              <Server className="text-red-400 mb-6" size={24} />
              <h3 className="text-xl mb-3">Real-time Threat Detection</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">Automated telemetry flags irregular API usage, scraping attempts, or concurrent login anomalies instantly.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Services Overview */}
        <div className="mb-32">
          <h2 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.3em] uppercase mb-12 border-b border-white/10 pb-4">
            02 / Service Level Agreements
          </h2>
          <div className="glass-panel p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl mb-4">Uptime & Reliability</h3>
                <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-6">Our distributed subsystem architecture ensures 99.99% uptime across all tools, from the Voice Entry parsing engine to the Interactive Wealth Simulator.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-emerald-400">
                    <CheckCircle2 size={12} /> Systems Nominal
                  </div>
                  <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase">Latency: 4.2ms</span>
                </div>
              </div>
              <div className="flex flex-col justify-center border-l border-white/10 pl-12">
                <ul className="flex flex-col gap-4 font-mono text-[11px] text-[var(--text-dim)] uppercase tracking-widest">
                  <li className="flex justify-between"><span>Data Backups</span> <span className="text-white">Hourly</span></li>
                  <li className="flex justify-between"><span>Compute Node</span> <span className="text-white">AWS us-east-1</span></li>
                  <li className="flex justify-between"><span>Plaid Integration</span> <span className="text-white">SOC 2 Type II</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: FAQ & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          
          <div>
            <h2 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.3em] uppercase mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
              <HelpCircle size={14} /> 03 / FAQ
            </h2>
            <div className="flex flex-col gap-6">
              <div className="border-b border-white/5 pb-6">
                <h4 className="text-sm font-bold text-white mb-2">Can ECHOID access my bank credentials?</h4>
                <p className="text-[13px] text-[var(--text-dim)] leading-relaxed">No. We use Plaid to establish read-only connections. We never see, store, or have access to your raw banking credentials.</p>
              </div>
              <div className="border-b border-white/5 pb-6">
                <h4 className="text-sm font-bold text-white mb-2">What happens to my voice data?</h4>
                <p className="text-[13px] text-[var(--text-dim)] leading-relaxed">Audio recordings are ephemeral. They are transcribed locally or via secure TLS pipelines, parsed for intent, and immediately destroyed.</p>
              </div>
              <div className="border-b border-white/5 pb-6">
                <h4 className="text-sm font-bold text-white mb-2">How do I export my ledger?</h4>
                <p className="text-[13px] text-[var(--text-dim)] leading-relaxed">You can export your entire state as a cryptographic JSON or CSV file from the Dashboard settings at any time.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs text-[var(--text-dim)] tracking-[0.3em] uppercase mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
              <FileText size={14} /> 04 / Privacy Policy
            </h2>
            <div className="glass-panel p-8 text-[13px] text-[var(--text-dim)] leading-relaxed">
              <p className="mb-4">
                <strong>Data Minimization:</strong> We collect only what is strictly necessary to run the mathematical and AI models powering your financial dashboard. We do not sell data to third parties.
              </p>
              <p className="mb-4">
                <strong>Third-Party Vendors:</strong> Our AI models run on secured infrastructure. No user financial data is used to train external foundational models.
              </p>
              <p>
                <strong>Right to Erasure:</strong> Initiating an account deletion instantly purges all ledgers, audit logs, and associated identity tokens from our databases irreversibly.
              </p>
            </div>
          </div>
          
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 flex justify-center">
        <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">
          ECHOID SYSTEM VER: 2.1.0 — INITIALIZED
        </p>
      </footer>
    </div>
  );
}
