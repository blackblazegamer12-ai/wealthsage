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

export default function SageHealthScore() {
  const [copied, setCopied] = useState(false);

  // Mock Financial Metrics for Health Score Calculation
  const metrics: MetricItem[] = [
    {
      name: 'Savings Velocity',
      score: 28,
      maxScore: 30,
      label: '32% Savings Rate',
      status: 'excellent',
      detail: 'Saving 32% of total income monthly (Target: 20%+)',
    },
    {
      name: 'Emergency Fund',
      score: 25,
      maxScore: 25,
      label: '6.2 Months Covered',
      status: 'excellent',
      detail: 'Full 6 months of living expenses secured',
    },
    {
      name: 'Debt-to-Income Ratio',
      score: 18,
      maxScore: 25,
      label: '12.4% (Low Risk)',
      status: 'good',
      detail: 'Healthy debt service relative to monthly revenue',
    },
    {
      name: 'Subscription Leakage',
      score: 14,
      maxScore: 20,
      label: '1 Zombie Sub Detected',
      status: 'fair',
      detail: 'Minor leakage detected in recurring subscriptions',
    },
  ];

  const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);

  const getRatingTier = (score: number) => {
    if (score >= 85) return { title: 'Sage Status 🔮', badge: 'Financial Fortress', color: '#10B981', gradient: 'from-emerald-500 to-cyan-500' };
    if (score >= 70) return { title: 'Solid Guard 🛡️', badge: 'Healthy Growth', color: '#06B6D4', gradient: 'from-cyan-500 to-purple-500' };
    if (score >= 50) return { title: 'Building Momentum 📈', badge: 'Progressing', color: '#F59E0B', gradient: 'from-amber-500 to-orange-500' };
    return { title: 'Caution ⚠️', badge: 'Optimization Needed', color: '#EF4444', gradient: 'from-red-500 to-amber-500' };
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
    <div className="w-full bg-[#161824]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 lg:p-7 text-[#F8FAFC] shadow-2xl relative overflow-hidden">
      {/* Background Accent Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#06B6D4]/20 text-[#10B981] border border-[#10B981]/30">
              <Award size={22} />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sage Health Score</h2>
          </div>
          <p className="text-sm text-[#94A3B8]">
            An AI-driven 0–100 index evaluating your savings velocity, emergency buffer, and debt load.
          </p>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareToTwitter}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black font-bold text-xs tracking-wide shadow-lg shadow-[#06B6D4]/25 hover:shadow-[#06B6D4]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? 'Copied & Shared!' : 'Share to X / Twitter'}
          <ExternalLink size={14} className="opacity-80" />
        </button>
      </div>

      {/* Main Grid: Gauge Radial + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Radial Progress Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-black/20 rounded-3xl border border-white/5 relative">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
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
                  filter: `drop-shadow(0 0 12px ${tier.color}80)`,
                }}
              />
            </svg>

            {/* Central Numerical Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black tracking-tight text-white">{totalScore}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">out of 100</span>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="mt-6 text-center">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${tier.gradient} text-white shadow-lg`}>
              <Sparkles size={14} />
              {tier.title}
            </span>
            <p className="text-xs text-slate-400 mt-2 font-medium">Rating: {tier.badge}</p>
          </div>
        </div>

        {/* Right Column: Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Health Breakdown Factors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div
                key={m.name}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-slate-300">{m.name}</span>
                    <span className="text-xs font-bold text-[#10B981]">
                      {m.score}/{m.maxScore} pts
                    </span>
                  </div>
                  <p className="text-base font-bold text-white mb-1">{m.label}</p>
                  <p className="text-[11px] text-slate-400 leading-snug">{m.detail}</p>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#06B6D4]"
                    style={{ width: `${(m.score / m.maxScore) * 100}%` }}
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
