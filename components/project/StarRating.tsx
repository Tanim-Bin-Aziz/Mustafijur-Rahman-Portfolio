"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
  size = 18,
  className = "",
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === "function";
  const filled = hovered || value;

  const star = (n: number, active: boolean) => (
    <Star
      size={size}
      className={active ? "text-[#C89B6A]" : "text-[#F4EEE3]/20"}
      fill={active ? "currentColor" : "none"}
      strokeWidth={1.5}
    />
  );

  if (!interactive) {
    return (
      <div
        className={`flex items-center gap-1 ${className}`}
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{star(n, n <= value)}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          className="p-0.5 transition-transform duration-150 hover:scale-110"
        >
          {star(n, n <= filled)}
        </button>
      ))}
    </div>
  );
}
