"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-[999] bg-bg flex flex-col items-center justify-center gap-5"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-black italic text-cream tracking-tight font-serif"
      >
        Mustafijur <em className=" text-[#8DB355]">Rahman</em>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="w-40 h-px bg-[#8DB355] origin-center"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[9px] tracking-[0.45em] uppercase text-cream/50 font-mono"
      >
        Portfolio · 2026
      </motion.div>
    </motion.div>
  );
}
