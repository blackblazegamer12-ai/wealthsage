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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Quantitative Analytics & Synthesis
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
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
        {wealthData.length > 0 ? (
          <div className="glass-panel p-6 lg:p-7 rounded-3xl h-[320px] flex flex-col justify-between border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <TrendingUp size={12} style={{ color: 'var(--accent)' }} /> Wealth Trajectory Curve
              </h3>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wealthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-dim)" tickLine={false} axisLine={false} fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="var(--text-dim)" tickLine={false} axisLine={false} fontSize={10} fontFamily="monospace" tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "black",
                      borderColor: "var(--border-royal)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "11px",
                      fontFamily: "monospace"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wealth"
                    stroke="var(--accent)"
                    strokeWidth={3}
                    dot={{ fill: "var(--accent)", r: 4 }}
                    activeDot={{ r: 7, fill: "var(--accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <TrendingUp size={24} className="text-[var(--text-dim)] mb-4 opacity-50" />
            <p className="text-sm font-bold text-white mb-1">No trend data yet</p>
            <p className="text-[10px] font-mono text-[var(--text-dim)]">Add at least 2 months of data to see wealth trajectory.</p>
          </div>
        )}

        {/* Expense Distribution */}
        {expensesByCategory.length > 0 ? (
          <div className="glass-panel p-6 lg:p-7 rounded-3xl h-[320px] flex flex-col justify-between border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <PieIcon size={12} style={{ color: 'var(--accent)' }} /> Capital Outflow Allocation
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
                      backgroundColor: "black",
                      borderColor: "var(--border-royal)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "11px",
                      fontFamily: "monospace"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center relative border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="absolute top-6 left-6 flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--text-dim)] tracking-widest">
              <Sparkles size={12} /> Expense Breakdown
            </div>
            <div className="w-8 h-8 rounded-full border-[3px] border-[var(--text-dim)] border-t-transparent opacity-50 mb-4 mt-6"></div>
            <p className="text-sm font-bold text-white mb-1">No expenses categorized yet</p>
            <p className="text-[10px] font-mono text-[var(--text-dim)]">Add expenses to see your spending breakdown.</p>
          </div>
        )}
      </div>

      {/* Sage Health Score Component */}
      <SageHealthScore 
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        transactionCount={transactionCount}
        subscriptionCount={subscriptionCount}
      />
    </motion.div>
  );
}
