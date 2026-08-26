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
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

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
    <div className="w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden mb-6 group transition-all border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
                AI Executive Briefing
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest flex items-center gap-1 border" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', borderColor: 'var(--border-subtle)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent)' }} /> Live Telemetry
              </span>
            </div>
            <p className="text-xs mt-1 font-mono text-[var(--text-dim)]">
              Autonomous financial synthesis, predictive velocity, and capital allocation strategy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Download PDF Report Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!briefing || isLoading || isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold transition-all disabled:opacity-40 bg-white/[0.02] text-white border border-white/10 hover:border-white/30"
          >
            <Download size={14} className={isExporting ? "animate-bounce" : ""} />
            {isExporting ? "Rendering PDF..." : "Export PDF Report"}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold transition-all disabled:opacity-50 bg-white/[0.02] text-[var(--text-dim)] border border-white/10 hover:text-white"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} style={isLoading ? { color: 'var(--accent)' } : undefined} />
            {isLoading ? "Synthesizing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-6 py-4 animate-pulse">
          <div className="h-6 rounded-xl w-3/4" style={{ backgroundColor: 'var(--surface-overlay)' }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 rounded-2xl" style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)' }} />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 rounded-lg w-full" style={{ backgroundColor: 'var(--surface-overlay)' }} />
            <div className="h-4 rounded-lg w-5/6" style={{ backgroundColor: 'var(--surface-overlay)' }} />
          </div>
        </div>
      ) : briefing ? (
        /* Rendered Briefing */
        <div className="space-y-6 relative z-10">
          {/* Main Headline */}
          <div className="p-5 rounded-2xl flex items-start gap-4 border" style={{ backgroundColor: 'var(--surface-overlay)', borderColor: 'var(--border-subtle)' }}>
            <div className="p-2 rounded-xl border shrink-0 mt-0.5" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-subtle)', color: 'var(--accent)' }}>
              <Zap size={18} />
            </div>
            <div>
              <p className="text-sm font-bold leading-relaxed text-white">
                {briefing.headline}
              </p>
            </div>
          </div>

          {/* KPI Telemetry Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Wealth Velocity */}
            <div className="p-5 rounded-2xl flex flex-col justify-between border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <TrendingUp size={12} className="text-emerald-400" /> Velocity Index
              </span>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl lg:text-3xl font-extrabold text-white">{score}</span>
                  <span className="text-xs font-mono text-[var(--text-dim)]">/100</span>
                </div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold border ${theme.badge}`}>
                  {tier}
                </span>
              </div>
            </div>

            {/* Monthly Surplus */}
            <div className="p-5 rounded-2xl flex flex-col justify-between border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <DollarSign size={12} className="text-[#06B6D4]" /> Net Surplus
              </span>
              <div className="mt-3">
                <p className="text-2xl lg:text-3xl font-extrabold text-[#06B6D4]">
                  {formatCurrency(briefing.net_monthly_surplus)}
                </p>
                <p className="text-[9px] font-mono tracking-widest uppercase mt-2 text-[var(--text-dim)]">Monthly Retained Cash</p>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="p-5 rounded-2xl flex flex-col justify-between border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <ShieldCheck size={12} style={{ color: 'var(--accent)' }} /> Savings Rate
              </span>
              <div className="mt-3">
                <p className="text-2xl lg:text-3xl font-extrabold" style={{ color: 'var(--accent)' }}>
                  {briefing.savings_rate_pct}
                </p>
                <p className="text-[9px] font-mono tracking-widest uppercase mt-2 text-[var(--text-dim)]">Target: 20%+ optimal</p>
              </div>
            </div>

            {/* Cash Runway */}
            <div className="p-5 rounded-2xl flex flex-col justify-between border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <Clock size={12} className="text-amber-400" /> Cash Runway
              </span>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl lg:text-3xl font-extrabold text-amber-400">
                    {briefing.monthly_runway_months}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-dim)]">mo</span>
                </div>
                <p className="text-[9px] font-mono tracking-widest uppercase mt-2 text-[var(--text-dim)]">Zero-revenue buffer</p>
              </div>
            </div>
          </div>

          {/* Strategic Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Key Observations */}
            <div className="lg:col-span-7 space-y-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-4 text-[var(--text-dim)]">
                Strategic Quant Diagnostics
              </p>
              {briefing.key_insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl border text-xs lg:text-sm text-[var(--text-dim)]"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                  <span className="leading-relaxed font-mono">{insight}</span>
                </div>
              ))}
            </div>

            {/* Right 5 cols: High-Yield Action Callout */}
            <div className="lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)]" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-royal-hover)' }}>
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border mb-4" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', borderColor: 'var(--border-royal)' }}>
                  ⚡ High-Yield Tactical Move
                </span>
                <p className="text-sm font-bold leading-relaxed text-white">
                  {briefing.tactical_action}
                </p>
              </div>

              <button
                type="button"
                onClick={handleActionClick}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl font-bold text-[10px] font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
              >
                {executed ? <Check size={14} /> : <ArrowRight size={14} />}
                {executed ? "Action Dispatched to Copilot!" : "Execute Tactical Move"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-10">
          <p className="text-sm text-[var(--text-dim)] max-w-md mx-auto mb-8 leading-relaxed font-mono">
            Add your income and expenses to receive a personalized AI briefing with spending insights and savings recommendations.
          </p>
          <button
            onClick={() => onExecuteAction && onExecuteAction("Generate")}
            className="px-6 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:border-white/30 transition-all flex items-center gap-2"
          >
            <Sparkles size={14} style={{ color: 'var(--accent)' }} /> Generate My First Briefing
          </button>
        </div>
      )}
    </div>
  );
}
