"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check, Sparkles } from "lucide-react";
import { useRoyalTheme, RoyalThemeId, ROYAL_THEMES } from "./ThemeContext";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelectorModal({ isOpen, onClose }: ThemeSelectorModalProps) {
  const { theme, setTheme } = useRoyalTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="theme-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="theme-modal-content"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="royal-glass-mirror p-6 sm:p-8 rounded-3xl w-full max-w-xl relative overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30">
                <Crown size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Royal Theme Vault</h3>
                <p className="text-xs text-slate-400">
                  Select an imperial aesthetic preset. Changes propagate globally across all telemetry & charts.
                </p>
              </div>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROYAL_THEMES.map((t) => {
                const isSelected = theme === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                    }}
                    className={`text-left p-4 rounded-2xl border transition-all relative group overflow-hidden ${
                      isSelected
                        ? "bg-white/[0.08] border-white/40 shadow-xl"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 25px -5px ${t.accentColor}40` : "none"
                    }}
                  >
                    {/* Glowing highlight indicator */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40"
                      style={{ backgroundColor: t.accentColor }}
                    />

                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="text-2xl">{t.crownEmoji}</span>
                      {isSelected ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border"
                          style={{
                            backgroundColor: `${t.accentColor}25`,
                            color: t.accentColor,
                            borderColor: `${t.accentColor}50`
                          }}
                        >
                          <Check size={11} strokeWidth={3} /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {t.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-base relative z-10">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug relative z-10">
                      {t.subtitle}
                    </p>

                    {/* Color Swatch Bar */}
                    <div className="mt-3.5 flex items-center gap-1.5 relative z-10">
                      <div
                        className="w-full h-2 rounded-full bg-gradient-to-r"
                        style={{
                          background: `linear-gradient(to right, ${t.accentColor}, #ffffff20)`
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15"
              >
                Apply & Return
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
