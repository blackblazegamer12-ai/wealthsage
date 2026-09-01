"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function TaxOptimizer() {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [hra, setHra] = useState<number>(120000);
  const [medical80D, setMedical80D] = useState<number>(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);

  const calculateTax = (regime: 'old' | 'new', income: number, deductions: number) => {
    let taxableIncome = income;
    
    if (regime === 'old') {
      // Standard deduction of 50k
      taxableIncome = Math.max(0, income - 50000 - deductions);
      if (taxableIncome <= 500000) return 0; // 87A Rebate

      let tax = 0;
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.30;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.20;
        taxableIncome = 500000;
      }
      if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }
      return tax * 1.04; // + 4% Cess
    } else {
      // New Regime FY2024-25 rules
      // Standard deduction of 75k
      taxableIncome = Math.max(0, income - 75000);
      if (taxableIncome <= 700000) return 0; // 87A Rebate

      let tax = 0;
      if (taxableIncome > 1500000) {
        tax += (taxableIncome - 1500000) * 0.30;
        taxableIncome = 1500000;
      }
      if (taxableIncome > 1200000) {
        tax += (taxableIncome - 1200000) * 0.20;
        taxableIncome = 1200000;
      }
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.15;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 700000) {
        tax += (taxableIncome - 700000) * 0.10;
        taxableIncome = 700000;
      }
      if (taxableIncome > 300000) {
        tax += (taxableIncome - 300000) * 0.05;
      }
      return tax * 1.04; // + 4% Cess
    }
  };

  const results = useMemo(() => {
    const totalDeductions = deduction80C + hra + medical80D + homeLoanInterest;
    const oldTax = calculateTax('old', grossIncome, totalDeductions);
    const newTax = calculateTax('new', grossIncome, 0); // New regime has no exemptions other than standard 75k

    const savings = Math.abs(oldTax - newTax);
    const recommended = oldTax < newTax ? 'Old Regime' : 'New Regime';
    
    return { oldTax, newTax, savings, recommended };
  }, [grossIncome, deduction80C, hra, medical80D, homeLoanInterest]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calculator className="text-[var(--accent)]" /> Tax Regime Optimization Engine
        </h2>
        <p className="text-sm text-[var(--text-dimmer)] font-mono">
          Simulate FY 2024-25 Old vs. New regime liabilities. Standard deduction pre-applied automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Console */}
        <div className="lg:col-span-5 space-y-6 bg-white/[0.02] border border-white/10 p-6 rounded-3xl glass-panel">
          <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4 mb-4">Financial Profile</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)] font-mono">Gross Income</span>
                <span className="text-white font-bold">{formatCurrency(grossIncome)}</span>
              </div>
              <input 
                type="range" min="300000" max="5000000" step="50000" 
                value={grossIncome} 
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="touch-slider text-[var(--accent)]"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2 mt-4">
                <span className="text-[var(--text-muted)] font-mono">80C Investments (Max 1.5L)</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(deduction80C)}</span>
              </div>
              <input 
                type="range" min="0" max="150000" step="10000" 
                value={deduction80C} 
                onChange={(e) => setDeduction80C(Number(e.target.value))}
                className="touch-slider text-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2 mt-4">
                <span className="text-[var(--text-muted)] font-mono">HRA Exemption</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(hra)}</span>
              </div>
              <input 
                type="range" min="0" max="500000" step="10000" 
                value={hra} 
                onChange={(e) => setHra(Number(e.target.value))}
                className="touch-slider text-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2 mt-4">
                <span className="text-[var(--text-muted)] font-mono">80D Health Insurance</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(medical80D)}</span>
              </div>
              <input 
                type="range" min="0" max="75000" step="5000" 
                value={medical80D} 
                onChange={(e) => setMedical80D(Number(e.target.value))}
                className="touch-slider text-emerald-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2 mt-4">
                <span className="text-[var(--text-muted)] font-mono">24(b) Home Loan Interest</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(homeLoanInterest)}</span>
              </div>
              <input 
                type="range" min="0" max="200000" step="10000" 
                value={homeLoanInterest} 
                onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                className="touch-slider text-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Recommendation Hero */}
          <motion.div 
            layout
            className="p-8 rounded-3xl bg-gradient-to-br from-[var(--bg)] to-white/5 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <p className="text-sm font-mono text-[var(--text-dim)] uppercase tracking-widest mb-2">Optimal Strategy</p>
            <h3 className="text-4xl font-bold text-white mb-2">{results.recommended}</h3>
            
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm">
              <TrendingDown size={18} /> You save {formatCurrency(results.savings)} by choosing the {results.recommended}
            </div>
          </motion.div>

          {/* Comparison Cards */}
          <div className="w-full overflow-x-auto scrollbar-thin pb-4">
            <div className="grid grid-cols-2 gap-6 min-w-[500px]">
            {/* OLD REGIME */}
            <motion.div 
              className={`p-6 rounded-3xl border transition-all ${results.recommended === 'Old Regime' ? 'bg-[var(--accent-brass-dim)] border-[var(--accent)] shadow-[0_0_30px_rgba(180,138,90,0.1)]' : 'bg-white/[0.02] border-white/10 opacity-70'}`}
            >
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center justify-between">
                Old Regime
                {results.recommended === 'Old Regime' && <CheckCircle size={16} className="text-[var(--accent)]" />}
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[var(--text-dimmer)] font-mono mb-1">TOTAL TAX (INC CESS)</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.oldTax)}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] text-[var(--text-dimmer)] font-mono mb-1">DEDUCTIONS APPLIED</p>
                  <p className="text-sm font-mono text-emerald-400">{formatCurrency(deduction80C + hra + medical80D + homeLoanInterest + 50000)}</p>
                </div>
              </div>
            </motion.div>

            {/* NEW REGIME */}
            <motion.div 
              className={`p-6 rounded-3xl border transition-all ${results.recommended === 'New Regime' ? 'bg-[var(--accent-brass-dim)] border-[var(--accent)] shadow-[0_0_30px_rgba(180,138,90,0.1)]' : 'bg-white/[0.02] border-white/10 opacity-70'}`}
            >
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center justify-between">
                New Regime
                {results.recommended === 'New Regime' && <CheckCircle size={16} className="text-[var(--accent)]" />}
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[var(--text-dimmer)] font-mono mb-1">TOTAL TAX (INC CESS)</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.newTax)}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] text-[var(--text-dimmer)] font-mono mb-1">DEDUCTIONS APPLIED</p>
                  <p className="text-sm font-mono text-emerald-400">₹75,000 (Standard)</p>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
          
          <p className="text-[10px] text-[var(--text-dimmer)] font-mono flex items-center gap-2 mt-2">
            <AlertCircle size={12} /> Excludes surcharge for income {'>'} 50L. Seek professional advice before filing.
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className, ...props }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
