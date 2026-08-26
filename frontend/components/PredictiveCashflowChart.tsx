"use client";
import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Sparkles, TrendingUp, ShieldCheck, Zap, Sliders, Calendar } from "lucide-react";

interface PredictiveCashflowChartProps {
  monthlyIncome: number;
  monthlyExpense: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function PredictiveCashflowChart({
  monthlyIncome,
  monthlyExpense
}: PredictiveCashflowChartProps) {
  const [strategy, setStrategy] = useState<"conservative" | "baseline" | "aggressive">("baseline");
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [reinvestPct, setReinvestPct] = useState<number>(80);

  const netSurplus = Math.max(0, monthlyIncome - monthlyExpense);

  const returnRate = useMemo(() => {
    if (strategy === "conservative") return 0.045; // 4.5% Treasury/HYSA
    if (strategy === "aggressive") return 0.12; // 12% Growth
    return 0.085; // 8.5% S&P 500
  }, [strategy]);

  // Compute Year-by-Year compounding simulation
  const { chartData, projectedTotal, totalContributions } = useMemo(() => {
    const monthlyContribution = (netSurplus * reinvestPct) / 100;
    const monthlyRate = returnRate / 12;
    const data = [];

    let runningWealth = 0;
    let runningPrincipal = 0;

    for (let yr = 1; yr <= horizonYears; yr++) {
      const totalMonths = yr * 12;
      runningPrincipal = monthlyContribution * totalMonths;

      if (monthlyRate > 0) {
        runningWealth = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      } else {
        runningWealth = runningPrincipal;
      }

      data.push({
        year: `Year ${yr}`,
        shortYear: `Y${yr}`,
        wealth: Math.round(runningWealth),
        principal: Math.round(runningPrincipal),
        gains: Math.round(Math.max(0, runningWealth - runningPrincipal))
      });
    }

    return {
      chartData: data,
      projectedTotal: runningWealth,
      totalContributions: runningPrincipal
    };
  }, [netSurplus, reinvestPct, returnRate, horizonYears]);

  return (
    <div className="w-full glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-6 group transition-all border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 flex items-center justify-center rounded-xl border shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <TrendingUp size={20} />
            </span>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Predictive Cash Flow & Compounding Engine
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-dim)]">
            Simulate dynamic portfolio compounding using your live retained cash surplus.
          </p>
        </div>

        {/* Strategy Selector Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/10">
          {[
            { id: "conservative", label: "🛡️ Defensive (4.5%)", desc: "HYSA / Bonds" },
            { id: "baseline", label: "📈 S&P 500 (8.5%)", desc: "Index Average" },
            { id: "aggressive", label: "⚡ Alpha (12%)", desc: "Equities / Tech" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStrategy(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
                strategy === tab.id
                  ? "shadow-lg"
                  : "text-[var(--text-dim)] hover:text-white"
              }`}
              style={strategy === tab.id ? { backgroundColor: 'var(--accent)', color: 'var(--bg)' } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Projection Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 relative z-10">
        {/* Left 4 Cols: Interactive Sliders */}
        <div className="lg:col-span-4 space-y-6 p-6 rounded-2xl flex flex-col justify-between border shadow-inner" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <Sliders size={12} style={{ color: 'var(--accent)' }} /> Surplus Allocation
              </label>
              <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent)' }}>{reinvestPct}% ({formatCurrency((netSurplus * reinvestPct) / 100)}/mo)</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={reinvestPct}
              onChange={(e) => setReinvestPct(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#06B6D4]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[var(--text-dim)]">
                <Calendar size={12} className="text-[#8B5CF6]" /> Time Horizon
              </label>
              <span className="text-[10px] font-mono font-bold text-[#8B5CF6]">{horizonYears} Years</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>

          <div className="p-5 rounded-2xl border" style={{ background: 'linear-gradient(to bottom right, var(--accent-brass-dim), transparent)', borderColor: 'var(--border-color)' }}>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Projected Capital Creation</p>
            <p className="text-3xl font-extrabold text-white mt-1 tracking-tight">
              {formatCurrency(projectedTotal)}
            </p>
            <p className="text-[9px] font-mono text-[var(--text-dim)] mt-2">
              +{formatCurrency(Math.max(0, projectedTotal - totalContributions))} from compound velocity
            </p>
          </div>
        </div>

        {/* Right 8 Cols: Visual Chart */}
        <div className="lg:col-span-8 h-[280px] p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPredictiveWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="shortYear" stroke="var(--text-dim)" tickLine={false} axisLine={false} fontSize={10} fontFamily="monospace" />
              <YAxis
                stroke="var(--text-dim)"
                tickLine={false}
                axisLine={false}
                fontSize={10}
                fontFamily="monospace"
                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "black",
                  borderColor: "var(--border-subtle)",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: "11px",
                  fontFamily: "monospace"
                }}
                formatter={(val: any, name: any) => [
                  formatCurrency(Number(val)),
                  name === "wealth" ? "Total Portfolio Value" : "Direct Capital Contributed"
                ]}
              />
              <Legend
                verticalAlign="top"
                height={28}
                formatter={(value) => (
                  <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest">
                    {value === "wealth" ? "Compounded Portfolio Value" : "Cumulative Contributions"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="wealth"
                name="wealth"
                stroke="var(--accent)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPredictiveWealth)"
              />
              <Area
                type="monotone"
                dataKey="principal"
                name="principal"
                stroke="#8B5CF6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#colorPrincipal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
