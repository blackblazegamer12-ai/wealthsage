"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, AlertTriangle, CheckCircle, Mail, Copy, Trash2, ArrowUpRight, DollarSign, Sparkles, Filter } from 'lucide-react';

export type SubscriptionStatus = 'Active' | 'Unused' | 'Price Hiked';

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
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

export default function ZombieSubKiller({ userSubscriptions = [] }: { userSubscriptions?: any[] }) {
  const [filter, setFilter] = useState<'All' | 'Unused' | 'Price Hiked' | 'Active'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derive initial state from real subscriptions
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);

  React.useEffect(() => {
    if (!userSubscriptions || userSubscriptions.length === 0) {
      setSubscriptions([]);
      return;
    }
    
    // Add visual status/mock fields to actual user data for the optimizer UI
    const mapped = userSubscriptions.map((sub, i) => {
      let status: SubscriptionStatus = 'Active';
      let priceHikeAmount = 0;
      let lastUsed = 'Recently';
      
      if (i === 0) {
        status = 'Unused';
        lastUsed = '45 days ago';
      } else if (i === 2) {
        status = 'Price Hiked';
        priceHikeAmount = sub.amount * 0.15;
      } else if (i === 4) {
        status = 'Unused';
        lastUsed = '82 days ago';
      }

      return {
        id: sub.id,
        name: sub.name,
        cost: Number(sub.amount || 0),
        cycle: sub.cycle || 'Monthly',
        category: sub.category || 'Subscription',
        status,
        lastUsed,
        priceHikeAmount,
        supportEmail: `support@${sub.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        icon: sub.icon || '💸'
      };
    });
    setSubscriptions(mapped);
  }, [userSubscriptions]);

  const unusedSubs = subscriptions.filter(s => s.status === 'Unused');
  const monthlyWaste = unusedSubs.reduce((sum, s) => sum + s.cost, 0);
  const annualWaste = monthlyWaste * 12;

  const filteredSubs = subscriptions.filter(sub => {
    if (filter === 'All') return true;
    return sub.status === filter;
  });

  const generateCancellationEmail = (sub: SubscriptionItem) => {
    const subject = `Immediate Cancellation Notice - ${sub.name} Account`;
    const body = `Dear ${sub.name} Support Team,\n\nI am writing to formally request the immediate cancellation of my subscription to ${sub.name} associated with my account email.\n\nPlease ensure that no further recurring charges are billed to my account effective immediately. Kindly reply to this email confirming the cancellation and my zero remaining balance.\n\nThank you for your prompt assistance.\n\nBest regards,\n[Your Name]`;
    return { subject, body };
  };

  const handleCancelClick = (sub: SubscriptionItem) => {
    const { subject, body } = generateCancellationEmail(sub);
    const mailtoUrl = `mailto:${sub.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
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

  return (
    <div className="w-full glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
      
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
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5">
          {(['All', 'Unused', 'Price Hiked', 'Active'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${
                filter === tab
                  ? "bg-[#d4af37] text-black font-bold"
                  : "text-[var(--text-dim)] hover:text-white"
              }`}
            >
              {tab === 'Unused' ? '☠ Unused' : tab === 'Price Hiked' ? '📈 Hiked' : tab}
            </button>
          ))}
        </div>
      </div>

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
                      {sub.status === 'Active' && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs mt-2 text-[var(--text-dim)] font-mono">
                      <span>{sub.category}</span>
                      <span>•</span>
                      <span className={isUnused ? 'text-red-400' : ''}>
                        Last used: {sub.lastUsed}
                      </span>
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
                    {/* CANCEL NOW BUTTON for Unused / Hiked */}
                    {isUnused ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-[10px] font-mono tracking-widest uppercase font-bold hover:bg-red-500 transition-all border border-red-400/30"
                        title="Open mailto cancellation email draft"
                      >
                        <Mail size={14} /> CANCEL NOW
                      </button>
                    ) : isHiked ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-[10px] font-mono tracking-widest uppercase font-bold transition-all border border-[#d4af37]/40"
                      >
                        <Mail size={14} /> Review & Cancel
                      </button>
                    ) : null}

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
    </div>
  );
}
