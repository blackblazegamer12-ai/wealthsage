"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Activity,
  Menu,
  X,
  Palette,
  Compass,
  Zap,
} from "lucide-react";
import ThemeSelectorModal from "../theme/ThemeSelectorModal";

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[var(--bg-glass)] backdrop-blur-xl border-b border-[var(--border-subtle)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-black font-extrabold text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  WealthSage
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-royal)] uppercase tracking-widest">
                  SOVEREIGN
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Autonomous AI Financial Vault</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[var(--text-secondary)]">
            <a
              href="#features"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-[var(--accent-primary)]" /> Features
            </a>
            <a
              href="#tools"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Compass size={14} className="text-cyan-400" /> Guide to Tools
            </a>
            <Link
              href="/quantum-visualizer"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Activity size={14} className="text-emerald-400" /> Quantum Visualizer
            </Link>
            <Link
              href="/subsystems"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Layers size={14} className="text-purple-400" /> Subsystems
            </Link>
            <Link
              href="/security"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <Shield size={14} className="text-rose-400" /> Security
            </Link>
          </nav>

          {/* Right Action CTAs & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme switcher trigger */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all cursor-pointer shadow-sm"
              title="Switch Royal Theme"
            >
              <Palette size={16} />
            </button>

            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl royal-btn-accent text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Launch Workspace <ArrowRight size={14} />
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl royal-btn-accent text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Get Started Free <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
              title="Switch Royal Theme"
            >
              <Palette size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 py-5 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-[var(--text-secondary)]">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--text-primary)] flex items-center gap-2 py-1"
              >
                <Sparkles size={16} className="text-[var(--accent-primary)]" /> Features Section
              </a>
              <a
                href="#tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--text-primary)] flex items-center gap-2 py-1"
              >
                <Compass size={16} className="text-cyan-400" /> Guide to the Tools
              </a>
              <Link
                href="/quantum-visualizer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--text-primary)] flex items-center gap-2 py-1"
              >
                <Activity size={16} className="text-emerald-400" /> Quantum Visualizer
              </Link>
              <Link
                href="/subsystems"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--text-primary)] flex items-center gap-2 py-1"
              >
                <Layers size={16} className="text-purple-400" /> Subsystems Architecture
              </Link>
              <Link
                href="/security"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--text-primary)] flex items-center gap-2 py-1"
              >
                <Shield size={16} className="text-rose-400" /> Security & Audit Trail
              </Link>
            </nav>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
              {isLoaded && isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 rounded-xl royal-btn-accent text-xs font-bold text-center shadow-md block"
                >
                  Launch Sovereign Workspace
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="w-full py-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold text-xs text-center border border-[var(--border-subtle)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="w-full py-2.5 rounded-xl royal-btn-accent text-xs font-bold text-center shadow-md block"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </>
  );
}
