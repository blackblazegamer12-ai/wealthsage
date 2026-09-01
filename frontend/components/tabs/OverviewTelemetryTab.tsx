"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BarChart3, Shield } from "lucide-react";
import OverviewTab from "./OverviewTab";
import AnalyticsTab from "./AnalyticsTab";
import dynamic from "next/dynamic";

const SovereignScore = dynamic(() => import("../SovereignScore"), {
  ssr: false,
  loading: () => (
    <div className="glass-panel rounded-3xl p-8 animate-pulse border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      <div className="h-48 flex items-center justify-center text-[var(--text-dim)] text-xs font-mono">
        Calculating Sovereign Score...
      </div>
    </div>
  ),
});

export default function OverviewTelemetryTab(props: any) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScore, setShowScore] = useState(false);

  return (
    <div className="space-y-6">
      <OverviewTab {...props} />

      {/* Sovereign Score Toggle */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-white/10" />
        <button
          onClick={() => setShowScore(!showScore)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest text-[var(--text-dim)] border border-white/10 hover:text-white hover:bg-white/5 transition-colors uppercase"
        >
          <Shield size={14} />
          {showScore ? "Hide Sovereign Score" : "Show Sovereign Score"}
          {showScore ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <AnimatePresence>
        {showScore && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <SovereignScore
                transactions={props.transactions || []}
                goals={[]}
                subscriptions={[]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Analytics Toggle */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-white/10" />
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest text-[var(--text-dim)] border border-white/10 hover:text-white hover:bg-white/5 transition-colors uppercase"
        >
          <BarChart3 size={14} />
          {showAnalytics ? "Hide Advanced Analytics" : "Show Advanced Analytics"}
          {showAnalytics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <AnalyticsTab {...props} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
