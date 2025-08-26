"use client";

import type { AnimatedNumberProps } from "@/features/home/types";
import { useEffect, useState } from "react";

export const AnimatedNumber = ({ value, suffix = "" }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;

    const duration = 2000; // 2秒动画
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
};
