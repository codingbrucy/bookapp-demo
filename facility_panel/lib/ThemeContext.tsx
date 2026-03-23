"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ── Color helpers ── */

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  h /= 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function darken(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - amount));
}

function lighten(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(1, l + amount));
}

/* ── Types ── */

type ModeColors = {
  primary: string;
  accent: string;
};

type ThemeContextValue = {
  isDark: boolean;
  toggle: () => void;
  lightColors: ModeColors;
  darkColors: ModeColors;
  setLightColors: (c: Partial<ModeColors>) => void;
  setDarkColors: (c: Partial<ModeColors>) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const LIGHT_DEFAULTS: ModeColors = { primary: "#0D7377", accent: "#F4A261" };
const DARK_DEFAULTS: ModeColors = { primary: "#38BDF8", accent: "#A78BFA" };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ── Derive all CSS variables from primary + accent ── */

function applyColors(isDark: boolean, colors: ModeColors) {
  const root = document.documentElement;
  const { primary, accent } = colors;
  const primaryHover = darken(primary, 0.08);

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-hover", primaryHover);
  root.style.setProperty("--accent", accent);

  if (isDark) {
    root.style.setProperty("--navbar-bg", darken(primary, 0.35));
    root.style.setProperty("--navbar-text-secondary", lighten(primary, 0.15));
  } else {
    root.style.setProperty("--navbar-bg", primary);
    root.style.setProperty("--navbar-text-secondary", lighten(primary, 0.3));
  }
}

/* ── Provider ── */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [lightColors, setLightColorsState] = useState<ModeColors>(LIGHT_DEFAULTS);
  const [darkColors, setDarkColorsState] = useState<ModeColors>(DARK_DEFAULTS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync .dark class + apply colors whenever mode or colors change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    applyColors(isDark, isDark ? darkColors : lightColors);
  }, [isDark, lightColors, darkColors]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  const setLightColors = useCallback(
    (c: Partial<ModeColors>) =>
      setLightColorsState((prev) => ({ ...prev, ...c })),
    [],
  );
  const setDarkColors = useCallback(
    (c: Partial<ModeColors>) =>
      setDarkColorsState((prev) => ({ ...prev, ...c })),
    [],
  );

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggle,
        lightColors,
        darkColors,
        setLightColors,
        setDarkColors,
        settingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
