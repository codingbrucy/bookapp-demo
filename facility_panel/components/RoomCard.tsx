"use client";

import { useState } from "react";
import type { Room } from "@/lib/types";
import BedGrid from "./BedGrid";

export default function RoomCard({ room }: { room: Room }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const occupiedCount = room.beds.filter((b) => b.occupied).length;
  const totalCount = room.beds.length;
  const pct = occupiedCount / totalCount;
  const isFull = pct === 1;
  const patients = room.beds
    .filter((b) => b.occupied && b.patientName)
    .map((b) => b.patientName!);

  return (
    <div
      className={`group relative rounded-2xl border cursor-pointer select-none transition-all duration-300 ${
        isExpanded
          ? "room-card-glow-active -translate-y-0.5"
          : "room-card-glow hover:-translate-y-1"
      }`}
      onClick={() => setIsExpanded((prev) => !prev)}
      style={{
        borderColor: isExpanded
          ? "color-mix(in srgb, var(--primary) 40%, transparent)"
          : "var(--card-border)",
        boxShadow: isExpanded
          ? undefined
          : undefined,
        ...(isExpanded
          ? { outline: "2px solid color-mix(in srgb, var(--primary) 10%, transparent)", outlineOffset: "-1px" }
          : {}),
      }}
    >
      {/* ── Left accent bar — slides down on hover, stays on expand ── */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full transition-transform duration-300 origin-top ${
          isExpanded ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
        }`}
        style={{ background: `linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary) 60%, transparent))` }}
      />

      {/* ── Subtle primary background wash ── */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--primary) 3%, transparent), color-mix(in srgb, var(--primary) 1%, transparent), transparent)" }}
      />

      {/* Card background */}
      <div className="absolute inset-0 rounded-2xl -z-10 transition-colors duration-500" style={{ backgroundColor: "var(--card-bg)" }} />

      {/* ── Header — always visible ── */}
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p
              className="room-number font-bold text-lg leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Room {room.id}
            </p>
            <p
              className="text-xs mt-0.5 transition-colors duration-300"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
            >
              {room.wing}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 ${
                isFull
                  ? "bg-red-50 text-red-500"
                  : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
              }`}
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {isFull ? "Full" : `${totalCount - occupiedCount} open`}
            </span>
            {/* Chevron */}
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              style={{ color: isExpanded ? "var(--primary)" : "var(--muted)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* ── Compact view (collapsed) ── */}
        {!isExpanded && (
          <>
            <div className="mb-3">
              <BedGrid beds={room.beds} mode="compact" />
            </div>

            {/* Capacity bar */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Occupancy
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {occupiedCount}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--subtle-bg)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct * 100}%`,
                    backgroundColor: isFull ? "#f87171" : "var(--primary)",
                  }}
                />
              </div>
            </div>

            {/* Patient names */}
            <div className="space-y-1.5">
              {patients.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)" }}
                  >
                    <span
                      className="text-[9px] font-black"
                      style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
                    >
                      {p
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                  >
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Expanded view — smooth CSS grid animation ── */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="relative px-4 pb-4 pt-3 border-t" style={{ borderColor: "var(--card-border)" }}>
            <BedGrid beds={room.beds} mode="detailed" />

            {/* Capacity bar */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Occupancy
                </span>
                <span
                  className="text-[10px] font-bold"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {occupiedCount}/{totalCount}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--subtle-bg)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct * 100}%`,
                    backgroundColor: isFull ? "#f87171" : "var(--primary)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
