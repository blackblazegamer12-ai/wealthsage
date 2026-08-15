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
import { Sparkles, TrendingUp, DollarSign, Clock, Zap, Coffee, ShoppingBag, Car } from 'lucide-react';

const PRESETS = [
  { name: 'Daily Coffee', cost: 6, icon: Coffee, label: '$6/day Coffee' },
  { name: 'Takeout Lunch', cost: 15, icon: ShoppingBag, label: '$15/day Takeout' },
  { name: 'Rideshare & Snacks', cost: 25, icon: Car, label: '$25/day Rides' },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

export default function WhatIfSimulator() {
  const [dailyCost, setDailyCost] = useState<number>(6);
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
    <div className="w-full bg-[#161824]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 lg:p-7 text-[#F8FAFC] shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#10B981]/20 text-[#06B6D4] border border-[#06B6D4]/30">
              <Zap size={20} />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">"What-If" Wealth Simulator</h2>
          </div>
          <p className="text-sm text-[#94A3B8]">
            Calculate the true opportunity cost of small daily expenses over time when invested.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = dailyCost === preset.cost;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => setDailyCost(preset.cost)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#06B6D4] text-black shadow-lg shadow-[#06B6D4]/30 font-semibold'
                    : 'bg-white/[0.05] text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon size={14} />
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Sliders & Controls */}
        <div className="lg:col-span-2 space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
          {/* Slider 1: Daily Cost */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <DollarSign size={16} className="text-[#06B6D4]" /> Daily Expense
              </label>
              <span className="text-lg font-bold text-[#06B6D4]">{formatCurrency(dailyCost)} / day</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={dailyCost}
              onChange={(e) => setDailyCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>$1/day ($365/yr)</span>
              <span>$25/day ($9.1k/yr)</span>
              <span>$50/day ($18.2k/yr)</span>
            </div>
          </div>

          {/* Slider 2: Annual Return % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#10B981]" /> Annual Investment Return
              </label>
              <span className="text-lg font-bold text-[#10B981]">{annualReturn}% / year</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>1% (Savings Acc)</span>
              <span>8% (S&P 500 Avg)</span>
              <span>15% (Aggressive)</span>
            </div>
          </div>

          {/* Slider 3: Time Horizon */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-[#8B5CF6]" /> Time Horizon
              </label>
              <span className="text-lg font-bold text-[#8B5CF6]">{years} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Right Col: Summary Stats */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10 hover:border-[#06B6D4]/30 transition-all">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Cash Spent</p>
            <p className="text-2xl font-bold text-slate-300">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-slate-500 mt-1">Direct out-of-pocket cost over {years} yrs</p>
          </div>

          <div className="bg-gradient-to-br from-[#10B981]/15 to-[#06B6D4]/15 p-5 rounded-2xl border border-[#10B981]/40 shadow-lg shadow-[#10B981]/10">
            <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wider mb-1">Potential Wealth Created</p>
            <p className="text-3xl font-extrabold text-[#10B981] tracking-tight">{formatCurrency(potentialWealth)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                +{formatCurrency(netGain)}
              </span>
              <span className="text-xs text-slate-400">in compound interest</span>
            </div>
          </div>

          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Wealth Multiplier</p>
              <p className="text-lg font-bold text-[#8B5CF6]">{multiplier}x Return</p>
            </div>
            <div className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl border border-[#8B5CF6]/20">
              <Sparkles size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[320px] bg-black/20 p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Growth Projection: Money Spent vs. Potential Wealth
          </h3>
        </div>
        <ResponsiveContainer width="100%" height="88%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis dataKey="year" stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161824',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                color: '#F8FAFC',
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
                <span className="text-xs text-slate-300 font-medium">
                  {value === 'wealth' ? 'Potential Wealth (Invested)' : 'Money Spent (Habit)'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="wealth"
              name="wealth"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWealth)"
            />
            <Area
              type="monotone"
              dataKey="spent"
              name="spent"
              stroke="#06B6D4"
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
