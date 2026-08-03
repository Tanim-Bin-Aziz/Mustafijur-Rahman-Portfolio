"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Presentation, Info } from "lucide-react";
import { SHOWCASE } from "@/data/showcase";
import GlassZoomModal from "./GlassZoomModal";
import { FadeUp, Tag } from "./Motion";

export default function GlassProjectShowcase() {
  const [activeId, setActiveId] = useState(SHOWCASE[0].id);
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const active = SHOWCASE.find((c) => c.id === activeId)!;

  const selectCategory = (id: string) => {
    setActiveId(id);
    setSlideIndex(0);
  };

  return (
    <section
      id="projects"
      className="relative py-28 px-6 bg-[#120F0E] overflow-hidden"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/4 w-96 h-96 bg-[#C89B6A]/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-[#3F2233]/20 rounded-full blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
        <FadeUp>
          <Tag>Selected Collections</Tag>
          <h2 className="font-serif font-black italic text-4xl md:text-6xl tracking-tight mb-16 max-w-2xl text-[#F4EEE3]">
            The <span className="text-[#C89B6A]">atelier archive.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          {/* sidebar */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {SHOWCASE.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCategory(c.id)}
                className={`relative shrink-0 text-left px-5 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  c.id === activeId
                    ? "bg-[#C89B6A]/15 border-[#C89B6A]/40 text-[#F4EEE3] shadow-[0_0_24px_rgba(200,155,106,0.15)]"
                    : "bg-white/[0.03] border-white/10 text-[#F4EEE3]/50 hover:bg-white/[0.06] hover:text-[#F4EEE3]/80"
                }`}
              >
                {c.label}
                {c.id === activeId && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-5 rounded-full bg-[#C89B6A]" />
                )}
              </button>
            ))}
          </div>

          {/* glass panel */}
          <div
            className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 overflow-hidden animate-panel-in"
            key={activeId}
          >
            <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-[#C89B6A]/10 rounded-full blur-3xl" />

            <h3 className="font-serif italic text-[#F4EEE3] text-2xl md:text-3xl mb-6 text-center md:text-left">
              {active.title}
            </h3>

            <div className="grid md:grid-cols-[1fr_260px] gap-6">
              {/* slider */}
              <button
                onClick={() => setModalOpen(true)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/20 cursor-zoom-in"
                aria-label="Open image viewer"
              >
                <div
                  key={slideIndex}
                  className="absolute inset-0 animate-slide-fade"
                >
                  <Image
                    src={active.images[slideIndex].src}
                    alt={active.images[slideIndex].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {active.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {active.images.map((_, i) => (
                      <span
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideIndex(i);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === slideIndex
                            ? "w-5 bg-[#C89B6A]"
                            : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>

              {/* text + actions */}
              <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#C89B6A] uppercase mb-3">
                  Text area
                </p>
                <ul className="flex-1 space-y-2 text-sm text-[#F4EEE3]/70 overflow-y-auto max-h-40 pr-1">
                  {active.details.map((d) => (
                    <li key={d} className="leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-4">
                  {active.pptxHref && (
                    <a
                      href={active.pptxHref}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[#F4EEE3]/70 hover:bg-[#C89B6A]/15 hover:border-[#C89B6A]/40 hover:text-[#F4EEE3] transition-colors"
                    >
                      <Presentation size={12} /> pptx
                    </a>
                  )}
                  {active.pdfHref && (
                    <a
                      href={active.pdfHref}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[#F4EEE3]/70 hover:bg-[#C89B6A]/15 hover:border-[#C89B6A]/40 hover:text-[#F4EEE3] transition-colors"
                    >
                      <FileText size={12} /> pdf
                    </a>
                  )}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[#F4EEE3]/70 hover:bg-[#C89B6A]/15 hover:border-[#C89B6A]/40 hover:text-[#F4EEE3] transition-colors"
                  >
                    <Info size={12} /> details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <GlassZoomModal
          category={active}
          startIndex={slideIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
