"use client";
/**
 * OverviewTab — Performance-optimized Overview Dashboard
 *
 * Optimizations applied:
 * 1. Search debounce via useDebounce hook (300ms) — prevents re-filtering on every keystroke
 * 2. TransactionRow wrapped in React.memo — prevents re-renders for unchanged rows
 * 3. Responsive text sizing (text-2xl md:text-3xl lg:text-4xl) for better scaling on mobile/tablet
 * 4. filteredTransactions memoized with useMemo — derived state recalculated only on input changes
 */
import React, { useState, useMemo, useCallback } from "react";
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
import { useDebounce } from "../../lib/hooks";

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

// ─── Memoized Transaction Row ─────────────────────────────────────────────────
// React.memo prevents re-rendering unchanged rows when parent state changes.
interface TxRowProps {
  tx: any;
}

const TransactionRow = React.memo(function TransactionRow({ tx }: TxRowProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 transition-all group" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
            tx.type === "income"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {tx.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--text-primary)' }}>{tx.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] truncate max-w-[100px] sm:max-w-none" style={{ color: 'var(--text-muted)' }}>{tx.category}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
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
        className={`font-bold text-sm sm:text-base shrink-0 ${
          tx.type === "income" ? "text-emerald-500" : ""
        }`}
        style={tx.type !== 'income' ? { color: 'var(--text-primary)' } : undefined}
      >
        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
      </p>
    </div>
  );
});

// ─── Main Component ────────────────────────────────────────────────────────────
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
  // Raw input state — updates instantly for snappy UX
  const [searchInput, setSearchInput] = useState("");

  // Debounced search term — filter recalculation waits 300ms after typing stops
  const debouncedSearch = useDebounce(searchInput, 300);

  // Memoized filter — only recalculates when debounced search or transactions change
  const filteredTransactions = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    if (!term) return transactions;
    return transactions.filter(
      (tx) =>
        tx.name?.toLowerCase().includes(term) ||
        tx.category?.toLowerCase().includes(term)
    );
  }, [debouncedSearch, transactions]);

  // Memoized handlers — stable references prevent prop-driven re-renders on children
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {userName}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Live ledger telemetry, cash velocity metrics, and real-time transaction ledger.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <PlaidLinkButton userId={currentUserId} onBankConnected={onBankConnected} />

          <button
            type="button"
            onClick={onOpenAuditModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-[var(--accent-primary)] text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border-royal)' }}
          >
            <ShieldAlert size={15} /> Audit
          </button>

          <button
            type="button"
            onClick={onOpenGlassAI}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl royal-card text-[var(--text-primary)] text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ border: '1px solid var(--border-royal)' }}
          >
            <Sparkles size={15} className="text-[var(--accent-primary)]" /> Glass AI
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl royal-btn-accent text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Record
          </button>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Net Liquidity */}
        <div className="royal-card p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Balance</span>
            <div className="p-2 rounded-xl text-[var(--accent-primary)]" style={{ backgroundColor: 'var(--icon-subtle)', border: '1px solid var(--border-subtle)' }}>
              <Wallet size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(currentBalance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Net Retained Liquidity</p>
          </div>
        </div>

        {/* Monthly Inflow */}
        <div className="royal-card p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Monthly Inflow</span>
            <div className="p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-500">
            {formatCurrency(totalIncome)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
            <ArrowUpRight size={13} /> Incoming Cashflow
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="royal-card p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Monthly Outflow</span>
            <div className="p-2 rounded-xl text-rose-400 border border-rose-500/20">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(totalExpense)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-rose-400/90">
            <ArrowDownRight size={13} /> Fixed & Variable Spend
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table Card */}
      <div className="royal-card rounded-3xl overflow-hidden" style={{ border: '1px solid var(--border-royal)' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Transaction Ledger</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {filteredTransactions.length} of {transactions.length} total records displayed
            </p>
          </div>

          {/* Search Filter — input updates immediately, filter is debounced */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search description or category..."
              className="rounded-xl pl-8 pr-4 py-2 text-xs transition-all w-44 sm:w-56 md:w-64 focus:outline-none"
              style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ borderColor: 'var(--border-subtle)' }} className="divide-y">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 lg:px-8 py-12 sm:py-16 text-center">
              <Layers className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No transactions found.</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Log a record manually or tell the AI copilot to add an expenditure.
              </p>
            </div>
          ) : (
            // Reversed list, each row is a memoized component
            [...filteredTransactions].reverse().map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
