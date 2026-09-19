"use client";

import type { WeakTopic } from "@/app/lib/types";

interface Props {
  weak: WeakTopic[];
  onTopicClick: (subject: string, topic: string) => void;
}

export default function WeakTopicFlags({ weak, onTopicClick }: Props) {
  if (weak.length === 0) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-6 py-5 flex items-center gap-4">
        <span className="text-3xl shrink-0">🎉</span>
        <div>
          <p className="font-display text-base font-bold text-emerald-800">
            All topics above 60%
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            No weak topics right now. Keep practising to stay there.
          </p>
        </div>
      </div>
    );
  }

  return (
    /*
     * Structurally different from every other card:
     * — rounded-xl not rounded-2xl (less soft, more alert)
     * — NO plain white background — rose tinted
     * — Top border accent (4px), not left — changes the silhouette
     * — Slightly elevated shadow
     * If you covered up the text, this card reads as "action required",
     * not "information."
     */
    <div
      className="rounded-xl bg-rose-50 border border-rose-200 overflow-hidden"
      style={{ boxShadow: "0 4px 20px -4px rgba(244, 63, 94, 0.2), 0 1px 4px 0 rgba(244, 63, 94, 0.08)" }}
    >
      {/* Thick top accent bar — the structural signal this is different */}
      <div className="h-1.5 bg-rose-500 w-full" />

      <div className="px-6 py-5">
        {/* Header — no warning triangle, no generic icon */}
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-display text-base font-bold text-rose-900">
            Focus areas
          </p>
          <p className="text-sm font-semibold text-rose-600">
            {weak.length} topic{weak.length > 1 ? "s" : ""} below 60%
          </p>
        </div>

        {/* One card per weak topic — score is the hero, not a chip label */}
        <div className="space-y-3">
          {weak.map(({ subject, topic, score }) => (
            <button
              key={`${subject}-${topic}`}
              onClick={() => onTopicClick(subject, topic)}
              className="w-full flex items-center justify-between bg-white rounded-xl border border-rose-100 px-4 py-4 text-left"
            >
              <div className="flex items-center gap-4">
                {/* Score is the dominant number — student recognises it instantly */}
                <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shrink-0">
                  <span className="font-display text-xl font-bold text-rose-600 tabular-nums leading-none">
                    {score}%
                  </span>
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-stone-900">{topic}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-display text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2">
                  Practice →
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-sm text-rose-500 mt-4">
          Tap a topic to start a 5-question quiz
        </p>
      </div>
    </div>
  );
}
