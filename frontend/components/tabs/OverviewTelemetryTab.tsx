"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BarChart3, Shield, Settings2 } from "lucide-react";
import OverviewTab from "./OverviewTab";
import AnalyticsTab from "./AnalyticsTab";
import Dropdown from "../Dropdown";
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

      {/* Controls Dropdown */}
      <div className="flex items-center justify-end py-2">
        <Dropdown 
          label="View Options"
          icon={<Settings2 size={14} />}
          items={[
            {
              id: 'toggle-score',
              label: showScore ? "Hide Sovereign Score" : "Show Sovereign Score",
              icon: <Shield size={14} />,
              onClick: () => setShowScore(!showScore)
            },
            {
              id: 'toggle-analytics',
              label: showAnalytics ? "Hide Advanced Analytics" : "Show Advanced Analytics",
              icon: <BarChart3 size={14} />,
              onClick: () => setShowAnalytics(!showAnalytics)
            }
          ]}
        />
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
