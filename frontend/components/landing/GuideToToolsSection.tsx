"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  LayoutDashboard,
  Activity,
  Layers,
  BookOpen,
  Skull,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sliders,
  Terminal,
  Zap,
} from "lucide-react";

interface ToolPathway {
  id: string;
  title: string;
  badge: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  statusText: string;
  shortcut: string;
  route: string;
  capabilities: string[];
}

const TOOL_PATHWAYS: ToolPathway[] = [
  {
    id: "tool-dashboard",
    title: "Sovereign Dashboard & Analytics Cockpit",
    badge: "CENTRAL COCKPIT",
    category: "WORKSPACE / OVERVIEW",
    description:
      "Consolidated financial cockpit featuring net worth trajectory, cash velocity indices, real-time transaction aggregation, and automated AI briefings.",
    icon: LayoutDashboard,
    accentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    statusText: "LIVE LEDGER",
    shortcut: "Cmd + 1",
    route: "/dashboard?tab=overview",
    capabilities: [
      "Executive Briefing & Health Score",
      "Predictive Cashflow Charting",
      "Transaction CRUD & Bulk Mutations",
    ],
  },
  {
    id: "tool-visualizer",
    title: "Quantum Yield Visualizer",
    badge: "60FPS CANVAS",
    category: "INTERACTIVE SIMULATION",
    description:
      "Parametric multi-harmonic canvas simulating cash velocity, health index harmonics, and continuous compounding curvature in real time with interactive sliders.",
    icon: Activity,
    accentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    statusText: "GPU ACCELERATED",
    shortcut: "Cmd + 2",
    route: "/quantum-visualizer",
    capabilities: [
      "Interactive 60FPS Harmonic Waves",
      "Dynamic Velocity & Density Sliders",
      "Mouse Coordinate Field Warping",
    ],
  },
  {
    id: "tool-subsystems",
    title: "Subsystems Progressive Architecture",
    badge: "QUANT KERNELS",
    category: "SYSTEM CONTRACTS",
    description:
      "Progressive disclosure drill-down from macro financial layers to micro-execution kernels, code implementations, and typed API schemas.",
    icon: Layers,
    accentColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    statusText: "TYPE-SAFE SPEC",
    shortcut: "Cmd + 3",
    route: "/subsystems",
    capabilities: [
      "Macro-to-Micro Architectural Drill-Down",
      "Production Python/TS Code Snippets",
      "Mathematical Governing Specifications",
    ],
  },
  {
    id: "tool-notebook",
    title: "Quant Formula Notebook & AI Tutor",
    badge: "LATEX TUTOR",
    category: "RESEARCH & PROOFS",
    description:
      "LaTeX and Markdown quant research workspace with interactive formula rendering, financial theory notes, and Gemini AI quantitative tutoring.",
    icon: BookOpen,
    accentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    statusText: "KATEX VERIFIED",
    shortcut: "Cmd + 4",
    route: "/notebook",
    capabilities: [
      "Live Markdown & KaTeX Formula Proofs",
      "Google Gemini Quantitative AI Tutor",
      "Persistent Wealth Research Scratchpad",
    ],
  },
  {
    id: "tool-zombie",
    title: "Zombie Subscription Exterminator Protocol",
    badge: "LEAK PRUNER",
    category: "OUTFLOW DEFENSE",
    description:
      "Automated recurring leak detection, dormancy scoring heuristics, price-hike alerts, and 1-click RFC-6068 cancellation email dispatch.",
    icon: Skull,
    accentColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    statusText: "AUTO-PRUNE",
    shortcut: "Cmd + 5",
    route: "/zombie-killer",
    capabilities: [
      "Heuristic Dormancy Waste Scans",
      "1-Click Mailto RFC-6068 Cancellation",
      "Annualized Capital Recovery Tracker",
    ],
  },
  {
    id: "tool-security",
    title: "Cryptographic Security & Audit Vault",
    badge: "SOC2 TYPE II",
    category: "COMPLIANCE & AUDIT",
    description:
      "Immutable SHA-256 digital signature audit ledger, client-side zero-knowledge isolation, NIST FIPS 140-2 compliance, and WebAuthn MFA.",
    icon: ShieldCheck,
    accentColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    statusText: "ZERO-KNOWLEDGE",
    shortcut: "Cmd + 6",
    route: "/security",
    capabilities: [
      "Immutable SHA-256 Audit Trail",
      "256-Bit Envelope Vault Encryption",
      "Clerk Biometric MFA Session Guard",
    ],
  },
];

export default function GuideToToolsSection() {
  return (
    <section id="tools" className="py-24 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] relative scroll-mt-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[var(--accent-glow)] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--border-royal)] text-[var(--accent-primary)] text-xs font-bold mb-3">
            <Compass size={14} /> Section 2: Sovereign Tool Directory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Guide to the Sovereign Tools & Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Direct interactive pathways to WealthSage&apos;s six dedicated execution engines. Click any tool card to launch the dedicated workspace or interactive sandbox.
          </p>
        </div>

        {/* 6 High-Precision Dedicated Tool Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TOOL_PATHWAYS.map((tool, idx) => {
            const Icon = tool.icon;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="royal-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group shadow-xl"
              >
                {/* Accent hover glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top Bar: Icon + Status + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-3 rounded-2xl border ${tool.accentColor}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {tool.shortcut}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-royal)]">
                        {tool.statusText}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                    {tool.category}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] mt-2.5 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                      Core Modules & Capabilities:
                    </p>
                    {tool.capabilities.map((cap) => (
                      <div
                        key={cap}
                        className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                      >
                        <ChevronRight size={13} className="text-[var(--accent-primary)] shrink-0" />
                        <span className="truncate">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Action Button */}
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    href={tool.route}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-royal)] text-xs font-bold text-[var(--text-primary)] transition-all group/btn shadow-sm"
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} className="text-[var(--accent-primary)]" />
                      Launch Dedicated Workspace
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-[var(--text-muted)] group-hover/btn:text-[var(--accent-primary)] group-hover/btn:translate-x-1 transition-all"
                    />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Platform Status Telemetry Banner */}
        <div className="mt-14 p-5 sm:p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)] shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[var(--text-primary)]">All 6 Subsystem Engines Operational</span>
            <span className="hidden sm:inline text-[var(--text-muted)]">· Zero latency buffer loss</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span>FastAPI 2.0 Backend: <strong className="text-emerald-400">Connected</strong></span>
            <span>Clerk Auth: <strong className="text-emerald-400">Active</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
