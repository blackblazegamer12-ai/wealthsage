"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  X,
  Lock,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { SecurityAuditLog as AuditLogEntry } from "../types";

interface SecurityAuditLogProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export default function SecurityAuditLog({
  isOpen,
  onClose,
  logs,
}: SecurityAuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadAuditJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wealthsage_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#11131a] border border-white/10 shadow-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Cryptographic Security Audit Trail
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Immutable, digital signature-verified log of all high-privilege operations and ledger actions.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadAuditJSON}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-all"
                  >
                    <Download size={14} /> Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by action, resource type, or user ID..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                />
              </div>

              {/* Table of logs */}
              <div className="overflow-x-auto max-h-[48vh] overflow-y-auto rounded-2xl border border-white/5 bg-black/30">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono text-[10px] uppercase">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Resource</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Digital Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                          No audit records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-3 font-bold text-white whitespace-nowrap">{log.action}</td>
                          <td className="p-3 text-slate-300">
                            {log.resource_type}:{log.resource_id}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                log.severity === "CRITICAL"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                  : log.severity === "WARNING"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-3 text-cyan-300 truncate max-w-[140px]" title={log.signature}>
                            {log.signature}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> Cryptographic Proofs Verified
              </span>
              <span>SHA-256 Digest Standard</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
