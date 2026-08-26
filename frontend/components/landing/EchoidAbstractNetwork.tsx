"use client";

import React, { useEffect, useState } from "react";
import { Activity, Network } from "lucide-react";

export default function EchoidAbstractNetwork() {
  const [nodes, setNodes] = useState<{ id: number; active: boolean }[]>([]);

  useEffect(() => {
    // Generate a grid of nodes
    const initialNodes = Array.from({ length: 64 }).map((_, i) => ({ id: i, active: Math.random() > 0.8 }));
    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        active: Math.random() > 0.85
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[800px] bg-black flex flex-col items-center justify-center overflow-hidden border-t border-[var(--line)]">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 flex flex-col lg:flex-row items-center gap-16 w-full max-w-6xl px-[var(--gutter)]">
        
        {/* Left: Text & Metrics */}
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="w-12 h-12 rounded-xl border border-[var(--line-strong)] flex items-center justify-center bg-white/[0.02] mb-8">
            <Network size={20} className="text-white" />
          </div>
          <p className="font-mono text-[10px] text-[#d4af37] tracking-[0.4em] uppercase mb-4">Neural Architecture</p>
          <h2 className="font-sans font-light text-4xl md:text-6xl text-white tracking-tight mb-12">
            Distributed Subsystem Intelligence
          </h2>

          <div className="flex flex-col gap-4 w-full max-w-md">
             <div className="glass-panel p-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Global Latency</span>
                <span className="font-mono text-xs text-white">4.2ms</span>
             </div>
             <div className="glass-panel p-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Active Nodes</span>
                <span className="font-mono text-xs text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  12,842
                </span>
             </div>
             <div className="glass-panel p-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">Vector Sync</span>
                <span className="font-mono text-xs text-[#d4af37]">STABILIZED</span>
             </div>
          </div>
        </div>

        {/* Right: Node Grid */}
        <div className="flex-1 w-full max-w-lg aspect-square relative glass-panel p-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/5 m-4 rounded-[24px]"></div>
          <div className="grid grid-cols-8 gap-4 w-full h-full">
            {nodes.map(node => (
              <div 
                key={node.id} 
                className={`rounded-sm transition-all duration-1000 ${
                  node.active 
                    ? 'bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-110' 
                    : 'bg-white/5 scale-100'
                }`}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
