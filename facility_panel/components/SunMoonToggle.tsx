"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function SunMoonToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-500 hover:bg-white/10"
    >
      <div
        className="w-8 h-8 relative transition-transform duration-700 ease-in-out"
        style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        {/* ── Sun — visible in light mode ── */}
        <svg
          viewBox="0 0 40 40"
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
          fill="none"
        >
          <g
            className={isDark ? "" : "sun-rays-spin"}
            style={{ transformOrigin: "20px 20px" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="20"
                y1="4"
                x2="20"
                y2="9"
                stroke="#F4A261"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${deg} 20 20)`}
              />
            ))}
          </g>
          <circle cx="20" cy="20" r="8" fill="#F4A261" />
        </svg>

        {/* ── Moon — visible in dark mode ── */}
        <svg
          viewBox="0 0 40 40"
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
          fill="none"
          style={{ transform: "rotate(180deg)" }}
        >
          {/*
            Crescent math:
            - Outer arc: r=12, from (20,8) to (20,32). Chord=24, r=12 → exact semicircle bulging LEFT.
            - Inner arc: r=16, from (20,32) to (20,8). Chord=24, r=16 → shallow arc bulging RIGHT.
            The larger inner radius makes a flatter cut, leaving a left-facing crescent.
          */}
          <path
            d="M20 8 A12 12 0 1 1 20 32 A16 16 0 0 0 20 8Z"
            fill="#F0E6D3"
          />
          {/* Stars */}
          <circle cx="9" cy="12" r="1.3" fill="#F0E6D3" opacity="0.9" />
          <circle cx="6" cy="22" r="0.9" fill="#F0E6D3" opacity="0.5" />
          <circle cx="11" cy="30" r="1.1" fill="#F0E6D3" opacity="0.7" />
        </svg>
      </div>
    </button>
  );
}
