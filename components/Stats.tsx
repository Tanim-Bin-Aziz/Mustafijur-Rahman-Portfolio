"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCounter } from "./Motion";
import { STATS, BRANDS } from "@/data/portfolio";

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const n = useCounter(value, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="font-serif font-black  text-4xl md:text-5xl text-cream">
        {n}
        <span className="text-white p-2">{suffix}</span>
      </div>
      <div className="text-[11px] tracking-[0.2em] uppercase text-cream/40 mt-2 font-mono">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative py-20 border-y border-cream/[0.06]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-14 animate-[marquee_28s_linear_infinite] w-max">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="text-xl md:text-2xl font-serif italic text-cream/20 whitespace-nowrap"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
