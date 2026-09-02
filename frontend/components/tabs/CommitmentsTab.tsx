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
import { Target, Plus, CreditCard, MoreHorizontal, Database } from "lucide-react";
import ZombieSubKiller from "../ZombieSubKiller";
import Dropdown from "../Dropdown";

interface CommitmentsTabProps {
  goals: any[];
  subscriptions: any[];
  onOpenGoalModal: (goal?: any) => void;
  onDeleteGoal: (id: string) => void;
  onOpenSubModal: (sub?: any) => void;
  onDeleteSub: (id: string) => void;
  onLoadDemoData: () => void;
  isDemoMode?: boolean;
  onExitDemoMode?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

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
  const progress = Math.round(((goal.current_amount || 0) / (goal.target_amount || 1)) * 100);
  const remaining = (goal.target_amount || 0) - (goal.current_amount || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-panel rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col items-center text-center relative group"
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

      <h3 className="text-sm sm:text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {formatCurrency(goal.current_amount || 0)} of {formatCurrency(goal.target_amount || 0)}
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
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub.billing_cycle || "Monthly"}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>• Due {sub.next_billing_date?.split('T')[0] || "1st"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <p className="font-extrabold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
          ₹{Number(sub.cost || 0).toFixed(2)}
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
  onDeleteSub,
  onLoadDemoData,
  isDemoMode,
  onExitDemoMode
}: CommitmentsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Goals, Subscriptions & Expense Optimizer
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Track wealth milestones, monitor recurring bills, and optimize expenses.
        </p>
      </div>

      {/* Demo Mode Active Banner */}
      {isDemoMode && (
        <div className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-rose-400">Demo Mode Active</h3>
            <p className="text-sm mt-1 text-rose-400/80">
              You are viewing sample data. Mutating actions are disabled to prevent data contamination.
            </p>
          </div>
          <button
            type="button"
            onClick={onExitDemoMode}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-500 transition-all shadow-lg hover:scale-[1.02] whitespace-nowrap"
          >
            Clear Demo Data
          </button>
        </div>
      )}

      {/* Financial Goals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-[var(--accent)]" size={20} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Financial Goals</h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenGoalModal()}
            disabled={isDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-black transition-all shadow-lg hover:scale-[1.02] ${isDemoMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Plus size={14} /> Add Goal
          </button>
        </div>
        
        {goals.length === 0 ? (
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4 text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No goals yet</h3>
            <p className="text-xs max-w-sm mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
              Set your first financial goal — like building an emergency fund or saving for a down payment.
            </p>
            <div className="flex items-center gap-3">
              <Dropdown
                label="Goal Actions"
                icon={<MoreHorizontal size={14} />}
                items={[
                  { id: 'add', label: 'Set Your First Goal', icon: <Plus size={14}/>, onClick: () => onOpenGoalModal() },
                  { id: 'demo', label: 'Load Demo Data', icon: <Database size={14}/>, onClick: onLoadDemoData }
                ]}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {goals.map((goal, i) => (
              <GoalCard key={goal.id} goal={goal} index={i} onEdit={onOpenGoalModal} onDelete={onDeleteGoal} />
            ))}
          </div>
        )}
      </div>

      {/* Recurring Expenses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="text-emerald-400" size={20} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Recurring Expenses</h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenSubModal()}
            disabled={isDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-black transition-all shadow-lg hover:scale-[1.02] ${isDemoMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4 text-emerald-400">
              <CreditCard size={24} />
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No recurring expenses tracked</h3>
            <p className="text-xs max-w-sm mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
              Add your monthly bills, subscriptions, or software costs to monitor your burn rate.
            </p>
            <div className="flex items-center gap-3">
              <Dropdown
                label="Expense Actions"
                icon={<MoreHorizontal size={14} />}
                items={[
                  { id: 'add', label: 'Add Expense', icon: <Plus size={14}/>, onClick: () => onOpenSubModal() },
                  { id: 'demo', label: 'Load Demo Data', icon: <Database size={14}/>, onClick: onLoadDemoData }
                ]}
              />
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl divide-y divide-[var(--border-subtle)] overflow-hidden" style={{ border: '1px solid var(--border-royal)' }}>
            {subscriptions.map((sub) => (
              <SubscriptionRow key={sub.id} sub={sub} onEdit={onOpenSubModal} onDelete={onDeleteSub} />
            ))}
          </div>
        )}
      </div>

      <ZombieSubKiller userSubscriptions={subscriptions} />
    </motion.div>
  );
}
