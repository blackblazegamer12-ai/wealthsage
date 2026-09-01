"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type RoyalThemeId =
  | "echoid"
  | "sapphire"
  | "obsidian"
  | "titanium"
  | "light-high-contrast";

export type ThemeMode = "light" | "dark";

export interface RoyalThemeInfo {
  id: RoyalThemeId;
  name: string;
  subtitle: string;
  accentColor: string;
  previewGradient: string;
  badge: string;
  crownEmoji: string;
  mode: ThemeMode;
}

export const ROYAL_THEMES: RoyalThemeInfo[] = [
  {
    id: "echoid" as RoyalThemeId,
    name: "ECHOID Obsidian & Brass",
    subtitle: "Pitch Black & Warm Brass",
    accentColor: "#B48A5A",
    previewGradient: "from-[#B48A5A] to-[#E5C158]",
    badge: "Flagship Default",
    crownEmoji: "⚡",
    mode: "dark",
  },
  {
    id: "sapphire" as RoyalThemeId,
    name: "Midnight Sapphire",
    subtitle: "Deep Navy & Translucent Sapphire",
    accentColor: "#B48A5A",
    previewGradient: "from-[#1E3A8A] to-[#3B82F6]",
    badge: "Executive Class",
    crownEmoji: "💎",
    mode: "dark",
  },
  {
    id: "obsidian" as RoyalThemeId,
    name: "Obsidian & Emerald",
    subtitle: "Pitch Black & Electric Emerald",
    accentColor: "#10B981",
    previewGradient: "from-[#10B981] to-[#34D399]",
    badge: "Quant Mode",
    crownEmoji: "📈",
    mode: "dark",
  },
  {
    id: "titanium" as RoyalThemeId,
    name: "Titanium & Frost",
    subtitle: "Machined Metal & Silver",
    accentColor: "#9CA3AF",
    previewGradient: "from-[#9CA3AF] to-[#E5E7EB]",
    badge: "Minimalist",
    crownEmoji: "⚙️",
    mode: "dark",
  },
  {
    id: "light-high-contrast" as RoyalThemeId,
    name: "High Contrast Light",
    subtitle: "Maximized Readability (WCAG AAA)",
    accentColor: "#0F172A",
    previewGradient: "from-[#F8FAFC] to-[#CBD5E1]",
    badge: "Accessibility",
    crownEmoji: "👁️",
    mode: "light",
  },
];

interface ThemeContextType {
  theme: RoyalThemeId;
  setTheme: (theme: RoyalThemeId) => void;
  themes: RoyalThemeInfo[];
  activeThemeInfo: RoyalThemeInfo;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDOM(themeId: RoyalThemeId) {
  if (typeof document === "undefined") return;
  const themeInfo = ROYAL_THEMES.find((item) => item.id === themeId) ?? ROYAL_THEMES[0];
  const root = document.documentElement;
  root.setAttribute("data-theme", themeInfo.id);
  if (themeInfo.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<RoyalThemeId>(() => {
    if (typeof window === "undefined") return "echoid";
    try {
      const stored = localStorage.getItem("wealthsage_royal_theme") as RoyalThemeId | null;
      return stored && ROYAL_THEMES.some((item) => item.id === stored) ? stored : "echoid";
    } catch {
      return "echoid";
    }
  });

  const setTheme = useCallback((nextTheme: RoyalThemeId) => {
    setThemeState(nextTheme);
    applyThemeToDOM(nextTheme);
    try {
      localStorage.setItem("wealthsage_royal_theme", nextTheme);
    } catch {
      // Local storage unavailable
    }
  }, []);

  // Sync on initial mount & storage change across tabs
  useEffect(() => {
    applyThemeToDOM(theme);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wealthsage_royal_theme" && e.newValue) {
        const nextTheme = e.newValue as RoyalThemeId;
        if (ROYAL_THEMES.some((item) => item.id === nextTheme)) {
          setThemeState(nextTheme);
          applyThemeToDOM(nextTheme);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  const activeThemeInfo = useMemo(
    () => ROYAL_THEMES.find((item) => item.id === theme) ?? ROYAL_THEMES[0],
    [theme]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themes: ROYAL_THEMES,
      activeThemeInfo,
      isDark: activeThemeInfo.mode === "dark",
    }),
    [theme, setTheme, activeThemeInfo]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useRoyalTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useRoyalTheme must be used within a ThemeProvider");
  }
  return context;
}
