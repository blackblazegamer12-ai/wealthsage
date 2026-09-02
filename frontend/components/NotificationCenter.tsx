"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, CheckCheck, AlertTriangle, ShieldCheck, Zap, ShieldAlert, CheckCircle2, FileText,
} from "lucide-react";
import { useWealthStore } from "@/lib/store";

export default function NotificationCenter() {
  const isNotifCenterOpen = useWealthStore(state => state.isNotifCenterOpen);
  const setModal = useWealthStore(state => state.setModal);
  const transactions = useWealthStore(state => state.transactions);
  const upiMandates = useWealthStore(state => state.upiMandates);
  const approveTransaction = useWealthStore(state => state.approveTransaction);
  const revokeMandate = useWealthStore(state => state.revokeMandate);
  const openCyberDefense = useWealthStore(state => state.openCyberDefense);
  const notifications = useWealthStore(state => state.notifications);
  const markAllNotificationsRead = useWealthStore(state => state.markAllNotificationsRead);

  const [activeTab, setActiveTab] = useState<'critical' | 'mandates' | 'civic'>('critical');

  const flaggedTxs = transactions.filter(t => t.status === 'flagged');
  const darkPatterns = upiMandates.filter(m => m.isDarkPattern && m.status === 'active');
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const totalAlerts = flaggedTxs.length + darkPatterns.length + unreadNotifications.length;

  return (
    <AnimatePresence>
      {isNotifCenterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0" 
            onClick={() => setModal('isNotifCenterOpen', false)} 
          />

          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between z-10 bg-[#09090b] border-l border-white/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-white">Actionable Radar</h3>
                    <p className="text-[11px] text-white/50">{totalAlerts} items require attention</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModal('isNotifCenterOpen', false)}
                  className="p-1.5 rounded-xl transition-all hover:bg-white/10 text-[var(--text-muted)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'critical' ? 'bg-white/10 text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Critical Alerts {flaggedTxs.length > 0 && <span className="ml-1 text-red-400">({flaggedTxs.length})</span>}
                </button>
                <button
                  onClick={() => setActiveTab('mandates')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'mandates' ? 'bg-white/10 text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Mandates {darkPatterns.length > 0 && <span className="ml-1 text-amber-400">({darkPatterns.length})</span>}
                </button>
                <button
                  onClick={() => setActiveTab('civic')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'civic' ? 'bg-white/10 text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  Civic {unreadNotifications.length > 0 && <span className="ml-1 text-emerald-400">({unreadNotifications.length})</span>}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {activeTab === 'critical' && (
                    <>
                      {flaggedTxs.length === 0 ? (
                        <EmptyState message="No critical alerts." icon={<ShieldCheck size={28} className="mx-auto mb-2 opacity-40 text-green-400" />} />
                      ) : (
                        flaggedTxs.map(tx => (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }} key={tx.id} className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-bold text-red-400 flex items-center gap-1">
                                <ShieldAlert size={14} /> Suspicious Transaction
                              </span>
                              <span className="text-xs font-mono opacity-80 text-white">₹{tx.amount}</span>
                            </div>
                            <p className="text-xs text-white/70 mt-1">Blocked an unauthorized payment to <strong>{tx.merchant}</strong>.</p>
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => approveTransaction(tx.id)}
                                className="flex-1 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1 font-medium"
                              >
                                <CheckCircle2 size={13} className="text-green-400" /> Approve
                              </button>
                              <button 
                                onClick={() => openCyberDefense(tx)}
                                className="flex-1 py-1.5 text-xs rounded bg-red-600/60 hover:bg-red-600/80 text-white transition-colors flex items-center justify-center gap-1 font-bold border border-red-500/50"
                              >
                                <AlertTriangle size={13} /> Report / SOS
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}

                  {activeTab === 'mandates' && (
                    <>
                      {darkPatterns.length === 0 ? (
                        <EmptyState message="No subscription traps detected." icon={<CheckCheck size={28} className="mx-auto mb-2 opacity-40 text-green-400" />} />
                      ) : (
                        darkPatterns.map(m => (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }} key={m.id} className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                                <AlertTriangle size={14} /> Subscription Trap
                              </span>
                              <span className="text-xs font-mono opacity-80 text-white">₹{m.amount}/mo</span>
                            </div>
                            <p className="text-xs text-white/70 mt-1">Dark-pattern auto-renewal detected for <strong>{m.merchant}</strong>.</p>
                            <button 
                              onClick={() => revokeMandate(m.id)}
                              className="w-full mt-2 py-2 text-xs rounded bg-amber-600/60 hover:bg-amber-600/80 text-white transition-colors font-bold flex items-center justify-center gap-1"
                            >
                              <X size={13} /> Revoke Mandate
                            </button>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}

                  {activeTab === 'civic' && (
                    <>
                      {unreadNotifications.length === 0 ? (
                        <EmptyState message="No civic entitlement updates." icon={<FileText size={28} className="mx-auto mb-2 opacity-40 text-emerald-400" />} />
                      ) : (
                        unreadNotifications.map(item => (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }} key={item.id} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-emerald-500/20 text-emerald-400">
                                <Zap size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                                <p className="text-[11px] mt-1 text-white/70 leading-relaxed">
                                  {item.message}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs border-t border-white/10 mt-4">
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1.5 font-semibold transition-colors hover:text-white text-white/50"
              >
                <CheckCheck size={15} /> Clear All
              </button>
              <span className="text-[10px] font-mono text-white/30">Guardian Shield Telemetry</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ message, icon }: { message: string, icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center text-xs text-white/40">
      {icon}
      {message}
    </motion.div>
  );
}
