"use client";
import React, { useState } from 'react';

import { Gamepad2, AlertTriangle, GraduationCap, X, Minus, Plus, Fingerprint, Search, ShieldCheck, BrainCircuit, Bot, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWealthStore } from '@/lib/store';
import { useAuth } from '@clerk/nextjs';
import { playAlertChime } from '@/lib/audioAlert';
import { detectSubscriptionTraps, AuditSummary } from '@/lib/subscriptionAuditor';

export default function ExpoDemoController() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [showAudit, setShowAudit] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [showMultiAgent, setShowMultiAgent] = useState(false);
  const [multiAgentStep, setMultiAgentStep] = useState(0);
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);

  const addToast = useWealthStore(state => state.addToast);
  const setModal = useWealthStore(state => state.setModal);
  const transactions = useWealthStore(state => state.transactions);
  const { getToken, userId } = useAuth();

  const handleGamingDebit = async () => {
    addToast('Expo Demo', 'Triggering Disguised Gaming Debit...', 'info');
    try {
      const res = await fetch('/api/webhooks/aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `expo-${Date.now()}`,
          amount: 1800,
          merchant: 'Codashop - Free Fire',
          category: 'General', // intentional miscategorization to test decoder
          actor: 'child',
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.status === 'flagged' || data.transaction?.status === 'flagged') {
        if (data.transaction) {
          useWealthStore.setState((s) => ({ transactions: [data.transaction, ...s.transactions] }));
        }
        playAlertChime();
        setModal('isNotifCenterOpen', true); // auto open to show judges
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMulePattern = async () => {
    addToast('Expo Demo', 'Injecting Student Mule Pattern...', 'info');
    try {
      // 1. Inflow
      const inRes = await fetch('/api/webhooks/aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `expo-in-${Date.now()}`,
          amount: 25000,
          merchant: 'Unknown UPI Transfer',
          category: 'Income',
          actor: 'parent', // or child
          timestamp: new Date().toISOString()
        })
      });
      const inData = await inRes.json();
      if (inData.transaction) {
        useWealthStore.setState((s) => ({ transactions: [inData.transaction, ...s.transactions] }));
      }

      // 2. Outflow (triggering anti-mule)
      const res = await fetch('/api/webhooks/aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `expo-out-${Date.now()}`,
          amount: 24000,
          merchant: 'Crypto P2P Exchange',
          category: 'Transfer',
          actor: 'parent',
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.status === 'flagged' || data.transaction?.status === 'flagged') {
        if (data.transaction) {
          useWealthStore.setState((s) => ({ transactions: [data.transaction, ...s.transactions] }));
        }
        playAlertChime();
        setModal('isNotifCenterOpen', true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScholarship = () => {
    addToast('Expo Demo', 'Simulating ₹20,000 Scholarship Entitlement', 'info');
    // For this demo, just trigger a notification
    useWealthStore.setState((s) => ({
      notifications: [
        {
          id: `sch-${Date.now()}`,
          title: 'Civic Entitlement Found',
          message: 'Eligible for Post-Matric Scholarship (₹20,000). Action required: Upload Aadhaar.',
          type: 'insight',
          read: false,
          created_at: 'Just now'
        },
        ...s.notifications
      ],
      isNotifCenterOpen: true
    }));
  };

  const handleBiometric = () => {
    setShowBiometric(true);
    setBiometricStatus('idle');
  };

  const runBiometricScan = () => {
    setBiometricStatus('scanning');
    setTimeout(() => {
      setBiometricStatus('success');
      playAlertChime();
      addToast('Biometric Approval', 'Identity verified. Payment authorized.', 'success');
      setTimeout(() => setShowBiometric(false), 2000);
    }, 1500);
  };

  const handleDeepAudit = async () => {
    setShowAudit(true);
    setAuditStep(0);
    
    try {
      const token = await getToken();
      const res = await fetch('/api/audit/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId: userId || 'demo-user-id' })
      });
      
      const json = await res.json();
      if (json.success && json.data) {
        setAuditSummary(json.data);
      }
    } catch (e) {
      console.error('Audit API failed', e);
    }
    
    setTimeout(() => setAuditStep(1), 800);
    setTimeout(() => setAuditStep(2), 2000);
    setTimeout(() => setAuditStep(3), 3200);
  };

  const handleMultiAgentDemo = async () => {
    setShowMultiAgent(true);
    setMultiAgentStep(0);
    
    // Step 1: Agent A evaluating
    setTimeout(() => setMultiAgentStep(1), 1000);
    
    // Step 2: Agent B evaluating
    setTimeout(() => setMultiAgentStep(2), 2500);

    // Step 3: Agent C synthesizing
    setTimeout(() => setMultiAgentStep(3), 4000);

    // Step 4: Complete & Push to UI
    setTimeout(() => {
      setShowMultiAgent(false);
      handleGamingDebit();
    }, 6000);
  };

  return (
    <>
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {!isMinimized && (
        <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl mb-2 w-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider opacity-80">Expo Demo HUD</h3>
            <button onClick={() => setIsMinimized(true)} className="text-white/50 hover:text-white">
              <Minus size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={handleGamingDebit}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <Gamepad2 size={16} className="text-red-400" />
              Simulate Gaming Debit (₹1800)
            </button>
            <button 
              onClick={handleMulePattern}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <AlertTriangle size={16} className="text-yellow-400" />
              Simulate Mule Pattern
            </button>
            <button 
              onClick={handleScholarship}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <GraduationCap size={16} className="text-green-400" />
              Simulate Scholarship (₹20k)
            </button>
            <div className="h-px bg-white/10 my-2" />
            <button 
              onClick={handleBiometric}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <Fingerprint size={16} className="text-blue-400" />
              Demo: Biometric Approval
            </button>
            <button 
              onClick={handleDeepAudit}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <Search size={16} className="text-purple-400" />
              Demo: AI Deep-Audit
            </button>
            <button 
              onClick={handleMultiAgentDemo}
              className="w-full flex items-center gap-2 p-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left"
            >
              <BrainCircuit size={16} className="text-emerald-400" />
              Demo: Tri-Agent Consensus
            </button>
          </div>
        </div>
      )}
      
      {isMinimized && (
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-xs transition-colors"
        >
          <Plus size={16} /> HUD
        </button>
      )}
    </div>

    {/* Biometric Modal */}
    <AnimatePresence>
      {showBiometric && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#09090b] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Verify Approval</h3>
            <p className="text-xs text-white/50 mb-8 relative z-10">Approve child's ₹1,500 gaming request.</p>
            
            <button onClick={runBiometricScan} disabled={biometricStatus !== 'idle'} className="relative z-10 p-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              {biometricStatus === 'idle' && <Fingerprint size={64} className="text-blue-400 group-hover:scale-110 transition-transform" />}
              {biometricStatus === 'scanning' && <Fingerprint size={64} className="text-blue-400 animate-ping" />}
              {biometricStatus === 'success' && <ShieldCheck size={64} className="text-emerald-400" />}
            </button>
            <p className="text-[10px] font-mono text-white/40 mt-6 relative z-10 uppercase tracking-widest">
              {biometricStatus === 'idle' ? 'Touch to verify' : biometricStatus === 'scanning' ? 'Verifying Identity...' : 'Authorized'}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* AI Deep Audit Modal */}
    <AnimatePresence>
      {showAudit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-[#09090b] border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col max-w-md w-full relative"
          >
            <button onClick={() => setShowAudit(false)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={16} /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Search size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Capital Leakage Audit</h3>
                <p className="text-[10px] text-white/50 font-mono">Scanning past 30 days...</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${auditStep >= 1 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/10'}`} />
                <span className={`text-xs ${auditStep >= 1 ? 'text-white' : 'text-white/30'}`}>Analyzing 142 transactions...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${auditStep >= 2 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/10'}`} />
                <span className={`text-xs ${auditStep >= 2 ? 'text-white' : 'text-white/30'}`}>Cross-referencing recurring mandates...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${auditStep >= 3 ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-white/10'}`} />
                <span className={`text-xs ${auditStep >= 3 ? 'text-amber-400 font-bold' : 'text-white/30'}`}>Identifying capital leakages...</span>
              </div>
            </div>

            <AnimatePresence>
              {auditStep >= 3 && auditSummary && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Executive Summary</h4>
                  <p className="text-xs text-white/80 leading-relaxed mb-2">
                    Identified <strong className="text-amber-400">₹{auditSummary.totalLeakage.toLocaleString('en-IN')}</strong> in unoptimized subscriptions.
                  </p>
                  {auditSummary.traps.length > 0 ? (
                    <ul className="text-xs text-white/80 space-y-1 mb-2">
                      {auditSummary.traps.map((trap, idx) => (
                        <li key={idx}>
                          • <strong>{trap.merchant}</strong> (₹{trap.latestAmount}) 
                          {trap.tags.map((tag, tIdx) => <span key={tIdx} className="ml-1 text-amber-400">{tag}</span>)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-400 mb-2">No active traps detected.</p>
                  )}
                  <button onClick={() => setShowAudit(false)} className="w-full mt-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg transition-colors border border-amber-500/20">
                    Review Traps
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Multi-Agent Demo Modal */}
    <AnimatePresence>
      {showMultiAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#09090b] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col max-w-lg w-full relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BrainCircuit size={24} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">Multi-Agent Sentinel</h3>
              </div>
              <Bot size={24} className="text-white/20" />
            </div>

            <div className="space-y-6">
              {/* Agent A */}
              <div className={`flex items-start gap-4 transition-opacity duration-500 ${multiAgentStep >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${multiAgentStep >= 1 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40 animate-pulse'}`}>
                  {multiAgentStep >= 1 ? <ShieldAlert size={16}/> : <Search size={16}/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Agent 1: Deterministic Sentinel</h4>
                  <p className="text-xs text-white/50 mb-1">Scanning merchant string for disguised gaming entities...</p>
                  {multiAgentStep >= 1 && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 font-mono">
                      [FLAG] Match found: Codashop - Free Fire (MCC_DECODER)
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Agent B */}
              <div className={`flex items-start gap-4 transition-opacity duration-500 ${multiAgentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${multiAgentStep >= 2 ? 'bg-amber-500/20 text-amber-400' : multiAgentStep === 1 ? 'bg-white/10 text-white/40 animate-pulse' : 'bg-white/5 text-white/10'}`}>
                  {multiAgentStep >= 2 ? <AlertTriangle size={16}/> : <Clock size={16}/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Agent 2: Behavioral Anomaly Engine</h4>
                  <p className="text-xs text-white/50 mb-1">Analyzing transaction timing and velocity patterns...</p>
                  {multiAgentStep >= 2 && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-amber-400 font-mono">
                      [WARNING] Late-night risk heuristic triggered.
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Agent C */}
              <div className={`flex items-start gap-4 transition-opacity duration-500 ${multiAgentStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${multiAgentStep >= 3 ? 'bg-purple-500/20 text-purple-400' : multiAgentStep === 2 ? 'bg-white/10 text-white/40 animate-pulse' : 'bg-white/5 text-white/10'}`}>
                  {multiAgentStep >= 3 ? <CheckCircle size={16}/> : <BrainCircuit size={16}/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Agent 3: Executive Arbiter</h4>
                  <p className="text-xs text-white/50 mb-1">Synthesizing findings to formulate final verdict...</p>
                  {multiAgentStep >= 3 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs text-purple-300 font-bold mb-1">Consensus: 99% Threat Severity</p>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest">Action: Revoke Mandate & Challenge</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            {multiAgentStep >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse">Pushing to UI Radar...</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
