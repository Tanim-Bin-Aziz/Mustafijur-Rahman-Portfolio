"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px w-8 bg-[#8db355]" />
      <span className="text-[10px] tracking-[0.35em] uppercase text-gold font-medium font-mono">
        {children}
      </span>
    </div>
  );
}

export function useCounter(end: number, go: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let t0: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 2000, 1);
      setN(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, go]);
  return n;
}
