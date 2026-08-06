"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface DisplaySlide {
  src: string;
  alt?: string;
  title?: string;
}

type TitleCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface ImageDisplayProps {
  slides: DisplaySlide[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  opacity?: number;
  duration?: number;
  autoplay?: boolean;
  autoplayDirection?: "leftToRight" | "rightToLeft";
  autoplayDelay?: number;
  showTitle?: boolean;
  titleColor?: string;
  titlePosition?: TitleCorner;
}

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

export default function ImageDisplay({
  slides,
  cardWidth = 400,
  cardHeight = 400,
  radius = 3,
  tilt = 12,
  sideTilt = 8,
  gap = 8,
  opacity = 60,
  duration = 0.6,
  autoplay = false,
  autoplayDirection = "rightToLeft",
  autoplayDelay = 2.5,
  showTitle = true,
  titleColor = "#ffffff",
  titlePosition = "bottomLeft",
}: ImageDisplayProps) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isTop = titlePosition === "topLeft" || titlePosition === "topRight";
  const isRight =
    titlePosition === "topRight" || titlePosition === "bottomRight";

  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  const step = useCallback(
    (dir: number) => {
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (!autoplay || n < 2 || isHovered || isDragging) return;
    const ms = Math.max(0.3, autoplayDelay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [
    autoplay,
    autoplayDirection,
    autoplayDelay,
    n,
    step,
    isHovered,
    isDragging,
  ]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    },
    [step],
  );

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -500) {
      step(1);
    } else if (offset > 50 || velocity > 500) {
      step(-1);
    }
  };

  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) *
    (Math.min(cardWidth, cardHeight) / 2);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  if (!n) return null;

  return (
    <div
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex min-h-[300px] sm:min-h-[360px] w-full min-w-[280px] sm:min-w-[320px] items-center justify-center overflow-hidden outline-none select-none touch-pan-y"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="relative flex items-center justify-center w-full max-w-[90vw] sm:max-w-none cursor-grab active:cursor-grabbing"
        style={{
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
        }}
      >
        <AnimatePresence initial={false}>
          {slides.map((slide, i) => {
            let rel = i - active;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;

            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
            const tx = rel * (gap * 20);
            const tz = -ax * DEPTH;
            const ry = -rel * tilt;
            const rz = rel * sideTilt;

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  x: tx,
                  z: tz,
                  rotateY: ry,
                  rotateZ: rz,
                  scale: sc,
                  opacity: visible ? 1 : 0,
                }}
                transition={{
                  duration: duration,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => {
                  if (!isDragging && !isActive) {
                    setActive(i);
                  }
                }}
                aria-label={slide.title}
                aria-hidden={!visible}
                className="absolute overflow-hidden bg-[#1a1a1a] will-change-transform max-w-[85vw] max-h-[60vh] sm:max-w-none sm:max-h-none"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: effectiveRadius,
                  transformStyle: "preserve-3d",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                {slide.src && (
                  <Image
                    src={slide.src}
                    alt={slide.alt || slide.title || ""}
                    fill
                    priority={isActive}
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 400px"
                    draggable={false}
                    className="object-cover pointer-events-none"
                  />
                )}

                {showTitle && slide.title && (
                  <>
                    <div
                      className={`pointer-events-none absolute inset-0 ${
                        isTop
                          ? "bg-gradient-to-b from-black/70 via-transparent to-transparent"
                          : "bg-gradient-to-t from-black/70 via-transparent to-transparent"
                      }`}
                    />

                    <div
                      className={`pointer-events-none absolute left-4 right-4 sm:left-[22px] sm:right-[22px] ${
                        isTop ? "top-4 sm:top-6" : "bottom-4 sm:bottom-6"
                      } ${isRight ? "text-right" : "text-left"}`}
                    >
                      <span
                        className="whitespace-pre-line text-xl sm:text-[28px] font-bold leading-[1.1em] tracking-[-0.02em]"
                        style={{
                          color: titleColor,
                          textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                        }}
                      >
                        {slide.title}
                      </span>
                    </div>
                  </>
                )}

                <motion.div
                  className="pointer-events-none absolute inset-0 bg-black"
                  animate={{ opacity: isActive ? 0 : dim }}
                  transition={{ duration: duration, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
