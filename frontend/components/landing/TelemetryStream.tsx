"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  Clock,
  Terminal
} from "lucide-react";
import { TelemetryEvent } from "../../types";

const INITIAL_EVENTS: TelemetryEvent[] = [
  {
    id: "evt-1",
    timestamp: Date.now() - 3200,
    label: "Treasury Yield Auto-Compound",
    value: "+$418.50",
    delta: "+4.85% APY",
    type: "inflow",
    status: "confirmed",
  },
  {
    id: "evt-2",
    timestamp: Date.now() - 2500,
    label: "Zombie Sub Auto-Cancellation (Gym #88)",
    value: "+$65.00/mo",
    delta: "Waste Zeroed",
    type: "audit",
    status: "confirmed",
  },
  {
    id: "evt-3",
    timestamp: Date.now() - 1800,
    label: "S&P 500 DCA Liquidity Sweep",
    value: "-$1,250.00",
    delta: "Indexed",
    type: "outflow",
    status: "confirmed",
  },
  {
    id: "evt-4",
    timestamp: Date.now() - 1100,
    label: "Gemini 2.5 Flash Telemetry Briefing",
    value: "Score 89/100",
    delta: "Optimal Runway",
    type: "compute",
    status: "confirmed",
  },
  {
    id: "evt-5",
    timestamp: Date.now() - 400,
    label: "Tax Loss Harvesting Sweep",
    value: "+$340.20 Tax Alpha",
    delta: "Executed",
    type: "hedge",
    status: "confirmed",
  },
];

const STREAM_POOL = [
  { label: "Dividend Reinvestment (VOO)", value: "+$84.20", delta: "+3.2%", type: "inflow" as const },
  { label: "Sub Extermination (Adobe CC)", value: "+$54.99/mo", delta: "Pruned", type: "audit" as const },
  { label: "Automated Tech DCA Allocation", value: "-$800.00", delta: "Allocated", type: "outflow" as const },
  { label: "Autonomous Risk Stress-Test", value: "0.04% VAR", delta: "Passed", type: "compute" as const },
  { label: "Arbitrage Liquidity Lock", value: "+$195.00", delta: "Zero Slippage", type: "hedge" as const },
  { label: "High-Yield Reserve Interest", value: "+$112.40", delta: "+5.1% HYSA", type: "inflow" as const },
  { label: "Cloud Infra Cost Optimization", value: "+$32.00/mo", delta: "Saved", type: "audit" as const },
];

export default function TelemetryStream() {
  const [events, setEvents] = useState<TelemetryEvent[]>(INITIAL_EVENTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [latency, setLatency] = useState<number>(34);
  const [totalProcessed, setTotalProcessed] = useState<number>(14892);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const randomItem = STREAM_POOL[Math.floor(Math.random() * STREAM_POOL.length)];
      const newEvent: TelemetryEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
        label: randomItem.label,
        value: randomItem.value,
        delta: randomItem.delta,
        type: randomItem.type,
        status: "confirmed",
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 6)]);
      setLatency(Math.floor(28 + Math.random() * 18));
      setTotalProcessed((prev) => prev + 1);
    }, 2400);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const getEventBadge = (type: TelemetryEvent["type"]) => {
    switch (type) {
      case "inflow":
        return {
          icon: ArrowUpRight,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          tag: "INFLOW",
        };
      case "outflow":
        return {
          icon: ArrowDownRight,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          tag: "CAPITAL DRAIN",
        };
      case "compute":
        return {
          icon: Cpu,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          tag: "QUANT AI",
        };
      case "hedge":
        return {
          icon: Zap,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          tag: "ALPHA HEDGE",
        };
      case "audit":
        return {
          icon: ShieldCheck,
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          tag: "LEAK KILLED",
        };
    }
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-[#11131a]/95 border border-white/10 shadow-2xl p-4 sm:p-6 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Stream Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Terminal size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Live Autonomous Telemetry Stream
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                STREAMING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous WebSocket event feed logging real-time capital sweeps, AI insights, and hedge executions
            </p>
          </div>
        </div>

        {/* Stream Controls */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Clock size={13} className="text-cyan-400" />
            Latency: <strong className="text-cyan-300 tabular-nums">{latency}ms</strong>
          </span>

          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 hidden sm:flex items-center gap-1.5">
            <Activity size={13} className="text-amber-400" />
            Events: <strong className="text-white tabular-nums">{totalProcessed.toLocaleString()}</strong>
          </span>

          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-all cursor-pointer"
          >
            {isStreaming ? (
              <>
                <Pause size={13} className="text-amber-400" /> Pause
              </>
            ) : (
              <>
                <Play size={13} className="text-emerald-400" /> Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2.5 min-h-[300px]">
        <AnimatePresence initial={false}>
          {events.map((evt) => {
            const badge = getEventBadge(evt.type);
            const Icon = badge.icon;

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/30 border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all group"
              >
                {/* Left: Event Icon + Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl border shrink-0 ${badge.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {evt.label}
                      </p>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-extrabold border ${badge.color}`}>
                        {badge.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Tick: #{evt.id.slice(-6)} · Verified by Autonomous Ledger
                    </p>
                  </div>
                </div>

                {/* Right: Value + Delta */}
                <div className="text-right shrink-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white tabular-nums">
                    {evt.value}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">
                    {evt.delta}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Terminal footer status bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Channel: wss://realtime.wealthsage.io/telemetry/v2</span>
        <span className="text-emerald-400/90 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Zero Buffer Loss · Protocol SHA-256 Validated
        </span>
      </div>
    </div>
  );
}
