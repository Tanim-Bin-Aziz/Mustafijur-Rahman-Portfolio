"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";

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
  radius?: number; // 0-20 scale, boxy -> fully rounded
  tilt?: number; // Y-axis rotation per step
  sideTilt?: number; // Z-axis rotation per step
  gap?: number; // 0-20, spacing between cards
  opacity?: number; // 0-100, visibility of inactive cards
  duration?: number; // transition seconds
  autoplay?: boolean;
  autoplayDirection?: "leftToRight" | "rightToLeft";
  autoplayDelay?: number; // seconds each card holds
  showTitle?: boolean;
  titleColor?: string;
  titlePosition?: TitleCorner;
}

// Fixed internals
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

  const isTop = titlePosition === "topLeft" || titlePosition === "topRight";
  const isRight =
    titlePosition === "topRight" || titlePosition === "bottomRight";

  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  // Rapid click/key spam handle korar jonno lock — transition shesh na hoile input block
  const lockRef = useRef(false);
  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(
      () => {
        lockRef.current = false;
      },
      Math.max(50, duration * 1000),
    );
  }, [duration]);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock],
  );

  const handleCardClick = useCallback(
    (i: number) => {
      if (autoplay || lockRef.current) return;
      lock();
      setActive((a) => (i === a ? (a + 1) % n : i));
    },
    [autoplay, n, lock],
  );

  useEffect(() => {
    if (!autoplay || n < 2) return;
    const ms = Math.max(0.3, autoplayDelay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayDirection, autoplayDelay, n, step]);

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

  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) *
    (Math.min(cardWidth, cardHeight) / 2);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;
  const transitionCss = `transform ${duration}s cubic-bezier(0.22,1,0.36,1), opacity ${duration}s cubic-bezier(0.22,1,0.36,1)`;

  if (!n) return null;

  return (
    <div
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      className="relative flex min-h-[360px] w-full min-w-[320px] items-center justify-center overflow-hidden outline-none"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div
        className="relative"
        style={{
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
        }}
      >
        {slides.map((slide, i) => {
          let rel = i - active;
          if (rel > n / 2) rel -= n;
          if (rel < -n / 2) rel += n;

          const ax = Math.abs(rel);
          const visible = ax <= MAX_VISIBLE;
          const isActive = rel === 0;
          const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
          const tx = rel * (gap * 30);
          const tz = -ax * DEPTH;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;

          const cardStyle: CSSProperties = {
            width: cardWidth,
            height: cardHeight,
            borderRadius: effectiveRadius,
            transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
            transition: transitionCss,
            opacity: visible ? 1 : 0,
            pointerEvents: visible && !autoplay ? "auto" : "none",
          };

          return (
            <div
              key={i}
              onClick={() => handleCardClick(i)}
              aria-label={slide.title}
              aria-hidden={!visible}
              className={`absolute left-1/2 top-1/2 overflow-hidden bg-[#1a1a1a] [transform-style:preserve-3d] [transform-origin:center] ${
                autoplay || isActive ? "cursor-default" : "cursor-pointer"
              }`}
              style={cardStyle}
            >
              {slide.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt={slide.alt || slide.title || ""}
                  draggable={false}
                  className="absolute inset-0 block h-full w-full select-none object-cover"
                />
              )}

              {showTitle && slide.title && (
                <>
                  {/* Legibility gradient — corner onujayi direction */}
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isTop
                        ? "bg-gradient-to-b from-transparent via-transparent to-black/70"
                        : "bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    }`}
                  />

                  <div
                    className={`pointer-events-none absolute left-[22px] right-[22px] ${
                      isTop ? "top-6" : "bottom-6"
                    } ${isRight ? "text-right" : "text-left"}`}
                  >
                    <span
                      className="whitespace-pre-line text-[28px] font-bold leading-[1.1em] tracking-[-0.02em]"
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

              {/* Inactive card-ke dim kore dey */}
              <div
                className="pointer-events-none absolute inset-0 bg-black"
                style={{
                  opacity: isActive ? 0 : dim,
                  transition: `opacity ${duration}s cubic-bezier(0.22,1,0.36,1)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
