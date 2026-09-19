"use client";

import type { Subjects } from "@/app/lib/types";
import { scoreTextColor, scoreHex } from "@/app/lib/helpers";
import ProgressBar from "./ui/ProgressBar";

const SUBJECT_EMOJI: Record<string, string> = {
  Mathematics: "🔢",
  Science:     "🔬",
  English:     "📖",
  History:     "🏛️",
  Geography:   "🌍",
  default:     "📚",
};

interface Props {
  subjects: Subjects;
}

export default function SubjectProgress({ subjects }: Props) {
  return (
    <div className="space-y-3">
      <p className="label-tele px-1" style={{ color: "var(--text-3)" }}>ACADEMIC VECTORS</p>

      {Object.entries(subjects).map(([subject, topics]) => {
        const scores = Object.values(topics).map((t) => t.score);
        const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const emoji  = SUBJECT_EMOJI[subject] ?? SUBJECT_EMOJI.default;

        return (
          <div
            key={subject}
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Subject header — darker stripe, hairline bottom */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{emoji}</span>
                <p className="font-display text-sm font-semibold" style={{ color: "var(--text-1)" }}>
                  {subject}
                </p>
              </div>
              {/* Average score — the headline number */}
              <p
                className={`font-mono-data text-xl font-bold ${scoreTextColor(avg)}`}
              >
                {avg}%
              </p>
            </div>

            {/* Topic rows */}
            <div className="px-5 py-4 space-y-4">
              {Object.entries(topics).map(([topic, data], idx, arr) => (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                        {topic}
                      </p>
                      {data.score < 60 && (
                        <span
                          className="label-tele px-1.5 py-0.5 rounded"
                          style={{
                            color: "#ff6b6b",
                            border: "1px solid rgba(255,107,107,0.25)",
                            background: "rgba(255,107,107,0.08)",
                          }}
                        >
                          ▲ WEAK
                        </span>
                      )}
                    </div>
                    <p className={`font-mono-data text-base font-bold ${scoreTextColor(data.score)}`}>
                      {data.score}%
                    </p>
                  </div>
                  <ProgressBar value={data.score} />
                  <p className="label-tele mt-1.5" style={{ color: "var(--text-3)" }}>
                    {data.attempts} attempt{data.attempts !== 1 ? "s" : ""}
                  </p>
                  {/* Hairline between topics, not after last */}
                  {idx < arr.length - 1 && (
                    <div className="mt-4 hairline" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Score legend */}
      <div className="flex items-center gap-6 px-1 pt-1">
        {[
          { label: "BELOW 60%", color: "#ff6b6b" },
          { label: "60–79%",    color: "#f59e0b" },
          { label: "80%+",      color: "#00d4aa" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: color, boxShadow: `0 0 4px ${color}` }}
            />
            <span className="label-tele" style={{ color: "var(--text-3)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
