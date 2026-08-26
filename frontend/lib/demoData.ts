"use client";
import React from "react";
import { Sparkles, Terminal, Rocket, Briefcase, GraduationCap, RotateCcw } from "lucide-react";

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  roleDescription: string;
  icon: any;
  transactions: any[];
  goals: any[];
  subscriptions: any[];
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "tech-lead",
    name: "Tech Architect",
    badge: "High Surplus (₹1.4L/mo)",
    roleDescription: "Engineering Lead with aggressive index compounding & diversified milestones.",
    icon: Rocket,
    transactions: [
      { id: "tx-1", name: "Staff Engineer Salary", amount: 250000, type: "income", category: "Salary" },
      { id: "tx-2", name: "Luxury Apartment Rent (HSR)", amount: 45000, type: "expense", category: "Housing" },
      { id: "tx-3", name: "Nifty 50 Index SIP", amount: 40000, type: "expense", category: "Investments" },
      { id: "tx-4", name: "Swiggy Instamart Groceries", amount: 8500, type: "expense", category: "Groceries" },
      { id: "tx-5", name: "Mahindra XUV Auto Loan", amount: 15890, type: "expense", category: "Transport" },
      { id: "tx-6", name: "Angel Syndicate Dividend", amount: 12000, type: "income", category: "Dividends" }
    ],
    goals: [
      { id: "g-1", name: "Indiranagar Downpayment", current: 1500000, target: 5000000, color: "#8B5CF6", accent: "purple", icon: "🏛️" },
      { id: "g-2", name: "Early Retirement Corpus", current: 4500000, target: 10000000, color: "#10B981", accent: "emerald", icon: "📈" },
      { id: "g-3", name: "Himalayan Expedition", current: 45000, target: 150000, color: "#06B6D4", accent: "cyan", icon: "⛷️" }
    ],
    subscriptions: [
      { id: "s-1", name: "AWS Cloud Infrastructure", amount: 2500, cycle: "Monthly", nextDate: "1st", icon: "☁️", color: "#F59E0B" },
      { id: "s-2", name: "Cult.fit Elite", amount: 1499, cycle: "Monthly", nextDate: "5th", icon: "🏋️", color: "#EF4444" },
      { id: "s-3", name: "Zerodha Sensibull", amount: 800, cycle: "Monthly", nextDate: "14th", icon: "📊", color: "#06B6D4" },
      { id: "s-4", name: "Spotify Family", amount: 179, cycle: "Monthly", nextDate: "28th", icon: "🎵", color: "#10B981" }
    ]
  },
  {
    id: "founder",
    name: "Startup Founder",
    badge: "Variable Flow ($9.8k/mo)",
    roleDescription: "Bootstrapped SaaS Founder managing runway, cloud spend, and emergency buffers.",
    icon: Briefcase,
    transactions: [
      { id: "tx-f1", name: "SaaS Enterprise Subscriptions", amount: 9800, type: "income", category: "Business" },
      { id: "tx-f2", name: "WeWork Dedicated Desk", amount: 650, type: "expense", category: "Office" },
      { id: "tx-f3", name: "OpenAI API & Anthropic Compute", amount: 850, type: "expense", category: "Software" },
      { id: "tx-f4", name: "Tax Reserve Set-Aside", amount: 2400, type: "expense", category: "Taxes" },
      { id: "tx-f5", name: "Apartment Rent", amount: 2100, type: "expense", category: "Housing" }
    ],
    goals: [
      { id: "gf-1", name: "12-Month Business Runway", current: 45000, target: 75000, color: "#06B6D4", accent: "cyan", icon: "🛡️" },
      { id: "gf-2", name: "Series-A Legal Retainer", current: 14000, target: 25000, color: "#8B5CF6", accent: "purple", icon: "⚖️" }
    ],
    subscriptions: [
      { id: "sf-1", name: "Vercel Enterprise", amount: 40.00, cycle: "Monthly", nextDate: "2nd", icon: "▲", color: "#F8FAFC" },
      { id: "sf-2", name: "Figma Organization", amount: 45.00, cycle: "Monthly", nextDate: "10th", icon: "🎨", color: "#8B5CF6" },
      { id: "sf-3", name: "Notion AI Team", amount: 30.00, cycle: "Monthly", nextDate: "19th", icon: "📝", color: "#10B981" }
    ]
  },
  {
    id: "student-quant",
    name: "Gen-Z Quant",
    badge: "Zombie Sub Demo Ready",
    roleDescription: "Student & junior researcher with unused subscriptions and high optimization potential.",
    icon: GraduationCap,
    transactions: [
      { id: "tx-q1", name: "Research Stipend / Fellowship", amount: 3800, type: "income", category: "Stipend" },
      { id: "tx-q2", name: "Campus Studio Rent", amount: 1250, type: "expense", category: "Housing" },
      { id: "tx-q3", name: "Tuition Installment", amount: 800, type: "expense", category: "Education" },
      { id: "tx-q4", name: "DoorDash & Late Night Eats", amount: 420, type: "expense", category: "Food" },
      { id: "tx-q5", name: "Boba & Coffee Run", amount: 140, type: "expense", category: "Food" }
    ],
    goals: [
      { id: "gq-1", name: "Emergency Buffer", current: 2800, target: 5000, color: "#10B981", accent: "emerald", icon: "🛡️" },
      { id: "gq-2", name: "First Quant Trading Portfolio", current: 3400, target: 10000, color: "#8B5CF6", accent: "purple", icon: "⚡" }
    ],
    subscriptions: [
      { id: "sq-1", name: "Metro Fitness Gym (Unused)", amount: 65.00, cycle: "Monthly", nextDate: "12th", icon: "🏋️", color: "#EF4444" },
      { id: "sq-2", name: "Adobe Creative Cloud (Unused)", amount: 54.99, cycle: "Monthly", nextDate: "18th", icon: "🎨", color: "#EF4444" },
      { id: "sq-3", name: "Netflix Premium (Price Hiked)", amount: 22.99, cycle: "Monthly", nextDate: "4th", icon: "🎬", color: "#F59E0B" },
      { id: "sq-4", name: "Spotify Student", amount: 5.99, cycle: "Monthly", nextDate: "25th", icon: "🎵", color: "#10B981" }
    ]
  }
];


