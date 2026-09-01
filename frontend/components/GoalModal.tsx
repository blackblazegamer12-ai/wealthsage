"use client";
import React, { useEffect } from 'react';
import { useFocusTrap } from '../lib/useFocusTrap';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  editingGoal: any;
  goalForm: any;
  setGoalForm: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onSave: () => void;
}

export default function GoalModal({
  isOpen,
  editingGoal,
  goalForm,
  setGoalForm,
  onClose,
  onSave,
}: GoalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const focusTrapRef = useFocusTrap(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="goal-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-label={editingGoal ? 'Edit Goal' : 'Create New Goal'}
            key="goal-modal-card"
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
              <div className="p-2.5 rounded-2xl btn-brass text-black flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {editingGoal ? 'Edit Target' : 'Create New Target'}
                </h3>
                <p className="text-xs text-slate-400">Set milestone goals and track your progress.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Goal Name</label>
                <input 
                  type="text" 
                  maxLength={120}
                  value={goalForm?.title || ''}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
                  placeholder="e.g. Mountain Chalet or Angel Pool"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Target ($)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="999999999"
                    value={goalForm?.target_amount || ''}
                    onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">Saved ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="999999999"
                    value={goalForm?.current_amount || ''}
                    onChange={(e) => setGoalForm({ ...goalForm, current_amount: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Target Date</label>
                <input 
                  type="date" 
                  value={goalForm?.target_date?.split('T')[0] || ''}
                  onChange={(e) => setGoalForm({ ...goalForm, target_date: new Date(e.target.value).toISOString() })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--accent-primary)] outline-none transition-all text-sm"
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
                className="flex-1 px-4 py-3 rounded-xl btn-brass text-xs font-bold transition-all shadow-lg"
              >
                {editingGoal ? 'Update Target' : 'Save Target'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
