"use client";

import type { DailyGoal } from "@/app/lib/types";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  goals: DailyGoal[];
}

export default function DailyGoals({ goals }: Props) {
  const done    = goals.filter((g) => g.done).length;
  const total   = goals.length;
  const allDone = done === total;
  const pct     = Math.round((done / total) * 100);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
      >
        <span className="label-tele" style={{ color: "var(--text-3)" }}>DAILY OBJECTIVES</span>
        <span
          className="font-mono-data text-sm font-bold"
          style={{ color: allDone ? "#00d4aa" : "var(--text-2)" }}
        >
          {done}/{total}
        </span>
      </div>

      <div className="px-5 py-4">
        {/* Progress track */}
        <div
          className="h-1 rounded-full overflow-hidden mb-5"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: allDone ? "#00d4aa" : "#00d4ff",
              boxShadow: allDone
                ? "0 0 8px 1px rgba(0,212,170,0.5)"
                : "0 0 8px 1px rgba(0,212,255,0.4)",
            }}
          />
        </div>

        {/* Goal list */}
        <ul className="space-y-3.5">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-start gap-3.5">
              {goal.done ? (
                <CheckCircle2 size={20} className="shrink-0 mt-px" style={{ color: "#00d4aa" }} />
              ) : (
                <Circle size={20} className="shrink-0 mt-px" style={{ color: "rgba(255,255,255,0.15)" }} />
              )}
              <span
                className="text-sm font-medium leading-snug"
                style={{
                  color: goal.done ? "var(--text-3)" : "var(--text-2)",
                  textDecoration: goal.done ? "line-through" : "none",
                }}
              >
                {goal.label}
              </span>
            </li>
          ))}
        </ul>

        {allDone && (
          <div
            className="mt-5 rounded-lg px-4 py-3 text-center"
            style={{
              background: "rgba(0,212,170,0.06)",
              border: "1px solid rgba(0,212,170,0.20)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#00d4aa" }}>
              ◉ ALL OBJECTIVES COMPLETE
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
              Daily mission accomplished. See you tomorrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
