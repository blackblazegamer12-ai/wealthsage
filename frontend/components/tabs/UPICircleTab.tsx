"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, UserCheck, Smartphone, ArrowRight } from "lucide-react";
import { useWealthStore, type PaymentRequest } from "../../lib/store";

export default function UPICircleTab() {
  const store = useWealthStore();
  const requests = store.paymentRequests;

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");
  const totalPendingAmount = pending.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* UPI Circle Header */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.3)" }}>
            <Smartphone size={18} style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>UPI Circle — Delegated Payments</h3>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Child devices request → Parent approves/rejects
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-overlay)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pending Requests</p>
            <p className="text-xl font-black mt-1" style={{ color: "#f59e0b" }}>{pending.length}</p>
          </div>
          <div className="rounded-xl border px-4 py-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-overlay)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pending Amount</p>
            <p className="text-xl font-black mt-1" style={{ color: "var(--text-primary)" }}>₹{totalPendingAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Pending Queue */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Clock size={14} style={{ color: "#f59e0b" }} /> Pending Approval Queue
          </h3>
          <AnimatePresence>
            {pending.map((req, idx) => (
              <RequestCard
                key={req.id}
                request={req}
                index={idx}
                onApprove={() => store.approvePaymentRequest(req.id)}
                onReject={() => store.rejectPaymentRequest(req.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {pending.length === 0 && (
        <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
          <UserCheck size={32} className="mx-auto mb-3" style={{ color: "#10b981" }} />
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>All Clear</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>No pending payment requests from child devices.</p>
        </div>
      )}

      {/* Resolved History */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Resolved</h3>
          {resolved.map((req) => (
            <div
              key={req.id}
              className={`rounded-xl border px-5 py-3 flex items-center gap-4 ${
                req.status === "approved" ? "status-approved" : "status-flagged"
              }`}
            >
              {req.status === "approved" ? (
                <CheckCircle size={16} style={{ color: "#10b981" }} />
              ) : (
                <XCircle size={16} style={{ color: "#ef4444" }} />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold">{req.merchant}</p>
                <p className="text-[10px]">₹{req.amount.toLocaleString("en-IN")} — {req.childLabel}</p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">{req.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({
  request,
  index,
  onApprove,
  onReject,
}: {
  request: PaymentRequest;
  index: number;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border p-5 card-warning pulse-amber"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border"
          style={{ backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.25)" }}
        >
          👦
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{request.merchant}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>📱 {request.childLabel}</span>
            <ArrowRight size={10} style={{ color: "var(--text-muted)" }} />
            <span className="text-[10px] font-bold" style={{ color: "#f59e0b" }}>₹{request.amount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onApprove}
            className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-emerald-500/20 flex items-center gap-1.5"
            style={{ borderColor: "rgba(16,185,129,0.4)", color: "#10b981" }}
          >
            <CheckCircle size={13} /> Approve
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/20 flex items-center gap-1.5"
            style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}
          >
            <XCircle size={13} /> Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
}
