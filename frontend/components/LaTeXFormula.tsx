"use client";

import React, { useMemo, useState } from "react";
import katex from "katex";
import { Copy, Check } from "lucide-react";

interface LaTeXFormulaProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  showCopy?: boolean;
  caption?: string;
}

export default function LaTeXFormula({
  math,
  displayMode = true,
  className = "",
  showCopy = false,
  caption,
}: LaTeXFormulaProps) {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return math;
    }
  }, [math, displayMode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(math);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  if (!displayMode) {
    return (
      <span
        className={`inline-block align-middle font-serif text-[var(--accent-primary)] ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={`relative group/formula rounded-2xl p-4 sm:p-5 bg-[var(--formula-bg)] border border-[var(--formula-border)] overflow-x-auto text-[var(--formula-text)] transition-all ${className}`}
    >
      {caption && (
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <span>{caption}</span>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1 cursor-pointer"
              title="Copy LaTeX source"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "LaTeX"}</span>
            </button>
          )}
        </div>
      )}

      <div
        className="w-full flex justify-center items-center py-1 overflow-x-auto select-all"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {!caption && showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all opacity-0 group-hover/formula:opacity-100 flex items-center gap-1 text-[10px] font-mono border border-[var(--border-subtle)] cursor-pointer"
          title="Copy LaTeX"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      )}
    </div>
  );
}
