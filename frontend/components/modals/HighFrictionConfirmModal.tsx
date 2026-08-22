"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert, Check } from "lucide-react";

interface HighFrictionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  requiredPhrase?: string;
  confirmButtonText?: string;
}

export default function HighFrictionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  requiredPhrase = "CONFIRM RESET",
  confirmButtonText = "Permanently Reset Ledger",
}: HighFrictionConfirmModalProps) {
  const [typedPhrase, setTypedPhrase] = useState("");
  const [isErrorShake, setIsErrorShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedPhrase("");
    }
  }, [isOpen]);

  const isMatch = typedPhrase.trim() === requiredPhrase;

  const handleConfirm = () => {
    if (!isMatch) {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
      return;
    }
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: isErrorShake ? [-8, 8, -6, 6, -3, 3, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-3xl bg-[#11131a] border border-rose-500/40 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
          >
            {/* Ambient red warning glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">
                    DESTRUCTIVE OPERATION GUARD
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Warning Description */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed mb-5">
              {description}
            </div>

            {/* Verification Prompt */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                To confirm this action, please type{" "}
                <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                  {requiredPhrase}
                </span>{" "}
                below:
              </label>
              <input
                type="text"
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                placeholder={`Type "${requiredPhrase}"`}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isMatch}
                title={!isMatch ? `Type "${requiredPhrase}" to enable` : "Execute destructive action"}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isMatch
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                    : "bg-rose-950/40 text-rose-400/50 border border-rose-900/30 cursor-not-allowed opacity-60"
                }`}
              >
                <AlertTriangle size={15} /> {confirmButtonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
