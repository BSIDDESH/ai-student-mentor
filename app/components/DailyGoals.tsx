"use client";

import type { DailyGoal } from "@/app/lib/types";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  goals: DailyGoal[];
}

export default function DailyGoals({ goals }: Props) {
  const done   = goals.filter((g) => g.done).length;
  const total  = goals.length;
  const allDone = done === total;
  const pct    = Math.round((done / total) * 100);

  return (
    <div
      className="bg-white rounded-2xl border border-stone-100 p-6"
      style={{ boxShadow: "0 1px 6px 0 rgba(28,25,23,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-base font-bold text-stone-800">Daily Goals</p>
        <span
          className={`font-display text-sm font-bold px-3 py-1 rounded-full tabular-nums ${
            allDone
              ? "bg-emerald-100 text-emerald-700"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {done}/{total}
        </span>
      </div>

      {/* Progress track */}
      <div className="h-2 rounded-full bg-stone-100 overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            allDone ? "bg-emerald-500" : "bg-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Goal list */}
      <ul className="space-y-4">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-start gap-4">
            {goal.done ? (
              <CheckCircle2 size={22} className="text-emerald-500 shrink-0 mt-px" />
            ) : (
              <Circle size={22} className="text-stone-300 shrink-0 mt-px" />
            )}
            <span
              className={`text-sm font-medium leading-snug ${
                goal.done ? "line-through text-stone-400" : "text-stone-700"
              }`}
            >
              {goal.label}
            </span>
          </li>
        ))}
      </ul>

      {allDone && (
        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4 text-center">
          <p className="font-display text-base font-bold text-emerald-800">
            🎉 All done for today!
          </p>
          <p className="text-sm text-emerald-700 mt-1">You crushed every target. See you tomorrow.</p>
        </div>
      )}
    </div>
  );
}
