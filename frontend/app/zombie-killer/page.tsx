"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Skull, ArrowRight, CheckCircle2, Mail, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import LaTeXFormula from "../../components/LaTeXFormula";

const SAMPLE_ZOMBIES = [
  {
    id: "sub-1",
    name: "Enterprise Cloud GPU Cluster",
    monthlyCost: 89.0,
    daysDormant: 48,
    leakScore: 142.4,
    supportEmail: "billing@cloudgpu.example.com",
    status: "CRITICAL LEAK",
  },
  {
    id: "sub-2",
    name: "Legacy Creative Suite Pro",
    monthlyCost: 54.99,
    daysDormant: 36,
    leakScore: 65.98,
    supportEmail: "cancellations@adobe-fake.example.com",
    status: "DORMANT",
  },
  {
    id: "sub-3",
    name: "Premium Gym & Spa Membership",
    monthlyCost: 65.0,
    daysDormant: 62,
    leakScore: 134.33,
    supportEmail: "members@equinox-fake.example.com",
    status: "CRITICAL LEAK",
  },
];

export default function ZombieKillerPage() {
  const [selectedSub, setSelectedSub] = useState(SAMPLE_ZOMBIES[0]);
  const [cancellationSent, setCancellationSent] = useState<string | null>(null);

  const handleCancel = (sub: typeof SAMPLE_ZOMBIES[0]) => {
    const subject = encodeURIComponent(`Immediate Cancellation Request - Account #${sub.id}`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease cancel my recurring subscription for "${sub.name}" effective immediately under RFC-6068 guidelines.\n\nThank you,\nAccount Holder`
    );
    window.open(`mailto:${sub.supportEmail}?subject=${subject}&body=${body}`, "_blank");
    setCancellationSent(sub.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-3">
            <Skull size={14} /> Automated Outflow Defense
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            Zombie Subscription Exterminator Protocol
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            Eliminate recurring financial leakage. Scans your transaction frequencies against activity logs to uncover creeping fees and generate 1-click RFC-6068 legal cancellation notices.
          </p>
        </div>

        {/* Heuristic Formula Banner */}
        <div className="mb-10 royal-card p-6 sm:p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Zap size={18} className="text-rose-400" /> Heuristic Dormancy Scoring Formula
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The exterminator scores subscriptions based on days since last user engagement, factoring monthly cost weight and price hikes:
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[280px]">
              <LaTeXFormula
                math="\text{Score}_{\text{leak}} = \frac{\Delta t_{\text{dormant}}}{30} \times \text{Cost}_{\text{monthly}}"
                showCopy={true}
                displayMode={true}
              />
            </div>
          </div>
        </div>

        {/* Interactive Zombie Scanner Table */}
        <div className="royal-card rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Identified Zombie Subscriptions (Demo Sandbox)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Average WealthSage user recovers <strong>$2,184/yr</strong> in forgotten recurring charges.
              </p>
            </div>
            <Link
              href="/dashboard?tab=commitments"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl royal-btn-accent text-xs font-bold shadow-md"
            >
              Scan Real Plaid Bank Feeds <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {SAMPLE_ZOMBIES.map((sub) => (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-royal)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{sub.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                    Dormant: <strong>{sub.daysDormant} days</strong> · Support: {sub.supportEmail}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-base font-extrabold text-[var(--text-primary)] tabular-nums">
                      ${sub.monthlyCost.toFixed(2)}/mo
                    </p>
                    <p className="text-[10px] text-rose-400 font-bold">
                      -${(sub.monthlyCost * 12).toFixed(0)}/yr leak
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCancel(sub)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>{cancellationSent === sub.id ? "Dispatched!" : "Dispatch 1-Click Cancel"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
