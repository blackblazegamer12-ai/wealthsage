"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Save, Plus, HelpCircle } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import LaTeXFormula from "../../components/LaTeXFormula";

const PRESET_FORMULAS = [
  {
    title: "Continuous Hyperbolic Compounding",
    tex: "A(t) = P \\left(1 + \\frac{r}{n}\\right)^{nt} + \\int_{0}^{t} S(u) e^{r(t-u)} du",
    notes: "Models compound growth with continuous monthly surplus retention $S(u)$ over investment horizon $t$.",
  },
  {
    title: "Variance-Adjusted Runway Buffer",
    tex: "B_{\\text{safe}} = 6 \\times \\mu_{\\text{burn}} \\times \\left(1 + \\sigma_{\\text{vol}}\\right)",
    notes: "Defines minimum liquidity buffer required before sweeping idle cash into high-yield alpha accounts.",
  },
  {
    title: "Zombie Subscription Inactivity Score",
    tex: "\\text{Score}_{\\text{leak}} = \\frac{\\Delta t_{\\text{dormant}}}{30} \\times \\text{Cost}_{\\text{monthly}}",
    notes: "Heuristic formula flagging recurring expenses with zero customer engagement over 30-day billing cycles.",
  },
  {
    title: "Tax Alpha Arbitrage Yield",
    tex: "\\alpha_{\\text{tax}} = \\sum_{k=1}^{m} \\max(0, \\text{Basis}_k - \\text{Price}_k) \\times \\tau_{\\text{cap}}",
    notes: "Calculates harvested tax offset opportunities across indexed equity holdings.",
  },
];

export default function NotebookPage() {
  const [selectedFormula, setSelectedFormula] = useState(PRESET_FORMULAS[0]);
  const [customTex, setCustomTex] = useState(PRESET_FORMULAS[0].tex);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <BookOpen size={14} /> Mathematical Quantitative Lab
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Quant Formula Notebook & AI Tutor
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Document wealth hypotheses with live LaTeX formulas and consult Google Gemini AI for mathematical proofs and quantitative modeling.
          </p>
        </div>

        {/* Two-Column Interactive Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Preset Formula Theorems (4 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Standard Financial Theorems & Formulas
            </h3>
            {PRESET_FORMULAS.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setSelectedFormula(item);
                  setCustomTex(item.tex);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedFormula.title === item.title
                    ? "bg-[var(--accent-subtle)] border-[var(--border-royal)] shadow-md"
                    : "royal-card hover:border-[var(--border-royal)]"
                }`}
              >
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{item.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{item.notes}</p>
              </button>
            ))}

            <div className="pt-4">
              <Link
                href="/dashboard?tab=notebook"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl royal-btn-accent text-xs font-bold shadow-md"
              >
                <Plus size={15} /> Open Full Notebook in Workspace
              </Link>
            </div>
          </div>

          {/* Right Column: Live LaTeX Visualizer & Proof Sandbox (7 cols) */}
          <div className="lg:col-span-7 royal-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase">
                    LIVE KATEX TYPESETTING PROOF
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                    {selectedFormula.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
                  KaTeX 0.18.3
                </span>
              </div>

              {/* Live Rendered Formula */}
              <div className="my-6">
                <LaTeXFormula
                  math={customTex}
                  caption="Mathematical Governing Formula"
                  showCopy={true}
                  displayMode={true}
                />
              </div>

              {/* Editable LaTeX Source Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Edit LaTeX Source:
                </label>
                <textarea
                  value={customTex}
                  onChange={(e) => setCustomTex(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[var(--border-royal)] resize-none h-24"
                  placeholder="Enter LaTeX formula e.g. A = P(1 + r/n)^{nt}..."
                />
              </div>

              <p className="text-xs text-[var(--text-secondary)] mt-4 leading-relaxed">
                {selectedFormula.notes}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-1 text-xs text-[var(--accent-primary)]">
                <Sparkles size={14} /> Powered by Google Gemini AI Tutor
              </span>
              <Link
                href="/dashboard?tab=notebook"
                className="flex items-center gap-1 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
              >
                <span>Ask AI Tutor for Proof</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
