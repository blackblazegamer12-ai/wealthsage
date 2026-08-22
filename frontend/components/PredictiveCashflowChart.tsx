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
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

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
    <div className="w-full backdrop-blur-2xl rounded-3xl p-5 lg:p-6 shadow-2xl relative overflow-hidden mb-6 group transition-all" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--accent-glow)' }} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#10B981]/20 text-[#06B6D4] border border-[#06B6D4]/30">
              <TrendingUp size={20} />
            </span>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Predictive Cash Flow & Compounding Engine
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Simulate dynamic portfolio compounding using your live retained cash surplus.
          </p>
        </div>

        {/* Strategy Selector Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl" style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: "conservative", label: "🛡️ Defensive (4.5%)", desc: "HYSA / Bonds" },
            { id: "baseline", label: "📈 S&P 500 (8.5%)", desc: "Index Average" },
            { id: "aggressive", label: "⚡ Alpha (12%)", desc: "Equities / Tech" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStrategy(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                strategy === tab.id
                  ? "bg-[#06B6D4] text-black shadow-md shadow-[#06B6D4]/30 font-bold"
                  : "hover:opacity-80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Projection Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left 4 Cols: Interactive Sliders */}
        <div className="lg:col-span-4 space-y-4 p-5 rounded-2xl flex flex-col justify-between" style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Sliders size={14} className="text-[#06B6D4]" /> Surplus Allocation
              </label>
              <span className="text-xs font-bold text-[#06B6D4]">{reinvestPct}% ({formatCurrency((netSurplus * reinvestPct) / 100)}/mo)</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={reinvestPct}
              onChange={(e) => setReinvestPct(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={14} className="text-[#8B5CF6]" /> Time Horizon
              </label>
              <span className="text-xs font-bold text-[#8B5CF6]">{horizonYears} Years</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>

          <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Projected Capital Creation</p>
            <p className="text-2xl font-extrabold text-[#10B981] mt-0.5">
              {formatCurrency(projectedTotal)}
            </p>
            <p className="text-[11px] text-[#10B981]/90 font-medium mt-1">
              +{formatCurrency(Math.max(0, projectedTotal - totalContributions))} from compound velocity
            </p>
          </div>
        </div>

        {/* Right 8 Cols: Visual Chart */}
        <div className="lg:col-span-8 h-[260px] p-4 rounded-2xl" style={{ backgroundColor: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPredictiveWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="shortYear" stroke="var(--text-muted)" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis
                stroke="var(--text-muted)"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  borderRadius: "14px",
                  color: "var(--text-primary)",
                  fontSize: "12px"
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
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {value === "wealth" ? "Compounded Portfolio Value" : "Cumulative Contributions"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="wealth"
                name="wealth"
                stroke="#06B6D4"
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
