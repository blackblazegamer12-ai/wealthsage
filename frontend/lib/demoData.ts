"use client";
import React from "react";
import { Briefcase, GraduationCap, Rocket } from "lucide-react";

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  roleDescription: string;
  icon: React.ElementType;
  transactions: Record<string, unknown>[];
  goals: Record<string, unknown>[];
  subscriptions: Record<string, unknown>[];
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "tech-lead",
    name: "Tech Architect",
    badge: "High Surplus (₹1.4L/mo)",
    roleDescription: "Engineering Lead with aggressive index compounding & diversified milestones.",
    icon: Rocket,
    transactions: [
      { id: "tx-1", description: "Staff Engineer Salary", amount: 250000, type: "inflow", category: "Salary", date: new Date().toISOString() },
      { id: "tx-2", description: "Luxury Apartment Rent (HSR)", amount: 45000, type: "outflow", category: "Housing", date: new Date().toISOString() },
      { id: "tx-3", description: "Nifty 50 Index SIP", amount: 40000, type: "outflow", category: "Investments", date: new Date().toISOString() },
      { id: "tx-4", description: "Swiggy Instamart Groceries", amount: 8500, type: "outflow", category: "Groceries", date: new Date().toISOString() },
      { id: "tx-5", description: "Mahindra XUV Auto Loan", amount: 15890, type: "outflow", category: "Transport", date: new Date().toISOString() },
      { id: "tx-6", description: "Angel Syndicate Dividend", amount: 12000, type: "inflow", category: "Dividends", date: new Date().toISOString() },
      { id: "tx-7", description: "Grammarly Trial Card Auth", amount: 2, type: "outflow", category: "Subscriptions", date: new Date().toISOString() }
    ],
    goals: [
      { id: "g-1", title: "Indiranagar Downpayment", current_amount: 1500000, target_amount: 5000000, target_date: "2027-12-31T00:00:00Z" },
      { id: "g-2", title: "Early Retirement Corpus", current_amount: 4500000, target_amount: 10000000, target_date: "2035-06-01T00:00:00Z" },
      { id: "g-3", title: "Himalayan Expedition", current_amount: 45000, target_amount: 150000, target_date: "2026-10-15T00:00:00Z" }
    ],
    subscriptions: [
      { id: "s-1", name: "AWS Cloud Infrastructure", cost: 2500, billing_cycle: "Monthly", next_billing_date: "2026-09-01T00:00:00Z", status: "active", plan_tier: "Enterprise", last_used_date: "2026-09-01T00:00:00Z" },
      { id: "s-2", name: "Cult.fit Elite", cost: 1499, billing_cycle: "Monthly", next_billing_date: "2026-09-05T00:00:00Z", status: "active", plan_tier: "Elite", last_used_date: "2026-08-15T00:00:00Z" },
      { id: "s-3", name: "Zerodha Sensibull", cost: 800, billing_cycle: "Monthly", next_billing_date: "2026-09-14T00:00:00Z", status: "active", plan_tier: "Pro", last_used_date: "2026-08-20T00:00:00Z" },
      { id: "s-4", name: "Spotify Family", cost: 179, billing_cycle: "Monthly", next_billing_date: "2026-09-28T00:00:00Z", status: "active", plan_tier: "Family", last_used_date: "2026-09-01T00:00:00Z" },
      { id: "s-5", name: "Grammarly Trial", cost: 999, billing_cycle: "Annual", next_billing_date: "2026-09-04T00:00:00Z", status: "Pending Trial", plan_tier: "Premium Trial", last_used_date: "2026-09-01T00:00:00Z" }
    ]
  },
  {
    id: "founder",
    name: "Startup Founder",
    badge: "Variable Flow ($9.8k/mo)",
    roleDescription: "Bootstrapped SaaS Founder managing runway, cloud spend, and emergency buffers.",
    icon: Briefcase,
    transactions: [
      { id: "tx-f1", description: "SaaS Enterprise Subscriptions", amount: 9800, type: "inflow", category: "Business", date: new Date().toISOString() },
      { id: "tx-f2", description: "WeWork Dedicated Desk", amount: 650, type: "outflow", category: "Office", date: new Date().toISOString() },
      { id: "tx-f3", description: "OpenAI API & Anthropic Compute", amount: 850, type: "outflow", category: "Software", date: new Date().toISOString() },
      { id: "tx-f4", description: "Tax Reserve Set-Aside", amount: 2400, type: "outflow", category: "Taxes", date: new Date().toISOString() },
      { id: "tx-f5", description: "Apartment Rent", amount: 2100, type: "outflow", category: "Housing", date: new Date().toISOString() }
    ],
    goals: [
      { id: "gf-1", title: "12-Month Business Runway", current_amount: 45000, target_amount: 75000, target_date: "2027-01-01T00:00:00Z" },
      { id: "gf-2", title: "Series-A Legal Retainer", current_amount: 14000, target_amount: 25000, target_date: "2026-11-01T00:00:00Z" }
    ],
    subscriptions: [
      { id: "sf-1", name: "Vercel Enterprise", cost: 40.00, billing_cycle: "Monthly", next_billing_date: "2026-09-02T00:00:00Z", status: "active" },
      { id: "sf-2", name: "Figma Organization", cost: 45.00, billing_cycle: "Monthly", next_billing_date: "2026-09-10T00:00:00Z", status: "active" },
      { id: "sf-3", name: "Notion AI Team", cost: 30.00, billing_cycle: "Monthly", next_billing_date: "2026-09-19T00:00:00Z", status: "active" }
    ]
  },
  {
    id: "student-quant",
    name: "Gen-Z Quant",
    badge: "Zombie Sub Demo Ready",
    roleDescription: "Student & junior researcher with unused subscriptions and high optimization potential.",
    icon: GraduationCap,
    transactions: [
      { id: "tx-q1", description: "Research Stipend / Fellowship", amount: 3800, type: "inflow", category: "Stipend", date: new Date().toISOString() },
      { id: "tx-q2", description: "Campus Studio Rent", amount: 1250, type: "outflow", category: "Housing", date: new Date().toISOString() },
      { id: "tx-q3", description: "Tuition Installment", amount: 800, type: "outflow", category: "Education", date: new Date().toISOString() },
      { id: "tx-q4", description: "DoorDash & Late Night Eats", amount: 420, type: "outflow", category: "Food", date: new Date().toISOString() },
      { id: "tx-q5", description: "Boba & Coffee Run", amount: 140, type: "outflow", category: "Food", date: new Date().toISOString() }
    ],
    goals: [
      { id: "gq-1", title: "Emergency Buffer", current_amount: 2800, target_amount: 5000, target_date: "2027-06-01T00:00:00Z" },
      { id: "gq-2", title: "First Quant Trading Portfolio", current_amount: 3400, target_amount: 10000, target_date: "2027-12-01T00:00:00Z" }
    ],
    subscriptions: [
      { id: "sq-1", name: "Metro Fitness Gym (Unused)", cost: 65.00, billing_cycle: "Monthly", next_billing_date: "2026-09-12T00:00:00Z", status: "cancelled" },
      { id: "sq-2", name: "Adobe Creative Cloud (Unused)", cost: 54.99, billing_cycle: "Monthly", next_billing_date: "2026-09-18T00:00:00Z", status: "cancelled" },
      { id: "sq-3", name: "Netflix Premium (Price Hiked)", cost: 22.99, billing_cycle: "Monthly", next_billing_date: "2026-09-04T00:00:00Z", status: "active" },
      { id: "sq-4", name: "Spotify Student", cost: 5.99, billing_cycle: "Monthly", next_billing_date: "2026-09-25T00:00:00Z", status: "active" }
    ]
  }
];


