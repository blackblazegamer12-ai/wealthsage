"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Sparkles, TrendingUp, DollarSign, Clock, Zap, Coffee, ShoppingBag, Car, Wallet } from 'lucide-react';

const PRESETS = [
  { name: 'Daily Coffee', cost: 200, icon: Coffee, label: '₹200/day Coffee' },
  { name: 'Takeout Lunch', cost: 500, icon: ShoppingBag, label: '₹500/day Takeout' },
  { name: 'Rideshare & Snacks', cost: 800, icon: Car, label: '₹800/day Rides' },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function WhatIfSimulator() {
  const [dailyCost, setDailyCost] = useState<number>(150);
  const [annualReturn, setAnnualReturn] = useState<number>(8);
  const [years, setYears] = useState<number>(10);

  // Calculate chart data points year by year
  const { chartData, totalSpent, potentialWealth, netGain } = useMemo(() => {
    const data = [];
    const monthlyRate = annualReturn / 100 / 12;
    const monthlyContribution = (dailyCost * 365) / 12;

    let finalSpent = 0;
    let finalWealth = 0;

    for (let yr = 1; yr <= years; yr++) {
      const spent = dailyCost * 365 * yr;
      const totalMonths = yr * 12;
      
      let wealth = spent;
      if (monthlyRate > 0) {
        wealth = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      }

      if (yr === years) {
        finalSpent = spent;
        finalWealth = wealth;
      }

      data.push({
        year: `Yr ${yr}`,
        yearNum: yr,
        spent: Math.round(spent),
        wealth: Math.round(wealth),
      });
    }

    return {
      chartData: data,
      totalSpent: finalSpent,
      potentialWealth: finalWealth,
      netGain: finalWealth - finalSpent,
    };
  }, [dailyCost, annualReturn, years]);

  const multiplier = totalSpent > 0 ? (potentialWealth / totalSpent).toFixed(1) : '1.0';

  return (
    <div className="w-full glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-5" style={{ backgroundColor: 'var(--accent)' }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: 'var(--accent)' }} /> See How Your Savings Grow
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono">
            Drag the sliders to see how your monthly savings could grow over time.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase">
          <span className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[var(--text-dim)]">PPF / Debt (7.1%)</span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]">NIFTY 50 (12.0%)</span>
          <span className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[var(--text-dim)]">Alpha (15%)</span>
        </div>
      </div>

      {/* Main Grid: Controls + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Sliders & Controls */}
        <div className="lg:col-span-2 space-y-8 p-8 rounded-2xl border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
          {/* Slider 1: Daily Cost */}
          <div>
            <div className="flex justify-between items-center mb-3 text-[11px] font-mono text-[var(--text-dim)]">
              <label className="flex items-center gap-2">
                <Wallet size={12} /> How Much to Invest
              </label>
              <span className="text-cyan-400 font-bold">{formatCurrency(dailyCost)} / day</span>
            </div>
            <input
              type="range"
              min={1}
              max={2000}
              step={50}
              value={dailyCost}
              onChange={(e) => setDailyCost(Number(e.target.value))}
              className="touch-slider text-cyan-400"
            />
          </div>

          {/* Slider 2: Annual Return % */}
          <div>
            <div className="flex justify-between items-center mb-3 text-[11px] font-mono text-[var(--text-dim)]">
              <label className="flex items-center gap-2">
                <TrendingUp size={12} className="text-[#10B981]" /> Annual Investment Return
              </label>
              <span className="text-[#10B981] font-bold">{annualReturn}% / year</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="touch-slider text-[#10B981]"
            />
          </div>

          {/* Slider 3: Time Horizon */}
          <div>
            <div className="flex justify-between items-center mb-3 text-[11px] font-mono text-[var(--text-dim)]">
              <label className="flex items-center gap-2">
                <Clock size={12} className="text-[#8B5CF6]" /> How Many Years
              </label>
              <span className="text-[#8B5CF6] font-bold">{years} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="touch-slider text-[#8B5CF6]"
            />
          </div>
        </div>

        {/* Right Col: Summary Stats */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-2xl border transition-all" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
            <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest mb-1">Total Cash Spent</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
            <p className="text-[9px] font-mono text-[var(--text-dim)] mt-1">Direct out-of-pocket cost over {years} yrs</p>
          </div>

          <div className="p-5 rounded-2xl border shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]" style={{ background: 'linear-gradient(to bottom right, var(--accent-brass-dim), transparent)', borderColor: 'var(--border-color)' }}>
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Projected Total</p>
            <p className="text-3xl font-extrabold text-cyan-400 tracking-tight">{formatCurrency(potentialWealth)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-mono">
                +{formatCurrency(netGain)}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-dim)]">earned from compound interest</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl flex items-center justify-between border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
            <div>
              <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest">Wealth Multiplier</p>
              <p className="text-lg font-bold text-[#8B5CF6]">{multiplier}x Return</p>
            </div>
            <div className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl border border-[#8B5CF6]/20">
              <Sparkles size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[320px] p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-dim)]">
            Growth Projection: Money Spent vs. Potential Wealth
          </h3>
        </div>
        <ResponsiveContainer width="100%" height="88%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-dim)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--text-dim)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-dim)" tickLine={false} axisLine={false} fontSize={10} fontFamily="monospace" />
            <YAxis
              stroke="var(--text-dim)"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              fontFamily="monospace"
              tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'black',
                borderColor: 'var(--border-subtle)',
                borderRadius: '12px',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '11px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)),
                name === 'wealth' ? 'Potential Wealth (Invested)' : 'Money Spent (Habit)',
              ]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {value === 'wealth' ? 'Potential Wealth (Invested)' : 'Money Spent (Habit)'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="wealth"
              name="wealth"
              stroke="var(--accent)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWealth)"
            />
            <Area
              type="monotone"
              dataKey="spent"
              name="spent"
              stroke="var(--text-dim)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorSpent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
