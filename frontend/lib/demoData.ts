"use client";
import React from "react";
import { Briefcase, GraduationCap, Rocket, Shield } from "lucide-react";

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  roleDescription: string;
  icon: React.ElementType;
  transactions: Record<string, unknown>[];
  goals: Record<string, unknown>[];
  subscriptions: Record<string, unknown>[];
  paymentRequests?: Record<string, unknown>[];
  upiMandates?: Record<string, unknown>[];
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "indian-family",
    name: "Indian Family Shield",
    badge: "Guardian Demo (₹85K/mo)",
    roleDescription: "Indian middle-class family with children making in-game purchases and dark-pattern subscriptions draining the account.",
    icon: Shield,
    transactions: [
      { id: "tx-f1", description: "Monthly Salary", amount: 85000, type: "inflow", category: "Salary", date: new Date().toISOString(), merchant: "Employer Direct Deposit", status: "approved", actor: "parent" },
      { id: "tx-f2", description: "Apartment Rent - Koramangala", amount: 15000, type: "outflow", category: "Rent", date: new Date().toISOString(), merchant: "Landlord UPI", status: "approved", actor: "parent" },
      { id: "tx-f3", description: "Google Play - Free Fire Diamonds", amount: 1200, type: "outflow", category: "Gaming", date: new Date().toISOString(), merchant: "Google Play", status: "flagged", actor: "child" },
      { id: "tx-f4", description: "Codashop - BGMI UC Top-up", amount: 799, type: "outflow", category: "Gaming", date: new Date().toISOString(), merchant: "Codashop", status: "flagged", actor: "child" },
      { id: "tx-f5", description: "Swiggy Late Night Order", amount: 450, type: "outflow", category: "Food", date: new Date().toISOString(), merchant: "Swiggy", status: "approved", actor: "child" },
      { id: "tx-f6", description: "Discord Nitro Auto-renewal", amount: 699, type: "outflow", category: "Social", date: new Date().toISOString(), merchant: "Discord", status: "flagged", actor: "child" },
      { id: "tx-f7", description: "Meta Verified Subscription", amount: 699, type: "outflow", category: "Social", date: new Date().toISOString(), merchant: "Meta Verified", status: "flagged", actor: "child" },
      { id: "tx-f8", description: "Swiggy Instamart Groceries", amount: 3500, type: "outflow", category: "Food", date: new Date().toISOString(), merchant: "Swiggy Instamart", status: "approved", actor: "parent" },
      { id: "tx-f9", description: "Uber Auto - School Drop", amount: 180, type: "outflow", category: "Transport", date: new Date().toISOString(), merchant: "Uber", status: "approved", actor: "parent" },
      { id: "tx-f10", description: "DPS School Tuition Fees", amount: 8500, type: "outflow", category: "Education", date: new Date().toISOString(), merchant: "DPS School", status: "approved", actor: "parent" },
      { id: "tx-f11", description: "Tata Power Electricity Bill", amount: 2200, type: "outflow", category: "Utility", date: new Date().toISOString(), merchant: "Tata Power", status: "approved", actor: "parent" },
      { id: "tx-f12", description: "Jio Fiber Broadband", amount: 999, type: "outflow", category: "Utility", date: new Date().toISOString(), merchant: "Jio Fiber", status: "approved", actor: "parent" },
    ],
    goals: [
      { id: "g-1", title: "Children's Education Fund", current_amount: 250000, target_amount: 1500000, target_date: "2030-06-01T00:00:00Z" },
      { id: "g-2", title: "Emergency Medical Fund", current_amount: 100000, target_amount: 500000, target_date: "2027-12-31T00:00:00Z" },
    ],
    subscriptions: [
      { id: "s-1", name: "YouTube Premium Family", cost: 189, billing_cycle: "Monthly", next_billing_date: "2026-09-15T00:00:00Z", status: "active", plan_tier: "Family" },
      { id: "s-2", name: "Discord Nitro (Child)", cost: 699, billing_cycle: "Monthly", next_billing_date: "2026-09-20T00:00:00Z", status: "active", plan_tier: "Nitro" },
      { id: "s-3", name: "Netflix Mobile", cost: 149, billing_cycle: "Monthly", next_billing_date: "2026-09-10T00:00:00Z", status: "active", plan_tier: "Mobile" },
      { id: "s-4", name: "Instagram Subscription", cost: 89, billing_cycle: "Monthly", next_billing_date: "2026-09-25T00:00:00Z", status: "active", plan_tier: "Creator" },
      { id: "s-5", name: "Spotify Premium", cost: 119, billing_cycle: "Monthly", next_billing_date: "2026-09-28T00:00:00Z", status: "active", plan_tier: "Individual" },
    ],
    paymentRequests: [
      { id: "pr-1", merchant: "Google Play - Free Fire", amount: 1200, childLabel: "Ravi's Phone", status: "pending", created_at: new Date().toISOString() },
      { id: "pr-2", merchant: "Codashop - BGMI UC", amount: 799, childLabel: "Ravi's Phone", status: "pending", created_at: new Date().toISOString() },
      { id: "pr-3", merchant: "Swiggy - Late Night Order", amount: 450, childLabel: "Ravi's Phone", status: "pending", created_at: new Date().toISOString() },
      { id: "pr-4", merchant: "Discord Nitro Renewal", amount: 699, childLabel: "Priya's iPad", status: "pending", created_at: new Date().toISOString() },
    ],
    upiMandates: [
      { id: "um-1", merchant: "YouTube Premium Family", amount: 189, frequency: "Monthly", last_charged: "2026-08-15", status: "active" },
      { id: "um-2", merchant: "Discord Nitro", amount: 699, frequency: "Monthly", last_charged: "2026-08-20", status: "active", isDarkPattern: true },
      { id: "um-3", merchant: "Instagram Subscription", amount: 89, frequency: "Monthly", last_charged: "2026-08-25", status: "active", isDarkPattern: true },
      { id: "um-4", merchant: "Netflix Mobile", amount: 149, frequency: "Monthly", last_charged: "2026-08-10", status: "active" },
      { id: "um-5", merchant: "Spotify Premium", amount: 119, frequency: "Monthly", last_charged: "2026-08-05", status: "active" },
    ],
  },
  {
    id: "tech-lead",
    name: "Tech Architect",
    badge: "High Surplus (₹1.4L/mo)",
    roleDescription: "Engineering Lead with aggressive index compounding & diversified milestones.",
    icon: Rocket,
    transactions: [
      { id: "tx-1", description: "Staff Engineer Salary", amount: 250000, type: "inflow", category: "Salary", date: new Date().toISOString(), merchant: "Employer", status: "approved", actor: "parent" },
      { id: "tx-2", description: "Luxury Apartment Rent (HSR)", amount: 45000, type: "outflow", category: "Housing", date: new Date().toISOString(), merchant: "Rent", status: "approved", actor: "parent" },
      { id: "tx-3", description: "Nifty 50 Index SIP", amount: 40000, type: "outflow", category: "Investments", date: new Date().toISOString(), merchant: "Zerodha", status: "approved", actor: "parent" },
      { id: "tx-4", description: "Swiggy Instamart Groceries", amount: 8500, type: "outflow", category: "Groceries", date: new Date().toISOString(), merchant: "Swiggy Instamart", status: "approved", actor: "parent" },
      { id: "tx-5", description: "Mahindra XUV Auto Loan", amount: 15890, type: "outflow", category: "Transport", date: new Date().toISOString(), merchant: "Mahindra Finance", status: "approved", actor: "parent" },
      { id: "tx-6", description: "Angel Syndicate Dividend", amount: 12000, type: "inflow", category: "Dividends", date: new Date().toISOString(), merchant: "Angel Fund", status: "approved", actor: "parent" },
    ],
    goals: [
      { id: "g-1", title: "Indiranagar Downpayment", current_amount: 1500000, target_amount: 5000000, target_date: "2027-12-31T00:00:00Z" },
      { id: "g-2", title: "Early Retirement Corpus", current_amount: 4500000, target_amount: 10000000, target_date: "2035-06-01T00:00:00Z" },
    ],
    subscriptions: [
      { id: "s-1", name: "AWS Cloud Infrastructure", cost: 2500, billing_cycle: "Monthly", next_billing_date: "2026-09-01T00:00:00Z", status: "active", plan_tier: "Enterprise" },
      { id: "s-2", name: "Cult.fit Elite", cost: 1499, billing_cycle: "Monthly", next_billing_date: "2026-09-05T00:00:00Z", status: "active", plan_tier: "Elite" },
      { id: "s-3", name: "Zerodha Sensibull", cost: 800, billing_cycle: "Monthly", next_billing_date: "2026-09-14T00:00:00Z", status: "active", plan_tier: "Pro" },
    ],
  },
  {
    id: "student-quant",
    name: "Gen-Z Quant",
    badge: "Zombie Sub Demo Ready",
    roleDescription: "Student & junior researcher with unused subscriptions and high optimization potential.",
    icon: GraduationCap,
    transactions: [
      { id: "tx-q1", description: "Research Stipend / Fellowship", amount: 3800, type: "inflow", category: "Stipend", date: new Date().toISOString(), merchant: "University", status: "approved", actor: "parent" },
      { id: "tx-q2", description: "Campus Studio Rent", amount: 1250, type: "outflow", category: "Housing", date: new Date().toISOString(), merchant: "Campus Housing", status: "approved", actor: "parent" },
      { id: "tx-q3", description: "Tuition Installment", amount: 800, type: "outflow", category: "Education", date: new Date().toISOString(), merchant: "University", status: "approved", actor: "parent" },
    ],
    goals: [
      { id: "gq-1", title: "Emergency Buffer", current_amount: 2800, target_amount: 5000, target_date: "2027-06-01T00:00:00Z" },
    ],
    subscriptions: [
      { id: "sq-1", name: "Metro Fitness Gym (Unused)", cost: 65.00, billing_cycle: "Monthly", next_billing_date: "2026-09-12T00:00:00Z", status: "cancelled" },
      { id: "sq-2", name: "Adobe Creative Cloud (Unused)", cost: 54.99, billing_cycle: "Monthly", next_billing_date: "2026-09-18T00:00:00Z", status: "cancelled" },
      { id: "sq-3", name: "Netflix Premium (Price Hiked)", cost: 22.99, billing_cycle: "Monthly", next_billing_date: "2026-09-04T00:00:00Z", status: "active" },
    ],
  },
];
