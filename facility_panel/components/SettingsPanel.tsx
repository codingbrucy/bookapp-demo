"use client";

import { useTheme } from "@/lib/ThemeContext";

const PRESETS = {
  primary: [
    { label: "Teal", light: "#0D7377", dark: "#38BDF8" },
    { label: "Indigo", light: "#4F46E5", dark: "#818CF8" },
    { label: "Rose", light: "#E11D48", dark: "#FB7185" },
    { label: "Emerald", light: "#059669", dark: "#34D399" },
    { label: "Violet", light: "#7C3AED", dark: "#A78BFA" },
    { label: "Slate", light: "#475569", dark: "#94A3B8" },
  ],
  accent: [
    { label: "Amber", light: "#F4A261", dark: "#A78BFA" },
    { label: "Pink", light: "#EC4899", dark: "#F472B6" },
    { label: "Cyan", light: "#06B6D4", dark: "#22D3EE" },
    { label: "Lime", light: "#84CC16", dark: "#BEF264" },
    { label: "Orange", light: "#EA580C", dark: "#FB923C" },
    { label: "Fuchsia", light: "#C026D3", dark: "#E879F9" },
  ],
};

function SunIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="20" y1="5" x2="20" y2="9"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
      </g>
      <circle cx="20" cy="20" r="7" fill="currentColor" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
      <path
        d="M20 8 A12 12 0 1 1 20 32 A16 16 0 0 0 20 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  presets: { color: string; label: string }[];
}) {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-wider mb-2"
        style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
      >
        {label}
      </p>
      <div className="flex items-center gap-2">
        {/* Native color input */}
        <label
          className="relative w-9 h-9 rounded-xl overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-colors"
          style={{ borderColor: "var(--card-border)" }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </label>
        {/* Preset swatches */}
        <div className="flex gap-1.5 flex-wrap">
          {presets.map((p) => (
            <button
              key={p.label}
              title={p.label}
              onClick={() => onChange(p.color)}
              className="w-7 h-7 rounded-lg transition-all hover:scale-110"
              style={{
                backgroundColor: p.color,
                outline: value === p.color ? "2px solid var(--foreground)" : "none",
                outlineOffset: "1px",
              }}
            />
          ))}
        </div>
      </div>
      {/* Hex display */}
      <p
        className="text-[10px] font-mono mt-1.5"
        style={{ color: "var(--muted)" }}
      >
        {value.toUpperCase()}
      </p>
    </div>
  );
}

export default function SettingsPanel() {
  const {
    isDark,
    toggle,
    lightColors,
    darkColors,
    setLightColors,
    setDarkColors,
    settingsOpen,
    closeSettings,
  } = useTheme();

  if (!settingsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={closeSettings}
      />

      {/* Panel — slides from right */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm shadow-2xl overflow-y-auto transition-colors duration-500"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div>
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--foreground)" }}
            >
              Settings
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
            >
              Customize your theme
            </p>
          </div>
          <button
            onClick={closeSettings}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
            style={{ backgroundColor: "var(--subtle-bg)", color: "var(--muted)" }}
          >
            ✕
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--card-border)" }}>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
          >
            Appearance
          </p>
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ backgroundColor: "var(--subtle-bg)" }}
          >
            <button
              onClick={() => { if (isDark) toggle(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                fontFamily: "var(--font-nunito)",
                backgroundColor: !isDark ? "var(--card-bg)" : "transparent",
                color: !isDark ? "var(--foreground)" : "var(--muted)",
                boxShadow: !isDark ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <span style={{ color: "#F4A261" }}><SunIcon /></span>
              Light
            </button>
            <button
              onClick={() => { if (!isDark) toggle(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                fontFamily: "var(--font-nunito)",
                backgroundColor: isDark ? "var(--card-bg)" : "transparent",
                color: isDark ? "var(--foreground)" : "var(--muted)",
                boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <span style={{ color: "#93C5FD" }}><MoonIcon /></span>
              Dark
            </button>
          </div>
        </div>

        {/* Light mode colors */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: "#F4A261" }}><SunIcon /></span>
            <p
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
            >
              Light Mode Colors
            </p>
          </div>
          <div className="space-y-4">
            <ColorPicker
              label="Primary"
              value={lightColors.primary}
              onChange={(c) => setLightColors({ primary: c })}
              presets={PRESETS.primary.map((p) => ({ color: p.light, label: p.label }))}
            />
            <ColorPicker
              label="Secondary"
              value={lightColors.accent}
              onChange={(c) => setLightColors({ accent: c })}
              presets={PRESETS.accent.map((p) => ({ color: p.light, label: p.label }))}
            />
          </div>
        </div>

        {/* Dark mode colors */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: "#93C5FD" }}><MoonIcon /></span>
            <p
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
            >
              Dark Mode Colors
            </p>
          </div>
          <div className="space-y-4">
            <ColorPicker
              label="Primary"
              value={darkColors.primary}
              onChange={(c) => setDarkColors({ primary: c })}
              presets={PRESETS.primary.map((p) => ({ color: p.dark, label: p.label }))}
            />
            <ColorPicker
              label="Secondary"
              value={darkColors.accent}
              onChange={(c) => setDarkColors({ accent: c })}
              presets={PRESETS.accent.map((p) => ({ color: p.dark, label: p.label }))}
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="px-6 py-5">
          <p
            className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
          >
            Preview
          </p>
          <div
            className="rounded-xl p-4 border"
            style={{ backgroundColor: "var(--subtle-bg)", borderColor: "var(--card-border)" }}
          >
            <div className="flex gap-3 items-center mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "var(--primary)", fontFamily: "var(--font-nunito)" }}
              >
                Aa
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-nunito)" }}
              >
                Aa
              </div>
              <div className="flex-1">
                <div
                  className="h-2 rounded-full mb-1.5"
                  style={{ backgroundColor: "var(--primary)", width: "70%" }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: "var(--accent)", width: "45%" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 text-white text-xs font-bold py-2 rounded-lg"
                style={{ backgroundColor: "var(--primary)", fontFamily: "var(--font-nunito)" }}
              >
                Primary
              </button>
              <button
                className="flex-1 text-white text-xs font-bold py-2 rounded-lg"
                style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-nunito)" }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
