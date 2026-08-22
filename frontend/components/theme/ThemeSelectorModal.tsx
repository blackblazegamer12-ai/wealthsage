"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check } from "lucide-react";
import { useRoyalTheme, ROYAL_THEMES } from "./ThemeContext";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelectorModal({ isOpen, onClose }: ThemeSelectorModalProps) {
  const { theme, setTheme } = useRoyalTheme();
  const lightThemes = ROYAL_THEMES.filter((item) => item.mode === "light");
  const darkThemes = ROYAL_THEMES.filter((item) => item.mode === "dark");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="theme-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            key="theme-modal-content"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="royal-card p-6 sm:p-8 rounded-3xl w-full max-w-xl relative overflow-hidden bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-2xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-subtle)] cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-subtle)] pb-4">
              <div className="p-2.5 rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-royal)]">
                <Crown size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Royal Theme Vault</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Select an imperial aesthetic preset. Changes propagate globally across all telemetry & charts.
                </p>
              </div>
            </div>

            {/* Light and dark choices */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {[["Dark Themes (Sovereign Nocturne)", darkThemes], ["Light Themes (Daylight Clarity)", lightThemes]].map(([label, group]) => (
                <section key={label as string}>
                  <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">{label as string}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(group as typeof ROYAL_THEMES).map((t) => {
                      const isSelected = theme === t.id;

                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id);
                          }}
                          className={`text-left p-4 rounded-2xl border transition-all relative group overflow-hidden cursor-pointer ${
                            isSelected
                              ? "bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-lg"
                              : "bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] hover:border-[var(--border-royal)] hover:bg-[var(--bg-elevated)]"
                          }`}
                          style={{
                            boxShadow: isSelected ? `0 0 25px -5px ${t.accentColor}40` : undefined,
                          }}
                        >
                          {/* Glowing highlight indicator */}
                          <div
                            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30"
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
                                  borderColor: `${t.accentColor}50`,
                                }}
                              >
                                <Check size={11} strokeWidth={3} /> ACTIVE
                              </span>
                            ) : (
                              <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                                {t.badge}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-[var(--text-primary)] text-base relative z-10">{t.name}</h4>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug relative z-10">
                            {t.subtitle}
                          </p>

                          {/* Color Swatch Bar */}
                          <div className="mt-3.5 flex items-center gap-1.5 relative z-10">
                            <div
                              className="w-full h-2 rounded-full"
                              style={{
                                background: `linear-gradient(to right, ${t.accentColor}, transparent)`,
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl royal-btn-accent text-xs font-bold transition-all cursor-pointer"
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
