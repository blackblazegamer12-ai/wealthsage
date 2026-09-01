"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mic, ArrowUpRight, Cpu, TrendingUp, Scan, UploadCloud, FileText, CheckCircle2, Camera, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function InteractiveVoiceSandbox() {
  const [state, setState] = useState<'idle' | 'listening' | 'typing' | 'reconciled'>('idle');
  const [activeTag, setActiveTag] = useState<{ text: string, amount: string, category: string } | null>(null);
  const [typedText, setTypedText] = useState('');

  const tags = [
    { text: "Spent ₹850 at Blue Tokai", amount: "₹850", category: "Dining" },
    { text: "Invested ₹15,000 in Nifty SIP", amount: "₹15,000", category: "Investments" },
    { text: "Paid ₹3,200 Electricity Bill", amount: "₹3,200", category: "Bills" }
  ];

  const handleTagClick = (tag: typeof tags[0]) => {
    if (state !== 'idle') return;
    setActiveTag(tag);
    setState('listening');
    
    // Simulate waveform
    setTimeout(() => {
      setState('typing');
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(tag.text.slice(0, i + 1));
        i++;
        if (i >= tag.text.length) {
          clearInterval(interval);
          setTimeout(() => setState('reconciled'), 400);
        }
      }, 40);
    }, 800);
  };

  const reset = () => {
    setState('idle');
    setActiveTag(null);
    setTypedText('');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
      <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-[var(--line-strong)] flex items-center justify-center mb-6 relative">
        {state === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-[#B48A5A] shadow-[0_0_15px_#B48A5A]"
            style={{ transform: "translateZ(0)" }}
          />
        )}
        <Mic size={24} className={state === 'listening' ? "text-[#B48A5A]" : "text-white/40"} />
      </div>

      <div className="h-[80px] flex items-center justify-center w-full px-4 mb-2">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap justify-center gap-2"
              style={{ transform: "translateZ(0)" }}
            >
              {tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-[var(--text-dim)] hover:text-white hover:border-white/30 transition-all hover:bg-white/10"
                >
                  "{tag.text}"
                </button>
              ))}
            </motion.div>
          )}

          {state === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 h-8"
              style={{ transform: "translateZ(0)" }}
            >
              {[1, 2, 3, 4, 5].map((bar) => (
                <motion.div
                  key={bar}
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: bar * 0.1 }}
                  className="w-1 bg-[#B48A5A] rounded-full"
                />
              ))}
            </motion.div>
          )}

          {state === 'typing' && (
            <motion.p
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-sm text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-center shadow-lg"
              style={{ transform: "translateZ(0)" }}
            >
              🎙️ {typedText}
              <span className="animate-pulse">_</span>
            </motion.p>
          )}

          {state === 'reconciled' && activeTag && (
            <motion.div
              key="reconciled"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={reset}
              style={{ transform: "translateZ(0)" }}
            >
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <CheckCircle2 size={14} className="shrink-0" />
                ✓ Reconciled into {activeTag.category} • {activeTag.amount}
              </div>
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest mt-1 opacity-50 hover:opacity-100 transition-opacity">Tap to reset</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EverythingYouNeed() {
  const [activeMode, setActiveMode] = useState<'voice' | 'file'>('voice');

  return (
    <section id="features" className="w-full bg-black py-32 px-[var(--gutter)] flex flex-col items-center border-t border-[var(--line)]">
      
      {/* Header */}
      <div className="text-center mb-24 flex flex-col items-center">
        <h2 className="font-sans font-light text-5xl md:text-7xl text-white mb-6 tracking-tight">
          Everything You Need
        </h2>
        <p className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase tracking-[0.25em]">
          POWERFUL TOOLS THAT WORK TOGETHER TO GROW YOUR WEALTH.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-[1400px]">
        
        {/* Card 1: Frictionless AI Capture (Large - Spans 2 cols) */}
        <div className="glass-panel p-8 md:p-12 flex flex-col lg:flex-row gap-12 group min-h-[480px] lg:col-span-2 items-center justify-between">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8">
              <Scan size={20} className="text-white" />
            </div>
            
            <h3 className="font-sans text-3xl text-white mb-4 leading-tight">
              Frictionless AI Capture
            </h3>
            
            <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed max-w-lg">
              Log transactions, receipts, or spending voice-notes instantly. Our AI parses, categorizes, and reconciles your ledger in milliseconds.
            </p>
          </div>
          
          {/* Visual Component */}
          <div className="relative w-full lg:w-[360px] h-[320px] lg:h-full min-h-[240px] rounded-2xl border border-white/10 bg-white/[0.015] backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
            {/* Toggle */}
            <div className="absolute top-4 flex justify-center gap-2 z-10 bg-black/40 md:backdrop-blur-xl max-md:backdrop-blur-sm max-md:bg-black/60 p-1.5 rounded-full border border-white/10">
              <button 
                onClick={() => setActiveMode('voice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-widest transition-all duration-300 relative ${
                  activeMode === 'voice' 
                    ? 'bg-[#B48A5A] text-[#050505] font-medium scale-105 shadow-[0_0_20px_rgba(180,138,90,0.3)]' 
                    : 'text-[var(--text-dim)] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {activeMode === 'voice' && (
                  <div className="absolute inset-0 rounded-full border border-[#B48A5A]/50 animate-ping opacity-50"></div>
                )}
                <Mic size={14} className={activeMode === 'voice' ? 'animate-pulse text-[#050505]' : ''} /> Voice Entry
              </button>
              <button 
                onClick={() => setActiveMode('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-widest transition-all duration-300 ${
                  activeMode === 'file' 
                    ? 'bg-white text-black shadow-lg scale-105' 
                    : 'text-[var(--text-dim)] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <UploadCloud size={14} /> File Drop
              </button>
            </div>
            
            {/* Mode A: Voice */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${activeMode === 'voice' ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}>
               <InteractiveVoiceSandbox />
            </div>

            {/* Mode B: File Drop */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${activeMode === 'file' ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}>
               
               <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 mt-8">
                  {/* Viewfinder borders */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37] opacity-70"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37] opacity-70"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37] opacity-70"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37] opacity-70"></div>
                  
                  <Camera size={24} className="text-white/40" />

                  {/* Floating Tags */}
                  <div className="absolute -top-4 -right-6 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2 py-1 rounded text-[9px] font-mono animate-bounce" style={{ animationDelay: '0.2s' }}>.pdf</div>
                  <div className="absolute -bottom-2 -left-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded text-[9px] font-mono animate-bounce" style={{ animationDelay: '0.5s' }}>.png</div>
                  
                  {/* Scanning Laser Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_10px_#d4af37] opacity-50 animate-scan"></div>
               </div>
               
               <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] mt-10 uppercase text-center mx-4">
                 Drop receipt or scan camera
               </p>
            </div>

          </div>
        </div>

        {/* Card 2: AI Financial Copilot */}
        <div className="glass-panel p-8 md:p-12 flex flex-col justify-between group min-h-[480px] lg:col-span-1">
          <div>
            <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8">
              <Cpu size={20} className="text-[var(--text-dim)]" />
            </div>
            
            <div className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] mb-2 uppercase">AI-Powered</div>
            <h3 className="font-sans text-2xl text-white mb-4">
              AI Financial Copilot
            </h3>
            
            <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed">
              Chat naturally to log expenses, audit spending, and get personalized savings recommendations — all powered by AI.
            </p>
          </div>
          
          <div className="mt-12 flex items-end justify-between border-t border-[var(--line)] pt-6">
             <div>
                <p className="text-white font-sans font-bold">Instant</p>
                <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase">Response Time</p>
             </div>
             <Link href="/dashboard" className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-dim)] hover:text-white tracking-[0.2em] uppercase transition-colors px-4 py-2 border border-[var(--line)] rounded-lg hover:bg-white/[0.05]">
               Explore <ArrowUpRight size={14} />
             </Link>
          </div>
        </div>

        {/* Card 3: Wealth Growth Simulator */}
        <div className="glass-panel p-8 md:p-12 flex flex-col justify-between group min-h-[480px] lg:col-span-1">
          <div>
            <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8">
              <TrendingUp size={20} className="text-[var(--text-dim)]" />
            </div>
            
            <div className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] mb-2 uppercase">Wealth Simulation</div>
            <h3 className="font-sans text-2xl text-white mb-4">
              Wealth Growth Simulator
            </h3>
            
            <p className="font-sans text-sm text-[var(--text-dim)] leading-relaxed">
              See how your monthly savings grow over time with realistic compounding projections based on real market returns.
            </p>
          </div>
          
          <div className="mt-12 flex items-end justify-between border-t border-[var(--line)] pt-6">
             <div>
                <p className="text-white font-sans font-bold">+24.8%</p>
                <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.2em] uppercase">Projected 5-Year Growth</p>
             </div>
             <Link href="/dashboard" className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-dim)] hover:text-white tracking-[0.2em] uppercase transition-colors px-4 py-2 border border-[var(--line)] rounded-lg hover:bg-white/[0.05]">
               Explore <ArrowUpRight size={14} />
             </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
