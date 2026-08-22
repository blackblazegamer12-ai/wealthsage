"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type RoyalThemeId =
  | "imperial-gold"
  | "emerald-sovereign"
  | "regal-burgundy"
  | "platinum-obsidian"
  | "ethereal-cream"
  | "sage-harmony";

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
    id: "imperial-gold",
    name: "Imperial Gold",
    subtitle: "Obsidian Charcoal & Luminous Gold",
    accentColor: "#EAB308",
    previewGradient: "from-[#FACC15] to-[#CA8A04]",
    badge: "Monarch Standard",
    crownEmoji: "👑",
    mode: "dark",
  },
  {
    id: "emerald-sovereign",
    name: "Emerald Sovereign",
    subtitle: "Deep Velvet Forest & Radiant Emerald",
    accentColor: "#10B981",
    previewGradient: "from-[#34D399] to-[#059669]",
    badge: "Dynasty Guard",
    crownEmoji: "🌿",
    mode: "dark",
  },
  {
    id: "regal-burgundy",
    name: "Regal Burgundy",
    subtitle: "Deep Wine Crimson & Rose Gold",
    accentColor: "#F43F5E",
    previewGradient: "from-[#FB7185] to-[#E11D48]",
    badge: "Imperial Velvet",
    crownEmoji: "♦️",
    mode: "dark",
  },
  {
    id: "platinum-obsidian",
    name: "Platinum Obsidian",
    subtitle: "Midnight Slate & Starlight Platinum",
    accentColor: "#38BDF8",
    previewGradient: "from-[#E2E8F0] to-[#38BDF8]",
    badge: "Celestial Order",
    crownEmoji: "✦",
    mode: "dark",
  },
  {
    id: "ethereal-cream",
    name: "Ethereal Cream",
    subtitle: "Soft Cream & Amethyst Clarity",
    accentColor: "#7C3AED",
    previewGradient: "from-[#9580c4] to-[#7c6daa]",
    badge: "Daylight Edition",
    crownEmoji: "☀️",
    mode: "light",
  },
  {
    id: "sage-harmony",
    name: "Sage Harmony",
    subtitle: "Quiet Sage & Evergreen Balance",
    accentColor: "#059669",
    previewGradient: "from-[#6dae91] to-[#5a9a7e]",
    badge: "Calm Focus",
    crownEmoji: "🍃",
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
    if (typeof window === "undefined") return "imperial-gold";
    try {
      const stored = localStorage.getItem("wealthsage_royal_theme") as RoyalThemeId | null;
      return stored && ROYAL_THEMES.some((item) => item.id === stored) ? stored : "imperial-gold";
    } catch {
      return "imperial-gold";
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
