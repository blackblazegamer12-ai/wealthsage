"use client";
import React from "react";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
}

/**
 * Tiny inline SVG sparkline — zero dependencies (no Recharts).
 * Renders last N data points as a smooth polyline with gradient fill.
 */
export default function SparklineChart({
  data,
  width = 120,
  height = 40,
  strokeColor,
  fillColor,
  className = "",
}: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  // Determine trend for auto-coloring
  const isUptrend = data[data.length - 1] >= data[0];
  const autoStroke = strokeColor || (isUptrend ? "#10B981" : "#EF4444");
  const autoFill = fillColor || (isUptrend ? "url(#sparkGreen)" : "url(#sparkRed)");

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");

  // Create fill polygon (close path to bottom)
  const firstX = padding;
  const lastX = padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2);
  const fillPoints = `${firstX},${height} ${polylinePoints} ${lastX},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Sparkline chart showing ${isUptrend ? "upward" : "downward"} trend`}
    >
      <defs>
        <linearGradient id="sparkGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sparkRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <polygon points={fillPoints} fill={autoFill} />

      {/* Line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={autoStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={parseFloat(points[points.length - 1].split(",")[0])}
        cy={parseFloat(points[points.length - 1].split(",")[1])}
        r="2.5"
        fill={autoStroke}
        style={{ filter: `drop-shadow(0 0 4px ${autoStroke})` }}
      />
    </svg>
  );
}
