"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "ai" | "warning" | "info";
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success" || !toast.type;
          const isAI = toast.type === "ai";
          const isWarning = toast.type === "warning";

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`pointer-events-auto p-4 rounded-2xl border bg-[var(--bg-surface)] shadow-lg flex items-start gap-3 relative overflow-hidden ${
                isAI
                  ? "border-[#8B5CF6]/40"
                : isSuccess
                  ? "border-[#10B981]/40"
                : isWarning
                  ? "border-amber-500/40"
                  : "border-[var(--border-subtle)]"
              }`}
            >
              {/* Subtle side glow bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isAI
                    ? "bg-gradient-to-b from-[#8B5CF6] to-[#06B6D4]"
                    : isSuccess
                    ? "bg-[#10B981]"
                    : isWarning
                    ? "bg-amber-500"
                    : "bg-cyan-500"
                }`}
              />

              <div className="shrink-0 mt-0.5">
                {isAI ? (
                  <div className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6]">
                    <Sparkles size={16} />
                  </div>
                ) : isSuccess ? (
                  <div className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                    <CheckCircle2 size={16} />
                  </div>
                ) : isWarning ? (
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <AlertCircle size={16} />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Info size={16} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{toast.description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
