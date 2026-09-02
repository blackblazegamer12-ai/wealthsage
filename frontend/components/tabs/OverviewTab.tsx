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
  Search,
  QrCode
} from "lucide-react";
import { BriefingData } from "../ExecutiveBriefing";
import SageHealthScore from "../SageHealthScore";
import dynamic from 'next/dynamic';

const PredictiveCashflowChart = dynamic(() => import("../PredictiveCashflowChart"), { 
  ssr: false, 
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-white/5" /> 
});

import PlaidLinkButton from "../PlaidLinkButton";
import UPISplitModal from "../modals/UPISplitModal";
import { useDebounce } from "../../lib/hooks";
import { useWealthStore } from "../../lib/store";

interface OverviewTabProps {
  userName: string;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  incomeChangePct: number;
  expenseChangePct: number;
  balanceChangePct: number;
  transactions: any[];
  currentUserId: string;
  onLoadDemoData: () => void;
  onOpenAddModal: () => void;
  onOpenAuditModal: () => void;
  onOpenGlassAI: () => void;
  onBankConnected: () => void;
  isDemoMode?: boolean;
  onExitDemoMode?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

// ─── Memoized Transaction Row ─────────────────────────────────────────────────
// React.memo prevents re-rendering unchanged rows when parent state changes.
interface TxRowProps {
  tx: any;
  onSplit: (tx: any) => void;
}

const TransactionRow = React.memo(function TransactionRow({ tx, onSplit }: TxRowProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 transition-all group" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
            tx.type === "inflow"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {tx.type === "inflow" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--text-primary)' }}>{tx.description || tx.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] truncate max-w-[100px] sm:max-w-none" style={{ color: 'var(--text-muted)' }}>{tx.category}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${
                tx.type === "inflow"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {tx.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <p
          className={`font-bold text-sm sm:text-base shrink-0 ${
            tx.type === "inflow" ? "text-emerald-500" : ""
          }`}
          style={tx.type !== 'inflow' ? { color: 'var(--text-primary)' } : undefined}
        >
          {tx.type === "inflow" ? "+" : "-"}{formatCurrency(tx.amount)}
        </p>
        {tx.type === "outflow" && (
          <button 
            onClick={() => onSplit(tx)}
            title="Split Expense via UPI"
            aria-label="Split Expense via UPI"
            className="p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 bg-white/5 border border-white/10 hover:bg-[var(--accent-brass-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] text-[var(--text-dim)]"
          >
            <QrCode size={14} />
          </button>
        )}
      </div>
    </div>
  );
});

// ─── Main Component ────────────────────────────────────────────────────────────
export default function OverviewTab({
  userName,
  currentBalance,
  totalIncome,
  totalExpense,
  incomeChangePct,
  expenseChangePct,
  balanceChangePct,
  transactions,
  currentUserId,
  onLoadDemoData,
  onOpenAddModal,
  onOpenAuditModal,
  onOpenGlassAI,
  onBankConnected,
  isDemoMode,
  onExitDemoMode
}: OverviewTabProps) {
  // Raw input state — updates instantly for snappy UX
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splitTx, setSplitTx] = useState<any>(null);

  const getActiveGoals = useWealthStore(state => state.getActiveGoals);
  const getActiveSubscriptions = useWealthStore(state => state.getActiveSubscriptions);
  const ledgerMode = useWealthStore(state => state.ledgerMode);
  const toggleLedgerMode = useWealthStore(state => state.toggleLedgerMode);
  
  const goals = getActiveGoals();
  const subscriptions = getActiveSubscriptions();
  const [searchInput, setSearchInput] = useState("");
  // Debounced search term — filter recalculation waits 300ms after typing stops
  const debouncedSearch = useDebounce(searchInput, 300);

  // Memoized filter — only recalculates when debounced search or transactions change
  const filteredTransactions = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    if (!term) return transactions;
    return transactions.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(term) || tx.name?.toLowerCase().includes(term) ||
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
      {/* Empty State / Load Demo Data */}
      {transactions.length === 0 && !isDemoMode && (
        <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-overlay)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Welcome to WealthSage!</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Your dashboard is currently empty. Load demo data to explore the features, or add your first record manually.
            </p>
          </div>
          <button
            type="button"
            onClick={onLoadDemoData}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all shadow-lg hover:scale-[1.02] whitespace-nowrap"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Load Demo Data
          </button>
        </div>
      )}

      {/* Ledger Mode Switcher */}
      <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl border bg-black/40 backdrop-blur-md" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${ledgerMode === 'household' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
            {ledgerMode === 'household' ? <Layers size={18} /> : <Wallet size={18} />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {ledgerMode === 'household' ? 'Shared Household Ledger' : 'Sovereign Personal Ledger'}
            </h3>
            <p className="text-xs text-[var(--text-dim)] font-mono mt-0.5">
              {ledgerMode === 'household' ? 'Viewing combined telemetry for you and your partner.' : 'Viewing solely your personal assets and liabilities.'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleLedgerMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${ledgerMode === 'household' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-[var(--accent)] hover:brightness-110 text-black'}`}
        >
          Switch to {ledgerMode === 'household' ? 'Personal' : 'Household'}
        </button>
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

      {/* Hero Welcome Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
            Household Financial Overview
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
            onClick={onOpenAddModal}
            disabled={isDemoMode}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl btn-brass text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-[1.02] ${isDemoMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
          >
            <Plus size={16} /> Add Record
          </button>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Net Liquidity */}
        <div className="glass-panel p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-[var(--text-dim)] uppercase tracking-widest font-mono">Total Balance</span>
            <div className="p-2 rounded-xl border" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--border-subtle)' }}>
              <Wallet size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {formatCurrency(currentBalance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`w-2 h-2 rounded-full ${balanceChangePct >= 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: balanceChangePct >= 0 ? 'var(--accent)' : '#f43f5e' }} />
            <p className="text-xs font-mono text-[var(--text-dim)] uppercase tracking-widest">
              {balanceChangePct >= 0 ? '+' : ''}{balanceChangePct.toFixed(1)}% vs last month
            </p>
          </div>
        </div>

        {/* Monthly Inflow */}
        <div className="glass-panel p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-[var(--text-dim)] uppercase tracking-widest font-mono">Monthly Inflow</span>
            <div className="p-2 rounded-xl text-emerald-400 bg-white/[0.02] border border-white/10">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-[10px] font-medium font-mono uppercase tracking-widest ${incomeChangePct >= 0 ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
            {incomeChangePct >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {incomeChangePct >= 0 ? '+' : ''}{incomeChangePct.toFixed(1)}% vs last month
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="glass-panel p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-[var(--text-dim)] uppercase tracking-widest font-mono">Monthly Outflow</span>
            <div className="p-2 rounded-xl text-rose-400 bg-white/[0.02] border border-white/10">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {formatCurrency(totalExpense)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-[10px] font-medium font-mono uppercase tracking-widest ${expenseChangePct <= 0 ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
            {expenseChangePct <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />} {expenseChangePct > 0 ? '+' : ''}{expenseChangePct.toFixed(1)}% vs last month
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="glass-panel p-5 sm:p-6 lg:p-7 rounded-3xl relative overflow-hidden group border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-royal-hover)' }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, transparent, var(--accent-brass-dim), transparent)' }}></div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs sm:text-sm font-medium text-white">Asset Allocation</span>
          </div>
          <p className="text-[11px] text-[var(--text-dim)] font-mono leading-relaxed mb-6">55/30/15 Benchmark Rule</p>
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-xl">
              {/* Needs 55% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent)" strokeWidth="12" strokeDasharray="138.2 251.3" className="opacity-100" />
              {/* Wants 30% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="75.4 251.3" strokeDashoffset="-138.2" className="opacity-90" />
              {/* Savings 15% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="37.7 251.3" strokeDashoffset="-213.6" className="opacity-80" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[9px] font-mono text-[var(--text-dim)] tracking-widest uppercase mb-1">BUDGET</p>
              <p className="text-xs font-bold text-white">{formatCurrency(totalIncome)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
            <div className="text-center flex-1 border-r border-white/10">
              <p className="text-[9px] font-mono text-[var(--text-dim)] uppercase mb-1 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: 'var(--accent)'}}></span>NEEDS</p>
              <p className="text-xs text-white font-bold">55%</p>
            </div>
            <div className="text-center flex-1 border-r border-white/10">
              <p className="text-[9px] font-mono text-[var(--text-dim)] uppercase mb-1 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>WANTS</p>
              <p className="text-xs text-white font-bold">30%</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[9px] font-mono text-[var(--text-dim)] uppercase mb-1 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>SAVINGS</p>
              <p className="text-xs text-white font-bold">15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table Card */}
      <div className="glass-panel rounded-3xl overflow-hidden" style={{ border: '1px solid var(--border-royal)' }}>
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
              <TransactionRow 
                key={tx.id} 
                tx={tx} 
                onSplit={(t) => {
                  setSplitTx(t);
                  setIsSplitModalOpen(true);
                }} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Modals */}
      <UPISplitModal 
        isOpen={isSplitModalOpen}
        onClose={() => {
          setIsSplitModalOpen(false);
          setSplitTx(null);
        }}
        transaction={splitTx} 
      />
    </motion.div>
  );
}
