export type IntakeRequest = {
  id: string;
  name: string;
  initials: string;
  dob: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    planType: string;
    memberId: string;
    authStatus: "pending" | "approved" | "denied";
  };
  program: string;
  admittingReason: string;
  substances: string[];
  lastUseDate: string;
  medicalFlags: string[];
  referralType: "doctor" | "hotline" | "self" | "family";
  referringSource: string;
  requestDate: string;
  priority: "high" | "normal";
  status: "pending" | "accepted" | "declined";
};

export type Bed = {
  index: number;
  occupied: boolean;
  patientName?: string;
};

export type Room = {
  id: string;
  wing: string;
  beds: Bed[];
};
