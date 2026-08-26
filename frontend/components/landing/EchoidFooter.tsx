"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EchoidFooter() {
  return (
    <section className="relative w-full min-h-[600px] bg-black flex flex-col items-center justify-between overflow-hidden pt-32 pb-8 border-t border-[var(--line)]">
      
      {/* Massive Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="font-sans font-black text-[15vw] tracking-tighter leading-none whitespace-nowrap">
          WEALTHSAGE
        </h1>
      </div>

      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-4xl px-[var(--gutter)] text-center flex-1 justify-center">
        <div className="w-16 h-16 rounded-full border border-[var(--accent-brass)] flex items-center justify-center text-xl text-black bg-[var(--accent-brass)] mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          ⚡
        </div>
        
        <h2 className="font-sans font-light text-5xl md:text-7xl text-white tracking-tight">
          Ready to initialize?
        </h2>
        
        <p className="font-sans text-lg text-[var(--text-dim)] max-w-xl mx-auto">
          Secure your sovereign financial identity today. No credit card required.
        </p>

        <div className="mt-8">
           <Link href="/sign-up" className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-white text-black rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             <span className="font-mono text-sm font-bold tracking-widest uppercase">Initialize</span>
             <ArrowRight size={16} />
           </Link>
        </div>
      </div>

      {/* Actual Footer Links */}
      <footer className="z-10 w-full max-w-[1400px] px-[var(--gutter)] mt-32 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--line)] pt-8">
         <div className="flex items-center gap-8 font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase">
            <Link href="#" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link href="#" className="hover:text-white transition-colors">Service Contract</Link>
            <Link href="#" className="hover:text-white transition-colors">Audit Log</Link>
         </div>
         <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-widest uppercase opacity-50">
            SYSTEM ID: WS-PRO-V2
         </p>
      </footer>
    </section>
  );
}
