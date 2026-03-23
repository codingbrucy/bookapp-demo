import type { Bed } from "@/lib/types";
import PersonFigure from "./PersonFigure";

type BedGridProps = {
  beds: Bed[];
  mode?: "compact" | "detailed";
};

export default function BedGrid({ beds, mode = "compact" }: BedGridProps) {
  if (mode === "compact") {
    return (
      <div className="flex gap-1.5 flex-wrap">
        {beds.map((bed) => (
          <div
            key={bed.index}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
            style={
              bed.occupied
                ? { backgroundColor: "var(--primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }
                : {
                    border: "2px dashed color-mix(in srgb, var(--primary) 25%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)",
                  }
            }
          >
            {bed.occupied && (
              <svg
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
              >
                <rect x="1" y="9" width="14" height="4" rx="1" />
                <rect x="1" y="5" width="6" height="4" rx="1" />
                <rect x="2" y="3" width="4" height="3" rx="1" />
              </svg>
            )}
          </div>
        ))}
      </div>
    );
  }

  /* ── Detailed mode ── */
  return (
    <div className="grid grid-cols-2 gap-3">
      {beds.map((bed) => (
        <div
          key={bed.index}
          className="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all"
          style={
            bed.occupied
              ? {
                  backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                }
              : {
                  border: "2px dashed color-mix(in srgb, var(--primary) 15%, transparent)",
                  backgroundColor: "var(--subtle-bg)",
                }
          }
        >
          {bed.occupied ? (
            <PersonFigure className="w-7 h-12" style={{ color: "var(--primary)" }} />
          ) : (
            <svg
              viewBox="0 0 40 24"
              className="w-10 h-6"
              style={{ color: "color-mix(in srgb, var(--primary) 20%, transparent)" }}
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="0" y="14" width="40" height="8" rx="2" />
              <rect x="0" y="6" width="16" height="8" rx="2" />
              <rect x="2" y="2" width="10" height="6" rx="2" />
            </svg>
          )}
          <div className="text-center">
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
            >
              Bed {bed.index + 1}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{
                fontFamily: "var(--font-nunito)",
                color: bed.occupied ? "var(--primary)" : "var(--muted)",
                fontWeight: bed.occupied ? 600 : 400,
              }}
            >
              {bed.occupied ? bed.patientName : "Available"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
