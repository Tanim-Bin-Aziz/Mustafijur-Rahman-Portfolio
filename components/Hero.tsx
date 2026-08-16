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
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Hero({ ready = true }: { ready?: boolean }) {
  return (
    <section className="relative mt-20 h-[calc(100vh-5rem)] w-full flex items-stretch overflow-hidden">
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
      <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-6">
        <div className="text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
          >
            <div className="overflow-hidden pb-1">
              <motion.div variants={lineVariants}>
                <h1
                  className="font-black italic leading-[1.1]"
                  style={{
                    ...serif,
                    fontSize: "clamp(1rem, 3vw, 2.75rem)",
                  }}
                >
                  <span className="whitespace-nowrap">
                    <span className="text-[#F0EBE1]">Elegance </span>
                    <span className="text-[#8DB355]">Meets</span>
                  </span>
                </h1>
              </motion.div>
            </div>

            <div className="mt-0 overflow-hidden pb-1">
              <motion.div variants={lineVariants}>
                <h1
                  className="font-black italic leading-[1.1]"
                  style={{
                    ...serif,
                    fontSize: "clamp(1rem, 3vw, 2.75rem)",
                    color: "#F0EBE1",
                  }}
                >
                  Creativity
                </h1>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-top scale-[1.05] md:scale-[1.05]"
        >
          <source src="/video/Background.webm" type="video/webm" />
        </video>

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

        {/* Bottom Fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top,#09090A 0%,transparent 35%)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
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
