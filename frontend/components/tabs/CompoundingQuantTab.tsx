"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Calculator, BookOpen } from "lucide-react";
import SimulatorTab from "./SimulatorTab";
import TaxEngineTab from "./TaxEngineTab";
import NotebookTab from "./NotebookTab";

interface CompoundingQuantTabProps {
  notes: any[];
  activeNote: any;
  setActiveNote: (note: any) => void;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteContent: string;
  setNoteContent: (content: string) => void;
  onCreateNewNote: () => void;
  onSaveNote: () => void;
  onAskTutor: () => void;
  isTutorThinking: boolean;
}

type SubTabType = "simulator" | "tax" | "notebook";

export default function CompoundingQuantTab(props: CompoundingQuantTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("simulator");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1 block">
            Wealth Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Compounding & Quant
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Simulate forward-looking trajectories, optimize taxes, and run quant formulas.
          </p>
        </div>
      </div>

      {/* Sub-navigation Segmented Control */}
      <div className="inline-flex p-1 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
        {[
          { id: "simulator", label: "Growth Simulator", icon: Zap },
          { id: "tax", label: "Tax Engine", icon: Calculator },
          { id: "notebook", label: "Quant Notebook", icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as SubTabType)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-white/[0.08] text-white shadow-sm border border-white/10"
                  : "text-[var(--text-dim)] hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[var(--accent)]" : ""} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {activeSubTab === "simulator" && <SimulatorTab />}
        {activeSubTab === "tax" && <TaxEngineTab />}
        {activeSubTab === "notebook" && <NotebookTab {...props} />}
      </div>
    </motion.div>
  );
}
