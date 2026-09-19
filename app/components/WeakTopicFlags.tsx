"use client";

import type { WeakTopic } from "@/app/lib/types";

interface Props {
  weak: WeakTopic[];
  onTopicClick: (subject: string, topic: string) => void;
}

export default function WeakTopicFlags({ weak, onTopicClick }: Props) {
  if (weak.length === 0) {
    return (
      <div
        className="rounded-xl px-6 py-5 flex items-center gap-4"
        style={{
          background: "rgba(0,212,170,0.06)",
          border: "1px solid rgba(0,212,170,0.20)",
        }}
      >
        <span className="text-3xl shrink-0">◉</span>
        <div>
          <p className="label-tele mb-1" style={{ color: "#00d4aa" }}>NAVIGATION STATUS</p>
          <p className="font-display text-base font-semibold" style={{ color: "var(--text-1)" }}>
            All vectors above threshold
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
            No course deviations detected. Continue current heading.
          </p>
        </div>
      </div>
    );
  }

  return (
    /*
     * DEVIATION ALERT — structurally different from every other card:
     * Left rail = 2px solid coral + subtle red glow on the whole card.
     * If you covered the text, the silhouette still reads as "urgent."
     */
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,107,107,0.04)",
        border: "1px solid rgba(255,107,107,0.18)",
        borderLeft: "3px solid #ff6b6b",
        boxShadow: "0 0 24px 0 rgba(255,107,107,0.08), inset 0 1px 0 rgba(255,107,107,0.08)",
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,107,107,0.12)", background: "rgba(0,0,0,0.20)" }}
      >
        <span className="label-tele" style={{ color: "#ff6b6b" }}>
          ▲ COURSE DEVIATION DETECTED
        </span>
        <span className="label-tele" style={{ color: "var(--text-3)" }}>
          {weak.length} VECTOR{weak.length > 1 ? "S" : ""} BELOW 60%
        </span>
      </div>

      {/* Topic rows */}
      <div className="p-4 space-y-2">
        {weak.map(({ subject, topic, score }) => (
          <button
            key={`${subject}-${topic}`}
            onClick={() => onTopicClick(subject, topic)}
            className="w-full flex items-center justify-between px-4 py-4 rounded-lg text-left"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,107,107,0.12)",
            }}
          >
            {/* Score — the dominant visual element */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,107,107,0.08)",
                  border: "1px solid rgba(255,107,107,0.20)",
                }}
              >
                <span
                  className="font-mono-data text-lg font-bold leading-none"
                  style={{ color: "#ff6b6b" }}
                >
                  {score}%
                </span>
              </div>
              <div>
                <p className="font-display text-base font-semibold" style={{ color: "var(--text-1)" }}>
                  {topic}
                </p>
                <p className="label-tele mt-1" style={{ color: "var(--text-3)" }}>{subject}</p>
              </div>
            </div>

            {/* CTA */}
            <span
              className="label-tele px-3 py-2 rounded-md shrink-0"
              style={{
                color: "#00d4ff",
                border: "1px solid rgba(0,212,255,0.20)",
                background: "rgba(0,212,255,0.06)",
              }}
            >
              INITIATE REVIEW →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
