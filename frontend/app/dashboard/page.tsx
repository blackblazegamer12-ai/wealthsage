"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Zap,
  BookOpen,
  Settings,
  Sparkles,
  Crown,
  LogOut,
  LogIn,
  Command,
  Plus,
  ShieldAlert,
  Palette,
  Bell,
  FileCheck2,
  Lock,
  ArrowLeft
} from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

// Modals & Drawers
import TransactionModal from "../../components/TransactionModal";
import AuditModal from "../../components/AuditModal";
import GoalModal from "../../components/GoalModal";
import SubscriptionModal from "../../components/SubscriptionModal";
import ThemeSelectorModal from "../../components/theme/ThemeSelectorModal";
import FullscreenAIModal from "../../components/modals/FullscreenAIModal";
import HighFrictionConfirmModal from "../../components/modals/HighFrictionConfirmModal";
import NotificationCenter from "../../components/NotificationCenter";
import SecurityAuditLogModal from "../../components/SecurityAuditLog";
import ToastContainer, { ToastMessage } from "../../components/Toast";
import CommandPalette, { CommandAction } from "../../components/CommandPalette";

// Modular Tabs
import OverviewTab from "../../components/tabs/OverviewTab";
import AnalyticsTab from "../../components/tabs/AnalyticsTab";
import CommitmentsTab from "../../components/tabs/CommitmentsTab";
import SimulatorTab from "../../components/tabs/SimulatorTab";
import NotebookTab from "../../components/tabs/NotebookTab";
import SettingsTab from "../../components/tabs/SettingsTab";

import { useRoyalTheme } from "../../components/theme/ThemeContext";
import { BriefingData } from "../../components/ExecutiveBriefing";
import { DEMO_PRESETS, DemoPreset } from "../../components/DemoPresetBar";
import { isValidSupabaseConfig, sanitizeAmount, sanitizeTextInput } from "../../lib/sanitize";
import { api } from "../../lib/api";
import { SecurityAuditLog as AuditEntry, NotificationItem } from "../../types";

// --- SUPABASE & API CONFIG ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_CONFIGURED = isValidSupabaseConfig(SUPABASE_URL, SUPABASE_ANON_KEY);
const SAFE_SUPABASE_URL = SUPABASE_CONFIGURED ? SUPABASE_URL : "https://localhost.invalid";
const SAFE_SUPABASE_ANON_KEY = SUPABASE_CONFIGURED ? SUPABASE_ANON_KEY : "demo-mode-disabled";
const supabase = createClient(SAFE_SUPABASE_URL, SAFE_SUPABASE_ANON_KEY);

type ActiveTabType = "overview" | "analytics" | "commitments" | "simulator" | "notebook" | "settings";

function DashboardContent() {
  const { theme, setTheme, themes } = useRoyalTheme();
  const { user: clerkUser } = useUser();
  const searchParams = useSearchParams();

  // Core Navigation & Loading
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    const tabParam = searchParams.get("tab") as ActiveTabType | null;
    return tabParam && ["overview", "analytics", "commitments", "simulator", "notebook", "settings"].includes(tabParam)
      ? tabParam
      : "overview";
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab") as ActiveTabType | null;
    if (tabParam && ["overview", "analytics", "commitments", "simulator", "notebook", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [isLoading, setIsLoading] = useState(true);

  // Entities
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [noteTitle, setNoteTitle] = useState("Untitled Note");
  const [noteContent, setNoteContent] = useState("");
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  // Audit Logs & Notifications Store
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-001",
      title: "Sovereign Vault Synchronized",
      message: "Autonomous telemetry engine online with zero latency buffer loss.",
      type: "insight",
      read: false,
      created_at: "Just now",
    }
  ]);

  // AI & Analytics State
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [insights, setInsights] = useState([
    {
      id: "1",
      message: "Welcome to WealthSage Sovereign Edition. I am your autonomous AI financial architect. Ask quant questions, analyze leaks, or simulate compound wealth.",
      type: "advice"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Modals Open State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [goalForm, setGoalForm] = useState<any>({ name: "", target: "", current: "", icon: "🎯", color: "#06B6D4" });
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [subForm, setSubForm] = useState<any>({ name: "", amount: "", cycle: "Monthly", nextDate: "", icon: "💸", color: "#10B981" });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isGlassAIOpen, setIsGlassAIOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState(false);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);

  // Form data for manual record
  const [formData, setFormData] = useState({ name: "", amount: "", type: "expense", category: "Housing" });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>("tech-lead");

  const currentUserId = clerkUser?.id || "demo-user-id";
  const userDisplayName = clerkUser?.fullName || clerkUser?.firstName || "Sovereign Executive";

  const addToast = (title: string, description?: string, type: "success" | "ai" | "warning" | "info" = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Executive Briefing
  const fetchExecutiveBriefing = async (
    currentTx = transactions,
    currentGoals = goals,
    currentSubs = subscriptions
  ) => {
    setIsBriefingLoading(true);
    try {
      const data = await api.getExecutiveBriefing(currentTx, currentGoals, currentSubs);
      if (data) {
        setBriefingData(data);
      }
    } catch (e) {
      console.warn("Executive briefing fallback:", e);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Fetch All Data (including chat history from Supabase for AI memory)
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch audit logs (from new Supabase-persisted endpoint)
      const logs = await api.getAuditLogs(currentUserId).catch(() => []);
      if (logs && Array.isArray(logs)) setAuditLogs(logs);

      // Fetch notifications from Supabase
      try {
        const notifRes = await fetch(`/api/notifications?user_id=${encodeURIComponent(currentUserId)}`);
        const notifData = await notifRes.json();
        if (notifData && Array.isArray(notifData) && notifData.length > 0) {
          setNotifications(notifData);
        }
      } catch {}

      // Fetch chat history from Supabase for AI memory
      try {
        const chatRes = await fetch(`/api/chat?user_id=${encodeURIComponent(currentUserId)}`);
        const chatData = await chatRes.json();
        if (chatData?.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
          const restoredInsights = chatData.messages.map((msg: any) => ({
            id: msg.id,
            message: msg.content,
            type: msg.role === "user" ? "user" : "advice",
          }));
          setInsights(restoredInsights);
        }
      } catch {}

      if (!SUPABASE_CONFIGURED) {
        const preset = DEMO_PRESETS[0];
        setNotes([{ id: "1", title: "Welcome to WealthSage", content: "Your local demo workspace is ready." }]);
        setTransactions(preset.transactions);
        setGoals(preset.goals);
        setSubscriptions(preset.subscriptions);
        fetchExecutiveBriefing(preset.transactions, preset.goals, preset.subscriptions);
        setIsLoading(false);
        return;
      }

      // Supabase fetch
      const { data: noteData } = await supabase
        .from("notes")
        .select("id, user_id, title, content")
        .eq("user_id", currentUserId);
      if (noteData && noteData.length > 0) {
        setNotes(noteData);
      } else {
        setNotes([{
          id: "1",
          title: "Sovereign Compounding Thesis",
          content: "## Sovereign Wealth Building Roadmap\n- Save at least $25\\%$ of gross revenue\n- Maximize compound interest: $$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\n- Rebalance monthly surplus into low-cost index equities."
        }]);
      }

      let loadedTx = DEMO_PRESETS[0].transactions;
      const { data: txData } = await supabase
        .from("transactions")
        .select("id, user_id, name, amount, type, category, created_at")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });
      if (txData && txData.length > 0) loadedTx = txData;
      setTransactions(loadedTx);

      let loadedGoals = DEMO_PRESETS[0].goals;
      const { data: goalData } = await supabase
        .from("goals")
        .select("id, user_id, name, target, current, color, icon")
        .eq("user_id", currentUserId);
      if (goalData && goalData.length > 0) loadedGoals = goalData;
      setGoals(loadedGoals);

      let loadedSubs = DEMO_PRESETS[0].subscriptions;
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("id, user_id, name, amount, cycle, nextDate, icon, color")
        .eq("user_id", currentUserId);
      if (subData && subData.length > 0) loadedSubs = subData;
      setSubscriptions(loadedSubs);

      fetchExecutiveBriefing(loadedTx, loadedGoals, loadedSubs);
    } catch (err) {
      console.warn("Data load fallback:", err);
      const preset = DEMO_PRESETS[0];
      setTransactions(preset.transactions);
      setGoals(preset.goals);
      setSubscriptions(preset.subscriptions);
      fetchExecutiveBriefing(preset.transactions, preset.goals, preset.subscriptions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUserId]);

  // Derived Totals
  const { totalIncome, totalExpense, currentBalance, wealthData, expensesByCategory } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const categoryMap: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        const cat = tx.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + (Number(tx.amount) || 0);
      }
    });

    const categoryPalette = ["#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#f59e0b", "#ec4899"];
    const expByCat = Object.entries(categoryMap).map(([name, value], i) => ({
      name,
      value,
      color: categoryPalette[i % categoryPalette.length],
    }));

    const wData = [
      { month: "Jan", wealth: Math.round(income * 0.7) },
      { month: "Feb", wealth: Math.round(income * 0.85) },
      { month: "Mar", wealth: Math.round(income - expense * 0.5) },
      { month: "Apr", wealth: Math.round(income * 1.05 - expense * 0.4) },
      { month: "Current", wealth: Math.max(1000, income - expense) },
    ];

    return {
      totalIncome: income,
      totalExpense: expense,
      currentBalance: income - expense,
      wealthData: wData,
      expensesByCategory: expByCat,
    };
  }, [transactions]);

  // Persona Preset Selection
  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setTransactions(preset.transactions);
    setGoals(preset.goals);
    setSubscriptions(preset.subscriptions);
    fetchExecutiveBriefing(preset.transactions, preset.goals, preset.subscriptions);
    addToast(`Loaded Persona: ${preset.name}`, preset.badge, "ai");
  };

  // Safe Execution of FULL Ledger Reset (clears ALL tables: transactions, goals, subs, notes, chat)
  const handleConfirmResetLedger = async () => {
    try {
      // Call the dedicated reset API which clears ALL Supabase tables
      const res = await fetch(`/api/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, scope: "all" }),
      });
      const data = await res.json();
      console.log("[Reset] API response:", data);
    } catch (err) {
      console.warn("[Reset] API failed, falling back to client-side Supabase:", err);
      // Fallback: clear directly via client-side Supabase
      if (SUPABASE_CONFIGURED) {
        await Promise.allSettled([
          supabase.from("transactions").delete().eq("user_id", currentUserId),
          supabase.from("goals").delete().eq("user_id", currentUserId),
          supabase.from("subscriptions").delete().eq("user_id", currentUserId),
          supabase.from("notes").delete().eq("user_id", currentUserId),
          supabase.from("chat_messages").delete().eq("user_id", currentUserId),
        ]);
      }
    }

    // Reset local state
    setActivePresetId(null);
    setTransactions([]);
    setGoals([]);
    setSubscriptions([]);
    setNotes([]);
    setInsights([{
      id: "welcome-reset",
      message: "Ledger fully reset. All transactions, goals, subscriptions, notes, and chat history have been cleared.",
      type: "advice"
    }]);
    fetchExecutiveBriefing([], [], []);

    addToast("Full Ledger Reset", "All data cleared across all tables (transactions, goals, subscriptions, notes, chat).", "warning");
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = sanitizeTextInput(formData.name);
    const amount = sanitizeAmount(formData.amount);
    if (!name || !amount) return;

    const newTx = {
      id: crypto.randomUUID(),
      name,
      amount,
      type: formData.type,
      category: sanitizeTextInput(formData.category, 80) || "General",
      user_id: currentUserId,
    };

    if (SUPABASE_CONFIGURED) await supabase.from("transactions").insert([newTx]);
    const updated = [...transactions, newTx];
    setTransactions(updated);
    fetchExecutiveBriefing(updated, goals, subscriptions);
    setIsModalOpen(false);
    setFormData({ name: "", amount: "", type: "expense", category: "Housing" });
    addToast("Record Logged", `${newTx.name} (${newTx.type === "income" ? "+" : "-"}$${newTx.amount})`);
  };

  const handleSaveGoal = async () => {
    const targetNum = sanitizeAmount(goalForm.target);
    if (!goalForm.name || !targetNum) return;
    const gPayload = {
      id: editingGoal?.id || crypto.randomUUID(),
      name: sanitizeTextInput(goalForm.name),
      target: targetNum,
      current: sanitizeAmount(goalForm.current) || 0,
      color: goalForm.color || "#06B6D4",
      icon: goalForm.icon || "🎯",
      user_id: currentUserId,
    };
    if (SUPABASE_CONFIGURED) await supabase.from("goals").upsert([gPayload]);
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === gPayload.id);
      return exists ? prev.map((g) => (g.id === gPayload.id ? gPayload : g)) : [...prev, gPayload];
    });
    setIsGoalModalOpen(false);
    addToast(editingGoal ? "Goal Updated" : "Goal Created", gPayload.name);
  };

  const handleSaveSubscription = async () => {
    const amtNum = sanitizeAmount(subForm.amount);
    if (!subForm.name || !amtNum) return;
    const sPayload = {
      id: editingSub?.id || crypto.randomUUID(),
      name: sanitizeTextInput(subForm.name),
      amount: amtNum,
      cycle: subForm.cycle || "Monthly",
      nextDate: subForm.nextDate || "1st",
      icon: subForm.icon || "💸",
      color: subForm.color || "#10B981",
      user_id: currentUserId,
    };
    if (SUPABASE_CONFIGURED) await supabase.from("subscriptions").upsert([sPayload]);
    setSubscriptions((prev) => {
      const exists = prev.some((s) => s.id === sPayload.id);
      return exists ? prev.map((s) => (s.id === sPayload.id ? sPayload : s)) : [...prev, sPayload];
    });
    setIsSubModalOpen(false);
    addToast(editingSub ? "Subscription Updated" : "Subscription Logged", sPayload.name);
  };

  const dispatchChatMessage = async (msgText: string) => {
    if (!msgText.trim()) return;
    const userMessage = msgText;
    setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: userMessage, type: "user" }]);
    setInputValue("");
    setIsTyping(true);

    const chatHistory = insights
      .filter((msg) => msg.type === "user" || msg.type === "advice")
      .slice(-20) // Limit history to last 20 messages for context window
      .map((msg) => ({ role: msg.type === "user" ? "user" : "assistant", content: msg.message }));

    try {
      // Use the new /api/chat endpoint which persists to Supabase
      const res = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory,
          transactions,
          user_id: currentUserId,
        }),
      });
      const data = await res.json();

      if (data && data.reply) {
        setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: data.reply, type: "advice" }]);

        if (data.has_updates && data.updates && Array.isArray(data.updates)) {
          let currentList = [...transactions];
          let currentGoals = [...goals];
          let currentSubs = [...subscriptions];

          for (const update of data.updates) {
            if (update.action === "add") {
              const newTx = {
                id: crypto.randomUUID(),
                name: update.name,
                amount: update.amount,
                type: update.type || "expense",
                category: update.category || "General",
                user_id: currentUserId,
              };
              if (SUPABASE_CONFIGURED) await supabase.from("transactions").insert([newTx]);
              currentList.push(newTx);
              addToast("AI Logged Record", `${newTx.name} ($${newTx.amount})`, "ai");
            } else if (update.action === "add_subscription") {
              const newSub = {
                id: crypto.randomUUID(),
                name: update.name,
                amount: update.amount,
                cycle: update.cycle || "Monthly",
                nextDate: update.nextDate || "1st",
                icon: update.icon || "💸",
                color: update.color || "#10B981",
                user_id: currentUserId,
              };
              if (SUPABASE_CONFIGURED) await supabase.from("subscriptions").insert([newSub]);
              currentSubs.push(newSub);
              addToast("AI Logged Subscription", `${newSub.name} ($${newSub.amount}/mo)`, "ai");
            } else if (update.action === "update" && update.id) {
              if (update.target === "transaction") {
                if (SUPABASE_CONFIGURED) await supabase.from("transactions").update({ name: update.name, amount: update.amount, category: update.category }).eq("id", update.id);
                currentList = currentList.map((t) => t.id === update.id ? { ...t, ...update } : t);
                addToast("AI Updated Record", `${update.name} ($${update.amount})`, "ai");
              } else if (update.target === "goal") {
                if (SUPABASE_CONFIGURED) await supabase.from("goals").update({ name: update.name, target: update.target_amount, current: update.current }).eq("id", update.id);
                currentGoals = currentGoals.map((g) => g.id === update.id ? { ...g, ...update } : g);
                addToast("AI Updated Goal", update.name, "ai");
              } else if (update.target === "subscription") {
                if (SUPABASE_CONFIGURED) await supabase.from("subscriptions").update({ name: update.name, amount: update.amount }).eq("id", update.id);
                currentSubs = currentSubs.map((s) => s.id === update.id ? { ...s, ...update } : s);
                addToast("AI Updated Subscription", update.name, "ai");
              }
            } else if (update.action === "delete" && update.id) {
              if (update.target === "transaction") {
                if (SUPABASE_CONFIGURED) await supabase.from("transactions").delete().eq("id", update.id);
                currentList = currentList.filter((t) => t.id !== update.id);
                addToast("AI Deleted Record", "Transaction removed.", "ai");
              } else if (update.target === "subscription") {
                if (SUPABASE_CONFIGURED) await supabase.from("subscriptions").delete().eq("id", update.id);
                currentSubs = currentSubs.filter((s) => s.id !== update.id);
                addToast("AI Deleted Subscription", "Subscription removed.", "ai");
              }
            } else if (update.action === "reset") {
              setIsResetConfirmModalOpen(true);
            }
          }

          setTransactions(currentList);
          setGoals(currentGoals);
          setSubscriptions(currentSubs);
          fetchExecutiveBriefing(currentList, currentGoals, currentSubs);
        }
      }
    } catch (error) {
      console.warn("Chat API error, using client-side fallback:", error);
      // Client-side fallback
      const q = userMessage.toLowerCase();
      const income = transactions.filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
      const expense = transactions.filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
      const net = income - expense;

      let fallbackText = `### WealthSage AI\n\nAnalyzing: *"${userMessage}"*\n\n**Active Ledger:** Income: $${income.toFixed(2)}/mo, Expenses: $${expense.toFixed(2)}/mo, Net: $${net.toFixed(2)}/mo\n\nAsk me to **log expenses**, **forecast growth**, **audit spending**, or **analyze trends**.`;

      setInsights((prev) => [
        ...prev,
        { id: crypto.randomUUID(), message: fallbackText, type: "advice" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const runAuditAnalysis = async () => {
    setIsAuditing(true);
    setIsAuditOpen(true);
    try {
      const data = await api.runAudit(transactions);
      setAuditData(data);
      addToast("Audit Complete", `Alert Level: ${data.alert_level}`, "ai");
    } catch (err) {
      console.warn("Audit error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Command Actions for Palette
  const commandActions: CommandAction[] = useMemo(
    () => [
      {
        id: "cmd-add-tx",
        label: "Add Record",
        description: "Log an income or expenditure",
        group: "Actions",
        icon: Plus,
        onSelect: () => setIsModalOpen(true),
      },
      {
        id: "cmd-audit",
        label: "Run Financial Audit",
        description: "Analyze burn velocity and leak vectors",
        group: "Actions",
        icon: ShieldAlert,
        onSelect: () => runAuditAnalysis(),
      },
      {
        id: "cmd-glass-ai",
        label: "Open Glass AI Copilot",
        description: "Natural language financial reasoning",
        group: "AI",
        icon: Sparkles,
        onSelect: () => setIsGlassAIOpen(true),
      },
      {
        id: "cmd-tab-overview",
        label: "Go to Overview",
        description: "Main telemetry and transaction ledger",
        group: "Navigation",
        icon: LayoutDashboard,
        onSelect: () => setActiveTab("overview"),
      },
      {
        id: "cmd-tab-analytics",
        label: "Go to Analytics",
        description: "Expense distribution and trends",
        group: "Navigation",
        icon: BarChart3,
        onSelect: () => setActiveTab("analytics"),
      },
      {
        id: "cmd-tab-commitments",
        label: "Go to Zombie Subs & Commitments",
        description: "Manage recurring charges and leaks",
        group: "Navigation",
        icon: Target,
        onSelect: () => setActiveTab("commitments"),
      },
      {
        id: "cmd-tab-simulator",
        label: "Go to Compounding Simulator",
        description: "Forward-looking wealth trajectory",
        group: "Navigation",
        icon: Zap,
        onSelect: () => setActiveTab("simulator"),
      },
    ],
    [transactions]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Workspace Header Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Link + Back to Landing */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 p-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
              title="Return to Public Landing Page"
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Landing</span>
            </Link>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-amber-500/20">
                ⚡
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  WealthSage
                </span>
                <span className="hidden md:inline ml-2 text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--border-subtle)' }}>
                  WORKSPACE
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions & Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--icon-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <Command size={13} style={{ color: 'var(--accent-primary)' }} />
              <span className="hidden sm:inline">Command</span>
              <kbd className="text-[10px] font-mono px-1 rounded" style={{ backgroundColor: 'var(--surface-input)', color: 'var(--text-muted)' }}>⌘K</kbd>
            </button>

            {/* Notification Center Trigger */}
            <button
              type="button"
              onClick={() => setIsNotifCenterOpen(true)}
              className="p-2 rounded-xl relative transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              title="Notification Center"
            >
              <Bell size={16} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent-primary)' }} />
              )}
            </button>

            {/* Security Audit Log Trigger */}
            <button
              type="button"
              onClick={() => setIsAuditLogModalOpen(true)}
              className="p-2 rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              title="Security Audit Trail"
            >
              <FileCheck2 size={16} />
            </button>

            {/* Theme Selector */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              className="p-2 rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--icon-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              title="Switch Royal Theme"
            >
              <Palette size={16} />
            </button>

            {/* Clerk User Avatar / Profile */}
            <div className="ml-1 pl-2 flex items-center" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
              {clerkUser ? (
                <UserButton />
              ) : (
                <Link
                  href="/sign-in"
                  className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                  style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)', border: '1px solid var(--border-royal)' }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
            { id: "commitments", label: "Zombie Subs & Commitments", icon: Target },
            { id: "simulator", label: "Compounding Engine", icon: Zap },
            { id: "notebook", label: "Quant Notebook", icon: BookOpen },
            { id: "settings", label: "Vault Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTabType)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                style={isActive
                  ? { background: 'var(--accent-gradient)', color: 'var(--text-on-accent)', boxShadow: '0 4px 14px var(--accent-glow)', fontWeight: 800 }
                  : { backgroundColor: 'var(--surface-overlay)', color: 'var(--text-muted)', border: '1px solid transparent' }
                }
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Router */}
        <main className="flex-1">
          {activeTab === "overview" && (
            <OverviewTab
              userName={userDisplayName}
              currentBalance={currentBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              transactions={transactions}
              currentUserId={currentUserId}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onResetPreset={() => setIsResetConfirmModalOpen(true)}
              onOpenAddModal={() => setIsModalOpen(true)}
              onOpenAuditModal={runAuditAnalysis}
              onOpenGlassAI={() => setIsGlassAIOpen(true)}
              onBankConnected={() => {
                fetchAllData();
                addToast("Bank Connected", "Incremental transaction sync loop completed.", "success");
              }}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              briefingData={briefingData}
              isBriefingLoading={isBriefingLoading}
              onRefreshBriefing={() => fetchExecutiveBriefing()}
              onExecuteAction={(a) => dispatchChatMessage(a)}
              monthlyIncome={totalIncome}
              monthlyExpense={totalExpense}
              wealthData={wealthData}
              expensesByCategory={expensesByCategory}
              userName={userDisplayName}
              transactionCount={transactions.length}
              goalCount={goals.length}
              subscriptionCount={subscriptions.length}
            />
          )}

          {activeTab === "commitments" && (
            <CommitmentsTab
              goals={goals}
              subscriptions={subscriptions}
              onOpenGoalModal={(g) => {
                setEditingGoal(g || null);
                setGoalForm(g || { name: "", target: "", current: "", icon: "🎯", color: "#06B6D4" });
                setIsGoalModalOpen(true);
              }}
              onDeleteGoal={async (id) => {
                if (SUPABASE_CONFIGURED) await supabase.from("goals").delete().eq("id", id);
                setGoals((prev) => prev.filter((g) => g.id !== id));
                addToast("Goal Removed", "Milestone removed from vault.", "info");
              }}
              onOpenSubModal={(s) => {
                setEditingSub(s || null);
                setSubForm(s || { name: "", amount: "", cycle: "Monthly", nextDate: "", icon: "💸", color: "#10B981" });
                setIsSubModalOpen(true);
              }}
              onDeleteSub={async (id) => {
                if (SUPABASE_CONFIGURED) await supabase.from("subscriptions").delete().eq("id", id);
                setSubscriptions((prev) => prev.filter((s) => s.id !== id));
                addToast("Subscription Removed", "Recurring commitment untracked.", "info");
              }}
            />
          )}

          {activeTab === "simulator" && (
            <SimulatorTab />
          )}

          {activeTab === "notebook" && (
            <NotebookTab
              notes={notes}
              activeNote={activeNote}
              setActiveNote={setActiveNote}
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              noteContent={noteContent}
              setNoteContent={setNoteContent}
              onCreateNewNote={() => {
                setActiveNote(null);
                setNoteTitle("New Sovereign Thesis");
                setNoteContent("## Formula Analysis\n$$A = P(1 + r/n)^{nt}$$");
              }}
              onSaveNote={async () => {
                const notePayload = {
                  id: activeNote?.id || crypto.randomUUID(),
                  title: sanitizeTextInput(noteTitle) || "Untitled Note",
                  content: sanitizeTextInput(noteContent, 8000) || "",
                  user_id: currentUserId,
                };
                if (SUPABASE_CONFIGURED) {
                  await supabase.from("notes").upsert([notePayload]);
                }
                setNotes((prev) => {
                  const exists = prev.some((n) => n.id === notePayload.id);
                  return exists ? prev.map((n) => (n.id === notePayload.id ? notePayload : n)) : [...prev, notePayload];
                });
                setActiveNote(notePayload);
                addToast("Note Saved", notePayload.title, "success");
              }}
              onAskTutor={async () => {
                if (!noteContent.trim()) return;
                setIsTutorThinking(true);
                try {
                  const result = await api.explainTutor(noteContent);
                  if (result && result.explanation) {
                    setNoteContent((prev) => `${prev}\n\n### AI Tutor Mathematical Expansion\n${result.explanation}`);
                    addToast("AI Tutor Complete", "Quantitative derivation generated.", "ai");
                  }
                } catch (e) {
                  console.warn("Tutor error:", e);
                } finally {
                  setIsTutorThinking(false);
                }
              }}
              isTutorThinking={isTutorThinking}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              user={clerkUser}
              transactions={transactions}
              goals={goals}
              subscriptions={subscriptions}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onClearLedger={() => setIsResetConfirmModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSaveTransaction}
      />

      <AuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditData={auditData}
        isAuditing={isAuditing}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        goalForm={goalForm}
        setGoalForm={setGoalForm}
        editingGoal={editingGoal}
        onSave={handleSaveGoal}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subForm={subForm}
        setSubForm={setSubForm}
        editingSub={editingSub}
        onSave={handleSaveSubscription}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <FullscreenAIModal
        isOpen={isGlassAIOpen}
        onClose={() => setIsGlassAIOpen(false)}
        insights={insights}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={dispatchChatMessage}
        isTyping={isTyping}
        isScanning={isScanning}
        onFileUpload={() => {}}
        onClearChat={async () => {
          setInsights([]);
          try {
            await fetch(`/api/chat?user_id=${encodeURIComponent(currentUserId)}`, { method: "DELETE" });
          } catch {}
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        actions={commandActions}
      />

      <NotificationCenter
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onMarkAllRead={async () => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          try {
            await fetch(`/api/notifications`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: currentUserId, mark_all_read: true }),
            });
          } catch {}
          addToast("Notifications Updated", "Marked all as read.", "info");
        }}
      />

      <SecurityAuditLogModal
        isOpen={isAuditLogModalOpen}
        onClose={() => setIsAuditLogModalOpen(false)}
        logs={auditLogs}
      />

      <HighFrictionConfirmModal
        isOpen={isResetConfirmModalOpen}
        onClose={() => setIsResetConfirmModalOpen(false)}
        onConfirm={handleConfirmResetLedger}
        title="Hard Reset Ledger & Clear All Records"
        description="This will irreversibly wipe all local and cloud ledger transactions, goals, and recurring commitments. You cannot undo this action."
        requiredPhrase="CONFIRM RESET"
        confirmButtonText="Execute Hard Reset"
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] font-mono text-xs">
          Loading Sovereign Vault...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

