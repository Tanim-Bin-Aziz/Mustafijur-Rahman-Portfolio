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

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const socialLinks = [
  { icon: Github, href: "https://github.com/yourusername", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
  },
  {
    icon: Facebook,
    href: "https://facebook.com/yourusername",
    label: "Facebook",
  },
];

function Hero({ ready = true }: { ready?: boolean }) {
  return (
    <section className="relative min-h-screen w-full flex items-stretch overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(196,153,58,0.035) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      {/* Left — text */}
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center px-8 md:px-16 lg:justify-start lg:px-24">
        <div className="max-w-[900px] text-center lg:text-left">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
          >
            <div className="flex items-center gap-3 mb-10" />

            <div className="mb-10">
              {/* Fashion + Digital */}
              <div className="overflow-hidden pb-2">
                <motion.div variants={lineVariants}>
                  <h1
                    className="font-black italic leading-[1.15]"
                    style={{
                      ...serif,
                      fontSize: "clamp(1.9rem,6vw,5.5rem)",
                    }}
                  >
                    <span className="whitespace-nowrap">
                      <span className="text-[#F0EBE1]">Elegance </span>
                      <span className="text-[#8DB355]">Meets</span>
                    </span>
                  </h1>
                </motion.div>
              </div>

              {/* Design */}
              <div className="mt-1 overflow-hidden pb-2">
                <motion.div variants={lineVariants}>
                  <h1
                    className="font-black italic leading-[1.15]"
                    style={{
                      ...serif,
                      fontSize: "clamp(1.9rem,6vw,5.5rem)",
                      color: "#F0EBE1",
                    }}
                  >
                    Creativity
                  </h1>
                </motion.div>
              </div>
            </div>

            <motion.p
              variants={fadeUpVariants}
              className="text-sm md:text-base text-[#F0EBE1]/40 leading-relaxed max-w-sm mb-10"
            >
              Creative Director & UI/UX Designer crafting immersive digital
              experiences for the world's most coveted fashion and luxury
              brands.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex justify-center gap-4 lg:justify-start"
            >
              <a
                href="#projects"
                className="group inline-flex h-11 w-42.5 bg-[#8DB355] items-center justify-center rounded-full px-5 text-xs font-bold text-cream shadow-[0_18px_45px_rgba(195,204,155,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(195,204,155,0.28)] sm:h-auto sm:w-auto sm:px-7 sm:py-3.5 sm:text-sm"
              >
                View Projects
                <span className="ml-1.5 transition duration-300 group-hover:translate-x-1 sm:ml-2">
                  →
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/4.5 px-5 py-3 text-xs font-bold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-(--accent)/45 hover:text-(--accent) sm:px-7 sm:py-3.5 sm:text-sm"
              >
                Contact Me
              </a>
            </motion.div>
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
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video/background.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay — left/text area-te thakbe, text porar jonno enough dark */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `
linear-gradient(
90deg,
rgba(9,9,10,.9) 0%,
rgba(9,9,10,.75) 15%,
rgba(9,9,10,.5) 30%,
rgba(9,9,10,.2) 42%,
rgba(9,9,10,0) 52%
)
`,
          }}
        />

        {/* Mobile overlay — dark wash covering text area top-to-bottom */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,10,.97) 0%, rgba(9,9,10,.9) 35%, rgba(9,9,10,.72) 60%, rgba(9,9,10,.45) 80%, rgba(9,9,10,.25) 100%)",
          }}
        />

        {/* Bottom Fade (both) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top,#09090A 0%,transparent 35%)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span
          className="text-[9px] tracking-[0.38em] uppercase text-[#F0EBE1]/22"
          style={mono}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={15} className="text-[#F0EBE1]/22" />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
