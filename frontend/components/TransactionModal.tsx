"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { name: string; amount: string; type: string; category: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; amount: string; type: string; category: string }>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: TransactionModalProps) {
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
          key="add-record-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="add-record-card"
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="royal-glass-mirror p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl relative border border-[var(--border-royal)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl royal-btn-accent text-black flex items-center justify-center">
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Log Transaction</h2>
                <p className="text-xs text-slate-400">Add an inflow or outflow to your real-time ledger.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Description</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
                  placeholder="e.g. Dividend Distribution or Rent"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Amount ($)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
                  placeholder="2500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none appearance-none transition-all text-sm"
                  >
                    <option value="expense" className="bg-[#12131a] text-white">Expense</option>
                    <option value="income" className="bg-[#12131a] text-white">Income</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
                    placeholder="Housing / Investments"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full royal-btn-accent py-3.5 rounded-xl mt-3 text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Save Record to Ledger
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
