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

const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'sub-1',
    name: 'Metro Fitness Gym',
    cost: 65.00,
    cycle: 'Monthly',
    category: 'Health & Fitness',
    status: 'Unused',
    lastUsed: '45 days ago',
    supportEmail: 'cancellations@metrofitness.com',
    icon: '🏋️‍♂️'
  },
  {
    id: 'sub-2',
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    cycle: 'Monthly',
    category: 'Software',
    status: 'Unused',
    lastUsed: '82 days ago',
    supportEmail: 'support@adobe.com',
    icon: '🎨'
  },
  {
    id: 'sub-3',
    name: 'Netflix Premium',
    cost: 22.99,
    cycle: 'Monthly',
    category: 'Entertainment',
    status: 'Price Hiked',
    priceHikeAmount: 3.00,
    lastUsed: 'Yesterday',
    supportEmail: 'support@netflix.com',
    icon: '🎬'
  },
  {
    id: 'sub-4',
    name: 'Spotify Family',
    cost: 16.99,
    cycle: 'Monthly',
    category: 'Music',
    status: 'Active',
    lastUsed: 'Today',
    supportEmail: 'support@spotify.com',
    icon: '🎵'
  },
  {
    id: 'sub-5',
    name: 'HBO Max',
    cost: 15.99,
    cycle: 'Monthly',
    category: 'Entertainment',
    status: 'Price Hiked',
    priceHikeAmount: 2.50,
    lastUsed: '3 days ago',
    supportEmail: 'support@max.com',
    icon: '📺'
  },
  {
    id: 'sub-6',
    name: 'Cloud Storage Pro',
    cost: 11.99,
    cycle: 'Monthly',
    category: 'Utilities',
    status: 'Unused',
    lastUsed: '120 days ago',
    supportEmail: 'billing@cloudstorage.com',
    icon: '☁️'
  }
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

export default function ZombieSubKiller() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);
  const [filter, setFilter] = useState<'All' | 'Unused' | 'Price Hiked' | 'Active'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    <div className="w-full bg-[#161824]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-8 text-[#F8FAFC] shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10">
              <Skull size={22} />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Zombie Subscription Killer</h2>
          </div>
          <p className="text-sm text-[#94A3B8]">
            Identify forgotten recurring charges, detect price hikes, and dispatch 1-click cancellation emails.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10">
          {(['All', 'Unused', 'Price Hiked', 'Active'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-white/10 text-white shadow-md border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab === 'Unused' ? '🚨 Unused' : tab === 'Price Hiked' ? '📈 Hiked' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Warning Waste Alert Banner */}
      {unusedSubs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-amber-950/30 border border-red-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Zombie Subscriptions Detected! ({unusedSubs.length} Unused)
              </h3>
              <p className="text-xs text-red-200/80 mt-0.5">
                You are currently wasting <strong className="text-white font-bold">{formatCurrency(monthlyWaste)}/mo</strong> ({formatCurrency(annualWaste)}/year) on services you haven't touched recently.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              Potential Savings: {formatCurrency(annualWaste)}/yr
            </span>
          </div>
        </motion.div>
      )}

      {/* Subscriptions List Grid */}
      <div className="space-y-4">
        {filteredSubs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="text-sm">No subscriptions match the selected filter.</p>
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
                className={`group relative flex flex-wrap items-center justify-between p-5 rounded-2xl border transition-all ${
                  isUnused
                    ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                    : isHiked
                    ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-md">
                    {sub.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-base truncate">{sub.name}</h4>
                      
                      {/* Status Badges */}
                      {isUnused && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 animate-pulse">
                          <Skull size={12} /> ZOMBIE (UNUSED)
                        </span>
                      )}
                      {isHiked && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <ArrowUpRight size={12} /> PRICE HIKED (+{formatCurrency(sub.priceHikeAmount || 0)})
                        </span>
                      )}
                      {sub.status === 'Active' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{sub.category}</span>
                      <span>•</span>
                      <span className={isUnused ? 'text-red-400/90 font-medium' : 'text-slate-400'}>
                        Last used: {sub.lastUsed}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Cost & Actions */}
                <div className="flex items-center gap-5 mt-3 sm:mt-0 ml-auto">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(sub.cost)}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
                    <p className="text-[11px] text-slate-400">({formatCurrency(sub.cost * 12)}/yr)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CANCEL NOW BUTTON for Unused / Hiked */}
                    {isUnused ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all border border-red-400/30"
                        title="Open mailto cancellation email draft"
                      >
                        <Mail size={15} /> CANCEL NOW
                      </button>
                    ) : isHiked ? (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(sub)}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white text-xs font-bold transition-all border border-amber-500/40"
                      >
                        <Mail size={14} /> Review & Cancel
                      </button>
                    ) : null}

                    {/* Copy Email Draft Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(sub)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
                      title="Copy email cancellation template"
                    >
                      {copiedId === sub.id ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>

                    {/* Dismiss item */}
                    <button
                      type="button"
                      onClick={() => handleDismiss(sub.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10"
                      title="Remove from list"
                    >
                      <Trash2 size={16} />
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
