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

            {/* Social Icons */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-6 flex justify-center gap-3 lg:justify-start"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F0EBE1]/10 bg-[#F0EBE1]/[0.03] text-[#8DB355] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#8DB355]/40 hover:text-[#8DB355]"
                >
                  <Icon size={16} />
                </a>
              ))}

              {/* WhatsApp (custom SVG, lucide-react e nai) */}
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F0EBE1]/10 bg-[#F0EBE1]/[0.03] text-[#8DB355] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#8DB355]/40 hover:text-[#8DB355]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 5l-1.4 5.12 5.24-1.37c1.46.8 3.1 1.22 4.75 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.14h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.37c0-4.53 3.69-8.22 8.24-8.22 2.2 0 4.27.86 5.82 2.42a8.15 8.15 0 0 1 2.41 5.81c0 4.54-3.69 8.22-8.23 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.24-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
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
          <source src="/video/hero.webm" type="video/webm" />
        </video>

        {/* Dark Overlay — desktop: side gradient, mobile: bottom-only */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `
linear-gradient(
90deg,
rgba(9,9,10,.96) 0%,
rgba(9,9,10,.90) 20%,
rgba(9,9,10,.72) 42%,
rgba(9,9,10,.38) 62%,
rgba(9,9,10,.12) 100%
)
`,
          }}
        />

        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg,#09090A 0%,rgba(9,9,10,.92) 28%,rgba(9,9,10,.45) 55%,rgba(9,9,10,.15) 100%)",
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
