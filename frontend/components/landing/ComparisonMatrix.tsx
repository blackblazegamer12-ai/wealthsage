"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ComparisonMatrix() {
  const features = [
    {
      name: "Data Entry",
      traditional: "Manual input & rigid spreadsheets",
      wealthsage: "Frictionless Voice & Receipt AI Capture",
    },
    {
      name: "Subscription Management",
      traditional: "Hidden fees drain your accounts",
      wealthsage: "AI Zombie Sub Killer detects unused plans",
    },
    {
      name: "Wealth Simulation",
      traditional: "Static formulas & guesswork",
      wealthsage: "Real-time Compounding Simulator",
    },
    {
      name: "Data Privacy",
      traditional: "Sells your financial data to advertisers",
      wealthsage: "Enterprise-grade encryption, zero data sold",
    },
  ];

  return (
    <section className="relative w-full bg-black py-32 px-[var(--gutter)] flex flex-col items-center border-t border-[var(--line)]">
      <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
        <h2 className="font-sans font-light text-4xl md:text-6xl text-white mb-4 tracking-tight">
          The Evolution of Wealth
        </h2>
        <p className="font-mono text-[10px] md:text-xs text-[var(--text-dim)] uppercase tracking-[0.2em] max-w-xl">
          Why top professionals are abandoning legacy apps for WealthSage.
        </p>
      </div>

      <div className="w-full max-w-[1200px] overflow-x-auto pb-8">
        <div className="min-w-[700px] flex flex-col border border-[var(--line-strong)] rounded-2xl overflow-hidden bg-white/[0.01]">
          {/* Header */}
          <div className="grid grid-cols-3 bg-white/[0.03] border-b border-[var(--line-strong)]">
            <div className="p-6 md:p-8 flex items-center">
              <span className="font-mono text-xs text-[var(--text-dim)] tracking-widest uppercase">Feature</span>
            </div>
            <div className="p-6 md:p-8 flex items-center border-l border-[var(--line-strong)]">
              <span className="font-sans font-medium text-lg text-white/50">Legacy Apps</span>
            </div>
            <div className="p-6 md:p-8 flex items-center border-l border-[#B48A5A]/30 bg-[#B48A5A]/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B48A5A] to-transparent opacity-50"></div>
              <span className="font-sans font-bold text-xl text-[#B48A5A] flex items-center gap-2">
                <span className="text-xl">⚡</span> WealthSage AI
              </span>
            </div>
          </div>

          {/* Rows */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ transform: "translateZ(0)" }}
              className="grid grid-cols-3 border-b border-[var(--line-strong)] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="p-6 md:p-8 flex items-center">
                <span className="font-sans text-white text-base md:text-lg">{feature.name}</span>
              </div>
              <div className="p-6 md:p-8 flex items-center gap-3 border-l border-[var(--line-strong)]">
                <XCircle size={18} className="text-red-500/50 shrink-0" />
                <span className="font-sans text-[var(--text-dim)] text-sm md:text-base leading-snug">{feature.traditional}</span>
              </div>
              <div className="p-6 md:p-8 flex items-center gap-3 border-l border-[#B48A5A]/30 bg-[#B48A5A]/[0.02]">
                <CheckCircle2 size={18} className="text-[#B48A5A] shrink-0" />
                <span className="font-sans text-white text-sm md:text-base leading-snug">{feature.wealthsage}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
