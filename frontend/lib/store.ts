/**
 * WealthSage Centralized Zustand Store
 * Eliminates prop-drilling across the 5-tab dashboard architecture.
 */
import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { isValidSupabaseConfig, sanitizeAmount, sanitizeTextInput } from './sanitize';
import { api } from './api';
import { DEMO_PRESETS } from './demoData';
import type { SecurityAuditLog, NotificationItem } from '../types';
import { supabase } from './supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith('your_'));


export interface ToastPayload {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'ai' | 'warning' | 'info';
}

type ActiveTabType = 'guardian' | 'capital' | 'civic' | 'settings';

export interface PaymentRequest {
  id: string;
  merchant: string;
  amount: number;
  childLabel: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface UPIMandate {
  id: string;
  merchant: string;
  amount: number;
  frequency: string;
  last_charged: string;
  status: 'active' | 'paused' | 'revoked';
  isDarkPattern?: boolean;
}

interface WealthState {
  // --- Core Entities ---
  transactions: any[];
  goals: any[];
  subscriptions: any[];
  notes: any[];
  activeNote: any;
  noteTitle: string;
  noteContent: string;
  isTutorThinking: boolean;

  // --- Navigation & Loading ---
  activeTab: ActiveTabType;
  isLoading: boolean;
  isDemoMode: boolean;
  currentUserId: string;
  userDisplayName: string;
  ledgerMode: 'personal' | 'household';

  // --- AI & Analytics ---
  insights: { id: string; message: string; type: string }[];
  inputValue: string;
  isTyping: boolean;
  briefingData: any;
  isBriefingLoading: boolean;

  // --- Audit & Notifications ---
  auditLogs: SecurityAuditLog[];
  notifications: NotificationItem[];
  auditData: any;
  isAuditing: boolean;

  // --- Modal States ---
  isModalOpen: boolean;
  isAuditOpen: boolean;
  isGoalModalOpen: boolean;
  isSubModalOpen: boolean;
  isThemeModalOpen: boolean;
  isGlassAIOpen: boolean;
  isCommandPaletteOpen: boolean;
  isNotifCenterOpen: boolean;
  isAuditLogModalOpen: boolean;
  isResetConfirmModalOpen: boolean;
  isCyberDefenseOpen: boolean;
  cyberDefenseData: any;

  // --- Form State ---
  editingGoal: any;
  goalForm: any;
  editingSub: any;
  subForm: any;
  formData: { description: string; amount: string; type: string; category: string };

  // --- Guardian Shield ---
  paymentRequests: PaymentRequest[];
  upiMandates: UPIMandate[];
  isAAModalOpen: boolean;

  // --- Toast ---
  toasts: ToastPayload[];
}

interface WealthActions {
  // --- Setters ---
  setActiveTab: (tab: ActiveTabType) => void;
  setCurrentUser: (id: string, name: string) => void;
  toggleLedgerMode: () => void;
  setModal: (modal: string, open: boolean) => void;
  openCyberDefense: (txData: any) => void;
  setInputValue: (value: string) => void;
  setFormData: (data: Partial<WealthState['formData']>) => void;
  setNoteTitle: (title: string) => void;
  setNoteContent: (content: string) => void;
  setActiveNote: (note: any) => void;
  setEditingGoal: (goal: any) => void;
  setGoalForm: (form: any) => void;
  setEditingSub: (sub: any) => void;
  setSubForm: (form: any) => void;
  setInsights: (fn: (prev: any[]) => any[]) => void;

  // --- Toast ---
  addToast: (title: string, description?: string, type?: ToastPayload['type']) => void;
  removeToast: (id: string) => void;

  // --- Data Fetching ---
  fetchAllData: () => Promise<void>;
  fetchExecutiveBriefing: (tx?: any[], g?: any[], s?: any[]) => Promise<void>;

  // --- CRUD ---
  saveTransaction: (payload: { description: string; amount: number; type: 'inflow' | 'outflow'; category: string; date?: string }) => Promise<any>;
  handleSaveGoal: () => Promise<void>;
  handleSaveSubscription: () => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  deleteSub: (id: string) => Promise<void>;

  // --- Modes ---
  enterDemoMode: () => void;
  exitDemoMode: () => Promise<void>;
  confirmResetLedger: () => Promise<void>;

  // --- AI ---
  dispatchChatMessage: (msg: string) => Promise<void>;
  runAuditAnalysis: () => Promise<void>;
  clearChat: () => Promise<void>;

  // --- Notes ---
  createNewNote: () => void;
  saveNote: () => Promise<void>;
  askTutor: () => Promise<void>;

  // --- Notifications ---
  markAllNotificationsRead: () => Promise<void>;

  // --- Computed ---
  getActiveTransactions: () => any[];
  getActiveGoals: () => any[];
  getActiveSubscriptions: () => any[];

  // --- Guardian Shield Actions ---
  approveTransaction: (id: string) => void;
  flagTransaction: (id: string) => void;
  revokeMandate: (id: string) => void;
  approvePaymentRequest: (id: string) => void;
  rejectPaymentRequest: (id: string) => void;
  triggerMockWebhook: () => void;
  seedGuardianDemoData: () => void;
}

import { persist } from 'zustand/middleware';

export const useWealthStore = create<WealthState & WealthActions>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
  transactions: [],
  goals: [],
  subscriptions: [],
  notes: [],
  activeNote: null,
  noteTitle: 'Untitled Note',
  noteContent: '',
  isTutorThinking: false,

  activeTab: 'guardian',
  isLoading: true,
  isDemoMode: false,
  currentUserId: 'demo-user-id',
  userDisplayName: 'Sovereign Executive',
  ledgerMode: 'personal',

  insights: [
    {
      id: '1',
      message: 'Welcome to WealthSage Guardian Shield. I am your Family Security Advisor. I monitor your family\'s transactions for gaming scams, dark-pattern subscriptions, and unauthorized purchases. Ask me to scan for threats, review child spending, or flag suspicious activity.',
      type: 'advice',
    },
  ],
  inputValue: '',
  isTyping: false,
  briefingData: null,
  isBriefingLoading: false,

  auditLogs: [],
  notifications: [
    {
      id: 'notif-001',
      title: 'Sovereign Vault Synchronized',
      message: 'Autonomous telemetry engine online with zero latency buffer loss.',
      type: 'insight',
      read: false,
      created_at: 'Just now',
    },
  ],
  auditData: null,
  isAuditing: false,

  isModalOpen: false,
  isAuditOpen: false,
  isGoalModalOpen: false,
  isSubModalOpen: false,
  isThemeModalOpen: false,
  isGlassAIOpen: false,
  isCommandPaletteOpen: false,
  isNotifCenterOpen: false,
  isAuditLogModalOpen: false,
  isResetConfirmModalOpen: false,
  isCyberDefenseOpen: false,
  cyberDefenseData: null,

  editingGoal: null,
  goalForm: { title: '', target_amount: '', current_amount: '', target_date: '' },
  editingSub: null,
  subForm: { name: '', cost: '', billing_cycle: 'Monthly', next_billing_date: '', status: 'active' },
  formData: { description: '', amount: '', type: 'outflow', category: 'Housing' },

  toasts: [],

  // --- Guardian Shield ---
  paymentRequests: [
    { id: 'pr-1', merchant: 'Google Play - Free Fire', amount: 1200, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
    { id: 'pr-2', merchant: 'Codashop - BGMI UC', amount: 799, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
    { id: 'pr-3', merchant: 'Swiggy - Late Night Order', amount: 450, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
    { id: 'pr-4', merchant: 'Discord Nitro Renewal', amount: 699, childLabel: "Priya's iPad", status: 'pending' as const, created_at: new Date().toISOString() },
  ],
  upiMandates: [
    { id: 'um-1', merchant: 'YouTube Premium Family', amount: 189, frequency: 'Monthly', last_charged: '2026-08-15', status: 'active' as const },
    { id: 'um-2', merchant: 'Discord Nitro', amount: 699, frequency: 'Monthly', last_charged: '2026-08-20', status: 'active' as const, isDarkPattern: true },
    { id: 'um-3', merchant: 'Instagram Subscription', amount: 89, frequency: 'Monthly', last_charged: '2026-08-25', status: 'active' as const, isDarkPattern: true },
    { id: 'um-4', merchant: 'Netflix Mobile', amount: 149, frequency: 'Monthly', last_charged: '2026-08-10', status: 'active' as const },
    { id: 'um-5', merchant: 'Spotify Premium', amount: 119, frequency: 'Monthly', last_charged: '2026-08-05', status: 'active' as const },
  ],
  isAAModalOpen: false,

  // --- Setters ---
  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentUser: (id, name) => set({ currentUserId: id, userDisplayName: name }),
  toggleLedgerMode: () => set((state) => {
    const newMode = state.ledgerMode === 'personal' ? 'household' : 'personal';
    get().addToast('Ledger Mode Switched', `Now viewing ${newMode === 'household' ? 'Shared Household' : 'Sovereign Personal'} telemetry.`, 'info');
    return { ledgerMode: newMode };
  }),
  setModal: (modal, open) => set({ [modal]: open } as any),
  openCyberDefense: (txData: any) => set({ isCyberDefenseOpen: true, cyberDefenseData: txData }),
  setInputValue: (value) => set({ inputValue: value }),
  setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  setNoteTitle: (title) => set({ noteTitle: title }),
  setNoteContent: (content) => set({ noteContent: content }),
  setActiveNote: (note) => set({ activeNote: note }),
  setEditingGoal: (goal) => set({ editingGoal: goal }),
  setGoalForm: (form) => set({ goalForm: form }),
  setEditingSub: (sub) => set({ editingSub: sub }),
  setSubForm: (form) => set({ subForm: form }),
  setInsights: (fn) => set((s) => ({ insights: fn(s.insights) })),

  // --- Guardian Shield Actions ---
  approveTransaction: (id) => {
    set((s) => ({ transactions: s.transactions.map((t) => t.id === id ? { ...t, status: 'approved' } : t) }));
    get().addToast('Transaction Approved', 'Payment has been authorized.', 'success');
  },
  flagTransaction: (id) => {
    set((s) => ({ transactions: s.transactions.map((t) => t.id === id ? { ...t, status: 'flagged' } : t) }));
    get().addToast('🚨 Transaction Flagged', 'Payment has been blocked and flagged for review.', 'warning');
  },
  revokeMandate: (id) => {
    set((s) => ({ upiMandates: s.upiMandates.map((m) => m.id === id ? { ...m, status: 'revoked' as const } : m) }));
    get().addToast('Mandate Revoked', 'Recurring payment authorization cancelled.', 'warning');
  },
  approvePaymentRequest: (id) => {
    const { paymentRequests, addToast, saveTransaction } = get();
    const req = paymentRequests.find((r) => r.id === id);
    if (req) {
      set((s) => ({ paymentRequests: s.paymentRequests.map((r) => r.id === id ? { ...r, status: 'approved' as const } : r) }));
      saveTransaction({ description: req.merchant, amount: req.amount, type: 'outflow', category: 'General' });
      addToast('Payment Approved', `₹${req.amount} to ${req.merchant} authorized.`, 'success');
    }
  },
  rejectPaymentRequest: (id) => {
    set((s) => ({ paymentRequests: s.paymentRequests.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r) }));
    get().addToast('Payment Rejected', "Child's payment request denied.", 'warning');
  },
  triggerMockWebhook: () => {
    const mockTx = {
      id: `mock-${crypto.randomUUID()}`, description: 'Google Play - Free Fire Diamonds', amount: 1200,
      type: 'outflow', category: 'Gaming', date: new Date().toISOString(), created_at: new Date().toISOString(),
      user_id: get().currentUserId, merchant: 'Google Play', status: 'flagged', actor: 'child',
    };
    set((s) => ({ transactions: [mockTx, ...s.transactions] }));
    get().addToast('🚨 Guardian Alert: Gaming Purchase Detected', '₹1,200 purchase attempted on Google Play by Child. Transaction flagged.', 'warning');
  },
  seedGuardianDemoData: () => {
    set({
      paymentRequests: [
        { id: 'pr-1', merchant: 'Google Play - Free Fire', amount: 1200, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
        { id: 'pr-2', merchant: 'Codashop - BGMI UC', amount: 799, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
        { id: 'pr-3', merchant: 'Swiggy Order', amount: 450, childLabel: "Ravi's Phone", status: 'pending' as const, created_at: new Date().toISOString() },
        { id: 'pr-4', merchant: 'Discord Nitro', amount: 699, childLabel: "Priya's iPad", status: 'pending' as const, created_at: new Date().toISOString() },
      ],
      upiMandates: [
        { id: 'um-1', merchant: 'YouTube Premium Family', amount: 189, frequency: 'Monthly', last_charged: '2026-08-15', status: 'active' as const },
        { id: 'um-2', merchant: 'Discord Nitro', amount: 699, frequency: 'Monthly', last_charged: '2026-08-20', status: 'active' as const, isDarkPattern: true },
        { id: 'um-3', merchant: 'Instagram Subscription', amount: 89, frequency: 'Monthly', last_charged: '2026-08-25', status: 'active' as const, isDarkPattern: true },
        { id: 'um-4', merchant: 'Netflix Mobile', amount: 149, frequency: 'Monthly', last_charged: '2026-08-10', status: 'active' as const },
        { id: 'um-5', merchant: 'Spotify Premium', amount: 119, frequency: 'Monthly', last_charged: '2026-08-05', status: 'active' as const },
      ],
    });
    get().addToast('Guardian Demo Data Loaded', 'Sample payment requests and UPI mandates loaded.', 'ai');
  },

  // --- Toast ---
  addToast: (title, description, type = 'success') => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, title, description, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // --- Computed ---
  getActiveTransactions: () => {
    const s = get();
    if (s.isDemoMode) return DEMO_PRESETS[0].transactions;
    if (s.ledgerMode === 'household') {
      // Simulate household transactions by merging personal with partner's tx
      const partnerTx = [
        { id: "p-tx-1", description: "Partner Salary", amount: 180000, type: "inflow", category: "Salary", date: "2026-09-01T10:00:00.000Z" },
        { id: "p-tx-2", description: "Shared Groceries", amount: 12000, type: "outflow", category: "Groceries", date: "2026-09-01T14:30:00.000Z" },
        { id: "p-tx-3", description: "Joint Mutual Fund SIP", amount: 25000, type: "outflow", category: "Investments", date: "2026-09-01T09:00:00.000Z" }
      ];
      return [...s.transactions, ...partnerTx].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return s.transactions;
  },
  getActiveGoals: () => {
    const s = get();
    if (s.isDemoMode) return DEMO_PRESETS[0].goals;
    if (s.ledgerMode === 'household') {
      const jointGoals = [
        { id: "p-g-1", title: "Joint House Downpayment", current_amount: 3500000, target_amount: 10000000, target_date: "2028-12-31T00:00:00Z", icon: "🏡", color: "#10B981" }
      ];
      return [...s.goals, ...jointGoals];
    }
    return s.goals;
  },
  getActiveSubscriptions: () => {
    const s = get();
    if (s.isDemoMode) return DEMO_PRESETS[0].subscriptions;
    if (s.ledgerMode === 'household') {
      const jointSubs = [
        { id: "p-s-1", name: "Family Health Insurance", cost: 4500, billing_cycle: "Monthly", next_billing_date: "2026-09-15T00:00:00.000Z", status: "Active" }
      ];
      return [...s.subscriptions, ...jointSubs].sort((a: any, b: any) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime());
    }
    return s.subscriptions;
  },

  // --- Data Fetching ---
  fetchExecutiveBriefing: async (txOverride?, goalsOverride?, subsOverride?) => {
    const s = get();
    const tx = txOverride ?? s.transactions;
    const g = goalsOverride ?? s.goals;
    const sub = subsOverride ?? s.subscriptions;
    set({ isBriefingLoading: true });
    try {
      const data = await api.getExecutiveBriefing(tx, g, sub);
      if (data) set({ briefingData: data });
    } catch (e) {
      console.warn('Executive briefing fallback:', e);
    } finally {
      set({ isBriefingLoading: false });
    }
  },

  fetchAllData: async () => {
    const { currentUserId, fetchExecutiveBriefing } = get();
    set({ isLoading: true });
    try {
      // Audit logs
      const logs = await api.getAuditLogs(currentUserId).catch(() => []);
      if (logs && Array.isArray(logs)) set({ auditLogs: logs as SecurityAuditLog[] });

      // Notifications
      try {
        const notifRes = await fetch(`/api/notifications?user_id=${encodeURIComponent(currentUserId)}`);
        const notifData = await notifRes.json();
        if (notifData && Array.isArray(notifData) && notifData.length > 0) set({ notifications: notifData });
      } catch {}

      // Chat history
      try {
        const chatRes = await fetch(`/api/chat?user_id=${encodeURIComponent(currentUserId)}`);
        const chatData = await chatRes.json();
        if (chatData?.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
          const restoredInsights = chatData.messages.map((msg: any) => ({
            id: msg.id,
            message: msg.content,
            type: msg.role === 'user' ? 'user' : 'advice',
          }));
          set({ insights: restoredInsights });
        }
      } catch {}

      if (!SUPABASE_CONFIGURED) {
        set({
          notes: [{ id: '1', title: 'Welcome to WealthSage', content: 'Your local workspace is ready.' }],
          transactions: [],
          goals: [],
          subscriptions: [],
        });
        await fetchExecutiveBriefing([], [], []);
        set({ isLoading: false });
        return;
      }

      // Supabase fetch
      const { data: noteData } = await supabase
        .from('notes')
        .select('id, user_id, title, content')
        .eq('user_id', currentUserId);
      if (noteData && noteData.length > 0) {
        set({ notes: noteData });
      } else {
        set({
          notes: [{
            id: '1',
            title: 'Sovereign Compounding Thesis',
            content: '## Sovereign Wealth Building Roadmap\n- Save at least $25\\%$ of gross revenue\n- Maximize compound interest: $$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\n- Rebalance monthly surplus into low-cost index equities.',
          }],
        });
      }

      let loadedTx: any[] = [];
      const { data: txData } = await supabase
        .from('transactions')
        .select('id, user_id, description, amount, type, category, date, created_at')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });
      if (txData && txData.length > 0) loadedTx = txData;
      set({ transactions: loadedTx });

      let loadedGoals: any[] = [];
      const { data: goalData } = await supabase
        .from('goals')
        .select('id, user_id, title, target_amount, current_amount, target_date, created_at')
        .eq('user_id', currentUserId);
      if (goalData && goalData.length > 0) loadedGoals = goalData;
      set({ goals: loadedGoals });

      let loadedSubs: any[] = [];
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id, user_id, name, cost, billing_cycle, next_billing_date, status, created_at')
        .eq('user_id', currentUserId);
      if (subData && subData.length > 0) loadedSubs = subData;
      set({ subscriptions: loadedSubs });

      await fetchExecutiveBriefing(loadedTx, loadedGoals, loadedSubs);
    } catch (err) {
      console.warn('Data load fallback:', err);
      set({ transactions: [], goals: [], subscriptions: [] });
      await fetchExecutiveBriefing([], [], []);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- CRUD: Transactions ---
  saveTransaction: async (payload) => {
    const { isDemoMode, currentUserId, transactions, goals, subscriptions, addToast, fetchExecutiveBriefing } = get();
    if (isDemoMode) {
      addToast('Action Blocked', 'Please exit Demo Mode to add or modify real records.', 'warning');
      return null;
    }
    const newTx = {
      id: crypto.randomUUID(),
      description: sanitizeTextInput(payload.description),
      amount: payload.amount,
      type: payload.type,
      category: sanitizeTextInput(payload.category, 80) || 'General',
      date: payload.date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: currentUserId,
      merchant: sanitizeTextInput(payload.description),
      status: 'approved',
      actor: 'parent',
    };
    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from('transactions').insert([newTx]);
        if (error) throw error;
        addToast('Record Saved', '✓ Saved to Supabase Vault', 'success');
      } else {
        addToast('Record Saved', 'Saved locally (Supabase not configured)', 'success');
      }
      const updated = [newTx, ...transactions];
      set({ transactions: updated });
      fetchExecutiveBriefing(updated, goals, subscriptions);
      return newTx;
    } catch (e: any) {
      const errorMsg = e?.message || JSON.stringify(e);
      console.error('Supabase Error:', errorMsg);
      const isSchemaError = errorMsg.toLowerCase().includes('column');
      addToast('Error', isSchemaError ? 'Schema mismatch. Run schema.sql migration.' : 'Failed to save to Supabase', 'warning');
      return null;
    }
  },

  // --- CRUD: Goals ---
  handleSaveGoal: async () => {
    const { isDemoMode, goalForm, editingGoal, currentUserId, addToast } = get();
    if (isDemoMode) { addToast('Action Blocked', 'Please exit Demo Mode.', 'warning'); return; }
    const targetNum = sanitizeAmount(goalForm.target_amount);
    if (!goalForm.title || !targetNum) return;
    const gPayload = {
      id: editingGoal?.id || crypto.randomUUID(),
      title: sanitizeTextInput(goalForm.title),
      target_amount: targetNum,
      current_amount: sanitizeAmount(goalForm.current_amount) || 0,
      target_date: goalForm.target_date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: currentUserId,
    };
    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from('goals').upsert([gPayload]);
        if (error) throw error;
      }
      set((s) => {
        const exists = s.goals.some((g) => g.id === gPayload.id);
        return {
          goals: exists ? s.goals.map((g) => (g.id === gPayload.id ? gPayload : g)) : [...s.goals, gPayload],
          isGoalModalOpen: false,
        };
      });
      addToast(editingGoal ? 'Goal Updated' : 'Vault Goal Created', gPayload.title, 'success');
    } catch {
      addToast('Error', 'Failed to save goal.', 'warning');
    }
  },

  // --- CRUD: Subscriptions ---
  handleSaveSubscription: async () => {
    const { isDemoMode, subForm, editingSub, currentUserId, addToast } = get();
    if (isDemoMode) { addToast('Action Blocked', 'Please exit Demo Mode.', 'warning'); return; }
    const amtNum = sanitizeAmount(subForm.cost);
    if (!subForm.name || !amtNum) return;
    const sPayload = {
      id: editingSub?.id || crypto.randomUUID(),
      name: sanitizeTextInput(subForm.name),
      cost: amtNum,
      billing_cycle: subForm.billing_cycle || 'Monthly',
      next_billing_date: subForm.next_billing_date || new Date().toISOString(),
      status: subForm.status || 'active',
      created_at: new Date().toISOString(),
      user_id: currentUserId,
    };
    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from('subscriptions').upsert([sPayload]);
        if (error) throw error;
      }
      set((s) => {
        const exists = s.subscriptions.some((sub) => sub.id === sPayload.id);
        return {
          subscriptions: exists ? s.subscriptions.map((sub) => (sub.id === sPayload.id ? sPayload : sub)) : [...s.subscriptions, sPayload],
          isSubModalOpen: false,
        };
      });
      addToast(editingSub ? 'Subscription Updated' : 'Subscription Tracked', sPayload.name, 'success');
    } catch {
      addToast('Error', 'Failed to save subscription.', 'warning');
    }
  },

  deleteGoal: async (id) => {
    if (SUPABASE_CONFIGURED) await supabase.from('goals').delete().eq('id', id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
    get().addToast('Goal Removed', 'Milestone removed from vault.', 'info');
  },

  deleteSub: async (id) => {
    if (SUPABASE_CONFIGURED) await supabase.from('subscriptions').delete().eq('id', id);
    set((s) => ({ subscriptions: s.subscriptions.filter((sub) => sub.id !== id) }));
    get().addToast('Subscription Removed', 'Recurring commitment untracked.', 'info');
  },

  // --- Modes ---
  enterDemoMode: () => {
    set({ isDemoMode: true });
    get().addToast('Loaded Demo Data', 'Temporary demo data loaded successfully into memory sandbox.', 'ai');
  },

  exitDemoMode: async () => {
    set({ isDemoMode: false });
    if (SUPABASE_CONFIGURED) {
      const mockTxNames = DEMO_PRESETS.flatMap((p) => p.transactions.map((t) => t.name));
      const mockGoalNames = DEMO_PRESETS.flatMap((p) => p.goals.map((g) => g.name));
      const mockSubNames = DEMO_PRESETS.flatMap((p) => p.subscriptions.map((s) => s.name));
      try {
        await Promise.allSettled([
          supabase.from('transactions').delete().in('name', mockTxNames),
          supabase.from('goals').delete().in('name', mockGoalNames),
          supabase.from('subscriptions').delete().in('name', mockSubNames),
        ]);
      } catch (e) {
        console.warn('Failed to purge demo data', e);
      }
    }
    get().fetchAllData();
    get().addToast('Real Ledger Active', 'Demo data cleared. Reconnected to live database.', 'info');
  },

  confirmResetLedger: async () => {
    const { isDemoMode, currentUserId, addToast, fetchExecutiveBriefing } = get();
    if (isDemoMode) { addToast('Action Blocked', 'Exit Demo Mode first.', 'warning'); return; }
    try {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, scope: 'all' }),
      });
    } catch {
      if (SUPABASE_CONFIGURED) {
        await Promise.allSettled([
          supabase.from('transactions').delete().eq('user_id', currentUserId),
          supabase.from('goals').delete().eq('user_id', currentUserId),
          supabase.from('subscriptions').delete().eq('user_id', currentUserId),
          supabase.from('notes').delete().eq('user_id', currentUserId),
          supabase.from('chat_messages').delete().eq('user_id', currentUserId),
        ]);
      }
    }
    set({
      transactions: [],
      goals: [],
      subscriptions: [],
      notes: [],
      insights: [{ id: 'welcome-reset', message: 'Ledger fully reset. All data cleared.', type: 'advice' }],
    });
    await fetchExecutiveBriefing([], [], []);
    addToast('Full Ledger Reset', 'All data cleared across all tables.', 'warning');
  },

  // --- AI Chat ---
  dispatchChatMessage: async (msgText) => {
    const { isDemoMode, insights, transactions, goals, subscriptions, currentUserId, addToast, saveTransaction, fetchExecutiveBriefing } = get();
    if (isDemoMode) { addToast('Action Blocked', 'Exit Demo Mode first.', 'warning'); return; }
    if (!msgText.trim()) return;

    set((s) => ({
      insights: [...s.insights, { id: crypto.randomUUID(), message: msgText, type: 'user' }],
      inputValue: '',
      isTyping: true,
    }));

    const chatHistory = insights
      .filter((msg) => msg.type === 'user' || msg.type === 'advice')
      .slice(-20)
      .map((msg) => ({ role: msg.type === 'user' ? 'user' : 'assistant', content: msg.message }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, history: chatHistory, transactions, user_id: currentUserId }),
      });
      const data = await res.json();

      if (data?.reply) {
        set((s) => ({
          insights: [...s.insights, { id: crypto.randomUUID(), message: data.reply, type: 'advice' }],
        }));

        if (data.has_updates && data.updates && Array.isArray(data.updates)) {
          let currentTx = [...transactions];
          let currentGoals = [...goals];
          let currentSubs = [...subscriptions];

          for (const update of data.updates) {
            if (update.action === 'add') {
              await saveTransaction({
                description: update.description || update.name,
                amount: update.amount,
                type: update.type === 'expense' ? 'outflow' : update.type === 'income' ? 'inflow' : update.type,
                category: update.category || 'General',
              });
            } else if (update.action === 'add_subscription') {
              const newSub = {
                name: update.name,
                amount: update.amount,
                cycle: update.cycle || 'Monthly',
                nextDate: update.nextDate || '1st',
                icon: update.icon || '💸',
                color: update.color || '#10B981',
                user_id: currentUserId,
              };
              if (SUPABASE_CONFIGURED) await supabase.from('subscriptions').insert([newSub]);
              currentSubs.push(newSub);
              addToast('AI Logged Subscription', `${newSub.name} (₹${newSub.amount}/mo)`, 'ai');
            } else if (update.action === 'update' && update.id) {
              if (update.target === 'transaction') {
                if (SUPABASE_CONFIGURED) await supabase.from('transactions').update({ name: update.name, amount: update.amount, category: update.category }).eq('id', update.id);
                currentTx = currentTx.map((t) => (t.id === update.id ? { ...t, ...update } : t));
                addToast('AI Updated Record', `${update.name} (₹${update.amount})`, 'ai');
              } else if (update.target === 'goal') {
                if (SUPABASE_CONFIGURED) await supabase.from('goals').update({ name: update.name, target: update.target_amount, current: update.current }).eq('id', update.id);
                currentGoals = currentGoals.map((g) => (g.id === update.id ? { ...g, ...update } : g));
                addToast('AI Updated Goal', update.name, 'ai');
              } else if (update.target === 'subscription') {
                if (SUPABASE_CONFIGURED) await supabase.from('subscriptions').update({ name: update.name, amount: update.amount }).eq('id', update.id);
                currentSubs = currentSubs.map((s) => (s.id === update.id ? { ...s, ...update } : s));
                addToast('AI Updated Subscription', update.name, 'ai');
              }
            } else if (update.action === 'delete' && update.id) {
              if (update.target === 'transaction') {
                if (SUPABASE_CONFIGURED) await supabase.from('transactions').delete().eq('id', update.id);
                currentTx = currentTx.filter((t) => t.id !== update.id);
                addToast('AI Deleted Record', 'Transaction removed.', 'ai');
              } else if (update.target === 'subscription') {
                if (SUPABASE_CONFIGURED) await supabase.from('subscriptions').delete().eq('id', update.id);
                currentSubs = currentSubs.filter((s) => s.id !== update.id);
                addToast('AI Deleted Subscription', 'Subscription removed.', 'ai');
              }
            } else if (update.action === 'reset') {
              if (SUPABASE_CONFIGURED) await supabase.from('transactions').delete().eq('user_id', currentUserId);
              currentTx = [];
              currentGoals = [];
              currentSubs = [];
              addToast('System Reset', 'All ledger data has been securely purged.', 'success');
            } else if (update.action === 'OPEN_MODAL') {
              if (update.target === 'cyber_defense') {
                get().setModal('cyberDefenseData', update.data);
                get().setModal('isCyberDefenseOpen', true);
                if (SUPABASE_CONFIGURED) {
                  await supabase.from('audit_logs').insert({
                    user_id: currentUserId,
                    action: 'CYBER_DEFENSE_TRIGGERED',
                    resource_type: 'MODAL',
                    resource_id: update.data?.id || 'unknown',
                    severity: 'CRITICAL',
                  });
                }
              }
            } else if (update.action === 'NAVIGATE') {
              if (typeof window !== 'undefined') {
                window.location.href = update.target;
              }
            }
          }

          set({ transactions: currentTx, goals: currentGoals, subscriptions: currentSubs });
          fetchExecutiveBriefing(currentTx, currentGoals, currentSubs);
        }
      }
    } catch (error) {
      console.warn('Chat API error, using client-side fallback:', error);
      const income = transactions.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
      const expense = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
      const net = income - expense;
      const fallbackText = `### WealthSage AI\n\nAnalyzing: *"${msgText}"*\n\n**Active Ledger:** Income: ₹${income.toFixed(2)}/mo, Expenses: ₹${expense.toFixed(2)}/mo, Net: ₹${net.toFixed(2)}/mo\n\nAsk me to **log expenses**, **forecast growth**, **audit spending**, or **analyze trends**.`;
      set((s) => ({
        insights: [...s.insights, { id: crypto.randomUUID(), message: fallbackText, type: 'advice' }],
      }));
    } finally {
      set({ isTyping: false });
    }
  },

  runAuditAnalysis: async () => {
    const { transactions, addToast } = get();
    set({ isAuditing: true, isAuditOpen: true });
    try {
      const data = await api.runAudit(transactions);
      set({ auditData: data });
      addToast('Audit Complete', `Alert Level: ${(data as any)?.alert_level || 'Low'}`, 'ai');
    } catch (err) {
      console.warn('Audit error:', err);
    } finally {
      set({ isAuditing: false });
    }
  },

  clearChat: async () => {
    const { isDemoMode, currentUserId } = get();
    if (isDemoMode) return;
    set({ insights: [] });
    try {
      await fetch(`/api/chat?user_id=${encodeURIComponent(currentUserId)}`, { method: 'DELETE' });
    } catch {}
  },

  // --- Notes ---
  createNewNote: () => {
    set({
      activeNote: null,
      noteTitle: 'New Sovereign Thesis',
      noteContent: '## Formula Analysis\n$$A = P(1 + r/n)^{nt}$$',
    });
  },

  saveNote: async () => {
    const { activeNote, noteTitle, noteContent, currentUserId, addToast } = get();
    const notePayload = {
      id: activeNote?.id || crypto.randomUUID(),
      title: sanitizeTextInput(noteTitle) || 'Untitled Note',
      content: sanitizeTextInput(noteContent, 8000) || '',
      user_id: currentUserId,
    };
    if (SUPABASE_CONFIGURED) {
      await supabase.from('notes').upsert([notePayload]);
    }
    set((s) => {
      const exists = s.notes.some((n) => n.id === notePayload.id);
      return {
        notes: exists ? s.notes.map((n) => (n.id === notePayload.id ? notePayload : n)) : [...s.notes, notePayload],
        activeNote: notePayload,
      };
    });
    addToast('Note Saved', notePayload.title, 'success');
  },

  askTutor: async () => {
    const { noteContent, activeNote, addToast } = get();
    if (!noteContent.trim()) return;
    set({ isTutorThinking: true });
    try {
      const result = await api.explainTutor(activeNote?.content || noteContent);
      if (result && (result as any).explanation) {
        set((s) => ({
          noteContent: `${s.noteContent}\n\n### AI Tutor Mathematical Expansion\n${(result as any).explanation}`,
        }));
      }
      addToast('AI Tutor Complete', 'Quantitative derivation generated.', 'ai');
    } catch (e) {
      console.warn('Tutor error:', e);
    } finally {
      set({ isTutorThinking: false });
    }
  },

  // --- Notifications ---
  markAllNotificationsRead: async () => {
    const { currentUserId, addToast } = get();
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, mark_all_read: true }),
      });
    } catch {}
  },
    }),
    {
      name: 'wealthsage-storage',
      partialize: (state) => ({ 
        transactions: state.transactions, 
        goals: state.goals, 
        subscriptions: state.subscriptions 
      }),
    }
  )
);
