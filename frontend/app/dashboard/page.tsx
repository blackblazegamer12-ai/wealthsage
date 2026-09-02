"use client";

import React, { useEffect, useMemo, Suspense, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Zap,
  BookOpen,
  Settings,
  Sparkles,
  Command,
  Plus,
  ShieldAlert,
  Palette,
  Bell,
  FileCheck2,
  ArrowLeft,
  Calculator,
  Mic,
  Camera
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

// Server Actions
import { processVoice } from "../../app/actions/processVoice";
import { processReceipt } from "../../app/actions/processReceipt";

// Global Store
import { useWealthStore } from "../../lib/store";

// Modals & Drawers
import FastCaptureModal from "../../components/modals/FastCaptureModal";
import AuditModal from "../../components/AuditModal";
import GoalModal from "../../components/GoalModal";
import SubscriptionModal from "../../components/SubscriptionModal";
import ThemeSelectorModal from "../../components/theme/ThemeSelectorModal";
import CopilotDrawer from "../../components/modals/CopilotDrawer";
import HighFrictionConfirmModal from "../../components/modals/HighFrictionConfirmModal";
import NotificationCenter from "../../components/NotificationCenter";
import CyberDefenseModal from "../../components/modals/CyberDefenseModal";
import ExpoDemoController from "../../components/ExpoDemoController";
import SecurityAuditLogModal from "../../components/SecurityAuditLog";
import ToastContainer from "../../components/Toast";
import CommandPalette, { CommandAction } from "../../components/CommandPalette";
import ErrorBoundary from "../../components/ErrorBoundary";

// Modular Tabs
import GuardianShieldTab from "../../components/tabs/GuardianShieldTab";
import OverviewTelemetryTab from "../../components/tabs/OverviewTelemetryTab";
import CommitmentsTab from "../../components/tabs/CommitmentsTab";
import CitizenEntitlementsTab from "../../components/tabs/CitizenEntitlementsTab";
import CompoundingQuantTab from "../../components/tabs/CompoundingQuantTab";
import SettingsTab from "../../components/tabs/SettingsTab";
import WealthSageLogo from "../../components/WealthSageLogo";

import { useRoyalTheme } from "../../components/theme/ThemeContext";
import { BriefingData } from "../../components/ExecutiveBriefing";
import { sanitizeAmount } from "../../lib/sanitize";

type ActiveTabType = "guardian" | "capital" | "civic" | "settings";

function DashboardContent() {
  const activeTab = useWealthStore(state => state.activeTab);
  const setActiveTab = useWealthStore(state => state.setActiveTab);
  const setModal = useWealthStore(state => state.setModal);
  const addToast = useWealthStore(state => state.addToast);
  const toasts = useWealthStore(state => state.toasts);
  const removeToast = useWealthStore(state => state.removeToast);
  const { user: clerkUser } = useUser();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ─── Zustand Store ─────────────────────────────────────────
  const store = useWealthStore();

  // Sync Clerk user ID into the store
  useEffect(() => {
    const id = clerkUser?.id || "demo-user-id";
    const name = clerkUser?.fullName || clerkUser?.firstName || "Family Administrator";
    store.setCurrentUser(id, name);
  }, [clerkUser]);

  // Sync URL tab param
  useEffect(() => {
    const tabParam = searchParams.get("tab") as ActiveTabType | null;
    if (tabParam && ["guardian", "capital", "civic", "settings"].includes(tabParam)) {
      store.setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Fetch all data on mount
  useEffect(() => {
    store.fetchAllData();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        store.setModal("isCommandPaletteOpen", !store.isCommandPaletteOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store.currentUserId]);

  // ─── Derived Computations ──────────────────────────────────
  const activeTransactions = store.getActiveTransactions();
  const activeGoals = store.getActiveGoals();
  const activeSubscriptions = store.getActiveSubscriptions();

  const { totalIncome, totalExpense, currentBalance, wealthData, expensesByCategory, incomeChangePct, expenseChangePct, balanceChangePct } = useMemo(() => {
    const income = activeTransactions
      .filter((t) => t.type === "inflow")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const expense = activeTransactions
      .filter((t) => t.type === "outflow")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const categoryMap: { [key: string]: number } = {};
    activeTransactions.forEach((tx) => {
      if (tx.type === "outflow") {
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

    const wData = activeTransactions.length > 0 ? [
      { month: "Jan", wealth: Math.round(income * 0.7) },
      { month: "Feb", wealth: Math.round(income * 0.85) },
      { month: "Mar", wealth: Math.round(income - expense * 0.5) },
      { month: "Apr", wealth: Math.round(income * 1.05 - expense * 0.4) },
      { month: "Current", wealth: Math.max(0, income - expense) },
    ] : [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let currentMonthIncome = 0, prevMonthIncome = 0, currentMonthExpense = 0, prevMonthExpense = 0;

    activeTransactions.forEach(t => {
      const txDate = new Date(t.date || t.created_at || now);
      const amt = Number(t.amount) || 0;
      if (txDate >= thirtyDaysAgo) {
        if (t.type === "inflow") currentMonthIncome += amt;
        else currentMonthExpense += amt;
      } else if (txDate >= sixtyDaysAgo && txDate < thirtyDaysAgo) {
        if (t.type === "inflow") prevMonthIncome += amt;
        else prevMonthExpense += amt;
      }
    });

    const calcPct = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / Math.abs(prev)) * 100;
    };

    return {
      totalIncome: income,
      totalExpense: expense,
      currentBalance: income - expense,
      wealthData: wData,
      expensesByCategory: expByCat,
      incomeChangePct: calcPct(currentMonthIncome, prevMonthIncome),
      expenseChangePct: calcPct(currentMonthExpense, prevMonthExpense),
      balanceChangePct: calcPct(currentMonthIncome - currentMonthExpense, prevMonthIncome - prevMonthExpense),
    };
  }, [activeTransactions]);

  // ─── Form Handlers ─────────────────────────────────────────
  const handleSaveTransaction = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const { description, amount, type, category } = store.formData;
    const amtNum = Number(sanitizeAmount(amount));
    if (!description || !amtNum || isNaN(amtNum)) return;

    await store.saveTransaction({
      description,
      amount: amtNum,
      type: type as "inflow" | "outflow",
      category,
    });

    store.setFormData({ description: "", amount: "", type: "outflow", category: "Housing" });
    store.setModal("isModalOpen", false);
  }, [store.formData]);

  // ─── Voice & OCR Handlers ──────────────────────────────────
  const handleDictation = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      store.addToast("Error", "Speech recognition not supported in this browser.", "warning");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    
    recognition.onstart = () => {
      store.addToast("Dictation", "Listening... Speak now.", "info");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      store.addToast("Processing", `Analyzing: "${transcript}"`, "info");
      try {
        const { amount, merchant, category, actor } = await processVoice(transcript);
        if (amount > 0) {
          store.addToast("Success", `Detected ₹${amount} at ${merchant}`, "success");
          // Add to ledger
          store.saveTransaction({
            description: merchant,
            amount: amount,
            type: "outflow",
            category: category,
          });
        }
      } catch (err) {
        store.addToast("Error", "Failed to parse dictation.", "warning");
      }
    };
    recognition.start();
  }, [store]);

  const handleReceiptUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    store.addToast("Processing", "Scanning receipt using Sovereign Vision OCR...", "info");
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const result = await processReceipt(base64);
        store.addToast("Success", `Receipt Parsed: ${result.merchant} ₹${result.amount}`, "success");
        store.saveTransaction({
          description: result.merchant,
          amount: result.amount,
          type: "outflow",
          category: result.category,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      store.addToast("Error", "Failed to parse receipt.", "warning");
    }
  }, [store]);

  const handleConnectAA = async () => {
    store.addToast("Connecting", "Initializing RBI Account Aggregator session...", "info");
    try {
      const res = await fetch("/api/aa/create-consent", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate AA session");
      }
    } catch (err: any) {
      store.addToast("Error", err.message || "Failed to connect", "warning");
    }
  };

  // ─── Command Palette Actions ───────────────────────────────
  const commandActions: CommandAction[] = useMemo(
    () => [
      { id: "cmd-add-tx", label: "Add Record", description: "Log an income or expenditure", group: "Actions", icon: Plus, onSelect: () => store.setModal("isModalOpen", true) },
      { id: "cmd-audit", label: "Run Financial Audit", description: "Analyze burn velocity and leak vectors", group: "Actions", icon: ShieldAlert, onSelect: () => store.runAuditAnalysis() },
      { id: "cmd-glass-ai", label: "Open Guardian AI", description: "Family security monitoring and reasoning", group: "AI", icon: Sparkles, onSelect: () => store.setModal("isGlassAIOpen", true) },
      { id: "cmd-theme", label: "Change Theme", description: "Switch to Echoid or other royal themes", group: "Actions", icon: Palette, onSelect: () => store.setModal("isThemeModalOpen", true) },
      { id: "cmd-tab-guardian", label: "Go to Guardian Shield", description: "Live Radar, Subscription Traps & UPI Circle", group: "Navigation", icon: ShieldAlert, onSelect: () => store.setActiveTab("guardian") },
      { id: "cmd-tab-capital", label: "Go to Capital Wealth", description: "Overview, Commitments & Quant Tools", group: "Navigation", icon: LayoutDashboard, onSelect: () => store.setActiveTab("capital") },
      { id: "cmd-tab-civic", label: "Go to Civic Entitlements", description: "Sovereign Welfare Radar", group: "Navigation", icon: Target, onSelect: () => store.setActiveTab("civic") },
    ],
    [store.transactions]
  );

  // ─── Tab Navigation Config ─────────────────────────────────
  const TABS = [
    { id: "guardian", label: "Guardian Shield", icon: ShieldAlert },
    { id: "capital", label: "Capital Wealth", icon: LayoutDashboard },
    { id: "civic", label: "Civic Entitlements", icon: Target },
    { id: "settings", label: "Vault Settings", icon: Settings },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[var(--text-dim)] font-mono text-xs">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 animate-pulse">
          <WealthSageLogo className="w-10 h-10" />
        </div>
        Initializing Sovereign Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white transition-colors duration-300">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={store.toasts} onDismiss={store.removeToast} />

      {/* Top Workspace Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 p-1.5 rounded-[12px] text-xs font-semibold transition-all bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white hover:bg-white/[0.1]"
              title="Return to Public Landing Page"
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Landing</span>
            </Link>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <WealthSageLogo className="w-8 h-8" />
              <div>
                <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  WealthSage
                </span>
                <span className="hidden md:inline ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[var(--text-dim)] border border-white/10">
                  WORKSPACE
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => store.setModal("isCommandPaletteOpen", true)} className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-xs transition-all cursor-pointer bg-white/[0.05] border border-white/10 text-[var(--text-dim)] hover:text-white" aria-label="Open command palette">
              <Command size={13} style={{ color: 'var(--accent-primary)' }} />
              <span className="hidden sm:inline">Command</span>
              <kbd className="text-[10px] font-mono px-1 rounded-sm bg-white/10 text-[var(--text-dim)]">⌘K</kbd>
            </button>

            {/* Hardware APIs: Mic & Camera */}
            <button onClick={handleDictation} className="p-2 rounded-[12px] transition-all bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white hover:bg-white/10" title="Voice Dictation">
              <Mic size={16} />
            </button>
            <label className="cursor-pointer p-2 rounded-[12px] transition-all bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white hover:bg-white/10" title="Upload Receipt">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
            </label>

            <button type="button" onClick={() => store.setModal("isNotifCenterOpen", true)} className="p-2 rounded-[12px] relative transition-all cursor-pointer bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white" title="Notification Center" aria-label="Open notifications">
              <Bell size={16} />
              {store.notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center shadow-lg text-white" style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}>
                  {store.notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button type="button" onClick={handleConnectAA} className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" title="Connect Bank via Account Aggregator">
              <ShieldAlert size={14} /> <span className="hidden sm:inline">Connect Bank (AA)</span>
            </button>

            <button type="button" onClick={() => store.setModal("isAuditLogModalOpen", true)} className="p-2 rounded-[12px] transition-all cursor-pointer bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white" title="Security Audit Trail" aria-label="Open security audit log">
              <FileCheck2 size={16} />
            </button>

            <button type="button" onClick={() => store.setModal("isThemeModalOpen", true)} className="p-2 rounded-[12px] transition-all cursor-pointer bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white" title="Switch Royal Theme" aria-label="Change theme">
              <Palette size={16} />
            </button>

            <div className="ml-1 pl-2 flex items-center border-l border-[var(--line-strong)]">
              {clerkUser ? (
                <UserButton />
              ) : (
                <Link href="/sign-in" className="text-xs font-bold px-3 py-1.5 rounded-[12px] transition-all bg-white/[0.05] text-[var(--accent-brass)] border border-[var(--accent-brass-dim)] hover:bg-white/10">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6 flex flex-col">
        {/* Tab Navigation with Scroll Snap */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-[var(--line)] tab-scroll-snap" role="tablist" aria-label="Dashboard sections">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = store.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => store.setActiveTab(tab.id as ActiveTabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[32px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive ? 'bg-[var(--fill-ghost)] text-white border border-[var(--line-strong)]' : 'bg-transparent text-[var(--text-dim)] border border-transparent hover:text-white hover:bg-white/[0.05]'}`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Router */}
        <AnimatePresence mode="wait">
          <motion.main
            key={store.activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
            role="tabpanel"
            id={`tabpanel-${store.activeTab}`}
          >
            {store.activeTab === "guardian" && (
              <GuardianShieldTab />
            )}

            {store.activeTab === "capital" && (
              <div className="space-y-12">
                <OverviewTelemetryTab
                  userName={store.userDisplayName}
                  currentBalance={currentBalance}
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  incomeChangePct={incomeChangePct}
                  expenseChangePct={expenseChangePct}
                  balanceChangePct={balanceChangePct}
                  transactions={activeTransactions}
                  currentUserId={store.currentUserId}
                  onLoadDemoData={store.enterDemoMode}
                  isDemoMode={store.isDemoMode}
                  onExitDemoMode={store.exitDemoMode}
                  onOpenAddModal={() => store.setModal("isModalOpen", true)}
                  onOpenAuditModal={store.runAuditAnalysis}
                  onOpenGlassAI={() => store.setModal("isGlassAIOpen", true)}
                  onBankConnected={() => {}}
                  briefingData={store.briefingData}
                  isBriefingLoading={store.isBriefingLoading}
                  onRefreshBriefing={() => store.fetchExecutiveBriefing()}
                  onExecuteAction={(a: any) => store.dispatchChatMessage(a)}
                  monthlyIncome={totalIncome}
                  monthlyExpense={totalExpense}
                  wealthData={wealthData}
                  expensesByCategory={expensesByCategory}
                  transactionCount={activeTransactions.length}
                  goalCount={activeGoals.length}
                  subscriptionCount={activeSubscriptions.length}
                />
                <CommitmentsTab
                  goals={activeGoals}
                  subscriptions={activeSubscriptions}
                  onOpenGoalModal={(g: any) => {
                    store.setEditingGoal(g || null);
                    store.setGoalForm(g || { name: "", target: "", current: "", icon: "🎯", color: "#06B6D4" });
                    store.setModal("isGoalModalOpen", true);
                  }}
                  onDeleteGoal={store.deleteGoal}
                  onOpenSubModal={(s: any) => {
                    store.setEditingSub(s || null);
                    store.setSubForm(s || { name: "", amount: "", cycle: "Monthly", nextDate: "", icon: "💸", color: "#10B981" });
                    store.setModal("isSubModalOpen", true);
                  }}
                  onDeleteSub={store.deleteSub}
                  onLoadDemoData={store.enterDemoMode}
                  isDemoMode={store.isDemoMode}
                  onExitDemoMode={store.exitDemoMode}
                />
                <CompoundingQuantTab
                  notes={store.notes}
                  activeNote={store.activeNote}
                  setActiveNote={store.setActiveNote}
                  noteTitle={store.noteTitle}
                  setNoteTitle={store.setNoteTitle}
                  noteContent={store.noteContent}
                  setNoteContent={store.setNoteContent}
                  onCreateNewNote={store.createNewNote}
                  onSaveNote={store.saveNote}
                  onAskTutor={store.askTutor}
                  isTutorThinking={store.isTutorThinking}
                />
              </div>
            )}

            {store.activeTab === "civic" && <CitizenEntitlementsTab />}

            {store.activeTab === "settings" && (
              <SettingsTab
                user={clerkUser}
                transactions={activeTransactions}
                goals={activeGoals}
                subscriptions={activeSubscriptions}
                onOpenThemeModal={() => store.setModal("isThemeModalOpen", true)}
                onClearLedger={() => store.setModal("isResetConfirmModalOpen", true)}
              />
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Global Modals & Drawers */}
      <FastCaptureModal
        isOpen={store.isModalOpen}
        onClose={() => store.setModal("isModalOpen", false)}
        formData={store.formData}
        setFormData={(d: any) => store.setFormData(d)}
        onSubmit={handleSaveTransaction}
        isDemoMode={store.isDemoMode}
        onDirectSave={store.saveTransaction}
      />

      <AuditModal
        isOpen={store.isAuditOpen}
        onClose={() => store.setModal("isAuditOpen", false)}
        auditData={store.auditData}
        isAuditing={store.isAuditing}
      />

      <GoalModal
        isOpen={store.isGoalModalOpen}
        onClose={() => store.setModal("isGoalModalOpen", false)}
        goalForm={store.goalForm}
        setGoalForm={store.setGoalForm}
        editingGoal={store.editingGoal}
        onSave={store.handleSaveGoal}
      />

      <SubscriptionModal
        isOpen={store.isSubModalOpen}
        onClose={() => store.setModal("isSubModalOpen", false)}
        subForm={store.subForm}
        setSubForm={store.setSubForm}
        editingSub={store.editingSub}
        onSave={store.handleSaveSubscription}
      />

      <ThemeSelectorModal
        isOpen={store.isThemeModalOpen}
        onClose={() => store.setModal("isThemeModalOpen", false)}
      />

      <CopilotDrawer
        isOpen={store.isGlassAIOpen}
        onClose={() => store.setModal("isGlassAIOpen", false)}
        insights={store.insights}
        inputValue={store.inputValue}
        setInputValue={store.setInputValue}
        onSendMessage={store.dispatchChatMessage}
        isTyping={store.isTyping}
        isScanning={false}
        onFileUpload={() => {}}
        isDemoMode={store.isDemoMode}
        onClearChat={store.clearChat}
      />

      <CommandPalette
        isOpen={store.isCommandPaletteOpen}
        onClose={() => store.setModal("isCommandPaletteOpen", false)}
        actions={commandActions}
      />

      <NotificationCenter />
      <CyberDefenseModal />
      <ExpoDemoController />

      <SecurityAuditLogModal
        isOpen={store.isAuditLogModalOpen}
        onClose={() => store.setModal("isAuditLogModalOpen", false)}
        logs={store.auditLogs}
      />

      <HighFrictionConfirmModal
        isOpen={store.isResetConfirmModalOpen}
        onClose={() => store.setModal("isResetConfirmModalOpen", false)}
        onConfirm={store.confirmResetLedger}
        title="Hard Reset Ledger & Clear All Records"
        description="This will irreversibly wipe all local and cloud ledger transactions, goals, and recurring commitments. You cannot undo this action."
        requiredPhrase="CONFIRM RESET"
        confirmButtonText="Execute Hard Reset"
      />

      {/* Floating AI Button */}
      <button
        onClick={() => store.setModal("isGlassAIOpen", true)}
        aria-label="Open AI Copilot"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary fallbackTitle="Dashboard Error">
      <Suspense
        fallback={
          <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] font-mono text-xs">
            Loading Sovereign Vault...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}
