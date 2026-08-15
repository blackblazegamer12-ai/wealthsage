"use client";
import React from "react";
import { motion } from "framer-motion";
import WhatIfSimulator from "../WhatIfSimulator";

export default function SimulatorTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
          Opportunity Cost & Compound Horizon
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          "What-If" Wealth Opportunity Simulator
        </h1>
        <p className="text-slate-400 mt-1.5 text-sm">
          Simulate the long-term wealth differential of redirecting small daily habitual spending into high-yield index vehicles.
        </p>
      </div>

      <WhatIfSimulator />
    </motion.div>
  );
}
