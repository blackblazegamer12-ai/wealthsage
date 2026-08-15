"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldAlert,
  Layers,
  Search
} from "lucide-react";
import PlaidLinkButton from "../PlaidLinkButton";
import DemoPresetBar, { DemoPreset } from "../DemoPresetBar";

interface OverviewTabProps {
  userName: string;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactions: any[];
  currentUserId: string;
  activePresetId: string | null;
  onSelectPreset: (preset: DemoPreset) => void;
  onResetPreset: () => void;
  onOpenAddModal: () => void;
  onOpenAuditModal: () => void;
  onOpenGlassAI: () => void;
  onBankConnected: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default function OverviewTab({
  userName,
  currentBalance,
  totalIncome,
  totalExpense,
  transactions,
  currentUserId,
  activePresetId,
  onSelectPreset,
  onResetPreset,
  onOpenAddModal,
  onOpenAuditModal,
  onOpenGlassAI,
  onBankConnected
}: OverviewTabProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredTransactions = transactions.filter((tx) =>
    tx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Judge Persona Selector */}
      <DemoPresetBar
        activePresetId={activePresetId}
        onSelectPreset={onSelectPreset}
        onReset={onResetPreset}
      />

      {/* Hero Welcome Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
            Royal Financial Overview
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Live ledger telemetry, cash velocity metrics, and real-time transaction ledger.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <PlaidLinkButton userId={currentUserId} onBankConnected={onBankConnected} />

          <button
            type="button"
            onClick={onOpenAuditModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/10 text-[var(--accent-primary)] border border-[var(--border-royal)] text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <ShieldAlert size={16} /> Audit
          </button>

          <button
            type="button"
            onClick={onOpenGlassAI}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl royal-card text-white border border-[var(--border-royal)] text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <Sparkles size={16} className="text-[var(--accent-primary)]" /> Glass AI
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl royal-btn-accent text-sm font-bold shadow-lg transition-all hover:scale-[1.02]"
          >
            <Plus size={17} /> Add Record
          </button>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Net Liquidity */}
        <div className="royal-card p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-medium">Total Balance</span>
            <div className="p-2 rounded-xl bg-white/5 text-[var(--accent-primary)] border border-white/10">
              <Wallet size={18} />
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {formatCurrency(currentBalance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <p className="text-xs text-slate-400">Net Retained Liquidity</p>
          </div>
        </div>

        {/* Monthly Inflow */}
        <div className="royal-card p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-medium">Monthly Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
          <div className="flex items-center gap-1 mt-2.5 text-xs text-emerald-400/90 font-medium">
            <ArrowUpRight size={14} /> Incoming Cashflow
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="royal-card p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-medium">Monthly Outflow</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {formatCurrency(totalExpense)}
          </p>
          <div className="flex items-center gap-1 mt-2.5 text-xs text-rose-400/90 font-medium">
            <ArrowDownRight size={14} /> Fixed & Variable Spend
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table Card */}
      <div className="royal-card rounded-3xl overflow-hidden border border-[var(--border-royal)]">
        <div className="px-6 lg:px-8 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Transaction Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {filteredTransactions.length} of {transactions.length} total records displayed
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search description or category..."
              className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent-primary)] transition-all w-56 sm:w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 lg:px-8 py-16 text-center">
              <Layers className="w-8 h-8 mx-auto text-slate-500 mb-2 opacity-50" />
              <p className="text-slate-400 text-sm font-medium">No transactions found.</p>
              <p className="text-slate-500 text-xs mt-1">
                Log a record manually or tell the AI copilot to add an expenditure.
              </p>
            </div>
          ) : (
            filteredTransactions.slice().reverse().map((tx) => (
              <div
                key={tx.id}
                className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      tx.type === "income"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {tx.type === "income" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{tx.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{tx.category}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          tx.type === "income"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-rose-500/15 text-rose-300"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className={`font-bold text-base shrink-0 ${
                    tx.type === "income" ? "text-emerald-400" : "text-slate-200"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
