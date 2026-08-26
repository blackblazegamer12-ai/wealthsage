"use client";

import { useEffect, useState, useRef } from "react";
import { animate, useInView } from "framer-motion";

export function useCountUp(
  end: number,
  duration: number = 2,
  decimals: number = 0,
  prefix: string = "",
  suffix: string = ""
) {
  const [value, setValue] = useState<string>(
    `${prefix}${(0).toFixed(decimals)}${suffix}`
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, end, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => {
          // Add commas for thousands
          const formattedNumber = Number(latest.toFixed(decimals)).toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
          setValue(`${prefix}${formattedNumber}${suffix}`);
        },
      });

      return () => controls.stop();
    }
  }, [isInView, end, duration, decimals, prefix, suffix]);

  return { ref, value };
}
