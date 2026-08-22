export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  color?: string;
  icon?: string;
  target_date?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  cycle: 'Monthly' | 'Annual' | 'Quarterly' | 'Weekly';
  nextDate: string;
  icon: string;
  color: string;
  status?: 'Active' | 'Unused' | 'Price Hiked';
  supportEmail?: string;
  lastUsed?: string;
  priceHikeAmount?: number;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_hash: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  signature: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'insight' | 'security' | 'sync';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: number;
  label: string;
  value: string;
  delta: string;
  type: 'inflow' | 'outflow' | 'compute' | 'audit' | 'hedge';
  status: 'confirmed' | 'pending' | 'flagged';
}

export interface ExecutiveBriefingData {
  wealth_velocity_score: number;
  velocity_tier: string;
  monthly_runway_months: number;
  top_leak_category: string;
  savings_rate_pct: string;
  net_monthly_surplus: number;
  headline: string;
  key_insights: string[];
  tactical_action: string;
}

export interface FinancialAuditData {
  alert_level: 'Safe' | 'Warning' | 'Critical';
  savings_rate_percentage: string;
  report: string;
}
