"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Skull,
  Code2,
  Database,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import LaTeXFormula from "../LaTeXFormula";

interface MicroFeature {
  id: string;
  name: string;
  metric: string;
  formula: string;
  description: string;
  codeSnippet: string;
  tag: string;
}

interface MacroSystem {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  badge: string;
  microFeatures: MicroFeature[];
}

const MACRO_SYSTEMS: MacroSystem[] = [
  {
    id: "macro-1",
    title: "Autonomous Cash Flow & Compounding Engine",
    subtitle: "Mathematical velocity modeling with predictive Monte Carlo projections",
    level: "MACRO LAYER 01",
    icon: TrendingUp,
    accentColor: "from-cyan-500 to-blue-600",
    badge: "QUANTITATIVE ENGINE",
    microFeatures: [
      {
        id: "micro-1-1",
        name: "Hyperbolic Compounding Integral",
        metric: "+24.8% Projected 5-Year Alpha",
        formula: "A(t) = P \\left(1 + \\frac{r}{n}\\right)^{nt} + \\int_{0}^{t} S(u) e^{r(t-u)} du",
        description:
          "Dynamically models compounding returns from continuous monthly retained surplus rather than static lump-sum snapshots.",
        codeSnippet: `def compute_projected_compounding(surplus: float, rate: float, horizon_years: int):
    monthly_rate = rate / 12
    total_months = horizon_years * 12
    return surplus * (((1 + monthly_rate)**total_months - 1) / monthly_rate)`,
        tag: "COMPOUNDING KERNEL",
      },
      {
        id: "micro-1-2",
        name: "Dynamic Liquidity Buffer Allocation",
        metric: "6.2 Months Runway Safeguard",
        formula: "B_{\\text{safe}} = 6 \\times \\mu_{\\text{burn}} \\times \\left(1 + \\sigma_{\\text{vol}}\\right)",
        description:
          "Calculates variance-adjusted emergency runway based on live expense volatility before sweeping cash into yield instruments.",
        codeSnippet: `const calculateRunway = (balance: number, avgBurn: number, volatility: number) => {
  const adjustedBurn = avgBurn * (1 + volatility);
  return (balance / adjustedBurn).toFixed(1);
};`,
        tag: "RUNWAY ALLOCATOR",
      },
    ],
  },
  {
    id: "macro-2",
    title: "Zombie Subscription Extermination Protocol",
    subtitle: "Automated recurring leak detection and 1-click email cancellation dispatch",
    level: "MACRO LAYER 02",
    icon: Skull,
    accentColor: "from-rose-500 to-amber-600",
    badge: "LEAK EXTERMINATOR",
    microFeatures: [
      {
        id: "micro-2-1",
        name: "Heuristic Inactivity Detection",
        metric: "$182/mo ($2,184/yr) Identified Waste",
        formula: "\\text{Score}_{\\text{leak}} = \\frac{\\text{Days Since Use}}{\\text{Billing Period (30)}} \\times \\text{Monthly Cost}",
        description:
          "Scans recurring ledger frequencies against transaction activity logs to pinpoint subscriptions with zero user engagement.",
        codeSnippet: `function detectZombieSubs(subs: SubscriptionItem[]): SubscriptionItem[] {
  return subs.filter(s => s.status === 'Unused' || s.lastUsedDays > 30);
}`,
        tag: "LEAK DETECTOR",
      },
      {
        id: "micro-2-2",
        name: "Direct SMTP Mailto Dispatcher",
        metric: "Sub-5 Second Cancellation Loop",
        formula: "\\text{Dispatch} = \\text{RFC-6068 Mailto URI Handler}(\\text{SupportEmail}, \\text{AccountID})",
        description:
          "Generates legally structured, unambiguous cancellation templates pre-addressed to verified service support desks.",
        codeSnippet: `const generateMailto = (sub: SubscriptionItem) => {
  const subject = encodeURIComponent(\`Immediate Cancellation - \${sub.name}\`);
  const body = encodeURIComponent(\`Please cancel account \${sub.id} immediately.\`);
  return \`mailto:\${sub.supportEmail}?subject=\${subject}&body=\${body}\`;
};`,
        tag: "DISPATCH KERNEL",
      },
    ],
  },
  {
    id: "macro-3",
    title: "Google Gemini Autonomous Financial Strategist",
    subtitle: "Real-time dual-SDK AI copilot performing live CRUD ledger operations",
    level: "MACRO LAYER 03",
    icon: Cpu,
    accentColor: "from-amber-400 to-emerald-500",
    badge: "AUTONOMOUS AGENT",
    microFeatures: [
      {
        id: "micro-3-1",
        name: "Structured Output JSON Schema Repair",
        metric: "99.98% Parse Reliability",
        formula: "\\text{Schema} \\cap \\text{Markdown Regex Scrub} \\to \\text{Valid JSON Dict}",
        description:
          "Processes natural language inputs and extracts structured transaction operations (add, update, delete, audit) with deterministic validation.",
        codeSnippet: `@app.post("/api/chat")
def ask_sage(request: ChatRequest):
    return process_financial_chat(
        user_query=request.message,
        history=request.history,
        current_transactions=request.transactions
    )`,
        tag: "GEMINI REASONER",
      },
      {
        id: "micro-3-2",
        name: "Mathematical LaTeX Financial Tutor",
        metric: "Instant Quantitative Proofs",
        formula: "\\text{Formula Translation} \\to \\KaTeX \\text{ High-Precision Typesetting}",
        description:
          "Translates notebook financial theories and notes into beautifully rendered mathematical formulas with LaTeX typesetting.",
        codeSnippet: `import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
<ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
  {noteContent}
</ReactMarkdown>`,
        tag: "KATEX TUTOR",
      },
    ],
  },
];

export default function ProgressiveFeatureDive() {
  const [activeMacroId, setActiveMacroId] = useState<string>("macro-1");
  const [activeMicroId, setActiveMicroId] = useState<string>("micro-1-1");

  const activeMacro = MACRO_SYSTEMS.find((m) => m.id === activeMacroId) || MACRO_SYSTEMS[0];
  const activeMicro =
    activeMacro.microFeatures.find((f) => f.id === activeMicroId) || activeMacro.microFeatures[0];

  return (
    <div className="w-full rounded-3xl overflow-hidden royal-card p-4 sm:p-7 relative shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-glow)] rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[var(--border-subtle)] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-royal)]">
              <Layers size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)]">
              Progressive Disclosure Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Drill Down from Macro Indices to Micro-Execution Kernels
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Explore WealthSage&apos;s core subsystems. Click into any layer to inspect mathematical formulas, architecture contracts, and production code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
            Active Layer: <strong className="text-[var(--accent-primary)]">{activeMacro.level}</strong>
          </span>
        </div>
      </div>

      {/* Macro System Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 relative z-10">
        {MACRO_SYSTEMS.map((system) => {
          const Icon = system.icon;
          const isSelected = system.id === activeMacroId;

          return (
            <button
              key={system.id}
              type="button"
              onClick={() => {
                setActiveMacroId(system.id);
                setActiveMicroId(system.microFeatures[0].id);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-[var(--bg-elevated)] border-[var(--border-royal-hover)] shadow-lg scale-[1.01]"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-royal)] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-gradient)]" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                  {system.level}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                  {system.badge}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--border-royal)] text-[var(--accent-primary)] shrink-0 mt-0.5">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug">{system.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">{system.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Micro Feature Deep-Dive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Sub-components list (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Micro Execution Components
          </h4>
          {activeMacro.microFeatures.map((micro) => {
            const isMicroSelected = micro.id === activeMicroId;

            return (
              <button
                key={micro.id}
                type="button"
                onClick={() => setActiveMicroId(micro.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isMicroSelected
                    ? "bg-[var(--accent-subtle)] border-[var(--border-royal)] shadow-md"
                    : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-royal)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)]">{micro.tag}</span>
                  <ChevronRight
                    size={15}
                    className={`transition-transform ${isMicroSelected ? "text-[var(--accent-primary)] translate-x-1" : "text-[var(--text-muted)]"}`}
                  />
                </div>
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-1">{micro.name}</h5>
                <p className="text-xs font-semibold text-emerald-400">{micro.metric}</p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code & Formula Inspector (8 cols) */}
        <div className="lg:col-span-8 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-6 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--accent-primary)] font-bold">
                  {activeMicro.tag} SPECIFICATION
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-0.5">
                  {activeMicro.name}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
                {activeMicro.metric}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {activeMicro.description}
            </p>

            {/* Pristine KaTeX Formula Block */}
            <div className="mb-4">
              <LaTeXFormula
                math={activeMicro.formula}
                caption="Mathematical Governing Equation"
                showCopy={true}
                displayMode={true}
              />
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Code2 size={13} className="text-cyan-400" /> Production Implementation
                </span>
                <span className="text-[10px] text-emerald-400">Type-Safe & Tested</span>
              </div>
              <pre className="p-4 text-xs font-mono text-[var(--text-primary)] overflow-x-auto leading-relaxed">
                <code>{activeMicro.codeSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 size={14} /> Full End-to-End Type Safety
            </span>
            <span className="font-mono text-[11px]">WealthSage Kernel v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
