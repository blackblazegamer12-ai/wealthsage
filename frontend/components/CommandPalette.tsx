"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search, X } from "lucide-react";

export interface CommandAction {
  id: string;
  label: string;
  description: string;
  group: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onSelect: () => void;
}

interface CommandPaletteProps { isOpen: boolean; onClose: () => void; actions: CommandAction[]; }

const normalized = (value: string) => value.toLowerCase().replace(/\s+/g, "");
function fuzzyMatches(query: string, candidate: string) {
  let searchIndex = 0;
  for (const char of normalized(candidate)) {
    if (char === query[searchIndex]) searchIndex += 1;
    if (searchIndex === query.length) return true;
  }
  return query.length === 0;
}

export default function CommandPalette({ isOpen, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => {
    const term = normalized(query);
    return actions.filter((action) => fuzzyMatches(term, `${action.label} ${action.description} ${action.group}`));
  }, [actions, query]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const choose = (action: CommandAction) => { action.onSelect(); onClose(); };
  return <AnimatePresence>{isOpen && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/35 backdrop-blur-sm px-4 pt-[12vh]">
      <motion.div initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actions…" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-black/5"><X size={17} /></button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {matches.length ? matches.map((action) => { const Icon = action.icon; return <button key={action.id} type="button" onClick={() => choose(action)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-black/5">
            <span className="rounded-lg bg-[var(--accent-glow)] p-2 text-[var(--accent-primary)]"><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[var(--text-primary)]">{action.label}</span><span className="block truncate text-xs text-[var(--text-muted)]">{action.description}</span></span><span className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{action.group}</span>
          </button>; }) : <div className="px-3 py-10 text-center text-sm text-[var(--text-muted)]">No matching action.</div>}
        </div>
        <div className="flex items-center gap-1 border-t border-[var(--border-subtle)] px-4 py-2 text-[11px] text-[var(--text-muted)]"><Command size={12} /> Command palette · Esc to close</div>
      </motion.div>
    </motion.div>
  )}</AnimatePresence>;
}
