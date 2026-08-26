"use client";

import React from "react";
import { useCountUp } from "../../lib/useCountUp";

interface RollingNumberProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function RollingNumber({
  end,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = ""
}: RollingNumberProps) {
  const { ref, value } = useCountUp(end, duration, decimals, prefix, suffix);

  return (
    <span ref={ref} className={className} style={{ transform: "translateZ(0)" }}>
      {value}
    </span>
  );
}
