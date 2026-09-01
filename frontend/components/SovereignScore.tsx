"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { calculateSovereignScore, type ScoreTier } from "../lib/sovereignScore";

const TIER_EMOJIS: Record<ScoreTier, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "💎",
  Sovereign: "👑",
};

interface SovereignScoreProps {
  transactions: any[];
  goals: any[];
  subscriptions: any[];
}

function ScoreArc({ score, color }: { score: number; color: string }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 1000) * circumference;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
      {/* Background circle */}
      <circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Score arc */}
      <motion.circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - progress }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
          filter: `drop-shadow(0 0 12px ${color}40)`,
        }}
      />
      {/* Center text */}
      <text x="100" y="88" textAnchor="middle" fill="white" fontSize="36" fontWeight="800" fontFamily="monospace">
        {score}
      </text>
      <text x="100" y="112" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="600" fontFamily="monospace" letterSpacing="3" style={{ textTransform: 'uppercase' }}>
        / 1000
      </text>
    </svg>
  );
}

function BreakdownBar({
  label,
  icon: Icon,
  score,
  max,
  color,
  delay,
}: {
  label: string;
  icon: React.ElementType;
  score: number;
  max: number;
  color: string;
  delay: number;
}) {
  const pct = Math.round((score / max) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="flex items-center gap-2 text-[var(--text-muted)]">
          <Icon size={12} style={{ color }} /> {label}
        </span>
        <span className="font-bold text-white">{score}<span className="text-[var(--text-dim)]">/{max}</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function SovereignScore({ transactions, goals, subscriptions }: SovereignScoreProps) {
  const result = useMemo(
    () => calculateSovereignScore(transactions, goals, subscriptions),
    [transactions, goals, subscriptions]
  );

  const { total, breakdown, tier, tierColor, percentile } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel rounded-3xl p-6 lg:p-8 border relative overflow-hidden"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[120px] pointer-events-none opacity-10"
        style={{ backgroundColor: tierColor }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Shield size={16} style={{ color: tierColor }} />
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Sovereign Financial Score
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Score Gauge */}
        <div className="flex flex-col items-center gap-3">
          <ScoreArc score={total} color={tierColor} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{
              borderColor: tierColor,
              backgroundColor: `${tierColor}15`,
            }}
          >
            <span className="text-sm">{TIER_EMOJIS[tier]}</span>
            <span className="text-xs font-bold font-mono tracking-widest" style={{ color: tierColor }}>
              {tier.toUpperCase()}
            </span>
          </motion.div>
          <p className="text-[10px] font-mono text-[var(--text-dim)]">
            Top {100 - percentile}% of peers
          </p>
        </div>

        {/* Right: Breakdown */}
        <div className="flex-1 w-full space-y-4">
          <BreakdownBar label="Savings Rate" icon={TrendingUp} score={breakdown.savingsRate} max={250} color="#10B981" delay={0.2} />
          <BreakdownBar label="Leak Prevention" icon={Shield} score={breakdown.leakPrevention} max={200} color="#F59E0B" delay={0.35} />
          <BreakdownBar label="Goal Progress" icon={Target} score={breakdown.goalProgress} max={250} color="#8B5CF6" delay={0.5} />
          <BreakdownBar label="Compound Trajectory" icon={Zap} score={breakdown.compoundTrajectory} max={200} color="#06B6D4" delay={0.65} />
          <BreakdownBar label="Budget Discipline" icon={BarChart3} score={breakdown.budgetDiscipline} max={100} color="#EC4899" delay={0.8} />
        </div>
      </div>
    </motion.div>
  );
}
