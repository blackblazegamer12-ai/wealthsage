"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";
import { NotificationItem } from "../types";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "alert" | "insight" | "security">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={16} className="text-amber-400" />;
      case "insight":
        return <Sparkles size={16} className="text-cyan-400" />;
      case "security":
        return <ShieldCheck size={16} className="text-emerald-400" />;
      default:
        return <Zap size={16} className="text-purple-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end bg-black/50 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between z-10"
            style={{ backgroundColor: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)' }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      Notification Center
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {unreadCount} unread system telemetry events
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl transition-all"
                  style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 mb-4 p-1 rounded-xl text-xs" style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)' }}>
                {(["all", "alert", "insight", "security"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    className="flex-1 py-1 rounded-lg text-center font-semibold capitalize transition-all"
                    style={filter === cat
                      ? { backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)' }
                      : { color: 'var(--text-muted)' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notification List */}
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {filtered.length === 0 ? (
                  <div className="py-16 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Bell size={28} className="mx-auto mb-2 opacity-40" />
                    No notifications in this view.
                  </div>
                ) : (
                  filtered.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border transition-all"
                      style={!item.read
                        ? { backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--border-royal)' }
                        : { backgroundColor: 'var(--surface-overlay)', borderColor: 'var(--border-subtle)' }
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl shrink-0 mt-0.5" style={{ backgroundColor: 'var(--icon-subtle)', border: '1px solid var(--border-subtle)' }}>
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                            <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                              {item.created_at}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={onMarkAllRead}
                className="flex items-center gap-1.5 font-semibold transition-colors hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                <CheckCheck size={15} /> Mark all as read
              </button>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>WealthSage Telemetry</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
