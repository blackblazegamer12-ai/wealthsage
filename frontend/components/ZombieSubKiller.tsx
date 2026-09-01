"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, AlertTriangle, CheckCircle, Mail, Copy, Trash2, ArrowUpRight, Clock, ShieldAlert } from 'lucide-react';
import HighFrictionConfirmModal from './modals/HighFrictionConfirmModal';
import ToastContainer, { ToastMessage } from './Toast';

export type SubscriptionStatus = 'Active' | 'Unused' | 'Price Hiked' | 'Pending Trial';

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  cycle: string;
  category: string;
  status: SubscriptionStatus;
  lastUsed: string;
  priceHikeAmount?: number;
  supportEmail: string;
  icon: string;
  plan_tier?: string;
  last_used_date?: string;
  next_billing_date?: string;
  days_since_used?: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

export default function ZombieSubKiller({ userSubscriptions = [] }: { userSubscriptions?: any[] }) {
  const [filter, setFilter] = useState<'All' | 'Unused' | 'Price Hiked' | 'Active' | 'Pending Trial'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [cancelModalSub, setCancelModalSub] = useState<SubscriptionItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Derive initial state from real subscriptions
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);

  React.useEffect(() => {
    if (!userSubscriptions || userSubscriptions.length === 0) {
      setSubscriptions([]);
      return;
    }
    
    // Add visual status/mock fields to actual user data for the optimizer UI
    const mapped = userSubscriptions.map((sub, i) => {
      let status: SubscriptionStatus = sub.status || 'Active';
      let priceHikeAmount = 0;
      let lastUsed = 'Recently';
      let last_used_date = sub.last_used_date || new Date().toISOString();
      let plan_tier = sub.plan_tier || 'Standard';

      const now = new Date();
      
      let daysSinceUsed = 0;
      
      if (status !== 'Pending Trial') {
        const lastUsedMs = new Date(last_used_date).getTime();
        daysSinceUsed = Math.floor((now.getTime() - lastUsedMs) / (1000 * 60 * 60 * 24));
        
        if (daysSinceUsed > 30) {
          status = 'Unused';
          lastUsed = `${daysSinceUsed} days ago`;
        } else {
          lastUsed = daysSinceUsed === 0 ? 'Today' : `${daysSinceUsed} days ago`;
        }
        
        // Mock a price hike on the 3rd sub for demo purposes if it's active
        if (i === 2 && status === 'Active') {
          status = 'Price Hiked';
          priceHikeAmount = (sub.cost || 0) * 0.15;
        }
      }

      return {
        id: sub.id,
        name: sub.name,
        cost: Number(sub.cost || 0),
        cycle: sub.billing_cycle || 'Monthly',
        category: sub.category || 'Subscription',
        status,
        lastUsed,
        priceHikeAmount,
        supportEmail: `support@${sub.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        icon: sub.icon || '💸',
        plan_tier,
        last_used_date,
        next_billing_date: sub.next_billing_date,
        days_since_used: daysSinceUsed
      };
    });
    setSubscriptions(mapped);
  }, [userSubscriptions]);

  const unusedSubs = subscriptions.filter(s => s.status === 'Unused');
  const trialSubs = subscriptions.filter(s => s.status === 'Pending Trial');
  const monthlyWaste = unusedSubs.reduce((sum, s) => sum + s.cost, 0);
  const annualWaste = monthlyWaste * 12;

  const filteredSubs = subscriptions.filter(sub => {
    if (filter === 'All') return true;
    return sub.status === filter;
  });

  const handleCancelClick = (sub: SubscriptionItem) => {
    setCancelModalSub(sub);
  };

  const executeCancellation = () => {
    if (cancelModalSub) {
      setSubscriptions(prev => prev.filter(s => s.id !== cancelModalSub.id));
      const id = crypto.randomUUID();
      setToasts([{ id, title: 'Mandate Revoked', description: `Successfully simulated UPI e-mandate revocation for ${cancelModalSub.name}.`, type: 'success' }]);
      setTimeout(() => setToasts([]), 4500);
      
      // Attempt to open deep link or support mail
      const subject = `Cancellation Request - ${cancelModalSub.name}`;
      const body = `Please cancel my ${cancelModalSub.name} subscription immediately.`;
      const mailtoUrl = `mailto:${cancelModalSub.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_blank');
      
      setCancelModalSub(null);
    }
  };

  const generateCancellationEmail = (sub: SubscriptionItem) => {
    const subject = `Immediate Cancellation Notice - ${sub.name} Account`;
    const body = `Dear ${sub.name} Support Team,\n\nI am writing to formally request the immediate cancellation of my subscription to ${sub.name} associated with my account email.\n\nPlease ensure that no further recurring charges are billed to my account effective immediately. Kindly reply to this email confirming the cancellation and my zero remaining balance.\n\nThank you for your prompt assistance.\n\nBest regards,\n[Your Name]`;
    return { subject, body };
  };

  const handleCopyEmail = (sub: SubscriptionItem) => {
    const { subject, body } = generateCancellationEmail(sub);
    const textToCopy = `To: ${sub.supportEmail}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDismiss = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const handleLogUsage = (id: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, last_used_date: new Date().toISOString(), status: 'Active' };
      }
      return s;
    }));
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
              <Skull size={20} />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Recurring Expense Optimizer</h2>
          </div>
          <p className="text-sm text-[var(--text-dim)] font-mono">
            Identify forgotten recurring charges, detect price hikes, and auto-cancel with one click.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 overflow-x-auto max-w-full">
          {(['All', 'Unused', 'Pending Trial', 'Price Hiked', 'Active'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-[#d4af37] text-black font-bold"
                  : "text-[var(--text-dim)] hover:text-white"
              }`}
            >
              {tab === 'Unused' ? '☠ Unused' : tab === 'Pending Trial' ? '⏱ Trials' : tab === 'Price Hiked' ? '📈 Hiked' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trial Watchlist Banner */}
      {trialSubs.length > 0 && filter !== 'Unused' && filter !== 'Price Hiked' && filter !== 'Active' && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} className="text-amber-400" /> Trial Watchlist
          </h3>
          <div className="grid gap-3">
            {trialSubs.map(trial => {
              const daysLeft = trial.next_billing_date 
                ? Math.max(0, Math.ceil((new Date(trial.next_billing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                : 3;
                
              return (
                <motion.div
                  key={trial.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl shrink-0 border border-amber-500/20">
                      {trial.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{trial.name} <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded ml-2">{trial.plan_tier}</span></h4>
                      <p className="text-xs text-[var(--text-dim)] mt-0.5 font-mono">
                        Detected small ₹2 authorization charge.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                        <AlertTriangle size={14} /> {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} until {formatCurrency(trial.cost)} auto-charge
                      </span>
                    </div>
                    <button
                      onClick={() => handleCancelClick(trial)}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Cancel Trial
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning Waste Alert Banner */}
      {unusedSubs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0 border border-red-500/20">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Zombie Subscriptions Detected! ({unusedSubs.length} Unused)
              </h3>
              <p className="text-xs text-[var(--text-dim)] mt-1 font-mono">
                You are currently wasting <strong className="text-red-400">{formatCurrency(monthlyWaste)}/mo</strong> ({formatCurrency(annualWaste)}/year) on services you haven't touched recently.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-mono uppercase tracking-widest border border-red-500/30">
              Potential Savings: {formatCurrency(annualWaste)}/yr
            </span>
          </div>
        </motion.div>
      )}

      {/* Subscriptions List Grid */}
      <div className="space-y-4">
        {filteredSubs.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-dim)]">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="text-sm font-mono">No subscriptions match the selected filter.</p>
          </div>
        ) : (
          filteredSubs.map(sub => {
            const isUnused = sub.status === 'Unused';
            const isHiked = sub.status === 'Price Hiked';

            return (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative flex flex-wrap items-center justify-between p-6 rounded-2xl transition-all ${
                  isUnused
                    ? 'bg-red-950/10 border border-red-500/20 hover:border-red-500/40'
                    : isHiked
                    ? 'bg-amber-950/10 border border-[#d4af37]/20 hover:border-[#d4af37]/40'
                    : sub.status === 'Pending Trial'
                    ? 'bg-amber-950/20 border border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-white/[0.02] border border-white/5 hover:border-white/20'
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-black border border-white/10">
                    {sub.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-bold text-base truncate text-white">{sub.name}</h4>
                      {sub.plan_tier && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white border border-white/20">
                          {sub.plan_tier}
                        </span>
                      )}
                      
                      {/* Status Badges */}
                      {isUnused && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                          <Skull size={10} /> ZOMBIE (UNUSED)
                        </span>
                      )}
                      {isHiked && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 flex items-center gap-1">
                          <ArrowUpRight size={10} /> PRICE HIKED (+{formatCurrency(sub.priceHikeAmount || 0)})
                        </span>
                      )}
                      {sub.status === 'Pending Trial' && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Clock size={10} /> TRIAL
                        </span>
                      )}
                      {sub.status === 'Active' && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-2 text-[var(--text-dim)] font-mono">
                      <span>{sub.category}</span>
                      <span>•</span>
                      
                      {/* Usage Health Indicator */}
                      {sub.status !== 'Pending Trial' && (
                        <button 
                          onClick={() => handleLogUsage(sub.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:bg-white/5 border border-transparent hover:border-white/10 ${
                            isUnused ? 'text-red-400' : (sub.days_since_used && sub.days_since_used > 14) ? 'text-yellow-400' : 'text-emerald-400'
                          }`}
                          title="Click to manually log usage"
                        >
                          <span className={`w-2 h-2 rounded-full ${isUnused ? 'bg-red-500' : (sub.days_since_used && sub.days_since_used > 14) ? 'bg-yellow-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                          {isUnused ? 'Zombie (30+ days)' : (sub.days_since_used && sub.days_since_used > 14) ? 'Warning (14+ days)' : 'Healthy'}
                          <span className="text-[10px] ml-1 opacity-50">({sub.lastUsed})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Cost & Actions */}
                <div className="flex items-center gap-6 mt-4 sm:mt-0 ml-auto">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(sub.cost)}<span className="text-xs font-normal text-[var(--text-dim)]">/mo</span></p>
                    <p className="text-[10px] font-mono text-[var(--text-dim)]">({formatCurrency(sub.cost * 12)}/yr)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CANCEL NOW BUTTON for Unused / Hiked / Trial */}
                    {isUnused || sub.status === 'Pending Trial' ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-[10px] font-mono tracking-widest uppercase font-bold hover:bg-red-500 transition-all border border-red-400/30"
                      >
                        <ShieldAlert size={14} /> REVOKE
                      </button>
                    ) : isHiked ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[10px] font-mono tracking-widest uppercase font-bold transition-all border border-[#d4af37]/40"
                      >
                        <ShieldAlert size={14} /> Review & Revoke
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:bg-red-500/20 hover:text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold transition-all border border-transparent hover:border-red-500/30"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Copy Email Draft Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(sub)}
                      className="p-3 rounded-xl transition-all bg-white/[0.02] text-[var(--text-dim)] border border-white/10 hover:text-white"
                      title="Copy email cancellation template"
                    >
                      {copiedId === sub.id ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>

                    {/* Dismiss item */}
                    <button
                      type="button"
                      onClick={() => handleDismiss(sub.id)}
                      className="p-3 rounded-xl transition-all bg-white/[0.02] text-[var(--text-dim)] border border-white/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30"
                      title="Remove from list"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      {/* Two-Step Cancellation Modal */}
      {cancelModalSub && (
        <HighFrictionConfirmModal
          isOpen={!!cancelModalSub}
          onClose={() => setCancelModalSub(null)}
          onConfirm={executeCancellation}
          title={`Revoke ${cancelModalSub.name} - ${cancelModalSub.plan_tier || 'Standard'} Tier`}
          requiredPhrase="CANCEL"
          confirmButtonText="Confirm Cancellation"
          description={
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-sm text-slate-300">
                  By revoking this e-mandate, you will recover <strong className="text-emerald-400 font-bold text-base ml-1">{formatCurrency(cancelModalSub.cost * 12)}/year</strong>.
                </p>
              </div>
              <div className="flex gap-3 text-rose-300 items-start">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>
                  <strong>Warning:</strong> Revoking this mandate will freeze future payments. You may lose access at the end of your current billing cycle.
                </p>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
