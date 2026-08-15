"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Plus, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
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
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Goals, Subscriptions & Zombie Killer
        </h1>
        <p className="text-slate-400 mt-1.5 text-sm">
          Track wealth milestones, monitor recurring bills, and dispatch automated cancellation notices.
        </p>
      </div>

      {/* 1. FINANCIAL GOALS & TARGETS */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="text-[var(--accent-primary)]" size={20} /> Financial Goals & Targets
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal, index) => {
            const progress = Math.round(((goal.current || 0) / (goal.target || 1)) * 100);
            const remaining = (goal.target || 0) - (goal.current || 0);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="royal-card rounded-3xl p-6 lg:p-7 flex flex-col items-center text-center relative group"
              >
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 z-10">
                  <button
                    onClick={() => onOpenGoalModal(goal)}
                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 text-slate-300 transition-colors"
                    title="Edit Target"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 bg-red-500/10 rounded-xl hover:bg-red-500/30 text-red-400 transition-colors"
                    title="Delete Target"
                  >
                    🗑️
                  </button>
                </div>

                <div className="mb-4 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-2xl">
                  {goal.icon || "🎯"}
                </div>

                <div className="relative mb-4">
                  <ProgressRing progress={progress} color={goal.color || "var(--accent-primary)"} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{progress}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Funded</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-0.5">{goal.name}</h3>
                <p className="text-xs text-slate-400 mb-4">
                  {formatCurrency(goal.current || 0)} of {formatCurrency(goal.target || 0)}
                </p>

                <div className="w-full space-y-2">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
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
                    <span className="text-slate-400">{formatCurrency(Math.max(remaining, 0))} left</span>
                    <span className="text-[var(--accent-primary)] font-semibold">
                      {progress >= 100 ? "Goal achieved!" : "On Track"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Combined Goal Buffer Card */}
        <div className="mt-6 royal-card rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--border-royal)]">
          <div>
            <h4 className="text-sm font-bold text-white">Aggregated Milestone Velocity</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Total accumulated capital: {formatCurrency(totalGoalSaved)} across {goals.length} wealth targets.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Target</span>
              <p className="text-base font-extrabold text-white">{formatCurrency(totalGoalTarget)}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Ratio</span>
              <p className="text-base font-extrabold text-[var(--accent-primary)]">{combinedRatio}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECURRING SUBSCRIPTIONS RADAR */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="text-[#10B981]" size={20} /> Recurring Commitments Radar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
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

        <div className="royal-card rounded-3xl overflow-hidden divide-y divide-white/[0.06] border border-white/10">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group relative"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md border border-white/10"
                  style={{ backgroundColor: `${sub.color || "#10B981"}20` }}
                >
                  {sub.icon || "💸"}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{sub.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">{sub.cycle || "Monthly"}</span>
                    <span className="text-[10px] text-slate-500">• Due on the {sub.nextDate || "1st"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-white font-extrabold text-base">${Number(sub.amount || 0).toFixed(2)}</p>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onOpenSubModal(sub)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                    title="Edit Bill"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteSub(sub.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400"
                    title="Delete Bill"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ZOMBIE SUBSCRIPTION KILLER */}
      <ZombieSubKiller />
    </motion.div>
  );
}
