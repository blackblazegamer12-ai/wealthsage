"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Sparkles, PieChart as PieIcon, TrendingUp, Award } from "lucide-react";
import ExecutiveBriefing, { BriefingData } from "../ExecutiveBriefing";
import PredictiveCashflowChart from "../PredictiveCashflowChart";
import SageHealthScore from "../SageHealthScore";

interface AnalyticsTabProps {
  briefingData: BriefingData | null;
  isBriefingLoading: boolean;
  onRefreshBriefing: () => void;
  onExecuteAction: (actionText: string) => void;
  monthlyIncome: number;
  monthlyExpense: number;
  wealthData: Array<{ month: string; wealth: number }>;
  expensesByCategory: Array<{ name: string; value: number; color: string }>;
  userName?: string;
  transactionCount?: number;
  goalCount?: number;
  subscriptionCount?: number;
}

export default function AnalyticsTab({
  briefingData,
  isBriefingLoading,
  onRefreshBriefing,
  onExecuteAction,
  monthlyIncome,
  monthlyExpense,
  wealthData,
  expensesByCategory,
  userName = "Architect",
  transactionCount = 0,
  goalCount = 0,
  subscriptionCount = 0
}: AnalyticsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
          Telemetry & Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Quantitative Analytics & Synthesis
        </h1>
        <p className="text-slate-400 mt-1.5 text-xs sm:text-sm">
          Deep diagnostic telemetry, predictive compounding projections, and portfolio allocation analytics.
        </p>
      </div>

      {/* AI Executive Briefing */}
      <ExecutiveBriefing
        briefing={briefingData}
        isLoading={isBriefingLoading}
        onRefresh={onRefreshBriefing}
        onExecuteAction={onExecuteAction}
        userName={userName}
        totalIncome={monthlyIncome}
        totalExpense={monthlyExpense}
        transactionCount={transactionCount}
        goalCount={goalCount}
        subscriptionCount={subscriptionCount}
      />

      {/* Predictive Cashflow & Compounding Engine */}
      <PredictiveCashflowChart
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
      />

      {/* Trajectory & Distribution Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wealth Trajectory */}
        <div className="royal-card p-6 lg:p-7 rounded-3xl h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[var(--accent-primary)]" /> Wealth Trajectory Curve
            </h3>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wealthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161824",
                    borderColor: "var(--border-royal)",
                    borderRadius: "16px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wealth"
                  stroke="var(--accent-primary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--accent-primary)", r: 4 }}
                  activeDot={{ r: 7, fill: "var(--accent-primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="royal-card p-6 lg:p-7 rounded-3xl h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <PieIcon size={15} className="text-[#06B6D4]" /> Capital Outflow Allocation
            </h3>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161824",
                    borderColor: "var(--border-royal)",
                    borderRadius: "16px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sage Health Score Component */}
      <SageHealthScore />
    </motion.div>
  );
}
