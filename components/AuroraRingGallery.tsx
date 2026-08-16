"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  WheelEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export interface RingItem {
  src: string;
  title: string;
  category: string; // jemon: "VILLAS", "LUXURY APARTMENTS"
  location: string; // jemon: "DUBAI", "MUMBAI"
}

interface AuroraRingGalleryProps {
  items: RingItem[];
  heading?: string;
  subheading?: string;
  rx?: number; // ellipse horizontal radius (px)
  ry?: number; // ellipse vertical radius (px) — chhoto hole beshi flat/wide dekhabe
  cardWidth?: number;
  cardHeight?: number;
  speed?: number; // degrees / second, continuous auto-rotate speed
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const round2 = (v: number) => Math.round(v * 100) / 100; // subpixel jitter kombe

export default function AuroraRingGallery({
  items,
  heading = "Showcase Gallery",
  subheading = "Explore 300+ curated luxury residences, commercial spaces, villas, and investment-ready developments.",
  rx = 620,
  ry = 190,
  cardWidth = 46,
  cardHeight = 92,
  speed = 2, // deg/sec
}: AuroraRingGalleryProps) {
  const n = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const angleRef = useRef(0); // current base rotation, degrees
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(false); // viewport-e na thakle loop e chalabe na
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dims, setDims] = useState({ rx, ry, cardWidth, cardHeight });

  // Responsive scale — chhoto screen-e ellipse/card chhoto hobe
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const factor = clamp(w / 1280, 0.42, 1);
      setDims({
        rx: rx * factor,
        ry: ry * factor,
        cardWidth: cardWidth * factor,
        cardHeight: cardHeight * factor,
      });
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [rx, ry, cardWidth, cardHeight]);

  // Section viewport-e ache kina track kora — na thakle animation loop e chalabe na
  // (onno section-e gele endless-loop CPU/GPU khoroch bondho hoye jabe)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) lastTsRef.current = null; // resume-e dt jump avoid
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Prottek card-er position ellipse-er upor bosano — 2D perspective illusion
  // (fan-tilt + depth scale diye), kono real 3D rotateY/preserve-3d nai.
  // translate3d + rounded value use kora hoise — GPU-accelerated, subpixel
  // flicker/glitch kombe.
  const applyPositions = useCallback(() => {
    const base = angleRef.current;
    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const theta = ((base + (360 / n) * i) * Math.PI) / 180;
      const x = round2(Math.cos(theta) * dims.rx);
      const y = round2(Math.sin(theta) * dims.ry);

      // depth: y = -ry (upore, dure) → 0, y = +ry (niche, kache) → 1
      const depth = clamp((y + dims.ry) / (dims.ry * 2), 0, 1);
      const scale = round2(lerp(0.55, 1.15, depth));
      const opacity = round2(lerp(0.45, 1, depth));
      const tilt = round2((x / dims.rx) * 14); // fan-tilt, left/right onujayi
      // zIndex shobshomoy 1-90 range-e rakha — lightbox (z-[9999]) er niche e thakbe
      const zIndex = 1 + Math.round(depth * 89);

      el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
    }
  }, [n, dims]);

  // Continuous rotation loop — direct DOM write, React re-render nai per frame.
  // Viewport-er baire gele ba tab hidden thakle loop pause thake.
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const loop = (ts: number) => {
      const active =
        !pausedRef.current &&
        !prefersReducedMotion &&
        inViewRef.current &&
        !document.hidden;

      if (active) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        let dt = (ts - lastTsRef.current) / 1000;
        // dt clamp — frame-drop / lag spike hole boro dt ashle rotation
        // hঠাৎ jump/glitch kore, tai max 50ms e cap kora holo
        dt = Math.min(dt, 0.05);
        lastTsRef.current = ts;
        angleRef.current = (angleRef.current + speed * dt) % 360;
        applyPositions();
      } else {
        lastTsRef.current = null; // pause-er por dt jump avoid korte
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, applyPositions]);

  // Tab minimize/switch korle-o extra safety (visibilitychange)
  useEffect(() => {
    const onVis = () => {
      lastTsRef.current = null;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // ---- Hover handling (robust) ----
  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleCardEnter = (i: number) => {
    clearLeaveTimer();
    setHoveredIndex(i);
    pausedRef.current = true;
  };

  const scheduleResume = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHoveredIndex(null);
      pausedRef.current = false;
      lastTsRef.current = null;
    }, 120);
  };

  const handlePopupEnter = () => clearLeaveTimer();

  const handleClick = (i: number) => {
    clearLeaveTimer();
    setHoveredIndex(null);
    pausedRef.current = true;
    setLightboxIndex(i);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    pausedRef.current = false;
    lastTsRef.current = null;
  };

  useEffect(() => clearLeaveTimer, []);

  if (!n) return null;
  const hovered = hoveredIndex !== null ? items[hoveredIndex] : null;
  const lightboxOpen = lightboxIndex !== null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 px-6 bg-[#f7f6f4]"
    >
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="font-black text-4xl md:text-6xl tracking-tight text-[#0B0908]">
          {heading}
        </h2>
        <p className="mt-4 text-[#0B0908]/60 text-base md:text-lg max-w-2xl mx-auto">
          {subheading}
        </p>
      </div>

      <div
        className="relative mx-auto"
        style={{
          height: dims.ry * 2 + dims.cardHeight * 1.4,
          maxWidth: dims.rx * 2 + dims.cardWidth * 2,
          visibility: lightboxOpen ? "hidden" : "visible",
          pointerEvents: lightboxOpen ? "none" : "auto",
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onMouseEnter={() => handleCardEnter(i)}
            onMouseLeave={scheduleResume}
            onClick={() => handleClick(i)}
            aria-label={item.title}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-[2px] shadow-md transition-opacity duration-200"
            style={{
              width: dims.cardWidth,
              height: dims.cardHeight,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="120px"
              className="object-cover pointer-events-none"
              loading="lazy"
            />
          </button>
        ))}

        {/* Hover korle ellipse-er moddhe (center e) popup card */}
        {hovered && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] flex flex-col items-center animate-fade-in">
            <div
              className="pointer-events-auto relative overflow-hidden rounded-lg shadow-2xl cursor-pointer"
              style={{ width: 260, height: 190 }}
              onMouseEnter={handlePopupEnter}
              onMouseLeave={scheduleResume}
              onClick={() => handleClick(hoveredIndex!)}
            >
              <Image
                src={hovered.src}
                alt={hovered.title}
                fill
                sizes="260px"
                className="object-cover"
                priority
              />
            </div>
            <div className="pointer-events-none mt-3 text-center">
              <p className="font-bold text-[#0B0908] text-lg">
                {hovered.title}
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#0B0908]/50 uppercase mt-1">
                {hovered.category} · {hovered.location}
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#8DB355] uppercase mt-2">
                Click to enlarge +
              </p>
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <RingLightbox
          items={items}
          index={lightboxIndex!}
          onClose={handleCloseLightbox}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </section>
  );
}

/* ---------------------------------------------------------
   Fullscreen lightbox — free zoom in/out + pan (wheel, buttons, drag)
--------------------------------------------------------- */
function RingLightbox({
  items,
  index,
  onClose,
  onChangeIndex,
}: {
  items: RingItem[];
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
}) {
  const item = items[index];

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const clampScale = (s: number) => Math.min(5, Math.max(1, s));

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // Image change korle zoom reset
  useEffect(() => {
    resetZoom();
  }, [index]);

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => {
      const next = clampScale(+(prev + delta).toFixed(2));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleZoomIn = () => setScale((s) => clampScale(+(s + 0.4).toFixed(2)));
  const handleZoomOut = () =>
    setScale((s) => {
      const next = clampScale(+(s - 0.4).toFixed(2));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };
  const stopDragging = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onChangeIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onChangeIndex]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0B0908]/95 backdrop-blur-md flex flex-col animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} viewer`}
    >
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-6">
          <span className="font-black tracking-tight text-[#F4EEE3]">
            Showcase <span className="text-[#8DB355]">Gallery</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom toolbar */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-xl p-1">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-mono text-[#8DB355] px-1 min-w-[42px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={resetZoom}
              title="Reset zoom"
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition border-l border-white/10 ml-1 pl-2"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-[#F4EEE3]/70 hover:text-[#8DB355] rounded-full hover:bg-white/5"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <div
        className={`relative flex-1 flex items-center justify-center px-4 pb-6 overflow-hidden select-none ${
          scale > 1
            ? isDragging.current
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <div
          className="relative w-full max-w-4xl aspect-[16/10] rounded-md overflow-hidden shadow-2xl"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: isDragging.current
              ? "none"
              : "transform 0.15s ease-out",
          }}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 90vw, 900px"
            className="object-cover pointer-events-none"
            draggable={false}
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-3">
            <span className="font-mono text-xs tracking-[0.2em] text-[#F4EEE3]/80 uppercase">
              {item.title} · {item.category} · {item.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
