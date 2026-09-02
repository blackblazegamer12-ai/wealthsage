"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Radar, CreditCard, Smartphone } from "lucide-react";
import { useWealthStore } from "../../lib/store";
import GuardianShieldScore from "../GuardianShieldScore";
import LiveRadarTab from "./LiveRadarTab";
import SubscriptionTrapsTab from "./SubscriptionTrapsTab";
import UPICircleTab from "./UPICircleTab";

const SUB_TABS = [
  { id: "radar", label: "Live Radar", icon: Radar },
  { id: "subscriptions", label: "Subscription Traps", icon: CreditCard },
  { id: "upicircle", label: "UPI Circle", icon: Smartphone },
] as const;

type GuardianSubTab = (typeof SUB_TABS)[number]["id"];

export default function GuardianShieldTab() {
  const [activeSubTab, setActiveSubTab] = useState<GuardianSubTab>("radar");
  const transactions = useWealthStore(state => state.getActiveTransactions());
  const upiMandates = useWealthStore(state => state.upiMandates);
  const paymentRequests = useWealthStore(state => state.paymentRequests);

  return (
    <div className="space-y-6">
      {/* Guardian Shield Score */}
      <GuardianShieldScore
        transactions={transactions}
        upiMandates={upiMandates}
        paymentRequests={paymentRequests}
      />

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-2xl border" style={{ backgroundColor: "var(--surface-overlay)", borderColor: "var(--border-subtle)" }}>
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all z-10 ${
                isActive ? "text-black shadow-lg" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="guardian-subtab-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSubTab === "radar" && <LiveRadarTab />}
        {activeSubTab === "subscriptions" && <SubscriptionTrapsTab />}
        {activeSubTab === "upicircle" && <UPICircleTab />}
      </motion.div>
    </div>
  );
}
