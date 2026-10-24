"use client";

import { ChevronDown, Github, Linkedin, Facebook } from "lucide-react";
import { motion, Variants } from "framer-motion";

const mono = { fontFamily: "'Courier New', monospace" };
const serif = { fontFamily: "'Georgia', serif" };

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

function Hero({
  ready = true,
  videoUrl = "/video/Background.webm",
}: {
  ready?: boolean;
  videoUrl?: string;
}) {
  return (
    <section className="relative mt-20 h-[calc(100vh-5rem)] max-h-[calc(100svh-5rem)] min-h-[24rem] w-full flex items-stretch overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(196,153,58,0.035) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* Center — text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6">
        <div className="relative w-full max-w-4xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            className="relative inline-block px-2 py-1"
          >
            {/* Soft fade behind the text only */}
            <motion.div
              variants={fadeVariants}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[150%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(9,9,10,0.72) 0%, rgba(9,9,10,0.5) 35%, rgba(9,9,10,0.25) 55%, rgba(9,9,10,0) 75%)",
              }}
            />
            <motion.div variants={lineVariants}>
              <h1
                className="font-black italic leading-[1.1] text-[#F0EBE1]"
                style={{
                  ...serif,
                  fontSize: "clamp(2rem, 9vw, 4.5rem)",
                }}
              >
                Welcome
              </h1>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Video — mobile e pura video dekha jay (contain), desktop ager moto cover */}
      <div className="absolute inset-0 overflow-hidden bg-[#09090A] md:bg-transparent">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/profile.jpg"
          className="absolute inset-0 h-full w-full object-contain object-center md:object-cover md:object-top md:scale-[1.05]"
        />

        {/* Light dark overlay for text visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(9, 9, 10, 0.32)",
          }}
        />

        {/* Mobile overlay */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,10,.65) 0%, rgba(9,9,10,.35) 45%, rgba(9,9,10,.2) 100%)",
          }}
        />

        {/* Mobile only — video-r opor/niche faka jaiga overlay diye cover + smooth blend */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/4 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, #09090A 0%, rgba(9,9,10,0.85) 40%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 md:hidden"
          style={{
            background:
              "linear-gradient(to top, #09090A 0%, rgba(9,9,10,0.85) 40%, transparent 100%)",
          }}
        />

        {/* Bottom Fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top,#09090A 0%,transparent 35%)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
        <span
          className="text-[9px] tracking-[0.38em] uppercase text-[#F0EBE1]/40"
          style={mono}
        >
          Scroll
        </span>

        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={15} className="text-[#F0EBE1]/40" />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
