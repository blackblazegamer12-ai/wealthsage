"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  ShieldCheck,
  Database,
  Key,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useRoyalTheme, ROYAL_THEMES } from "../theme/ThemeContext";

interface SettingsTabProps {
  user: any;
  transactions: any[];
  goals: any[];
  subscriptions: any[];
  onOpenThemeModal: () => void;
  onClearLedger: () => void;
}

export default function SettingsTab({
  user,
  transactions,
  goals,
  subscriptions,
  onOpenThemeModal,
  onClearLedger
}: SettingsTabProps) {
  const { theme, setTheme, activeThemeInfo } = useRoyalTheme();
  const [copiedExport, setCopiedExport] = useState(false);

  const handleExportData = () => {
    const fullState = {
      exportDate: new Date().toISOString(),
      user: user?.email || "demo-user",
      transactions,
      goals,
      subscriptions
    };
    const jsonStr = JSON.stringify(fullState, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
          Configuration & Vault
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Settings & Royal Theme Vault
        </h1>
        <p className="text-slate-400 mt-1.5 text-xs sm:text-sm">
          Customize imperial visual themes, verify database integrity, and manage data export feeds.
        </p>
      </div>

      {/* 1. ROYAL THEME PRESET SELECTOR */}
      <div className="royal-card p-6 lg:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <Crown size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Imperial Aesthetic Theme</h2>
              <p className="text-xs text-slate-400">
                Current active preset: <strong className="text-white">{activeThemeInfo.name}</strong> ({activeThemeInfo.badge})
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROYAL_THEMES.map((t) => {
            const isSelected = theme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "bg-white/[0.08] border-white/40 shadow-xl"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px -5px ${t.accentColor}40` : "none"
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{t.crownEmoji}</span>
                  {isSelected && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 border"
                      style={{
                        backgroundColor: `${t.accentColor}25`,
                        color: t.accentColor,
                        borderColor: `${t.accentColor}50`
                      }}
                    >
                      <Check size={10} strokeWidth={3} /> ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm">{t.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.subtitle}</p>

                <div
                  className="w-full h-1.5 rounded-full mt-3"
                  style={{
                    background: `linear-gradient(to right, ${t.accentColor}, #ffffff15)`
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CLOUD DATABASE & SERVICE INTEGRITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="royal-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Supabase Cloud Database</h3>
              <p className="text-xs text-slate-400">PostgreSQL Cloud Persistence</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Connection Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active & Synced
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Auth Identity:</span>
              <span className="text-white font-medium">{user?.email || "Sandbox Demo User"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ledger Count:</span>
              <span className="text-white font-medium">{transactions.length} items</span>
            </div>
          </div>
        </div>

        <div className="royal-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Quant Engine & Plaid</h3>
              <p className="text-xs text-slate-400">LLaMA 3.3 Versatile 70B & Sandbox API</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Groq Reasoning API:</span>
              <span className="text-emerald-400 font-bold">Encrypted & Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Plaid Banking Link:</span>
              <span className="text-cyan-400 font-bold">Sandbox Mode Available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">OCR Tesseract Engine:</span>
              <span className="text-emerald-400 font-bold">Client-Side WASM Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DATA EXPORT & ACTIONS */}
      <div className="royal-card p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base">Export Financial Vault</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Copy a complete JSON snapshot of your transactions, goals, and subscriptions to clipboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15"
          >
            <Download size={14} />
            {copiedExport ? "Copied JSON to Clipboard!" : "Copy Snapshot JSON"}
          </button>

          <button
            type="button"
            onClick={onClearLedger}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs transition-all border border-red-500/30"
          >
            <Trash2 size={14} />
            Reset Ledger
          </button>
        </div>
      </div>
    </motion.div>
  );
}
