"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { ShowcaseCategory } from "@/data/showcase";

interface Props {
  category: ShowcaseCategory;
  startIndex: number;
  onClose: () => void;
}

export default function GlassZoomModal({
  category,
  startIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
      setIndex(
        (i) => (i + dir + category.images.length) % category.images.length,
      );
    },
    [category.images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, go]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomed) {
      setZoomed(false);
      setPan({ x: 0, y: 0 });
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
    setZoomed(true);
  };

  const onDragStart = (e: React.MouseEvent) => {
    if (!zoomed) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };
  const onDragMove = (e: React.MouseEvent) => {
    if (!zoomed || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  };
  const onDragEnd = () => (dragRef.current = null);

  const img = category.images[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-glass-fade"
      role="dialog"
      aria-modal="true"
      aria-label={`${category.title} viewer`}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-[#0B0908]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* glass shell */}
      <div className="relative w-full max-w-4xl animate-glass-scale rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-[#C89B6A]/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-[#3F2233]/30 rounded-full blur-3xl" />

        {/* header */}
        <div className="relative flex items-center justify-between px-5 md:px-8 pt-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#C89B6A] uppercase">
              {category.label}
            </p>
            <h3 className="font-serif italic text-[#F4EEE3] text-2xl md:text-3xl">
              {category.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                zoomed ? (setZoomed(false), setPan({ x: 0, y: 0 })) : null
              }
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
              className="text-[#F4EEE3]/60 hover:text-[#C89B6A] transition-colors p-2 rounded-full hover:bg-white/5"
            >
              {zoomed ? (
                <ZoomOut size={18} />
              ) : (
                <ZoomIn size={18} className="opacity-40" />
              )}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[#F4EEE3]/60 hover:text-[#C89B6A] transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* image stage */}
        <div className="relative px-5 md:px-8 pt-5 pb-3">
          <div
            ref={frameRef}
            onClick={handleImageClick}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            className={`relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${
              zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
          >
            <div
              key={index}
              className="absolute inset-0 animate-slide-fade transition-transform duration-300 ease-out"
              style={{
                transform: zoomed
                  ? `scale(2.2) translate(${pan.x / 2.2}px, ${pan.y / 2.2}px)`
                  : "scale(1)",
                transformOrigin: origin,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="70vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>

          {!zoomed && category.images.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-8 top-1/2 -translate-y-1/2 text-[#F4EEE3]/70 hover:text-[#C89B6A] bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-8 top-1/2 -translate-y-1/2 text-[#F4EEE3]/70 hover:text-[#C89B6A] bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* dots + details */}
        <div className="relative px-5 md:px-8 pb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            {category.images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setZoomed(false);
                  setPan({ x: 0, y: 0 });
                  setIndex(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-[#C89B6A]"
                    : "w-1.5 bg-[#F4EEE3]/25 hover:bg-[#F4EEE3]/50"
                }`}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#F4EEE3]/50 font-mono">
            {category.details.slice(0, 3).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
