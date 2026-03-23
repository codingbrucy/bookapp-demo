"use client";

import { useState } from "react";
import { useFacilityContext } from "@/lib/FacilityContext";
import type { Room } from "@/lib/types";

type Props = {
  intakeId: string;
  intakeName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BedAssignmentModal({
  intakeId,
  intakeName,
  onClose,
  onSuccess,
}: Props) {
  const { rooms, acceptIntake } = useFacilityContext();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBedIndex, setSelectedBedIndex] = useState<number | null>(null);

  const availableRooms = rooms.filter((r) => r.beds.some((b) => !b.occupied));

  function handleConfirm() {
    if (!selectedRoom || selectedBedIndex === null) return;
    acceptIntake(intakeId, selectedRoom.id, selectedBedIndex);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--foreground)" }}
              >
                Assign Bed
              </h2>
              <p
                className="text-sm mt-0.5"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
              >
                Admitting {intakeName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
              style={{ backgroundColor: "var(--subtle-bg)", color: "var(--muted)" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[55vh] overflow-y-auto">
          {!selectedRoom ? (
            <>
              <p
                className="text-sm font-semibold mb-3"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
              >
                Select a room
              </p>
              {availableRooms.length === 0 ? (
                <p
                  className="text-sm text-center py-8"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  No rooms with available beds.
                </p>
              ) : (
                <div className="space-y-2">
                  {availableRooms.map((room) => {
                    const available = room.beds.filter((b) => !b.occupied).length;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className="w-full flex items-center justify-between border rounded-xl px-4 py-3 transition-all text-left"
                        style={{ backgroundColor: "var(--subtle-bg)", borderColor: "var(--card-border)" }}
                      >
                        <div>
                          <p
                            className="font-bold text-sm"
                            style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                          >
                            Room {room.id}
                          </p>
                          <p
                            className="text-xs"
                            style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                          >
                            {room.wing}
                          </p>
                        </div>
                        <span
                          className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"
                          style={{ fontFamily: "var(--font-nunito)" }}
                        >
                          {available} open
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  setSelectedBedIndex(null);
                }}
                className="flex items-center gap-1.5 text-sm font-semibold mb-4 hover:underline"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
              >
                ← Back to rooms
              </button>
              <p
                className="text-sm font-bold mb-0.5"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
              >
                Room {selectedRoom.id} · {selectedRoom.wing}
              </p>
              <p
                className="text-xs mb-4"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
              >
                Select an available bed
              </p>
              <div className="grid grid-cols-2 gap-2">
                {selectedRoom.beds.map((bed) => (
                  <button
                    key={bed.index}
                    disabled={bed.occupied}
                    onClick={() => setSelectedBedIndex(bed.index)}
                    className="p-3 rounded-xl border-2 text-left transition-all"
                    style={
                      bed.occupied
                        ? { backgroundColor: "var(--subtle-bg)", borderColor: "var(--card-border)", cursor: "not-allowed", opacity: 0.6 }
                        : selectedBedIndex === bed.index
                        ? {
                            backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
                            borderColor: "var(--primary)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }
                        : { backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={
                          bed.occupied
                            ? { backgroundColor: "var(--primary)" }
                            : { border: "2px dashed color-mix(in srgb, var(--primary) 25%, transparent)" }
                        }
                      >
                        {bed.occupied && (
                          <svg
                            viewBox="0 0 16 16"
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                          >
                            <rect x="1" y="9" width="14" height="4" rx="1" />
                            <rect x="1" y="5" width="6" height="4" rx="1" />
                            <rect x="2" y="3" width="4" height="3" rx="1" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                      >
                        Bed {bed.index + 1}
                      </span>
                    </div>
                    <p
                      className="text-[10px]"
                      style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                    >
                      {bed.occupied ? bed.patientName : "Available"}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--card-border)" }}>
          <button
            onClick={onClose}
            className="flex-1 border text-sm font-bold py-3 rounded-xl transition-colors"
            style={{ fontFamily: "var(--font-nunito)", borderColor: "var(--card-border)", color: "var(--muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedRoom || selectedBedIndex === null}
            className="flex-1 text-white text-sm font-bold py-3 rounded-xl transition-colors"
            style={{
              fontFamily: "var(--font-nunito)",
              backgroundColor:
                selectedRoom && selectedBedIndex !== null
                  ? "var(--primary)"
                  : "color-mix(in srgb, var(--primary) 30%, transparent)",
              cursor: selectedRoom && selectedBedIndex !== null ? "pointer" : "not-allowed",
            }}
          >
            Confirm Admission
          </button>
        </div>
      </div>
    </div>
  );
}
