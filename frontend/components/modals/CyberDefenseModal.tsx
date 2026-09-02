import React, { useState } from 'react';
import { X, Copy, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';
import { useWealthStore } from '@/lib/store';
import { analyzeTransactionMultiAgent, synthesizeExecutiveVerdictAsync, MultiAgentAnalysisResult } from '@/lib/multiAgentEngine';
import { BrainCircuit, Bot } from 'lucide-react';

export default function CyberDefenseModal() {
  const { isCyberDefenseOpen, setModal, cyberDefenseData, getActiveTransactions } = useWealthStore();
  const [copied, setCopied] = useState(false);

  const [multiAgent, setMultiAgent] = useState<MultiAgentAnalysisResult | null>(null);

  React.useEffect(() => {
    if (isCyberDefenseOpen && cyberDefenseData) {
      const initial = analyzeTransactionMultiAgent(cyberDefenseData, getActiveTransactions());
      setMultiAgent(initial);
      
      if (initial.isFlagged && initial.agentC.status === 'REASONING') {
        let isMounted = true;
        synthesizeExecutiveVerdictAsync(initial.agentA, initial.agentB, cyberDefenseData, getActiveTransactions()).then((agentC) => {
          if (isMounted) {
            setMultiAgent(prev => prev ? { ...prev, agentC } : prev);
          }
        });
        return () => { isMounted = false; };
      }
    } else {
      setMultiAgent(null);
    }
  }, [isCyberDefenseOpen, cyberDefenseData]);

  if (!isCyberDefenseOpen || !cyberDefenseData || !multiAgent) return null;
  
  const utrNumber = (cyberDefenseData as any).utr_reference || `CMS-${Date.now().toString().slice(-8)}`;

  const narrative = `COMPLAINT NARRATIVE:
To: cybercrime.gov.in (National Cyber Crime Reporting Portal)
Date: ${new Date().toLocaleDateString()}

I am reporting an unauthorized transaction on my account. The details are as follows:
Merchant/Gateway: ${cyberDefenseData.merchant}
Amount: ₹${cyberDefenseData.amount.toLocaleString('en-IN')}
Transaction ID / UTR: ${utrNumber}

This transaction was executed without verified consent, potentially indicating systemic fraud, dark-pattern auto-renewal, or a disguised gaming/betting gateway. Please freeze the destination account immediately and initiate chargeback protocols.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setModal('isCyberDefenseOpen', false)} 
      />
      
      <div 
        className="relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--surface-overlay)', borderColor: 'var(--border-danger)', color: 'var(--text-primary)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-red-400">Cyber Defense SOS</h2>
          </div>
          <button 
            onClick={() => setModal('isCyberDefenseOpen', false)} 
            className="p-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 opacity-50" />
          </button>
        </div>

        <p className="text-sm opacity-80 mb-6 font-medium">
          Generate an official complaint narrative for unauthorized debits. Proceed to register the complaint directly with the National Portal (1930) or dispute it with the merchant.
        </p>

        <div className="mb-6 bg-black/40 p-4 rounded-xl border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Multi-Agent Consensus Audit</h3>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Agent 1 (Deterministic Sentinel):</span>
              {multiAgent.agentA.status === 'FLAG' ? (
                <span className="text-red-400 font-bold flex items-center gap-1"><ShieldAlert size={12}/> FLAG (MCC_DECODER)</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> PASS</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Agent 2 (Behavioral Anomaly):</span>
              {multiAgent.agentB.status === 'FLAG' ? (
                <span className="text-amber-400 font-bold flex items-center gap-1"><ShieldAlert size={12}/> FLAG ({multiAgent.agentB.anomalyType})</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> PASS</span>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1 relative min-h-[60px] justify-center">
              <span className="text-[10px] uppercase tracking-wider text-white/40 absolute top-2">Agent 3 (Executive Arbiter) Verdict:</span>
              {multiAgent.agentC.status === 'REASONING' ? (
                <div className="flex items-center justify-center pt-6 pb-2">
                  <span className="text-[10px] text-purple-400 font-mono animate-pulse">🤖 Synthesizing Executive Verdict...</span>
                </div>
              ) : (
                <div className="pt-6">
                  <p className="text-xs text-white/90">{multiAgent.agentC.plainTextVerdict}</p>
                  <span className="text-[10px] text-red-400 font-bold mt-1">RECOMMENDATION: {multiAgent.agentC.actionableNextStep}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Generated Narrative</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white/5 hover:bg-white/10"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Complaint'}
            </button>
          </div>
          <pre className="p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-auto" style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
            {narrative}
          </pre>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a 
            href="https://cybercrime.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
          >
            NCRP Portal (1930)
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
          <a 
            href="https://play.google.com/store/account/orderhistory" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-colors"
            style={{ backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
          >
            Google Play Dispute
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
}
