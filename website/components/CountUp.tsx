"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    setDisplay(0);
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="num">
      {prefix}
      {display ?? value}
      {suffix}
    </span>
  );
}
