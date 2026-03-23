"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFacilityContext } from "@/lib/FacilityContext";
import RoomCard from "@/components/RoomCard";

function StatCard({
  label,
  value,
  sub,
  variant,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  variant: "teal" | "white" | "amber" | "warm";
  icon: ReactNode;
}) {
  const styles = {
    teal: {
      wrap: "transition-colors duration-500",
      wrapStyle: { backgroundColor: "var(--primary)" },
      label: "text-teal-200",
      value: "text-white",
      sub: "text-teal-300",
    },
    amber: {
      wrap: "transition-colors duration-500",
      wrapStyle: { backgroundColor: "var(--accent)" },
      label: "text-amber-100",
      value: "text-white",
      sub: "text-amber-100",
    },
    white: {
      wrap: "border transition-colors duration-500",
      wrapStyle: { backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" },
      label: "text-[#9ca3af]",
      value: "",
      valueStyle: { color: "var(--primary)" },
      sub: "text-[#9ca3af]",
    },
    warm: {
      wrap: "border transition-colors duration-500",
      wrapStyle: { backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" },
      label: "text-[#9ca3af]",
      value: "text-[#dc6b3a]",
      sub: "text-[#9ca3af]",
    },
  };
  const s = styles[variant] as typeof styles["teal"] & { wrapStyle?: React.CSSProperties; valueStyle?: React.CSSProperties };
  return (
    <div className={`${s.wrap} rounded-2xl p-5 shadow-sm`} style={s.wrapStyle}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[11px] font-bold uppercase tracking-widest ${s.label}`}
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {label}
          </p>
          <p
            className={`text-4xl font-bold mt-1 leading-none ${s.value}`}
            style={{ fontFamily: "var(--font-playfair)", ...s.valueStyle }}
          >
            {value}
          </p>
          <p
            className={`text-xs mt-1.5 ${s.sub}`}
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {sub}
          </p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}

export default function FacilityDashboard() {
  const { intakes, rooms } = useFacilityContext();

  const allBeds = rooms.flatMap((r) => r.beds);
  const activePatients = allBeds.filter((b) => b.occupied).length;
  const availableBeds = allBeds.filter((b) => !b.occupied).length;
  const totalBeds = allBeds.length;
  const pendingIntakes = intakes.filter((i) => i.status === "pending");
  const displayedIntakes = pendingIntakes.slice(0, 3);
  const remainingCount = Math.max(0, pendingIntakes.length - 3);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--foreground)" }}
          >
            Good morning, Dr. Sarah
          </h2>
          <p
            className="text-[#9ca3af] mt-1 text-sm"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Saturday, March 14, 2026 · Here&apos;s your facility overview
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Rooms"
            value={String(rooms.length)}
            sub="across 3 wings"
            variant="teal"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-teal-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21v-6h6v6" />
              </svg>
            }
          />
          <StatCard
            label="Available Beds"
            value={String(availableBeds)}
            sub={`of ${totalBeds} total beds`}
            variant="white"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                style={{ color: "color-mix(in srgb, var(--primary) 40%, transparent)" }}
                fill="currentColor"
              >
                <rect x="2" y="13" width="20" height="6" rx="2" />
                <rect x="2" y="8" width="9" height="6" rx="1.5" />
                <circle cx="5.5" cy="6" r="2" />
              </svg>
            }
          />
          <StatCard
            label="Active Patients"
            value={String(activePatients)}
            sub={`${Math.round((activePatients / totalBeds) * 100)}% capacity`}
            variant="amber"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white/50"
                fill="currentColor"
              >
                <circle cx="9" cy="7" r="4" />
                <path d="M2 21v-1a7 7 0 0114 0v1" />
              </svg>
            }
          />
          <Link href="/intakes" className="block">
            <StatCard
              label="Pending Requests"
              value={String(pendingIntakes.length)}
              sub="awaiting review"
              variant="warm"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-[#dc6b3a]/30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  <path d="M9 12h6M9 16h4" />
                </svg>
              }
            />
          </Link>
        </div>

        {/* Two-column: Rooms (2/3) + Requests (1/3) */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rooms grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-xl font-bold text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Rooms &amp; Beds
              </h3>
              <span
                className="text-sm text-[#9ca3af]"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {rooms.length} rooms · 3 wings
              </span>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </div>

          {/* Pending Intake Requests */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-xl font-bold text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Pending Intakes
              </h3>
              <span
                className="text-white text-xs font-black px-2.5 py-1 rounded-full transition-colors duration-500"
                style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-nunito)" }}
              >
                {pendingIntakes.length}
              </span>
            </div>

            {pendingIntakes.length === 0 ? (
              <div
                className="rounded-2xl p-8 shadow-sm border text-center transition-colors duration-500"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <p
                  className="text-[#9ca3af] text-sm"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  No pending intake requests.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedIntakes.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl p-4 shadow-sm border hover:shadow-md transition-all duration-500"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                  >
                    {/* Patient header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-500" style={{ background: "linear-gradient(to bottom right, var(--primary), var(--primary-hover))" }}>
                        <span
                          className="text-white font-black text-sm"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {req.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-[var(--foreground)] text-sm leading-tight"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {req.name}
                        </p>
                        <p
                          className="text-xs text-[#9ca3af] mt-0.5"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          Requested {req.requestDate}
                        </p>
                      </div>
                      {req.priority === "high" && (
                        <span
                          className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="rounded-xl p-3 mb-3 space-y-2" style={{ backgroundColor: "var(--subtle-bg)" }}>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] text-[#9ca3af] font-semibold uppercase tracking-wide"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          Program
                        </span>
                        <span
                          className="text-xs font-bold text-[#374151]"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {req.program}
                        </span>
                      </div>
                      <div className="h-px" style={{ backgroundColor: "var(--card-border)" }} />
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] text-[#9ca3af] font-semibold uppercase tracking-wide"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          Insurance
                        </span>
                        <span
                          className="text-xs font-bold text-[#374151]"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {req.insurance.provider} {req.insurance.planType}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/intakes/${req.id}`}
                        className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl transition-colors text-center"
                        style={{ backgroundColor: "var(--primary)", fontFamily: "var(--font-nunito)" }}
                      >
                        Accept
                      </Link>
                      <Link
                        href={`/intakes/${req.id}`}
                        className="flex-1 border text-xs font-bold py-2.5 rounded-xl transition-colors text-center"
                        style={{ backgroundColor: "var(--subtle-bg)", borderColor: "var(--card-border)", color: "var(--muted)", fontFamily: "var(--font-nunito)" }}
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}

                {/* View more */}
                {remainingCount > 0 && (
                  <Link
                    href="/intakes"
                    className="block w-full text-center text-sm font-semibold py-3.5 border-2 border-dashed rounded-2xl transition-all"
                    style={{ color: "var(--primary)", borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)", fontFamily: "var(--font-nunito)" }}
                  >
                    View {remainingCount} more request{remainingCount > 1 ? "s" : ""} →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
