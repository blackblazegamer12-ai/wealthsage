"use client";
import React from "react";
import TaxOptimizer from "../TaxOptimizer";
import TaxLossHarvesting from "../TaxLossHarvesting";

export default function TaxEngineTab() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
        <TaxOptimizer />
      </div>
      <div className="p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
        <TaxLossHarvesting />
      </div>
    </div>
  );
}
