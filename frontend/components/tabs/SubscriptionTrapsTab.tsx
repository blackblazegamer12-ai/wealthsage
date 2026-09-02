"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, CreditCard, RotateCcw, CheckCircle, X } from "lucide-react";
import { useWealthStore, type UPIMandate } from "../../lib/store";

export default function SubscriptionTrapsTab() {
  const store = useWealthStore();
  const mandates = store.upiMandates;
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const activeMandates = mandates.filter((m) => m.status === "active");
  const revokedMandates = mandates.filter((m) => m.status === "revoked");
  const totalMonthly = activeMandates.reduce((s, m) => s + m.amount, 0);
  const darkPatternCount = activeMandates.filter((m) => m.isDarkPattern).length;

  const handleRevoke = (id: string) => {
    store.revokeMandate(id);
    setRevokeTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Active Mandates</p>
          <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{activeMandates.length}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Monthly Drain</p>
          <p className="text-xl font-black" style={{ color: "#f59e0b" }}>₹{totalMonthly.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border p-4 card-danger" style={{}}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#fca5a5" }}>Dark Patterns</p>
          <p className="text-xl font-black" style={{ color: "#ef4444" }}>{darkPatternCount}</p>
        </div>
      </div>

      {/* Mandate Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <CreditCard size={14} /> Active Recurring Mandates
        </h3>

        <AnimatePresence>
          {activeMandates.map((mandate) => (
            <MandateCard
              key={mandate.id}
              mandate={mandate}
              isRevoking={revokeTarget === mandate.id}
              onRevokeStart={() => setRevokeTarget(mandate.id)}
              onRevokeConfirm={() => handleRevoke(mandate.id)}
              onRevokeCancel={() => setRevokeTarget(null)}
            />
          ))}
        </AnimatePresence>

        {activeMandates.length === 0 && (
          <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
            <CheckCircle size={32} className="mx-auto mb-3" style={{ color: "#10b981" }} />
            <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>All mandates have been reviewed. Your family is protected.</p>
          </div>
        )}
      </div>

      {/* Revoked History */}
      {revokedMandates.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            <RotateCcw size={14} /> Revoked Mandates
          </h3>
          {revokedMandates.map((m) => (
            <div key={m.id} className="rounded-xl border px-5 py-3 flex items-center gap-4 status-revoked" style={{}}>
              <span className="text-lg">🚫</span>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{m.merchant}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>₹{m.amount}/mo — Revoked</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MandateCard({
  mandate,
  isRevoking,
  onRevokeStart,
  onRevokeConfirm,
  onRevokeCancel,
}: {
  mandate: UPIMandate;
  isRevoking: boolean;
  onRevokeStart: () => void;
  onRevokeConfirm: () => void;
  onRevokeCancel: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      className={`rounded-2xl border p-5 transition-all ${mandate.isDarkPattern ? "card-danger pulse-amber" : "mb-3"}`}
      style={{
        backgroundColor: mandate.isDarkPattern ? undefined : "var(--card-bg)",
        borderColor: mandate.isDarkPattern ? undefined : "var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border ${mandate.isDarkPattern ? "card-danger" : ""}`}
          style={{
            backgroundColor: !mandate.isDarkPattern ? "var(--surface-overlay)" : undefined,
            borderColor: !mandate.isDarkPattern ? "var(--border-subtle)" : undefined,
          }}
        >
          {mandate.isDarkPattern ? "⚠️" : "💳"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{mandate.merchant}</p>
            {mandate.isDarkPattern ? (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider status-flagged flex items-center gap-1">
                <AlertTriangle size={9} /> {mandate.merchant.includes("Discord") ? "Silent Price Hike" : "Unused 90 Days"}
              </span>
            ) : (
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldAlert size={9} /> Auto-Debit Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>₹{mandate.amount}/mo</span>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>•</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{mandate.frequency}</span>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>•</span>
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>Last: {mandate.last_charged}</span>
          </div>
        </div>

        {/* Revoke Action */}
        <div className="shrink-0">
          {isRevoking ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onRevokeConfirm}
                className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/20"
                style={{ borderColor: "rgba(239,68,68,0.5)", color: "#ef4444" }}
              >
                Confirm Revoke
              </button>
              <button
                onClick={onRevokeCancel}
                className="p-2 rounded-xl border transition-all hover:bg-white/5"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onRevokeStart}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/10 flex items-center gap-1.5"
              style={{ borderColor: "rgba(239,68,68,0.3)", color: "#fca5a5" }}
            >
              <ShieldAlert size={12} /> Revoke
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
