"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFacilityContext } from "@/lib/FacilityContext";
import BedAssignmentModal from "@/components/BedAssignmentModal";

const AUTH_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  denied: "bg-red-50 text-red-500",
};

const REFERRAL_LABELS = {
  doctor: "Physician Referral",
  hotline: "Hotline",
  self: "Self-Referral",
  family: "Family Intervention",
};

export default function IntakeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { intakes, declineIntake } = useFacilityContext();
  const [showModal, setShowModal] = useState(false);

  const intake = intakes.find((i) => i.id === id);

  if (!intake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
          >
            Intake request not found.
          </p>
          <Link
            href="/intakes"
            className="font-semibold mt-4 block hover:underline text-sm"
            style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
          >
            ← Back to Intakes
          </Link>
        </div>
      </div>
    );
  }

  function handleDecline() {
    declineIntake(intake!.id);
    router.push("/intakes");
  }

  function handleSuccess() {
    setShowModal(false);
    router.push("/");
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-8 pb-36">
        {/* Back link */}
        <Link
          href="/intakes"
          className="flex items-center gap-1.5 text-sm font-semibold mb-6 hover:underline w-fit"
          style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
        >
          ← Back to Intakes
        </Link>

        {/* Patient header card */}
        <div
          className="rounded-2xl p-6 shadow-sm border mb-6 transition-colors duration-500"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-colors duration-500"
              style={{ background: "linear-gradient(to bottom right, var(--primary), var(--primary-hover))" }}
            >
              <span
                className="text-white font-black text-xl"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                {intake.initials}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--foreground)" }}
                >
                  {intake.name}
                </h2>
                {intake.priority === "high" && (
                  <span
                    className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-bold"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Urgent
                  </span>
                )}
                {intake.status !== "pending" && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      intake.status === "accepted"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-400"
                    }`}
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {intake.status === "accepted" ? "Admitted" : "Declined"}
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-sm"
                style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
              >
                {intake.program} · Requested {intake.requestDate}
              </p>
            </div>
          </div>
        </div>

        {/* Info sections — 2-column grid on md+ */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Contact & Demographics */}
          <div
            className="rounded-2xl p-5 shadow-sm border transition-colors duration-500"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
            >
              Contact &amp; Demographics
            </h3>
            <dl className="space-y-3">
              {[
                { label: "Date of Birth", value: intake.dob },
                { label: "Phone", value: intake.phone },
                {
                  label: "Emergency Contact",
                  value: `${intake.emergencyContact.name} · ${intake.emergencyContact.relationship}`,
                },
                { label: "EC Phone", value: intake.emergencyContact.phone },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                  >
                    {label}
                  </dt>
                  <dd
                    className="text-sm font-semibold mt-0.5"
                    style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Insurance & Program */}
          <div
            className="rounded-2xl p-5 shadow-sm border transition-colors duration-500"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
            >
              Insurance &amp; Program
            </h3>
            <dl className="space-y-3">
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Provider
                </dt>
                <dd
                  className="text-sm font-semibold mt-0.5"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.insurance.provider} · {intake.insurance.planType}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Member ID
                </dt>
                <dd
                  className="text-sm font-semibold mt-0.5"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.insurance.memberId}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Auth Status
                </dt>
                <dd>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      AUTH_STATUS_STYLES[intake.insurance.authStatus]
                    }`}
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {intake.insurance.authStatus.charAt(0).toUpperCase() +
                      intake.insurance.authStatus.slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Program
                </dt>
                <dd
                  className="text-sm font-semibold mt-0.5"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.program}
                </dd>
              </div>
            </dl>
          </div>

          {/* Clinical Notes */}
          <div
            className="rounded-2xl p-5 shadow-sm border transition-colors duration-500"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
            >
              Clinical Notes
            </h3>
            <dl className="space-y-3">
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Admitting Reason
                </dt>
                <dd
                  className="text-sm mt-0.5 leading-relaxed"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.admittingReason}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Substances
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {intake.substances.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: "var(--font-nunito)",
                        backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
                        color: "var(--primary)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Last Use
                </dt>
                <dd
                  className="text-sm font-semibold mt-0.5"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.lastUseDate}
                </dd>
              </div>
              {intake.medicalFlags.length > 0 && (
                <div>
                  <dt
                    className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                  >
                    Medical Flags
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {intake.medicalFlags.map((f) => (
                      <span
                        key={f}
                        className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-full"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        ⚠ {f}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Referring Source */}
          <div
            className="rounded-2xl p-5 shadow-sm border transition-colors duration-500"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-[11px] font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-nunito)", color: "var(--primary)" }}
            >
              Referring Source
            </h3>
            <dl className="space-y-3">
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Referral Type
                </dt>
                <dd>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      backgroundColor: "var(--subtle-bg)",
                      borderColor: "var(--card-border)",
                      color: "var(--foreground)",
                    }}
                  >
                    {REFERRAL_LABELS[intake.referralType]}
                  </span>
                </dd>
              </div>
              <div>
                <dt
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--muted)" }}
                >
                  Referred By
                </dt>
                <dd
                  className="text-sm font-semibold mt-0.5 leading-relaxed"
                  style={{ fontFamily: "var(--font-nunito)", color: "var(--foreground)" }}
                >
                  {intake.referringSource}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      {/* Sticky action bar — only shown for pending intakes */}
      {intake.status === "pending" && (
        <div
          className="fixed bottom-0 left-0 right-0 border-t shadow-lg px-6 py-4 transition-colors duration-500"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={handleDecline}
              className="px-6 border-2 text-sm font-bold py-3.5 rounded-xl hover:text-red-400 transition-all"
              style={{ fontFamily: "var(--font-nunito)", borderColor: "var(--card-border)", color: "var(--muted)" }}
            >
              Decline
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm"
              style={{ fontFamily: "var(--font-nunito)", backgroundColor: "var(--primary)" }}
            >
              Accept &amp; Assign Bed →
            </button>
          </div>
        </div>
      )}

      {/* Bed assignment modal */}
      {showModal && (
        <BedAssignmentModal
          intakeId={intake.id}
          intakeName={intake.name}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
