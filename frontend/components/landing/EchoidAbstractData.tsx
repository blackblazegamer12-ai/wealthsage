"use client";

import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";

export default function EchoidAbstractData() {
  const [stream, setStream] = useState<string[]>([]);

  useEffect(() => {
    const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const interval = setInterval(() => {
      setStream(prev => [
        `[${new Date().toISOString()}] SYNC_${generateHash().toUpperCase()} : VERIFIED`,
        ...prev.slice(0, 15)
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[800px] bg-black flex items-center justify-center overflow-hidden border-t border-[var(--line)]">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Abstract Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full border border-white/20 animate-[spin_40s_linear_infinite]"></div>
        <div className="absolute w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full border border-white/10 animate-[spin_30s_linear_infinite_reverse]"></div>
        <div className="absolute w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full border border-dashed border-white/30 animate-[spin_20s_linear_infinite]"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-5xl px-[var(--gutter)]">
        
        {/* Animated Voice Orb */}
        <div className="relative group cursor-pointer">
           <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="relative w-32 h-32 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border border-[#d4af37]/50 animate-ping opacity-30"></div>
             <div className="absolute inset-2 rounded-full border border-white/20 animate-[spin_3s_linear_infinite]"></div>
             <Mic size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
           </div>
        </div>

        {/* Abstract Header */}
        <div className="text-center">
          <p className="font-mono text-[10px] text-[#d4af37] tracking-[0.4em] uppercase mb-4">Acoustic Telemetry</p>
          <h2 className="font-sans font-light text-4xl md:text-6xl text-white tracking-tight">
            Omnipresent Audio Vectoring
          </h2>
        </div>

        {/* Terminal Stream */}
        <div className="w-full max-w-2xl bg-white/[0.01] border border-[var(--line)] rounded-2xl p-6 h-[240px] overflow-hidden relative backdrop-blur-md">
           <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black to-transparent z-10"></div>
           <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent z-10"></div>
           <div className="flex flex-col gap-2 font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase opacity-70">
             {stream.map((line, i) => (
                <div key={i} className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {line}
                </div>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}
