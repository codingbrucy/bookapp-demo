"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFacilityContext } from "@/lib/FacilityContext";
import { useTheme } from "@/lib/ThemeContext";
import SunMoonToggle from "./SunMoonToggle";
import SettingsPanel from "./SettingsPanel";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Intakes", href: "/intakes" },
  { label: "Patients", href: "#" },
  { label: "Rooms", href: "#" },
  { label: "Reports", href: "#" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { rooms } = useFacilityContext();
  const { openSettings } = useTheme();

  const activePatients = rooms.flatMap((r) => r.beds).filter((b) => b.occupied).length;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="px-6 lg:px-10 py-4 flex items-center justify-between shadow-lg transition-colors duration-500" style={{ backgroundColor: "var(--navbar-bg)" }}>
      {/* Logo + facility name */}
      <Link href="/" className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 transition-colors duration-500" style={{ backgroundColor: "var(--accent)" }}>
          <span
            className="text-white font-black text-sm"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            cU
          </span>
        </div>
        <div>
          <h1
            className="text-white text-lg font-semibold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sunrise Recovery Center
          </h1>
          <p
            className="text-xs transition-colors duration-500"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--navbar-text-secondary)" }}
          >
            Facility Management Portal
          </p>
        </div>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`text-sm font-semibold transition-colors ${
              isActive(href)
                ? "text-white border-b-2 pb-0.5"
                : "hover:text-white transition-colors duration-500"
            }`}
            style={{
              fontFamily: "var(--font-nunito)",
              ...(isActive(href)
                ? { borderColor: "var(--accent)" }
                : { color: "var(--navbar-text-secondary)" }),
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right: badge + avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors duration-500" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)", borderWidth: "1px", borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse block transition-colors duration-500" style={{ backgroundColor: "var(--accent)" }} />
          <span
            className="text-sm font-bold transition-colors duration-500"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--accent)" }}
          >
            {activePatients} Active Patients
          </span>
        </div>
        <SunMoonToggle />
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-colors duration-500" style={{ background: "linear-gradient(to bottom right, var(--accent), color-mix(in srgb, var(--accent) 80%, #000))" }}>
            <span
              className="text-white font-bold text-sm"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              SM
            </span>
          </div>
          <div className="hidden lg:block">
            <p
              className="text-white text-sm font-bold leading-tight"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Dr. Sarah M.
            </p>
            <p
              className="text-xs transition-colors duration-500"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--navbar-text-secondary)" }}
            >
              Medical Director
            </p>
          </div>
        </div>
        {/* Settings gear */}
        <button
          onClick={openSettings}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Open settings"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--navbar-text-secondary)" }}
          >
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
      <SettingsPanel />
    </nav>
  );
}
