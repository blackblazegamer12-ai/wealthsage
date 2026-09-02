"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2, AlertTriangle, Network } from 'lucide-react';
import { useWealthStore } from '@/lib/store';
import { analyzeTransactionMultiAgent } from '@/lib/multiAgentEngine';

function AACallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'processing' | 'error' | 'success'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const hasProcessed = useRef(false);
  
  const { addToast, currentUserId, fetchExecutiveBriefing } = useWealthStore();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      const success = searchParams.get('success');
      const id = searchParams.get('id');
      const errorcode = searchParams.get('errorcode');

      if (success !== 'true' || !id || errorcode) {
        setStatus('error');
        setErrorMsg(errorcode || 'Consent was rejected or failed.');
        return;
      }

      setStatus('processing');
      
      try {
        const res = await fetch('/api/aa/fetch-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ consentId: id })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        // Process fetched transactions through Multi-Agent pipeline
        const newTransactions = data.data || [];
        let flaggedCount = 0;
        const currentLedger = useWealthStore.getState().transactions;

        const processedTxs = newTransactions.map((tx: any) => {
          // Temporarily add to ledger to check against velocity
          const tempLedger = [...currentLedger, tx];
          const result = analyzeTransactionMultiAgent(tx, tempLedger);
          if (result.isFlagged) {
            tx.status = 'flagged';
            flaggedCount++;
          }
          tx.user_id = currentUserId;
          return tx;
        });

        // Insert into Zustand Store
        if (processedTxs.length > 0) {
           useWealthStore.setState((s) => ({
             transactions: [...processedTxs, ...s.transactions]
           }));
           // Call executive briefing to update insights
           fetchExecutiveBriefing([...processedTxs, ...currentLedger], useWealthStore.getState().goals, useWealthStore.getState().subscriptions);
        }

        setStatus('success');
        addToast('Telemetry Link Secured', `Imported ${processedTxs.length} transactions via RBI Account Aggregator.`, 'success');
        if (flaggedCount > 0) {
          addToast('Multi-Agent Sentinel', `${flaggedCount} incoming transactions were flagged by AI.`, 'warning');
          useWealthStore.setState({ isNotifCenterOpen: true });
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);

      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Failed to fetch telemetry data.');
      }
    };

    processCallback();
  }, [searchParams, router, addToast, currentUserId, fetchExecutiveBriefing]);

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(circle at top, rgba(16,185,129,0.05), transparent 60%)' }}>
      <div className="w-full max-w-md p-8 rounded-3xl border shadow-2xl flex flex-col items-center text-center relative overflow-hidden" style={{ backgroundColor: 'var(--surface-overlay)', borderColor: 'var(--border-subtle)' }}>
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative z-10 w-full">
          {status === 'loading' && (
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 text-emerald-400 animate-spin opacity-50" />
               <p className="text-white/60 text-sm animate-pulse">Initializing Telemetry Link...</p>
             </div>
          )}

          {status === 'processing' && (
             <div className="flex flex-col items-center gap-4">
               <div className="relative w-16 h-16 flex items-center justify-center">
                 <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping" />
                 <Network className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Securing Telemetry Link</h3>
               <p className="text-white/50 text-xs mt-2">Pulling encrypted transaction fragments...</p>
             </div>
          )}

          {status === 'success' && (
             <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                 <ShieldCheck className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-white font-bold text-lg">Bank Connected</h3>
               <p className="text-white/50 text-xs">Redirecting to Guardian Shield...</p>
             </div>
          )}

          {status === 'error' && (
             <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                 <AlertTriangle className="w-8 h-8 text-red-400" />
               </div>
               <h3 className="text-red-400 font-bold text-lg">Connection Failed</h3>
               <p className="text-white/50 text-xs">{errorMsg}</p>
               <button onClick={() => router.push('/dashboard')} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-bold">
                 Return to Dashboard
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AACallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000] flex items-center justify-center"><Loader2 className="w-12 h-12 text-emerald-400 animate-spin" /></div>}>
      <AACallbackContent />
    </Suspense>
  );
}
