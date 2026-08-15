"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuditing: boolean;
  auditData: any;
}

export default function AuditModal({
  isOpen,
  onClose,
  isAuditing,
  auditData,
}: AuditModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="audit-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="audit-modal-card"
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="card-clean p-6 sm:p-8 rounded-2xl w-full max-w-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">AI Financial Health Audit</h2>
                <p className="text-xs text-slate-400">Deep quant diagnostic of cashflow safety & allocation.</p>
              </div>
            </div>

            {isAuditing ? (
              <div className="py-20 flex flex-col items-center justify-center text-[var(--accent-primary)] space-y-4">
                <Sparkles className="w-10 h-10 animate-spin" />
                <p className="animate-pulse font-semibold text-white text-sm">
                  WealthSage is auditing your ledger records...
                </p>
              </div>
            ) : auditData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-black/30 p-5 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Security Status</p>
                    <p
                      className={`text-xl font-extrabold mt-1 flex items-center gap-1.5 ${
                        auditData.alert_level === 'Safe'
                          ? 'text-emerald-400'
                          : auditData.alert_level === 'Warning'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {auditData.alert_level === 'Safe' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                      {auditData.alert_level}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Savings Retention</p>
                    <p className="text-xl font-extrabold text-[var(--accent-primary)] mt-1">
                      {auditData.savings_rate_percentage}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  {auditData.report?.split('\n').map((paragraph: string, idx: number) => {
                    if (!paragraph.trim()) return null;
                    return (
                      <p key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
