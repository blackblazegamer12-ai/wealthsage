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
    badge: "High Surplus ($14.5k/mo)",
    roleDescription: "FAANG Engineering Lead with aggressive index compounding & diversified milestones.",
    icon: Rocket,
    transactions: [
      { id: "tx-1", name: "Staff Engineer Salary (Google)", amount: 14500, type: "income", category: "Salary" },
      { id: "tx-2", name: "Luxury Apartment Lease (SF)", amount: 3400, type: "expense", category: "Housing" },
      { id: "tx-3", name: "Vanguard S&P 500 Index SIP", amount: 4000, type: "expense", category: "Investments" },
      { id: "tx-4", name: "Whole Foods Organic Groceries", amount: 650, type: "expense", category: "Groceries" },
      { id: "tx-5", name: "Tesla Model S Auto Loan", amount: 890, type: "expense", category: "Transport" },
      { id: "tx-6", name: "Angel Syndicate Dividend", amount: 1200, type: "income", category: "Dividends" }
    ],
    goals: [
      { id: "g-1", name: "Pacific Heights Downpayment", current: 85000, target: 150000, color: "#8B5CF6", accent: "purple", icon: "🏛️" },
      { id: "g-2", name: "Early Retirement Index Pool", current: 240000, target: 500000, color: "#10B981", accent: "emerald", icon: "📈" },
      { id: "g-3", name: "Alpine Skiing Expedition", current: 7200, target: 10000, color: "#06B6D4", accent: "cyan", icon: "⛷️" }
    ],
    subscriptions: [
      { id: "s-1", name: "AWS Cloud Infrastructure", amount: 120.00, cycle: "Monthly", nextDate: "1st", icon: "☁️", color: "#F59E0B" },
      { id: "s-2", name: "Equinox Elite Gym", amount: 280.00, cycle: "Monthly", nextDate: "5th", icon: "🏋️", color: "#EF4444" },
      { id: "s-3", name: "Bloomberg Terminal Access", amount: 45.00, cycle: "Monthly", nextDate: "14th", icon: "📊", color: "#06B6D4" },
      { id: "s-4", name: "Spotify Family", amount: 16.99, cycle: "Monthly", nextDate: "28th", icon: "🎵", color: "#10B981" }
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

interface DemoPresetBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: DemoPreset) => void;
  onReset: () => void;
}

export default function DemoPresetBar({ activePresetId, onSelectPreset, onReset }: DemoPresetBarProps) {
  return (
    <div className="w-full bg-[#161824]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 mb-8 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
          <Sparkles size={15} />
        </span>
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">
            ⚡ Judge Quick-Demo Personas
          </h3>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Instantly load rich financial profiles to evaluate live telemetry, charts, and copilot reasoning.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {DEMO_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/40 scale-[1.03] border border-[#8B5CF6]"
                  : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
              title={preset.roleDescription}
            >
              <Icon size={14} />
              <span>{preset.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.03] hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-all"
          title="Reset to blank ledger for interactive typing test"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
