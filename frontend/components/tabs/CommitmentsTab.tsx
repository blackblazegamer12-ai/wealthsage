"use client";
/**
 * CommitmentsTab — Goals, Subscriptions & Zombie Sub Killer
 *
 * Optimizations applied:
 * - GoalCard wrapped in React.memo (prevents re-renders when only unrelated state changes)
 * - SubscriptionRow wrapped in React.memo (prevents re-renders for unchanged bills)
 * - Responsive heading text sizes (text-2xl sm:text-3xl lg:text-4xl)
 */
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Target, Plus, CreditCard } from "lucide-react";
import ZombieSubKiller from "../ZombieSubKiller";

interface CommitmentsTabProps {
  goals: any[];
  subscriptions: any[];
  onOpenGoalModal: (goal?: any) => void;
  onDeleteGoal: (id: string) => void;
  onOpenSubModal: (sub?: any) => void;
  onDeleteSub: (id: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

function ProgressRing({ progress, color, size = 128 }: { progress: number; color: string; size?: number }) {
  const radius = 52;
  const stroke = 7;
  const normalized = Math.min(Math.max(progress, 0), 100);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
      />
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

// ─── Memoized GoalCard ────────────────────────────────────────────────────────
// Only re-renders when this goal's data actually changes.
interface GoalCardProps {
  goal: any;
  index: number;
  onEdit: (goal: any) => void;
  onDelete: (id: string) => void;
}

const GoalCard = memo(function GoalCard({ goal, index, onEdit, onDelete }: GoalCardProps) {
  const progress = Math.round(((goal.current || 0) / (goal.target || 1)) * 100);
  const remaining = (goal.target || 0) - (goal.current || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="royal-card rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col items-center text-center relative group"
    >
      {/* Hover Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 z-10">          <button
          onClick={() => onEdit(goal)}
          className="p-2 rounded-xl transition-colors"
          style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-secondary)' }}
          title="Edit Target"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 bg-red-500/10 rounded-xl hover:bg-red-500/30 text-red-400 transition-colors"
          title="Delete Target"
        >
          🗑️
        </button>
      </div>

      <div className="mb-4 p-2.5 rounded-2xl text-2xl" style={{ backgroundColor: 'var(--icon-subtle)', border: '1px solid var(--border-subtle)' }}>
        {goal.icon || "🎯"}
      </div>

      <div className="relative mb-4">
        <ProgressRing progress={progress} color={goal.color || "var(--accent-primary)"} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{progress}%</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Funded</span>
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{goal.name}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {formatCurrency(goal.current || 0)} of {formatCurrency(goal.target || 0)}
      </p>

      <div className="w-full space-y-2">
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: goal.color || "var(--accent-primary)",
              boxShadow: `0 0 8px ${goal.color || "var(--accent-primary)"}80`
            }}
          />
        </div>
        <div className="flex justify-between text-[11px]">
          <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(Math.max(remaining, 0))} left</span>
          <span className="text-[var(--accent-primary)] font-semibold">
            {progress >= 100 ? "Goal achieved!" : "On Track"}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// ─── Memoized SubscriptionRow ─────────────────────────────────────────────────
// Only re-renders when this bill's data changes, not on unrelated state updates.
interface SubRowProps {
  sub: any;
  onEdit: (sub: any) => void;
  onDelete: (id: string) => void;
}

const SubscriptionRow = memo(function SubscriptionRow({ sub, onEdit, onDelete }: SubRowProps) {
  return (
    <div className="p-4 sm:p-5 flex items-center justify-between transition-colors group relative" style={{ '--hover-bg': 'var(--surface-overlay)' } as any} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0"
          style={{ backgroundColor: `${sub.color || "#10B981"}20` }}
        >
          {sub.icon || "💸"}
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>{sub.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub.cycle || "Monthly"}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>• Due {sub.nextDate || "1st"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <p className="font-extrabold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
          ${Number(sub.amount || 0).toFixed(2)}
        </p>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(sub)}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-secondary)' }}
            title="Edit Bill"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400"
            title="Delete Bill"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});


export default function CommitmentsTab({
  goals,
  subscriptions,
  onOpenGoalModal,
  onDeleteGoal,
  onOpenSubModal,
  onDeleteSub
}: CommitmentsTabProps) {
  const totalMonthlySubCost = subscriptions.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + Number(g.current || 0), 0);
  const totalGoalTarget = goals.reduce((sum, g) => sum + Number(g.target || 0), 0);
  const combinedRatio = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
          Strategic Commitments & Targets
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Goals, Subscriptions & Zombie Killer
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Track wealth milestones, monitor recurring bills, and dispatch automated cancellation notices.
        </p>
      </div>

      {/* 1. FINANCIAL GOALS & TARGETS */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Target className="text-[var(--accent-primary)]" size={20} /> Financial Goals & Targets
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {goals.length} active wealth milestones tracked
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenGoalModal()}
            className="royal-btn-accent px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus size={15} /> + Add Target
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onEdit={onOpenGoalModal}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>

        {/* Combined Goal Buffer Card */}
        <div className="mt-6 royal-card rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--border-royal)]">
          <div>
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Aggregated Milestone Velocity</h4>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Total accumulated capital: {formatCurrency(totalGoalSaved)} across {goals.length} wealth targets.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Target</span>
              <p className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalGoalTarget)}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Overall Ratio</span>
              <p className="text-base font-extrabold text-[var(--accent-primary)]">{combinedRatio}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECURRING SUBSCRIPTIONS RADAR */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CreditCard className="text-[#10B981]" size={20} /> Recurring Commitments Radar
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              ${totalMonthlySubCost.toFixed(2)}/mo total automated outflow ({subscriptions.length} active bills)
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenSubModal()}
            className="px-4 py-2.5 rounded-2xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus size={15} /> + Add Bill
          </button>
        </div>

        <div className="royal-card rounded-3xl overflow-hidden divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {subscriptions.map((sub) => (
            <SubscriptionRow
              key={sub.id}
              sub={sub}
              onEdit={onOpenSubModal}
              onDelete={onDeleteSub}
            />
          ))}
        </div>
      </div>

      {/* 3. ZOMBIE SUBSCRIPTION KILLER */}
      <ZombieSubKiller />
    </motion.div>
  );
}
