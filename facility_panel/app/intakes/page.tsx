"use client";

import Link from "next/link";
import { useState } from "react";
import { useFacilityContext } from "@/lib/FacilityContext";

type FilterTab = "all" | "urgent" | "normal";

export default function IntakesPage() {
  const { intakes } = useFacilityContext();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const pendingIntakes = intakes.filter((i) => i.status === "pending");
  const processedIntakes = intakes.filter((i) => i.status !== "pending");

  const filtered =
    activeTab === "urgent"
      ? pendingIntakes.filter((i) => i.priority === "high")
      : activeTab === "normal"
      ? pendingIntakes.filter((i) => i.priority === "normal")
      : pendingIntakes;

  const urgentCount = pendingIntakes.filter((i) => i.priority === "high").length;
  const normalCount = pendingIntakes.filter((i) => i.priority === "normal").length;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-8 pb-16">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-semibold mb-2 hover:underline"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
            >
              ← Dashboard
            </Link>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--foreground)" }}
            >
              Intake Requests
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
            >
              {pendingIntakes.length} pending · requires review
            </p>
          </div>
          {pendingIntakes.length > 0 && (
            <span
              className="text-white text-sm font-black px-3 py-1.5 rounded-full mt-8 transition-colors duration-500"
              style={{ fontFamily: "var(--font-nunito)", backgroundColor: "var(--accent)" }}
            >
              {pendingIntakes.length}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(
            [
              { id: "all" as FilterTab, label: "All", count: pendingIntakes.length },
              { id: "urgent" as FilterTab, label: "Urgent", count: urgentCount },
              { id: "normal" as FilterTab, label: "Normal", count: normalCount },
            ]
          ).map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === id
                  ? "text-white shadow-sm"
                  : "border text-[#6b7280]"
              }`}
              style={{
                fontFamily: "var(--font-nunito)",
                ...(activeTab === id
                  ? { backgroundColor: "var(--primary)" }
                  : { backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }),
              }}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === id ? "bg-white/20 text-white" : ""
                }`}
                style={activeTab !== id ? { backgroundColor: "var(--subtle-bg)", color: "var(--muted)" } : undefined}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Pending list */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
          >
            No intake requests in this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-500"
                    style={{ background: "linear-gradient(to bottom right, var(--primary), var(--primary-hover))" }}
                  >
                    <span
                      className="text-white font-black text-sm"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {req.initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p
                        className="font-bold"
                        style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                      >
                        {req.name}
                      </p>
                      {req.priority === "high" && (
                        <span
                          className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          Urgent
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mb-3"
                      style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                    >
                      {req.program} · Requested {req.requestDate}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="text-xs text-[#6b7280]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        <span className="font-semibold" style={{ color: "var(--foreground)" }}>Insurance:</span>{" "}
                        {req.insurance.provider} {req.insurance.planType}
                      </span>
                      {req.medicalFlags.length > 0 && (
                        <span
                          className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          ⚠ {req.medicalFlags[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/intakes/${req.id}`}
                    className="text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
                    style={{ fontFamily: "var(--font-nunito)", backgroundColor: "var(--primary)" }}
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Processed requests */}
        {processedIntakes.length > 0 && (
          <div className="mt-10">
            <h3
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
            >
              Processed
            </h3>
            <div className="space-y-3">
              {processedIntakes.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl p-4 shadow-sm border opacity-70"
                  style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--subtle-bg)" }}
                    >
                      <span
                        className="font-black text-sm"
                        style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                      >
                        {req.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-sm"
                        style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                      >
                        {req.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                      >
                        {req.program} · {req.requestDate}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === "accepted"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-400"
                      }`}
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {req.status === "accepted" ? "Admitted" : "Declined"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
