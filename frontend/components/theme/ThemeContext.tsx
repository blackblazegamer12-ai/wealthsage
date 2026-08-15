"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type RoyalThemeId = "imperial-gold" | "emerald-sovereign" | "regal-burgundy" | "platinum-obsidian";

export interface RoyalThemeInfo {
  id: RoyalThemeId;
  name: string;
  subtitle: string;
  accentColor: string;
  previewGradient: string;
  badge: string;
  crownEmoji: string;
}

export const ROYAL_THEMES: RoyalThemeInfo[] = [
  {
    id: "imperial-gold",
    name: "Imperial Gold",
    subtitle: "Obsidian Charcoal & Luminous Gold",
    accentColor: "#EAB308",
    previewGradient: "from-[#FACC15] to-[#CA8A04]",
    badge: "Monarch Standard",
    crownEmoji: "👑"
  },
  {
    id: "emerald-sovereign",
    name: "Emerald Sovereign",
    subtitle: "Deep Velvet Forest & Radiant Emerald",
    accentColor: "#10B981",
    previewGradient: "from-[#34D399] to-[#059669]",
    badge: "Dynasty Guard",
    crownEmoji: "💎"
  },
  {
    id: "regal-burgundy",
    name: "Regal Burgundy",
    subtitle: "Deep Wine Crimson & Rose Gold",
    accentColor: "#F43F5E",
    previewGradient: "from-[#FB7185] to-[#E11D48]",
    badge: "Imperial Velvet",
    crownEmoji: "🍷"
  },
  {
    id: "platinum-obsidian",
    name: "Platinum Obsidian",
    subtitle: "Midnight Slate & Starlight Platinum",
    accentColor: "#38BDF8",
    previewGradient: "from-[#E2E8F0] to-[#38BDF8]",
    badge: "Celestial Order",
    crownEmoji: "✨"
  }
];

interface ThemeContextType {
  theme: RoyalThemeId;
  setTheme: (theme: RoyalThemeId) => void;
  themes: RoyalThemeInfo[];
  activeThemeInfo: RoyalThemeInfo;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<RoyalThemeId>("imperial-gold");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("wealthsage_royal_theme") as RoyalThemeId | null;
      if (savedTheme && ROYAL_THEMES.some((t) => t.id === savedTheme)) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "imperial-gold");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "imperial-gold");
    }
  }, []);

  const setTheme = (newTheme: RoyalThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("wealthsage_royal_theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
  };

  const activeThemeInfo = ROYAL_THEMES.find((t) => t.id === theme) || ROYAL_THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: ROYAL_THEMES, activeThemeInfo }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useRoyalTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useRoyalTheme must be used within a ThemeProvider");
  }
  return context;
}
