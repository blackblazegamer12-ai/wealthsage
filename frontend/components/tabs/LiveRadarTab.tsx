"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, ShieldCheck, User, Gamepad2, Smartphone, ShoppingBag } from "lucide-react";
import { useWealthStore } from "../../lib/store";
import { getCategoryEmoji, evaluateTransaction, categorizeTransaction } from "../../lib/ruleEngine";
import { analyzeTransactionMultiAgent, synthesizeExecutiveVerdictAsync, MultiAgentAnalysisResult } from "../../lib/multiAgentEngine";
import { ChevronDown, ChevronUp, Bot, BrainCircuit, ShieldAlert as ShieldAlertIcon } from "lucide-react";

export default function LiveRadarTab() {
  const store = useWealthStore();
  const transactions = store.getActiveTransactions();

  const totalFlagged = transactions.filter((t: Record<string, unknown>) => t.status === "flagged").length;
  const totalChildSpend = transactions
    .filter((t: Record<string, unknown>) => t.actor === "child" && t.type === "outflow")
    .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);
  const pendingCount = store.paymentRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Summary Bar Removed - Data is handled by GuardianShieldScore.tsx overarching layout */}

      {/* Transaction Feed */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>Live Transaction Radar</h3>
          </div>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{transactions.length} entries</span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
          <AnimatePresence>
            {transactions.map((tx: Record<string, unknown>, idx: number) => (
              <TransactionRow key={(tx.id as string) || idx} tx={tx} idx={idx} transactions={transactions} />
            ))}
          </AnimatePresence>

          {transactions.length === 0 && (
            <div className="px-5 py-24 text-center flex flex-col items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <ShieldCheck size={28} className="text-zinc-600" />
              </div>
              <p className="text-sm font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>Zero Anomalies Detected</p>
              <p className="text-xs mt-1 max-w-xs" style={{ color: "var(--text-muted)" }}>The ledger is clean. Load demo data or connect your AA bank to begin surveillance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <p className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

function TransactionRow({ tx, idx, transactions }: { tx: Record<string, unknown>, idx: number, transactions: any[] }) {
  const store = useWealthStore();
  const status = (tx.status as string) || "approved";
  const actor = (tx.actor as string) || "parent";
  const merchant = (tx.merchant as string) || (tx.description as string) || "Unknown";
  const category = (tx.category as string) || categorizeTransaction(merchant);
  const amount = Number(tx.amount || 0);
  const type = (tx.type as string) || "outflow";
  const emoji = getCategoryEmoji(category);
  
  const isFlagged = status === "flagged";
  const isPending = status === "pending";
  const isGamingOrSocial = category === "Gaming" || category === "Social";
  
  const [multiAgent, setMultiAgent] = React.useState<MultiAgentAnalysisResult | null>(
    isFlagged ? analyzeTransactionMultiAgent(tx, transactions) : null
  );

  React.useEffect(() => {
    if (multiAgent?.isFlagged && multiAgent.agentC.status === 'REASONING') {
      let isMounted = true;
      synthesizeExecutiveVerdictAsync(multiAgent.agentA, multiAgent.agentB, tx, transactions).then((agentC) => {
        if (isMounted) {
          setMultiAgent(prev => prev ? { ...prev, agentC } : prev);
        }
      });
      return () => { isMounted = false; };
    }
  }, [multiAgent?.isFlagged, multiAgent?.agentC.status, tx, multiAgent?.agentA, multiAgent?.agentB]);

  return (
    <div className="flex flex-col border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ delay: idx * 0.03 }}
        className={`px-5 py-4 flex items-center gap-4 transition-all hover:bg-white/[0.02] ${
          isFlagged ? "pulse-alert" : isGamingOrSocial && actor === "child" ? "pulse-amber" : ""
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
            isFlagged ? "card-danger" : isGamingOrSocial ? "card-warning" : ""
          }`}
          style={{
            backgroundColor: !isFlagged && !isGamingOrSocial ? "var(--surface-overlay)" : undefined,
            borderColor: !isFlagged && !isGamingOrSocial ? "var(--border-subtle)" : undefined,
          }}
        >
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
              {tx.description as string}
            </p>
            {isGamingOrSocial && actor === "child" && !isFlagged && (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider status-flagged flex items-center gap-1">
                <AlertTriangle size={9} /> Parental Review
              </span>
            )}
            {isFlagged && multiAgent && (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Bot size={10} /> 
                {multiAgent.agentC.status === 'REASONING' ? (
                  <span className="animate-pulse">Evaluating Threat...</span>
                ) : (
                  <span>Tri-Agent Consensus: {multiAgent.agentC.confidenceScore}% Threat</span>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
              {actor === "child" ? "👦 Child" : "👤 Parent"}
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>•</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{category}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className={`text-sm font-black tabular-nums ${type === "inflow" ? "text-emerald-400" : ""}`} style={type !== "inflow" ? { color: "var(--text-primary)" } : {}}>
            {type === "inflow" ? "+" : "−"}₹{amount.toLocaleString("en-IN")}
          </p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            isFlagged ? "status-flagged" : isPending ? "status-pending" : "status-approved"
          }`}>
            {status}
          </span>
        </div>

        {(isFlagged || isPending) && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={() => store.approveTransaction(tx.id as string)}
              className="p-1.5 rounded-lg border transition-all hover:bg-emerald-500/10"
              style={{ borderColor: "rgba(16,185,129,0.3)", color: "#10b981" }}
              title="Approve"
            >
              <CheckCircle size={14} />
            </button>
            {!isFlagged && (
              <button
                onClick={() => store.flagTransaction(tx.id as string)}
                className="p-1.5 rounded-lg border transition-all hover:bg-red-500/10"
                style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
                title="Flag"
              >
                <ShieldAlert size={14} />
              </button>
            )}
          </div>
        )}
      </motion.div>
      
      {isFlagged && multiAgent && (
        <div className="bg-black/40 p-4 pl-[72px] border-t border-red-500/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs">
            <BrainCircuit size={14} className="text-purple-400" />
            <span className="text-white/70 font-mono">Consensus Audit Breakdown:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">Agent 1: Edge Sentinel</span>
              {multiAgent.agentA.status === 'FLAG' ? (
                <span className="text-xs text-red-400 font-bold flex items-center gap-1"><ShieldAlertIcon size={12}/> Flagged (Disguised Gaming Code)</span>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={12}/> Passed</span>
              )}
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">Agent 2: Velocity Classifier</span>
              {multiAgent.agentB.status === 'FLAG' ? (
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1"><AlertTriangle size={12}/> Warning ({multiAgent.agentB.anomalyType === 'VELOCITY' ? 'Rapid Outflow' : 'Late-Night Activity'})</span>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={12}/> Passed</span>
              )}
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[10px] uppercase text-white/40 tracking-wider">Agent 3: Executive Arbiter</span>
              {multiAgent.agentC.status === 'REASONING' ? (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-purple-400 font-mono animate-pulse">🤖 Synthesizing Executive Verdict...</span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-xs text-red-400 font-bold flex items-center gap-1"><ShieldAlertIcon size={12}/> Final Action Recommended:</span>
                  <span className="text-[10px] text-white/70 mt-1 block leading-relaxed">{multiAgent.agentC.actionableNextStep}</span>
                  <span className="text-[10px] text-white/50 block mt-1 italic">{multiAgent.agentC.plainTextVerdict}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
