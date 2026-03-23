"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { IntakeRequest, Room } from "./types";
import { initialIntakes, initialRooms } from "./mockData";

type FacilityContextValue = {
  intakes: IntakeRequest[];
  rooms: Room[];
  acceptIntake: (intakeId: string, roomId: string, bedIndex: number) => void;
  declineIntake: (intakeId: string) => void;
};

const FacilityContext = createContext<FacilityContextValue | null>(null);

export function FacilityDataProvider({ children }: { children: ReactNode }) {
  const [intakes, setIntakes] = useState<IntakeRequest[]>(initialIntakes);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  function acceptIntake(intakeId: string, roomId: string, bedIndex: number) {
    const intake = intakes.find((i) => i.id === intakeId);
    if (!intake) return;

    setIntakes((prev) =>
      prev.map((i) => (i.id === intakeId ? { ...i, status: "accepted" } : i))
    );

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              beds: room.beds.map((b) =>
                b.index === bedIndex
                  ? { ...b, occupied: true, patientName: intake.name }
                  : b
              ),
            }
          : room
      )
    );
  }

  function declineIntake(intakeId: string) {
    setIntakes((prev) =>
      prev.map((i) => (i.id === intakeId ? { ...i, status: "declined" } : i))
    );
  }

  return (
    <FacilityContext.Provider value={{ intakes, rooms, acceptIntake, declineIntake }}>
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacilityContext() {
  const ctx = useContext(FacilityContext);
  if (!ctx)
    throw new Error("useFacilityContext must be used inside FacilityDataProvider");
  return ctx;
}
