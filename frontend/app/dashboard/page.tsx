"use client";

import React, { useEffect, useMemo, Suspense, useCallback, useState } from "react";
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
  Calculator
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

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
import SecurityAuditLogModal from "../../components/SecurityAuditLog";
import ToastContainer from "../../components/Toast";
import CommandPalette, { CommandAction } from "../../components/CommandPalette";
import ErrorBoundary from "../../components/ErrorBoundary";

// Modular Tabs
import OverviewTelemetryTab from "../../components/tabs/OverviewTelemetryTab";
import CommitmentsTab from "../../components/tabs/CommitmentsTab";
import CitizenEntitlementsTab from "../../components/tabs/CitizenEntitlementsTab";
import CompoundingQuantTab from "../../components/tabs/CompoundingQuantTab";
import SettingsTab from "../../components/tabs/SettingsTab";
import WealthSageLogo from "../../components/WealthSageLogo";

import { useRoyalTheme } from "../../components/theme/ThemeContext";
import { BriefingData } from "../../components/ExecutiveBriefing";
import { sanitizeAmount } from "../../lib/sanitize";

type ActiveTabType = "overview" | "commitments" | "citizen" | "compounding" | "settings";

function DashboardContent() {
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
    const name = clerkUser?.fullName || clerkUser?.firstName || "Sovereign Executive";
    store.setCurrentUser(id, name);
  }, [clerkUser]);

  // Sync URL tab param
  useEffect(() => {
    const tabParam = searchParams.get("tab") as ActiveTabType | null;
    if (tabParam && ["overview", "commitments", "citizen", "compounding", "settings"].includes(tabParam)) {
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

  // ─── Command Palette Actions ───────────────────────────────
  const commandActions: CommandAction[] = useMemo(
    () => [
      { id: "cmd-add-tx", label: "Add Record", description: "Log an income or expenditure", group: "Actions", icon: Plus, onSelect: () => store.setModal("isModalOpen", true) },
      { id: "cmd-audit", label: "Run Financial Audit", description: "Analyze burn velocity and leak vectors", group: "Actions", icon: ShieldAlert, onSelect: () => store.runAuditAnalysis() },
      { id: "cmd-glass-ai", label: "Open Glass AI Copilot", description: "Natural language financial reasoning", group: "AI", icon: Sparkles, onSelect: () => store.setModal("isGlassAIOpen", true) },
      { id: "cmd-theme", label: "Change Theme", description: "Switch to Echoid or other royal themes", group: "Actions", icon: Palette, onSelect: () => store.setModal("isThemeModalOpen", true) },
      { id: "cmd-tab-overview", label: "Go to Overview & Telemetry", description: "Main telemetry and transaction ledger", group: "Navigation", icon: LayoutDashboard, onSelect: () => store.setActiveTab("overview") },
      { id: "cmd-tab-commitments", label: "Go to Subscriptions & Commitments", description: "Manage recurring charges and leaks", group: "Navigation", icon: Target, onSelect: () => store.setActiveTab("commitments") },
      { id: "cmd-tab-citizen", label: "Go to Citizen Entitlements", description: "Sovereign Welfare Radar & Predatory Shield", group: "Navigation", icon: ShieldAlert, onSelect: () => store.setActiveTab("citizen") },
      { id: "cmd-tab-compounding", label: "Go to Compounding & Quant", description: "Forward-looking wealth trajectory & Tax Engine", group: "Navigation", icon: Zap, onSelect: () => store.setActiveTab("compounding") },
    ],
    [store.transactions]
  );

  // ─── Tab Navigation Config ─────────────────────────────────
  const TABS = [
    { id: "overview", label: "Overview & Telemetry", icon: LayoutDashboard },
    { id: "commitments", label: "Subscriptions & Commitments", icon: Target },
    { id: "citizen", label: "Citizen Entitlements", icon: ShieldAlert },
    { id: "compounding", label: "Compounding & Quant", icon: Zap },
    { id: "settings", label: "Vault Settings", icon: Settings },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[var(--text-dim)] font-mono text-xs">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-amber-500/20 mb-4 animate-pulse">
          ⚡
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
      <header className="sticky top-0 z-40 w-full glass-nav">
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

            <button type="button" onClick={() => store.setModal("isNotifCenterOpen", true)} className="p-2 rounded-[12px] relative transition-all cursor-pointer bg-white/[0.05] text-[var(--text-dim)] border border-white/10 hover:text-white" title="Notification Center" aria-label="Open notifications">
              <Bell size={16} />
              {store.notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent-primary)' }} />
              )}
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
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
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
        <main className="flex-1" role="tabpanel" id={`tabpanel-${store.activeTab}`}>
          {store.activeTab === "overview" && (
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
              onBankConnected={() => {
                store.fetchAllData();
                store.addToast("Bank Connected", "Incremental transaction sync loop completed.", "success");
              }}
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
          )}

          {store.activeTab === "commitments" && (
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
          )}

          {store.activeTab === "citizen" && <CitizenEntitlementsTab />}

          {store.activeTab === "compounding" && (
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
          )}

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
        </main>
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

      <NotificationCenter
        isOpen={store.isNotifCenterOpen}
        onClose={() => store.setModal("isNotifCenterOpen", false)}
        notifications={store.notifications}
        onMarkAllRead={store.markAllNotificationsRead}
      />

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
