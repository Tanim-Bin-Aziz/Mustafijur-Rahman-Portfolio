// components/Nav.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, User, ChevronDown, ChevronRight } from "lucide-react";

/* -----------------------------------------------------------
   Nav data — Home, Portfolio, About, Video, Contact.
   Portfolio, About, Video-er nijer nijer dropdown ache.
   Portfolio-r "Academic (Hons)" item-er nijer arekta
   nested submenu (flyout) ache.
----------------------------------------------------------- */
type SubLink = { label: string; href: string; items?: SubLink[] }; // items thakle nested flyout hobe
type NavItem = {
  label: string;
  href: string;
  items?: SubLink[]; // thakle eita dropdown hobe
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/#about",
    items: [
      { label: "Education", href: "/#education" },
      { label: "Experience", href: "/#experience" },
      { label: "Certification", href: "/#certification" },
      { label: "CV", href: "/#cv" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    items: [
      {
        label: "Academic (Hons)",
        href: "/portfolio/academic-hons",
        items: [
          { label: "Thesis Project", href: "/portfolio/academic-hons/thesis" },
          {
            label: "Research Paper",
            href: "/portfolio/academic-hons/research",
          },
          {
            label: "Coursework",
            href: "/portfolio/academic-hons/coursework",
          },
        ],
      },
      { label: "Professional", href: "/portfolio/professional" },
      { label: "Additional Work", href: "/portfolio/additional-work" },
      { label: "Gallery", href: "/portfolio/gallery" },
    ],
  },
  {
    label: "Video",
    href: "/#video",
    items: [
      { label: "Final Collection", href: "/video/final-collection" },
      { label: "Drapping Final Dress", href: "/video/drapping-final-dress" },
      { label: "Studio Collection", href: "/video/studio-collection" },
      { label: "Gallery", href: "/video/gallery" },
    ],
  },
  { label: "Contact", href: "/#contact" },
];

export default function Nav({ ready = true }: { ready?: boolean }) {
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const [desktopSubGroup, setDesktopSubGroup] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(
    null,
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopDropdown(label);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => {
      setDesktopDropdown(null);
      setDesktopSubGroup(null);
    }, 150);
  };

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      className={`fixed inset-x-0 top-0 z-50 h-20 border-b backdrop-blur-2xl
      transform-gpu will-change-[background-color,border-color]
      transition-[background-color,border-color]
      duration-300
      ${
        scrolled
          ? "bg-[#0d0d0cf2] border-cream/10"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <motion.a variants={itemVariants} href="#" className="leading-tight">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8DB355]">
            Creative Director
          </p>

          <h2 className="text-xl font-semibold text-cream">
            Mustafijur <em className=" text-[#8DB355]">Rahman</em>
          </h2>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.items && handleEnter(item.label)}
              onMouseLeave={() => item.items && handleLeave()}
            >
              <motion.a
                variants={itemVariants}
                href={item.href}
                className="group relative flex items-center gap-1 text-sm font-medium tracking-wide text-cream/50 transition-colors duration-300 hover:text-[#8DB355]"
              >
                {item.label}
                {item.items && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      desktopDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#8DB355] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </motion.a>

              {/* Dropdown */}
              {item.items && (
                <AnimatePresence>
                  {desktopDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-3 flex w-56 flex-col rounded-xl border border-cream/10 bg-[#0d0d0cf7] p-2 backdrop-blur-2xl shadow-xl"
                    >
                      {item.items.map((sub) =>
                        sub.items ? (
                          // Nested flyout item (jemon: Academic (Hons))
                          <div
                            key={sub.label}
                            className="relative"
                            onMouseEnter={() => setDesktopSubGroup(sub.label)}
                          >
                            <div className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm text-cream/70 transition-colors hover:bg-cream/5 hover:text-[#8DB355]">
                              {sub.label}
                              <ChevronRight size={14} />
                            </div>

                            <AnimatePresence>
                              {desktopSubGroup === sub.label && (
                                <motion.div
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-full top-0 ml-2 flex w-56 flex-col rounded-xl border border-cream/10 bg-[#0d0d0cf7] p-2 backdrop-blur-2xl shadow-xl"
                                >
                                  {sub.items.map((nested) => (
                                    <a
                                      key={nested.label}
                                      href={nested.href}
                                      className="rounded-lg px-3 py-2.5 text-sm text-cream/60 transition-colors hover:bg-cream/5 hover:text-[#8DB355]"
                                    >
                                      {nested.label}
                                    </a>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="rounded-lg px-3 py-2.5 text-sm text-cream/70 transition-colors hover:bg-cream/5 hover:text-[#8DB355]"
                          >
                            {sub.label}
                          </a>
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          variants={itemVariants}
          href="#contact"
          className="hidden items-center rounded-lg gap-2 bg-[#8DB355] px-5 py-2 text-sm font-semibold text-cream/80 transition-colors duration-300 hover:bg-[#8DB355]/80 md:inline-flex"
        >
          Login
          <User size={14} />
        </motion.a>

        {/* Mobile Toggle */}
        <motion.button
          variants={itemVariants}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="p-1 text-cream md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-cream/10 bg-[#0d0d0cf7] backdrop-blur-2xl md:hidden"
          >
            <div className="flex max-h-[70vh] flex-col overflow-y-auto px-6 py-5">
              {NAV_ITEMS.map((item) =>
                item.items ? (
                  <div
                    key={item.label}
                    className="border-b border-cream/5 last:border-0"
                  >
                    <button
                      onClick={() =>
                        setMobileExpanded((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                      className="flex w-full items-center justify-between py-3 text-base font-medium text-cream/60 transition-colors duration-300 hover:text-cream"
                    >
                      {item.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          mobileExpanded === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileExpanded === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-3 pb-2"
                        >
                          {item.items.map((sub) =>
                            sub.items ? (
                              // Nested accordion (jemon: Academic (Hons))
                              <div key={sub.label} className="mb-1">
                                <button
                                  onClick={() =>
                                    setMobileSubExpanded((prev) =>
                                      prev === sub.label ? null : sub.label,
                                    )
                                  }
                                  className="flex w-full items-center justify-between py-2 text-sm font-medium text-cream/50 hover:text-[#8DB355]"
                                >
                                  {sub.label}
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${
                                      mobileSubExpanded === sub.label
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {mobileSubExpanded === sub.label && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden pl-3"
                                    >
                                      {sub.items.map((nested) => (
                                        <a
                                          key={nested.label}
                                          href={nested.href}
                                          onClick={() => setOpen(false)}
                                          className="block py-2 text-sm text-cream/40 hover:text-[#8DB355]"
                                        >
                                          {nested.label}
                                        </a>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <a
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setOpen(false)}
                                className="block py-2 text-sm text-cream/50 hover:text-[#8DB355]"
                              >
                                {sub.label}
                              </a>
                            ),
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group relative border-b border-cream/5 py-3 text-base font-medium text-cream/60 transition-colors duration-300 last:border-0 hover:text-cream"
                  >
                    {item.label}
                  </a>
                ),
              )}

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-5 bg-gold py-3 text-center text-sm font-semibold text-bg transition-colors duration-300 hover:bg-gold-light"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
