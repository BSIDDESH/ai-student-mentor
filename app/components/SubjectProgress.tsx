"use client";

import type { Subjects } from "@/app/lib/types";
import { scoreTextColor, scoreColor } from "@/app/lib/helpers";

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
    <div className="space-y-4">
      <p className="font-display text-base font-bold text-stone-700 px-1">Your Progress</p>

      {Object.entries(subjects).map(([subject, topics]) => {
        const scores = Object.values(topics).map((t) => t.score);
        const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const emoji  = SUBJECT_EMOJI[subject] ?? SUBJECT_EMOJI.default;

        return (
          <div key={subject} className="bg-white rounded-2xl border border-stone-100 overflow-hidden"
               style={{ boxShadow: "0 1px 6px 0 rgba(28,25,23,0.06)" }}>

            {/* Subject header — warm mist background, not cold grey */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-stone-100"
              style={{ background: "var(--mist)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{emoji}</span>
                <p className="font-display text-base font-bold text-stone-800">{subject}</p>
              </div>
              {/* Average — display font, score-band colour */}
              <p className={`font-display text-xl font-bold tabular-nums ${scoreTextColor(avg)}`}>
                {avg}%
              </p>
            </div>

            {/* Topic rows */}
            <div className="px-6 py-4 space-y-5">
              {Object.entries(topics).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-stone-700">{topic}</p>
                    <div className="flex items-center gap-2">
                      {data.score < 60 && (
                        <span className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
                          weak
                        </span>
                      )}
                      <p className={`font-display text-xl font-bold tabular-nums ${scoreTextColor(data.score)}`}>
                        {data.score}%
                      </p>
                    </div>
                  </div>

                  {/* Progress bar — one of the three allowed animations */}
                  <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scoreColor(data.score)} transition-all duration-700`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>

                  <p className="text-sm text-stone-400 mt-1.5">
                    {data.attempts} attempt{data.attempts !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Colour legend — teaches judges the score language in two seconds */}
      <div className="flex items-center gap-6 px-1 pt-1">
        {[
          { label: "Below 60%", cls: "bg-rose-500" },
          { label: "60–79%",    cls: "bg-amber-500" },
          { label: "80%+",      cls: "bg-emerald-500" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${cls}`} />
            <span className="text-sm text-stone-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
