"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Clock,
  DollarSign,
  PieChart,
  Check,
  Download,
  Crown
} from "lucide-react";
import { exportExecutiveBriefingPdf } from "../lib/pdfGenerator";

export interface BriefingData {
  wealth_velocity_score: number;
  velocity_tier: string;
  monthly_runway_months: number;
  top_leak_category: string;
  savings_rate_pct: string;
  net_monthly_surplus: number;
  headline: string;
  key_insights: string[];
  tactical_action: string;
}

interface ExecutiveBriefingProps {
  briefing: BriefingData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onExecuteAction?: (actionText: string) => void;
  userName?: string;
  totalIncome?: number;
  totalExpense?: number;
  transactionCount?: number;
  goalCount?: number;
  subscriptionCount?: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default function ExecutiveBriefing({
  briefing,
  isLoading,
  onRefresh,
  onExecuteAction,
  userName = "Architect",
  totalIncome = 0,
  totalExpense = 0,
  transactionCount = 0,
  goalCount = 0,
  subscriptionCount = 0
}: ExecutiveBriefingProps) {
  const [executed, setExecuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const score = briefing?.wealth_velocity_score || 75;
  const tier = briefing?.velocity_tier || "Accelerated Growth";

  // Score color helper
  const getScoreTheme = (val: number) => {
    if (val >= 80) return { color: "#10B981", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    if (val >= 60) return { color: "#06B6D4", badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
    if (val >= 40) return { color: "#F59E0B", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    return { color: "#EF4444", badge: "bg-red-500/20 text-red-300 border-red-500/40" };
  };

  const theme = getScoreTheme(score);

  const handleActionClick = () => {
    if (!briefing) return;
    setExecuted(true);
    if (onExecuteAction) onExecuteAction(briefing.tactical_action);
    setTimeout(() => setExecuted(false), 3000);
  };

  const handleExportPdf = () => {
    if (!briefing) return;
    setIsExporting(true);
    try {
      exportExecutiveBriefingPdf({
        userName,
        wealthVelocityScore: score,
        velocityTier: tier,
        monthlyRunwayMonths: briefing.monthly_runway_months,
        savingsRatePct: briefing.savings_rate_pct,
        netMonthlySurplus: briefing.net_monthly_surplus,
        headline: briefing.headline,
        keyInsights: briefing.key_insights,
        tacticalAction: briefing.tactical_action,
        totalIncome,
        totalExpense,
        transactionCount,
        goalCount,
        subscriptionCount
      });
    } catch (e) {
      console.warn("PDF generation error:", e);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="w-full royal-card rounded-3xl p-6 lg:p-8 text-[#F8FAFC] shadow-2xl relative overflow-hidden mb-8 group transition-all border border-[var(--border-royal)]">
      {/* Aurora gradient backlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--theme-aurora-1)] rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[var(--theme-aurora-2)] rounded-full blur-[120px] pointer-events-none opacity-30" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl royal-btn-accent text-black flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                AI Executive Briefing
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-royal)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-ping" /> Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous financial synthesis, predictive velocity, and capital allocation strategy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Download PDF Report Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!briefing || isLoading || isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
            title="Download executive PDF report stamped with royal seal"
          >
            <Download size={14} className={isExporting ? "animate-bounce" : ""} />
            {isExporting ? "Rendering PDF..." : "Export PDF Report"}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-[var(--accent-primary)]" : ""} />
            {isLoading ? "Synthesizing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-6 py-4 animate-pulse">
          <div className="h-6 bg-white/5 rounded-xl w-3/4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-white/5 rounded-2xl border border-white/5" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded-lg w-full" />
            <div className="h-4 bg-white/5 rounded-lg w-5/6" />
          </div>
        </div>
      ) : briefing ? (
        /* Rendered Briefing */
        <div className="space-y-6 relative z-10">
          {/* Main Headline */}
          <div className="p-4 rounded-2xl bg-black/40 border border-[var(--border-royal)] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-glow)] text-[var(--accent-primary)] shrink-0 mt-0.5">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {briefing.headline}
              </p>
            </div>
          </div>

          {/* KPI Telemetry Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Wealth Velocity */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={13} className="text-emerald-400" /> Velocity Index
              </span>
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl lg:text-3xl font-extrabold text-white">{score}</span>
                  <span className="text-xs text-slate-400 font-medium">/100</span>
                </div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>
                  {tier}
                </span>
              </div>
            </div>

            {/* Monthly Surplus */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={13} className="text-[#06B6D4]" /> Net Surplus
              </span>
              <div className="mt-2">
                <p className="text-2xl lg:text-3xl font-extrabold text-[#06B6D4]">
                  {formatCurrency(briefing.net_monthly_surplus)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Monthly Retained Cash</p>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[var(--accent-primary)]" /> Savings Rate
              </span>
              <div className="mt-2">
                <p className="text-2xl lg:text-3xl font-extrabold text-[var(--accent-primary)]">
                  {briefing.savings_rate_pct}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Target: 20%+ optimal</p>
              </div>
            </div>

            {/* Cash Runway */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" /> Cash Runway
              </span>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl lg:text-3xl font-extrabold text-amber-300">
                    {briefing.monthly_runway_months}
                  </span>
                  <span className="text-xs text-slate-400">mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Zero-revenue buffer</p>
              </div>
            </div>
          </div>

          {/* Strategic Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Key Observations */}
            <div className="lg:col-span-7 space-y-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Strategic Quant Diagnostics
              </p>
              {briefing.key_insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-xs lg:text-sm text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-2 shrink-0" />
                  <span className="leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>

            {/* Right 5 cols: High-Yield Action Callout */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-black/40 border border-emerald-500/40 flex flex-col justify-between shadow-lg shadow-emerald-500/5">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30 mb-2">
                  ⚡ High-Yield Tactical Move
                </span>
                <p className="text-xs lg:text-sm text-white font-medium leading-relaxed mt-1">
                  {briefing.tactical_action}
                </p>
              </div>

              <button
                type="button"
                onClick={handleActionClick}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {executed ? <Check size={15} /> : <ArrowRight size={15} />}
                {executed ? "Action Dispatched to Copilot!" : "Execute Tactical Move"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
