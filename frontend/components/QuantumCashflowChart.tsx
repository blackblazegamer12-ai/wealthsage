"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function QuantumCashflowChart({ currentBurn = 25000, leakage = 5000 }) {
  const [points, setPoints] = useState({
    optimized: "",
    baseline: "",
  });

  useEffect(() => {
    // Generate SVG path points
    const width = 800;
    const height = 300;
    
    // Baseline timeline (leaking)
    let bPath = "M 0,200 ";
    // Optimized timeline (leakage removed)
    let oPath = "M 0,200 ";

    let bY = 200;
    let oY = 200;

    for (let day = 1; day <= 90; day++) {
      const x = (day / 90) * width;
      
      // baseline drops faster
      bY += (currentBurn / 30 / 100); 
      // optimized drops slower
      oY += ((currentBurn - leakage) / 30 / 100);

      // Add quantum noise for visual effect
      const noise1 = Math.sin(day * 0.5) * 5;
      const noise2 = Math.cos(day * 0.3) * 5;

      bPath += `L ${x},${Math.min(height - 10, bY + noise1)} `;
      oPath += `L ${x},${Math.min(height - 10, oY + noise2)} `;
    }

    setPoints({ baseline: bPath, optimized: oPath });
  }, [currentBurn, leakage]);

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-2xl border border-zinc-800/80 bg-black/50 p-4">
      <h3 className="absolute top-4 left-6 text-sm font-bold text-white z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        90-Day Parallel Timeline Projection
      </h3>
      
      <svg 
        className="w-full h-full" 
        viewBox="0 0 800 300" 
        preserveAspectRatio="none"
        role="img"
        aria-labelledby="quantum-chart-title quantum-chart-desc"
      >
        <title id="quantum-chart-title">90-Day Predictive Cashflow Chart</title>
        <desc id="quantum-chart-desc">A line chart displaying two parallel timelines over 90 days. The red baseline shows status quo cash burn, and the green line shows the optimized trajectory with subscription leaks removed.</desc>
        <defs>
          <linearGradient id="optGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Baseline Path */}
        <motion.path
          d={points.baseline}
          fill="none"
          stroke="url(#baseGrad)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Optimized Path */}
        <motion.path
          d={points.optimized}
          fill="none"
          stroke="url(#optGrad)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Grid lines */}
        <line x1="0" y1="150" x2="800" y2="150" stroke="#333" strokeDasharray="4 4" />
        <line x1="266" y1="0" x2="266" y2="300" stroke="#333" strokeDasharray="4 4" />
        <line x1="533" y1="0" x2="533" y2="300" stroke="#333" strokeDasharray="4 4" />
        
        <text x="266" y="290" fill="#666" fontSize="10" textAnchor="middle">Day 30</text>
        <text x="533" y="290" fill="#666" fontSize="10" textAnchor="middle">Day 60</text>
        <text x="790" y="290" fill="#666" fontSize="10" textAnchor="end">Day 90</text>
      </svg>
      
      <div className="absolute bottom-4 right-6 flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-400 rounded-sm" /> Optimized (Traps Removed)
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-3 h-3 bg-red-400 rounded-sm" /> Baseline (Status Quo)
        </div>
      </div>
    </div>
  );
}
