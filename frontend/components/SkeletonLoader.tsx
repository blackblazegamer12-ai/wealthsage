"use client";
import React from "react";

type SkeletonVariant = "card" | "table-row" | "chart" | "text-block" | "hero-stat";

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`}
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4 border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
      <SkeletonPulse className="h-3 w-24" />
      <SkeletonPulse className="h-8 w-40" />
      <SkeletonPulse className="h-2 w-32" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "var(--card-bg)" }}>
      <SkeletonPulse className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-3 w-32" />
        <SkeletonPulse className="h-2 w-20" />
      </div>
      <SkeletonPulse className="h-4 w-16 shrink-0" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-6 border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
      <SkeletonPulse className="h-3 w-36 mb-6" />
      <div className="flex items-end gap-2 h-[180px]">
        {[40, 65, 50, 80, 70, 90, 55, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg animate-pulse bg-white/[0.04]"
            style={{ height: `${h}%`, border: '1px solid rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
    </div>
  );
}

function TextBlockSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-5/6" />
      <SkeletonPulse className="h-3 w-4/6" />
      <SkeletonPulse className="h-3 w-3/4" />
    </div>
  );
}

function HeroStatSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-6 border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--card-bg)" }}>
      <SkeletonPulse className="h-2 w-20 mb-3" />
      <SkeletonPulse className="h-7 w-32 mb-2" />
      <SkeletonPulse className="h-2 w-16" />
    </div>
  );
}

const VARIANT_MAP: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  "table-row": TableRowSkeleton,
  chart: ChartSkeleton,
  "text-block": TextBlockSkeleton,
  "hero-stat": HeroStatSkeleton,
};

export default function SkeletonLoader({
  variant = "card",
  count = 1,
  className = "",
}: SkeletonLoaderProps) {
  const Component = VARIANT_MAP[variant];
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
