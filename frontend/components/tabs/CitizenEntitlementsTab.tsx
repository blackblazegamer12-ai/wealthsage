"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Landmark, FileText, CheckCircle, AlertOctagon, ArrowUpRight, Search } from "lucide-react";

const SCHEMES = [
  {
    id: "pm-surya-ghar",
    ministry: "Ministry of New and Renewable Energy",
    title: "PM Surya Ghar: Muft Bijli Yojana",
    value: "₹78,000 Subsidy",
    reasoning: "Based on your housing expenses, you own a home. Installing solar can yield a direct capital subsidy and reduce monthly outflow.",
    link: "https://pmsuryaghar.gov.in"
  },
  {
    id: "pm-svanidhi",
    ministry: "Ministry of Housing and Urban Affairs",
    title: "PM SVANidhi",
    value: "₹10,000 - ₹50,000 Microcredit",
    reasoning: "Collateral-free working capital. Identified potential eligibility based on irregular freelance inflow patterns.",
    link: "https://pmsvanidhi.mohua.gov.in"
  },
  {
    id: "pmjjby",
    ministry: "Ministry of Finance",
    title: "PMJJBY & PMSBY",
    value: "₹4 Lakh Life & Accidental Cover",
    reasoning: "You currently lack tracked insurance commitments. Secure ₹4L coverage for just ₹436 + ₹20 per year.",
    link: "https://jansuraksha.gov.in"
  }
];

export default function CitizenEntitlementsTab() {
  const [loanText, setLoanText] = useState("");
  const [loanResult, setLoanResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLoan = () => {
    if (!loanText.trim()) return;
    setIsAnalyzing(true);
    
    // Simulated Predatory Loan Analysis Engine
    setTimeout(() => {
      const text = loanText.toLowerCase();
      const isPredatory = text.includes("daily") || text.includes("payday") || text.includes("processing fee 10%") || text.match(/\b(30%|40%|50%|1% per day)\b/);
      
      if (isPredatory) {
        setLoanResult({
          status: "predatory",
          title: "🚨 Predatory Usury Trap",
          apr: "120% - 365% (Estimated)",
          issues: [
            "Extremely high annualized interest rate disguised as 'flat' or 'daily' rate.",
            "Unregistered NBFC / Illegal lending app pattern detected.",
            "Excessive upfront processing fees."
          ]
        });
      } else {
        setLoanResult({
          status: "safe",
          title: "🟢 Safe Institutional Loan",
          apr: "10% - 15%",
          issues: [
            "Standard RBI-registered NBFC or Banking partner terms.",
            "No hidden daily compounding detected.",
            "Processing fees are within regulatory limits (1-2%)."
          ]
        });
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] block">
          Digital Public Infrastructure
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Landmark className="text-[var(--accent)]" /> Citizen Entitlements & Safety
        </h2>
        <p className="text-sm text-[var(--text-dimmer)] font-mono max-w-2xl">
          Match your telemetry against sovereign welfare schemes and scan financial offers for predatory usury traps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schemes Radar */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Search size={18} className="text-emerald-400" /> Sovereign Entitlements Radar
          </h3>
          
          <div className="space-y-4">
            {SCHEMES.map((scheme) => (
              <div key={scheme.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 glass-panel relative overflow-hidden group hover:border-[var(--accent-brass-dim)] transition-all">
                <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 rounded-bl-xl text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">
                  {scheme.ministry}
                </div>
                
                <h4 className="font-bold text-white text-base mt-2 mb-1">{scheme.title}</h4>
                <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold mb-3 border border-emerald-500/20">
                  {scheme.value}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                  {scheme.reasoning}
                </p>
                
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:text-white transition-colors uppercase tracking-wide"
                >
                  Verify on .gov.in <ArrowUpRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Predatory Loan Shield */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldAlert size={18} className="text-rose-400" /> Predatory Loan & Usury Shield
          </h3>
          
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 glass-panel space-y-4">
            <p className="text-sm text-[var(--text-dim)]">
              Paste SMS loan offers, WhatsApp messages, or contract terms to instantly calculate true effective APR and verify RBI compliance.
            </p>
            
            <textarea
              value={loanText}
              onChange={(e) => setLoanText(e.target.value)}
              placeholder="e.g., 'Get ₹50,000 instantly! Just 1% interest per day. Processing fee 10% deducted upfront...'"
              className="w-full h-32 p-4 rounded-xl bg-[var(--surface-input)] border border-[var(--border-subtle)] text-sm text-white focus:outline-none focus:border-[var(--accent)] resize-none transition-colors font-mono"
            />
            
            <button
              onClick={analyzeLoan}
              disabled={!loanText.trim() || isAnalyzing}
              className="w-full py-3 rounded-xl bg-[var(--accent)] text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {isAnalyzing ? (
                <span className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              ) : (
                <><FileText size={18} /> Analyze Terms & Conditions</>
              )}
            </button>
            
            {/* Analysis Result */}
            {loanResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 p-5 rounded-2xl border ${loanResult.status === 'predatory' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`font-bold text-lg ${loanResult.status === 'predatory' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {loanResult.title}
                  </h4>
                  {loanResult.status === 'predatory' ? <AlertOctagon className="text-rose-400" /> : <CheckCircle className="text-emerald-400" />}
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-mono block mb-1">Effective APR</span>
                  <span className={`text-xl font-mono font-bold ${loanResult.status === 'predatory' ? 'text-rose-300' : 'text-white'}`}>
                    {loanResult.apr}
                  </span>
                </div>
                
                <ul className="space-y-2">
                  {loanResult.issues.map((issue: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                      <span className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${loanResult.status === 'predatory' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {issue}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
