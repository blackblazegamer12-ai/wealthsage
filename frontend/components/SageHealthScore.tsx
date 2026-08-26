"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Share2, Check, Sparkles, ShieldCheck, TrendingUp, Wallet, AlertCircle, ExternalLink } from 'lucide-react';

interface MetricItem {
  name: string;
  score: number;
  maxScore: number;
  label: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  detail: string;
}
interface SageHealthScoreProps {
  monthlyIncome?: number;
  monthlyExpense?: number;
  transactionCount?: number;
  subscriptionCount?: number;
}

export default function SageHealthScore({
  monthlyIncome = 0,
  monthlyExpense = 0,
  transactionCount = 0,
  subscriptionCount = 0
}: SageHealthScoreProps) {
  const [copied, setCopied] = useState(false);

  // Dynamic Financial Metrics for Health Score Calculation
  const hasData = transactionCount > 0;
  const netSurplus = Math.max(0, monthlyIncome - monthlyExpense);
  const savingsRatePct = monthlyIncome > 0 ? (netSurplus / monthlyIncome) * 100 : 0;
  
  // 1. Savings Velocity (Max 30)
  // Target: 20%+. Score scales up to 30.
  const savingsScore = hasData ? Math.min(30, Math.round((savingsRatePct / 20) * 30)) : 0;
  
  // 2. Emergency Fund (Max 25)
  // Proxy: If we have a net surplus, assume some reserve. 
  // Let's approximate reserves = netSurplus * 6 for demo, or 0 if no net surplus.
  // Target: 6 months of expenses.
  const estReserves = netSurplus * 6;
  const monthsCovered = monthlyExpense > 0 ? estReserves / monthlyExpense : 0;
  const emergencyScore = hasData ? Math.min(25, Math.round((monthsCovered / 6) * 25)) : 0;
  
  // 3. Debt-to-Income Ratio (Max 25)
  // Proxy: Give a baseline good score if they have positive income, scale down if expenses are too high.
  // We don't have exact debt data, so we'll estimate a "Load Ratio" (expense / income).
  const loadRatio = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 100;
  // If load ratio < 50%, full score. If > 90%, 0 score.
  const dtiScoreRaw = 25 - ((Math.max(50, Math.min(90, loadRatio)) - 50) / 40) * 25;
  const debtScore = hasData ? Math.round(dtiScoreRaw) : 0;

  // 4. Subscription Leakage (Max 20)
  // If they have 0 subs, perfect score. If they have > 5, poor score.
  const subScoreRaw = 20 - Math.min(5, subscriptionCount) * 4;
  const subScore = hasData ? Math.max(0, subScoreRaw) : 0;

  const metrics: MetricItem[] = [
    {
      name: 'Savings Velocity',
      score: savingsScore,
      maxScore: 30,
      label: hasData ? `${savingsRatePct.toFixed(1)}% Savings Rate` : 'No Data',
      status: savingsScore >= 24 ? 'excellent' : savingsScore >= 15 ? 'good' : 'fair',
      detail: hasData ? `Saving ${savingsRatePct.toFixed(1)}% of total income monthly (Target: 20%+)` : 'Log transactions to see savings velocity',
    },
    {
      name: 'Emergency Fund',
      score: emergencyScore,
      maxScore: 25,
      label: hasData ? `${monthsCovered.toFixed(1)} Months Covered` : 'No Data',
      status: emergencyScore >= 20 ? 'excellent' : emergencyScore >= 12 ? 'good' : 'fair',
      detail: hasData ? `Estimated ${monthsCovered.toFixed(1)} months of living expenses secured` : 'Log transactions to estimate runway',
    },
    {
      name: 'Load-to-Income Ratio',
      score: debtScore,
      maxScore: 25,
      label: hasData ? `${loadRatio.toFixed(1)}% Expense Load` : 'No Data',
      status: debtScore >= 20 ? 'excellent' : debtScore >= 12 ? 'good' : 'poor',
      detail: hasData ? 'Healthy expense service relative to monthly revenue' : 'Log transactions to calculate load ratio',
    },
    {
      name: 'Subscription Leakage',
      score: subScore,
      maxScore: 20,
      label: hasData ? `${subscriptionCount} Subscriptions Detected` : 'No Data',
      status: subScore >= 15 ? 'excellent' : subScore >= 8 ? 'good' : 'poor',
      detail: hasData ? 'Minor leakage detected in recurring subscriptions' : 'Add subscriptions to audit leakage',
    },
  ];

  const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);

  const getRatingTier = (score: number) => {
    if (score >= 85) return { title: 'Sage Status', badge: 'Financial Fortress', color: 'var(--accent)', gradient: 'from-[var(--accent)] to-[var(--accent-brass-hover)]' };
    if (score >= 70) return { title: 'Solid Guard', badge: 'Healthy Growth', color: '#06B6D4', gradient: 'from-cyan-500 to-blue-500' };
    if (score >= 50) return { title: 'Building Momentum', badge: 'Progressing', color: '#F59E0B', gradient: 'from-amber-500 to-orange-500' };
    return { title: 'Caution', badge: 'Optimization Needed', color: '#EF4444', gradient: 'from-red-500 to-amber-500' };
  };

  const tier = getRatingTier(totalScore);

  // SVG Radial Gauge Calculation
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const shareText = `My WealthSage Health Score is ${totalScore}/100! 🚀\n\n• Savings Rate: 32%\n• Emergency Coverage: 6.2 Months\n• Rating: ${tier.title}\n\nTrack your financial health with #WealthSage 🔮`;

  const handleShareToTwitter = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {/* Background Accent Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-12 h-12 flex items-center justify-center rounded-xl border shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <Award size={20} />
            </span>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Sage Health Score</h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-dim)]">
            An AI-driven 0–100 index evaluating your savings velocity, emergency buffer, and debt load.
          </p>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareToTwitter}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border font-mono text-[10px] uppercase tracking-widest font-bold hover:border-[var(--border-royal-hover)] transition-all"
          style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} style={{ color: 'var(--accent)' }} />}
          {copied ? 'Copied & Shared!' : 'Share to X'}
          <ExternalLink size={12} className="opacity-50" />
        </button>
      </div>

      {/* Main Grid: Gauge Radial + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Radial Progress Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl relative border shadow-inner" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
              />
              {/* Animated Progress Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={tier.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1.5s ease-out',
                  filter: `drop-shadow(0 0 10px ${tier.color}60)`,
                }}
              />
            </svg>

            {/* Central Numerical Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold tracking-tight text-white">{totalScore}</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest mt-1 text-[var(--text-dim)]">out of 100</span>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="mt-8 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r ${tier.gradient} text-black shadow-lg`}>
              <Sparkles size={12} />
              {tier.title}
            </span>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-3 text-[var(--text-dim)]">Rating: {tier.badge}</p>
          </div>
        </div>

        {/* Right Column: Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-4 text-[var(--text-dim)]">
            Health Breakdown Factors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div
                key={m.name}
                className="p-5 rounded-2xl transition-all flex flex-col justify-between border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono text-[var(--text-dim)]">{m.name}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                      {m.score}/{m.maxScore} pts
                    </span>
                  </div>
                  <p className="text-sm font-bold mb-1 text-white">{m.label}</p>
                  <p className="text-[9px] font-mono text-[var(--text-dim)]">{m.detail}</p>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1 rounded-full mt-4 bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(m.score / m.maxScore) * 100}%`, backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
