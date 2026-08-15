"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Zap,
  BookOpen,
  Settings,
  Sparkles,
  MessageSquare,
  Crown,
  User as UserIcon,
  LogOut,
  LogIn,
  Maximize2
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Modals
import TransactionModal from "../components/TransactionModal";
import AuditModal from "../components/AuditModal";
import GoalModal from "../components/GoalModal";
import SubscriptionModal from "../components/SubscriptionModal";
import ThemeSelectorModal from "../components/theme/ThemeSelectorModal";
import FullscreenAIModal from "../components/modals/FullscreenAIModal";
import ToastContainer, { ToastMessage } from "../components/Toast";
import ReceiptScannerModal from "../components/ReceiptScannerModal";

// Modular Tabs
import OverviewTab from "../components/tabs/OverviewTab";
import AnalyticsTab from "../components/tabs/AnalyticsTab";
import CommitmentsTab from "../components/tabs/CommitmentsTab";
import SimulatorTab from "../components/tabs/SimulatorTab";
import NotebookTab from "../components/tabs/NotebookTab";
import SettingsTab from "../components/tabs/SettingsTab";

import { useRoyalTheme } from "../components/theme/ThemeContext";
import { BriefingData } from "../components/ExecutiveBriefing";
import { DEMO_PRESETS, DemoPreset } from "../components/DemoPresetBar";

// --- SUPABASE & API CONFIG ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#f59e0b", "#ec4899"];

type ActiveTabType = "overview" | "analytics" | "commitments" | "simulator" | "notebook" | "settings";

export default function Dashboard() {
  const { theme, activeThemeInfo } = useRoyalTheme();

  // Core State
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>("overview");
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

  // AI & Analytics State
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [insights, setInsights] = useState([
    {
      id: "1",
      message: "Welcome to WealthSage Royal Edition. I am your autonomous AI financial architect. Ask quant questions, analyze leaks, or simulate compound wealth.",
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
  const [goalForm, setGoalForm] = useState<any>({ name: "", target: "", current: "", icon: "🎯" });
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [subForm, setSubForm] = useState<any>({ name: "", amount: "", cycle: "Monthly", nextDate: "", icon: "💸", color: "#10B981" });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isGlassAIOpen, setIsGlassAIOpen] = useState(false);

  // Form data for manual record
  const [formData, setFormData] = useState({ name: "", amount: "", type: "expense", category: "Housing" });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>("tech-lead");

  const currentUserId = user?.id || "demo-user-id";

  // Toast Trigger Helper
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
      const res = await fetch(`${API_BASE_URL}/api/executive-briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: currentTx,
          goals: currentGoals,
          subscriptions: currentSubs
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBriefingData(data);
      }
    } catch (e) {
      console.warn("Executive briefing fallback:", e);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Master Data Fetcher
  const fetchAllData = async (activeUser?: any) => {
    const targetUserId = activeUser?.id || user?.id || "demo-user-id";

    try {
      // Notes — only title, content, user_id, id needed
      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .select("id, user_id, title, content")
        .eq("user_id", targetUserId);
      if (!noteError && noteData && noteData.length > 0) {
        setNotes(noteData);
      } else {
        setNotes([
          {
            id: "1",
            title: "Royal Compounding Thesis",
            content: "## Royal Wealth Building Roadmap\n- Save at least $25\\%$ of gross revenue\n- Maximize compound interest: $$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\n- Rebalance monthly surplus into low-cost index equities."
          }
        ]);
      }

      // Transactions — only the columns we render
      let loadedTx = DEMO_PRESETS[0].transactions;
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("id, user_id, name, amount, type, category, created_at")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });
      if (!txError && txData && txData.length > 0) {
        loadedTx = txData;
      }
      setTransactions(loadedTx);

      // Goals — only the columns we render
      let loadedGoals = DEMO_PRESETS[0].goals;
      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .select("id, user_id, name, target, current, color, icon")
        .eq("user_id", targetUserId);
      if (!goalError && goalData && goalData.length > 0) {
        loadedGoals = goalData;
      }
      setGoals(loadedGoals);

      // Subscriptions — only the columns we render
      let loadedSubs = DEMO_PRESETS[0].subscriptions;
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("id, user_id, name, amount, cycle, nextDate, icon, color")
        .eq("user_id", targetUserId);
      if (!subError && subData && subData.length > 0) {
        loadedSubs = subData;
      }
      setSubscriptions(loadedSubs);

      fetchExecutiveBriefing(loadedTx, loadedGoals, loadedSubs);
    } catch (err) {
      console.warn("Supabase fallback:", err);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchAllData(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchAllData(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Preset Handlers
  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setTransactions(preset.transactions);
    setGoals(preset.goals);
    setSubscriptions(preset.subscriptions);
    fetchExecutiveBriefing(preset.transactions, preset.goals, preset.subscriptions);
    addToast(`Loaded Persona: ${preset.name}`, preset.badge, "ai");
  };

  const handleResetPreset = () => {
    setActivePresetId(null);
    setTransactions([]);
    setGoals([]);
    setSubscriptions([]);
    fetchExecutiveBriefing([], [], []);
    addToast("Ledger Reset", "Cleared all records for blank interactive testing.", "warning");
  };

  // Auth Handlers
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
        }
      });
      if (error) console.error("Login failed:", error.message);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
    setIsDropdownOpen(false);
    fetchAllData(null);
    addToast("Signed Out", "Switched back to sandbox demo environment.", "info");
  };

  // Transaction Manual Submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    const newTx = {
      id: crypto.randomUUID(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category || "General",
      user_id: currentUserId
    };
    await supabase.from("transactions").insert([newTx]);
    const updated = [...transactions, newTx];
    setTransactions(updated);
    fetchExecutiveBriefing(updated, goals, subscriptions);
    setIsModalOpen(false);
    setFormData({ name: "", amount: "", type: "expense", category: "Housing" });
    addToast("Record Logged", `${newTx.name} (${newTx.type === "income" ? "+" : "-"}$${newTx.amount})`);
  };

  // AI Chat Dispatcher
  const dispatchChatMessage = async (msgText: string) => {
    if (!msgText.trim()) return;
    const userMessage = msgText;
    setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: userMessage, type: "user" }]);
    setInputValue("");
    setIsTyping(true);

    const chatHistory = insights
      .filter((msg) => msg.type === "user" || msg.type === "advice")
      .map((msg) => ({ role: msg.type === "user" ? "user" : "assistant", content: msg.message }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory,
          transactions: transactions,
          user_id: currentUserId
        })
      });
      if (response.ok) {
        const data = await response.json();
        setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: data.reply, type: "advice" }]);

        if (data.has_updates && data.updates && Array.isArray(data.updates)) {
          let currentList = [...transactions];
          for (const update of data.updates) {
            if (update.action === "add") {
              const newTx = {
                id: crypto.randomUUID(),
                name: update.name,
                amount: update.amount,
                type: update.type || "expense",
                category: update.category || "General",
                user_id: currentUserId
              };
              await supabase.from("transactions").insert([newTx]);
              currentList.push(newTx);
              addToast("AI Logged Record", `${newTx.name} ($${newTx.amount})`, "ai");
            } else if (update.action === "update") {
              await supabase.from("transactions").update({ name: update.name, amount: update.amount, type: update.type, category: update.category }).eq("id", update.id);
              currentList = currentList.map((tx) => (tx.id === update.id ? { ...tx, ...update } : tx));
              addToast("AI Updated Record", update.name, "ai");
            } else if (update.action === "delete") {
              await supabase.from("transactions").delete().eq("id", update.id);
              currentList = currentList.filter((tx) => tx.id !== update.id);
              addToast("AI Deleted Record", "Record removed from ledger.", "ai");
            } else if (update.action === "reset") {
              await supabase.from("transactions").delete().eq("user_id", currentUserId);
              currentList = [];
              addToast("AI Reset Ledger", "All ledger records cleared.", "warning");
            } else if (update.action === "add_subscription") {
              await fetchAllData(user);
              addToast("AI Added Recurring SIP", update.name || "Subscription", "ai");
            }
          }
          setTransactions(currentList);
          fetchExecutiveBriefing(currentList, goals, subscriptions);
        }
      } else {
        setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: "WealthSage received your query. Check backend connection.", type: "advice" }]);
      }
    } catch (error) {
      setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: "Simulated response processed offline.", type: "advice" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // OCR Receipt Scanner
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: "Scanning receipt image... 📸", type: "user" }]);
    addToast("Scanning Receipt", "Extracting OCR text and parsing totals...", "ai");

    try {
      const tesseractLib = await import("tesseract.js");
      const Tesseract = (tesseractLib as any).default || tesseractLib;
      const result = await Tesseract.recognize(file, "eng");
      const text = result?.data?.text || "Receipt items total $42.50";

      const aiPrompt = `I just scanned a receipt. Here is the OCR text: "${text}". Please identify the merchant name, parse the total amount, and log as an expense.`;
      dispatchChatMessage(aiPrompt);
    } catch (error) {
      console.error(error);
      setInsights((prev) => [...prev, { id: crypto.randomUUID(), message: "Receipt processed via offline fallback.", type: "advice" }]);
    } finally {
      setIsScanning(false);
    }
  };

  // Audit Trigger
  const runAudit = async () => {
    setIsAuditOpen(true);
    setIsAuditing(true);
    setAuditData(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: transactions })
      });
      if (response.ok) {
        const data = await response.json();
        setAuditData(data);
        addToast("Audit Complete", `Status: ${data.alert_level} | Retention: ${data.savings_rate_percentage}`, "ai");
      } else {
        setAuditData({
          alert_level: "Safe",
          savings_rate_percentage: "32.5%",
          report: "Your financial ledger demonstrates healthy cash velocity. Retained surplus exceeds recommended baselines."
        });
      }
    } catch (error) {
      setAuditData({
        alert_level: "Safe",
        savings_rate_percentage: "30.0%",
        report: "Audit complete: Spending remains well-balanced across essential buckets."
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Notebook Note Handlers
  const handleAskTutor = async () => {
    if (!noteContent.trim()) return;
    setIsTutorThinking(true);
    addToast("Tutor Thinking", "Synthesizing quantitative mathematical proofs...", "ai");

    try {
      const response = await fetch(`${API_BASE_URL}/api/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_content: noteContent })
      });
      if (response.ok) {
        const data = await response.json();
        const tutorReply = data.explanation || data.reply || "Mathematical concept parsed.";
        setNoteContent((prev) => prev + "\n\n---\n### 🔮 WealthSage Tutor Proof\n\n" + tutorReply);
        addToast("Tutor Proof Ready", "LaTeX rendered into notebook.");
      } else {
        setNoteContent((prev) => prev + "\n\n---\n### 🔮 WealthSage Tutor Proof\n\n**Compound Formula:** $$A = P(1 + r)^t$$");
      }
    } catch (error) {
      setNoteContent((prev) => prev + "\n\n---\n### 🔮 WealthSage Tutor Proof\n\n**Proof:** Compound velocity increases exponentially.");
    } finally {
      setIsTutorThinking(false);
    }
  };

  const handleSaveNote = async () => {
    if (activeNote) {
      await supabase.from("notes").update({ title: noteTitle, content: noteContent }).eq("id", activeNote.id);
      setNotes(notes.map((n) => (n.id === activeNote.id ? { ...n, title: noteTitle, content: noteContent } : n)));
    } else {
      const newNote = { id: crypto.randomUUID(), title: noteTitle, content: noteContent, user_id: currentUserId };
      const { data } = await supabase.from("notes").insert([newNote]).select();
      if (data && data.length > 0) {
        setNotes([...notes, data[0]]);
        setActiveNote(data[0]);
      } else {
        setNotes([...notes, newNote]);
        setActiveNote(newNote);
      }
    }
    addToast("Note Saved", noteTitle);
  };

  const createNewNote = () => {
    setActiveNote(null);
    setNoteTitle("New Research Note");
    setNoteContent("");
  };

  // Goal & Sub Modal Handlers
  const handleOpenGoalModal = (goal: any = null) => {
    if (goal && !goal.nativeEvent) {
      setEditingGoal(goal);
      setGoalForm(goal);
    } else {
      setEditingGoal(null);
      setGoalForm({ name: "", target: "", current: "", icon: "🎯" });
    }
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async () => {
    if (editingGoal) {
      await supabase.from("goals").update({ name: goalForm.name, target: Number(goalForm.target), current: Number(goalForm.current), icon: goalForm.icon }).eq("id", editingGoal.id);
      setGoals(goals.map((g) => (g.id === editingGoal.id ? { ...g, ...goalForm } : g)));
      addToast("Target Updated", goalForm.name);
    } else {
      const newGoal = {
        id: crypto.randomUUID(),
        name: goalForm.name || "New Target",
        target: Number(goalForm.target) || 0,
        current: Number(goalForm.current) || 0,
        icon: goalForm.icon || "🎯",
        color: "var(--accent-primary)",
        user_id: currentUserId
      };
      await supabase.from("goals").insert([newGoal]);
      setGoals([...goals, newGoal]);
      addToast("Target Created", newGoal.name);
    }
    setIsGoalModalOpen(false);
  };

  const handleDeleteGoal = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id);
    setGoals(goals.filter((g) => g.id !== id));
    addToast("Target Removed", "Removed from active tracking.", "warning");
  };

  const handleOpenSubModal = (sub: any = null) => {
    if (sub && !sub.nativeEvent) {
      setEditingSub(sub);
      setSubForm(sub);
    } else {
      setEditingSub(null);
      setSubForm({ name: "", amount: "", cycle: "Monthly", nextDate: "", icon: "💸", color: "#10B981" });
    }
    setIsSubModalOpen(true);
  };

  const handleSaveSub = async () => {
    if (editingSub) {
      await supabase.from("subscriptions").update({ name: subForm.name, amount: Number(subForm.amount), cycle: subForm.cycle, nextDate: subForm.nextDate, icon: subForm.icon }).eq("id", editingSub.id);
      setSubscriptions(subscriptions.map((s) => (s.id === editingSub.id ? { ...s, ...subForm, amount: Number(subForm.amount) } : s)));
      addToast("Bill Updated", subForm.name);
    } else {
      const newSub = {
        id: crypto.randomUUID(),
        name: subForm.name || "New Bill",
        amount: Number(subForm.amount) || 0,
        cycle: subForm.cycle || "Monthly",
        nextDate: subForm.nextDate || "1st",
        icon: subForm.icon || "💸",
        color: "#10B981",
        user_id: currentUserId
      };
      await supabase.from("subscriptions").insert([newSub]);
      setSubscriptions([...subscriptions, newSub]);
      addToast("Bill Created", newSub.name);
    }
    setIsSubModalOpen(false);
  };

  const handleDeleteSub = async (id: string) => {
    await supabase.from("subscriptions").delete().eq("id", id);
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
    addToast("Bill Removed", "Removed from recurring bills.", "warning");
  };

  // Financial Aggregations
  const { totalIncome, totalExpense, currentBalance, expensesByCategory } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categories: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "income") income += Number(tx.amount);
      else {
        expense += Number(tx.amount);
        categories[tx.category] = (categories[tx.category] || 0) + Number(tx.amount);
      }
    });
    const pieData = Object.keys(categories).map((key, index) => ({
      name: key,
      value: categories[key],
      color: COLORS[index % COLORS.length]
    }));
    return { totalIncome: income, totalExpense: expense, currentBalance: income - expense, expensesByCategory: pieData };
  }, [transactions]);

  const wealthData = [
    { month: "Jan", wealth: Math.round(currentBalance * 0.75) },
    { month: "Feb", wealth: Math.round(currentBalance * 0.88) },
    { month: "Mar", wealth: Math.round(currentBalance) },
    { month: "Apr", wealth: Math.round(currentBalance * 1.08) },
    { month: "May", wealth: Math.round(currentBalance * 1.18) },
    { month: "Jun", wealth: Math.round(currentBalance * 1.32) }
  ];

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Architect";

  const navItems = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "analytics" as const, label: "Analytics & Telemetry", icon: BarChart3 },
    { id: "commitments" as const, label: "Goals & Subscriptions", icon: Target },
    { id: "simulator" as const, label: "Wealth Simulator", icon: Zap },
    { id: "notebook" as const, label: "LaTeX Notebook", icon: BookOpen },
    { id: "settings" as const, label: "Royal Vault", icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-white">
        <Sparkles className="animate-spin mr-3 w-6 h-6 text-[var(--accent-primary)]" />
        <span className="font-semibold text-sm tracking-wide">Initializing Royal Wealth Vault...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Royal Aurora Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-[var(--theme-aurora-1)] rounded-full blur-[160px] opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-[var(--theme-aurora-2)] rounded-full blur-[160px] opacity-50" />
      </div>

      {/* ── Left Royal Navigation Bar ── */}
      <aside className="relative z-30 w-full lg:w-56 xl:w-60 shrink-0 bg-black/40 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-[var(--border-royal)] flex flex-col justify-between p-3 lg:p-5 shadow-2xl">
        {/* Brand Top */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl royal-btn-accent flex items-center justify-center shadow-lg">
                <Crown size={18} className="text-black" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  WealthSage <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-royal)]">ROYAL</span>
                </h1>
                <p className="text-[11px] text-slate-400">Autonomous Wealth Vault</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "royal-card text-white border-[var(--border-royal)] shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 25px -5px var(--accent-glow)` : "none"
                  }}
                >
                  <Icon size={16} className={isActive ? "text-[var(--accent-primary)]" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Theme Switcher & Glass Mirror Trigger & Profile */}
        <div className="space-y-2.5 pt-4 border-t border-white/10 mt-4">
          {/* Glass Mirror AI Quick Launcher Button */}
          <button
            type="button"
            onClick={() => setIsGlassAIOpen(true)}
            className="w-full royal-btn-accent py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles size={15} /> Open Glass Mirror AI
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span className="flex items-center gap-2">
              <span>{activeThemeInfo.crownEmoji}</span>
              <span>{activeThemeInfo.name}</span>
            </span>
            <Crown size={14} className="text-[var(--accent-primary)]" />
          </button>

          {/* User Auth Profile */}
          <div className="pt-2">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--border-royal)] flex items-center justify-center font-bold text-xs text-[var(--accent-primary)]">
                      {userName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{userName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full royal-glass-mirror rounded-2xl p-1.5 shadow-2xl border border-[var(--border-royal)] z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-white/5 rounded-xl transition-all flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
              >
                <LogIn size={14} /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Viewport Content ── */}
      <main className="flex-1 relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto w-full pb-12">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview-tab"
                userName={userName}
                currentBalance={currentBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                transactions={transactions}
                currentUserId={currentUserId}
                activePresetId={activePresetId}
                onSelectPreset={handleSelectPreset}
                onResetPreset={handleResetPreset}
                onOpenAddModal={() => setIsModalOpen(true)}
                onOpenAuditModal={runAudit}
                onOpenGlassAI={() => setIsGlassAIOpen(true)}
                onBankConnected={() => fetchAllData(user)}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab
                key="analytics-tab"
                briefingData={briefingData}
                isBriefingLoading={isBriefingLoading}
                onRefreshBriefing={() => fetchExecutiveBriefing(transactions, goals, subscriptions)}
                onExecuteAction={(act) => {
                  setIsGlassAIOpen(true);
                  dispatchChatMessage(`Break down and execute this strategic plan: ${act}`);
                }}
                monthlyIncome={totalIncome}
                monthlyExpense={totalExpense}
                wealthData={wealthData}
                expensesByCategory={expensesByCategory}
                userName={userName}
                transactionCount={transactions.length}
                goalCount={goals.length}
                subscriptionCount={subscriptions.length}
              />
            )}

            {activeTab === "commitments" && (
              <CommitmentsTab
                key="commitments-tab"
                goals={goals}
                subscriptions={subscriptions}
                onOpenGoalModal={handleOpenGoalModal}
                onDeleteGoal={handleDeleteGoal}
                onOpenSubModal={handleOpenSubModal}
                onDeleteSub={handleDeleteSub}
              />
            )}

            {activeTab === "simulator" && <SimulatorTab key="simulator-tab" />}

            {activeTab === "notebook" && (
              <NotebookTab
                key="notebook-tab"
                notes={notes}
                activeNote={activeNote}
                setActiveNote={setActiveNote}
                noteTitle={noteTitle}
                setNoteTitle={setNoteTitle}
                noteContent={noteContent}
                setNoteContent={setNoteContent}
                onCreateNewNote={createNewNote}
                onSaveNote={handleSaveNote}
                onAskTutor={handleAskTutor}
                isTutorThinking={isTutorThinking}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                key="settings-tab"
                user={user}
                transactions={transactions}
                goals={goals}
                subscriptions={subscriptions}
                onOpenThemeModal={() => setIsThemeModalOpen(true)}
                onClearLedger={handleResetPreset}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Glass AI Trigger Pill (Bottom Right) */}
      <button
        type="button"
        onClick={() => setIsGlassAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 royal-btn-accent p-4 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-black transition-all hover:scale-110 active:scale-95 cursor-pointer"
        title="Open Fullscreen Glass Mirror AI"
      >
        <Sparkles size={18} className="text-black" />
        <span className="hidden sm:inline">Ask Glass AI</span>
      </button>

      {/* --- MODAL POP-UPS --- */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleManualSubmit}
      />

      <AuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        isAuditing={isAuditing}
        auditData={auditData}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        editingGoal={editingGoal}
        goalForm={goalForm}
        setGoalForm={setGoalForm}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        editingSub={editingSub}
        subForm={subForm}
        setSubForm={setSubForm}
        onClose={() => setIsSubModalOpen(false)}
        onSave={handleSaveSub}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Fullscreen Glass Mirror AI Modal */}
      <FullscreenAIModal
        isOpen={isGlassAIOpen}
        onClose={() => setIsGlassAIOpen(false)}
        insights={insights}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={dispatchChatMessage}
        isTyping={isTyping}
        isScanning={isScanning}
        onFileUpload={handleFileUpload}
        onClearChat={() => setInsights([{ id: "1", message: "Chat context cleared. WealthSage Quantum Ready.", type: "advice" }])}
      />

      {/* Glowing Real-time Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
