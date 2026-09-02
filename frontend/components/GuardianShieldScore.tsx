"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface GuardianShieldScoreProps {
  transactions: Record<string, unknown>[];
  upiMandates: { id: string; status: string; isDarkPattern?: boolean }[];
  paymentRequests: { id: string; status: string }[];
}

function getScoreTier(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Secure", color: "#10b981", bg: "rgba(16,185,129,0.12)" };
  if (score >= 50) return { label: "Review Needed", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" };
  return { label: "At Risk", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
}

export default function GuardianShieldScore({ transactions, upiMandates, paymentRequests }: GuardianShieldScoreProps) {
  const { score, tier, metrics } = useMemo(() => {
    const flaggedTxs = transactions.filter((t) => (t as Record<string, unknown>).status === "flagged");
    const childTxs = transactions.filter((t) => (t as Record<string, unknown>).actor === "child");
    const reviewedMandates = upiMandates.filter((m) => m.status === "revoked").length;
    const totalMandates = upiMandates.length || 1;
    const pendingRequests = paymentRequests.filter((r) => r.status === "pending").length;
    const totalRequests = paymentRequests.length || 1;

    // Score calculation (higher = safer)
    let s = 100;
    // Deduct for unresolved flagged transactions
    s -= Math.min(30, flaggedTxs.length * 8);
    // Deduct for unreviewed dark-pattern mandates
    const unreviewedDP = upiMandates.filter((m) => m.isDarkPattern && m.status === "active").length;
    s -= Math.min(25, unreviewedDP * 12);
    // Deduct for pending payment requests
    s -= Math.min(20, pendingRequests * 5);
    // Bonus for reviewed mandates
    s += Math.min(10, (reviewedMandates / totalMandates) * 10);
    s = Math.max(0, Math.min(100, Math.round(s)));

    return {
      score: s,
      tier: getScoreTier(s),
      metrics: {
        flagged: flaggedTxs.length,
        childTotal: childTxs.length,
        pendingApprovals: pendingRequests,
        mandatesReviewed: reviewedMandates,
        mandatesTotal: upiMandates.length,
      },
    };
  }, [transactions, upiMandates, paymentRequests]);

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border p-8 shadow-2xl relative overflow-hidden"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", borderColor: "var(--border-subtle)", backdropFilter: "blur(12px)" }}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-20 blur-[80px] mix-blend-screen pointer-events-none" style={{ backgroundColor: tier.color }} />
      
      <div className="flex items-center gap-10 flex-wrap relative z-10">
        {/* Score Gauge */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={tier.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color: tier.color }}>{score}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>SHIELD</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} style={{ color: tier.color }} />
            <span className="text-sm font-bold" style={{ color: tier.color }}>{tier.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricPill icon={<AlertTriangle size={12} />} label="Flagged" value={metrics.flagged} color="#ef4444" />
            <MetricPill icon={<Clock size={12} />} label="Pending" value={metrics.pendingApprovals} color="#f59e0b" />
            <MetricPill icon={<CheckCircle size={12} />} label="Mandates Reviewed" value={`${metrics.mandatesReviewed}/${metrics.mandatesTotal}`} color="#10b981" />
            <MetricPill icon={<Shield size={12} />} label="Child Txns" value={metrics.childTotal} color="#8b5cf6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl px-4 py-3 border relative overflow-hidden group" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-overlay)" }}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: color }} />
      
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>{label}</p>
      </div>
      <p className="text-2xl font-black tabular-nums tracking-tight" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}
