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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Settings & Royal Theme Vault
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Customize imperial visual themes, verify database integrity, and manage data export feeds.
        </p>
      </div>

      {/* 1. ROYAL THEME PRESET SELECTOR */}
      <div className="royal-card p-5 sm:p-6 lg:p-7 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <Crown size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Imperial Aesthetic Theme</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Current active preset: <strong style={{ color: 'var(--text-primary)' }}>{activeThemeInfo.name}</strong> ({activeThemeInfo.badge})
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
                  isSelected ? "shadow-xl" : ""
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--surface-overlay)',
                  borderColor: isSelected ? 'var(--border-royal-hover)' : 'var(--border-subtle)',
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

                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</h3>
                <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="royal-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Supabase Cloud Database</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PostgreSQL Cloud Persistence</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl space-y-2 text-xs" style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Connection Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active & Synced
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Auth Identity:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email || "Sandbox Demo User"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Ledger Count:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{transactions.length} items</span>
            </div>
          </div>
        </div>

        <div className="royal-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>AI Quant Engine & Plaid</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Gemini 3.6 Flash & Sandbox API</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl space-y-2 text-xs" style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Groq Reasoning API:</span>
              <span className="text-emerald-400 font-bold">Encrypted & Online</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Plaid Banking Link:</span>
              <span className="text-cyan-400 font-bold">Sandbox Mode Available</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>OCR Tesseract Engine:</span>
              <span className="text-emerald-400 font-bold">Client-Side WASM Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DATA EXPORT & ACTIONS */}
      <div className="royal-card p-5 sm:p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Export Financial Vault</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Copy a complete JSON snapshot of your transactions, goals, and subscriptions to clipboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' }}
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
