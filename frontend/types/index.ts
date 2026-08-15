// types/index.ts

export type TransactionType = 'income' | 'expense';
export type InsightType = 'advice' | 'alert';

export interface Transaction {
  id: string;
  name: string;
  date: string; // ISO date string preferred later, but keeping it simple for now
  amount: number; 
  type: TransactionType;
  category: string;
}

export interface AIInsight {
  id: string;
  message: string;
  type: InsightType;
  createdAt: string;
}

export interface DashboardMetrics {
  totalBalance: number;
  monthlySpending: number;
  projectedWealth: number;
}
