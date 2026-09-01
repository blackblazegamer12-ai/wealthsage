"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const MOCK_HARVEST_OPPORTUNITIES = [
  { id: 1, asset: "HDFC Bank Ltd", type: "STCG", currentLoss: -45000, recommendedHarvest: 45000, potentialTaxSaved: 45000 * 0.20 }, // 20% STCG
  { id: 2, asset: "Infosys Ltd", type: "LTCG", currentLoss: -125000, recommendedHarvest: 100000, potentialTaxSaved: 100000 * 0.125 }, // 12.5% LTCG
  { id: 3, asset: "Navi Nifty 50 Index", type: "STCG", currentLoss: -15000, recommendedHarvest: 15000, potentialTaxSaved: 15000 * 0.20 },
];

export default function TaxLossHarvesting() {
  const totalSTCGSaved = MOCK_HARVEST_OPPORTUNITIES.filter(o => o.type === "STCG").reduce((acc, curr) => acc + curr.potentialTaxSaved, 0);
  const totalLTCGSaved = MOCK_HARVEST_OPPORTUNITIES.filter(o => o.type === "LTCG").reduce((acc, curr) => acc + curr.potentialTaxSaved, 0);
  const totalSaved = totalSTCGSaved + totalLTCGSaved;

  return (
    <div className="space-y-8 mt-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
          <Leaf size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tax-Loss Harvesting Engine</h2>
          <p className="text-sm text-[var(--text-dim)] font-mono">Offset your realized gains before March 31st.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-[var(--border-subtle)]">
          <p className="text-[10px] font-mono text-[var(--text-dimmer)] mb-2 uppercase tracking-widest">Realized STCG (YTD)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-emerald-400">+?1,25,000</h3>
            <span className="text-xs text-[var(--text-dim)] font-mono mb-1">Tax: ?25,000</span>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-[var(--border-subtle)]">
          <p className="text-[10px] font-mono text-[var(--text-dimmer)] mb-2 uppercase tracking-widest">Realized LTCG (YTD)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-emerald-400">+?2,10,000</h3>
            <span className="text-xs text-[var(--text-dim)] font-mono mb-1">Tax: ?10,625</span>
          </div>
          <p className="text-[10px] text-white/50 mt-1">?1.25L exemption applied.</p>
        </div>
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/20">
          <p className="text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest flex items-center gap-1.5"><SparkleIcon size={12} /> Potential Tax Savings</p>
          <h3 className="text-3xl font-bold text-emerald-400">{formatCurrency(totalSaved)}</h3>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-subtle)]">
        <div className="p-6 border-b border-[var(--border-subtle)] bg-white/[0.02]">
          <h3 className="font-bold text-white text-lg">Harvesting Opportunities</h3>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">Liquidate these underperforming assets to offset your gains.</p>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono text-[var(--text-dimmer)] uppercase tracking-wider">
                <th className="pb-4 font-normal">Asset</th>
                <th className="pb-4 font-normal">Category</th>
                <th className="pb-4 font-normal text-right">Unrealized Loss</th>
                <th className="pb-4 font-normal text-right">Actionable Harvest</th>
                <th className="pb-4 font-normal text-right text-emerald-400">Tax Saved</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_HARVEST_OPPORTUNITIES.map((opp, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={opp.id} 
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 font-bold text-sm text-white">{opp.asset}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase border border-white/10 bg-white/5 text-white/70">
                      {opp.type}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-red-400 text-sm">
                    <div className="flex justify-end items-center gap-1"><TrendingDown size={14} /> {formatCurrency(opp.currentLoss)}</div>
                  </td>
                  <td className="py-4 text-right font-mono text-white text-sm">{formatCurrency(opp.recommendedHarvest)}</td>
                  <td className="py-4 text-right font-bold text-emerald-400 text-sm">+{formatCurrency(opp.potentialTaxSaved)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono flex items-start gap-3">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <p>
          Wash Sale Rules in India do not explicitly exist, but immediate buybacks might be scrutinized by the ITD as "colorable devices." Wait 1-2 days before repurchasing the same asset, or reinvest the harvested capital into a highly correlated asset class immediately.
        </p>
      </div>
    </div>
  );
}

function SparkleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
