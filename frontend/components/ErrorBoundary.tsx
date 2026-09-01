"use client";
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[WealthSage ErrorBoundary]", error, errorInfo);
    // Optionally log to remote error tracking
    try {
      fetch("/api/error-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div
            className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border space-y-6"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                {this.props.fallbackTitle || "Something Went Wrong"}
              </h2>
              <p className="text-xs text-[var(--text-dim)] font-mono leading-relaxed">
                WealthSage encountered an unexpected error. Your data is safe — this is a rendering issue.
              </p>
            </div>

            {/* Error Details */}
            {this.state.error && (
              <div className="text-left p-4 rounded-xl bg-black/50 border border-white/10 overflow-auto max-h-32">
                <p className="text-[10px] font-mono text-red-300 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Retry Button */}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
              }}
            >
              <RefreshCw size={16} />
              Retry
            </button>

            <p className="text-[9px] text-[var(--text-dim)] font-mono">
              If this persists, try refreshing the page or clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
