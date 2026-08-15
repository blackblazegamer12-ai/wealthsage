"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  editingSub: any;
  subForm: any;
  setSubForm: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSave: () => void;
}

export default function SubscriptionModal({
  isOpen,
  editingSub,
  subForm,
  setSubForm,
  onClose,
  onSave,
}: SubscriptionModalProps) {
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
          key="sub-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="sub-modal-card"
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="card-clean p-6 sm:p-8 rounded-2xl w-full max-w-md relative"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingSub ? 'Edit Commitment' : 'Add Recurring Bill'}
                </h3>
                <p className="text-xs text-slate-400">Track recurring subscriptions & automated bills.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Service Name</label>
                <input 
                  type="text" 
                  maxLength={120}
                  value={subForm?.name || ''}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
                  placeholder="e.g. AWS Cloud or Spotify"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Amount ($)</label>
                  <input 
                    type="number" 
                    min="0.01"
                    max="999999999"
                    step="0.01"
                    value={subForm?.amount || ''}
                    onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Due Date</label>
                  <input 
                    type="text" 
                    maxLength={32}
                    placeholder="e.g. 15th"
                    value={subForm?.nextDate || ''}
                    onChange={(e) => setSubForm({ ...subForm, nextDate: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Emoji Icon</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={subForm?.icon || ''}
                  onChange={(e) => setSubForm({ ...subForm, icon: e.target.value })}
                  className="w-20 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center text-xl focus:border-[var(--accent-primary)] outline-none"
                  placeholder="💸"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={onSave}
                className="flex-1 px-4 py-3 rounded-xl royal-btn-accent text-xs font-bold transition-all shadow-lg"
              >
                {editingSub ? 'Update Bill' : 'Save Bill'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
