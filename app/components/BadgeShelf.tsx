"use client";

import { badgeInfo } from "@/app/lib/helpers";

const ALL_BADGES = [
  "first_quiz",
  "streak_3",
  "streak_7",
  "hydration_hero",
  "quiz_master",
  "weakness_cleared",
];

interface Props {
  earned: string[];
}

export default function BadgeShelf({ earned }: Props) {
  const earnedSet = new Set(earned);

  return (
    <div
      className="bg-white rounded-2xl border border-stone-100 p-6"
      style={{ boxShadow: "0 1px 6px 0 rgba(28,25,23,0.06)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="font-display text-base font-bold text-stone-800">Achievements</p>
        <p className="text-sm text-stone-400">
          <span className="font-display font-bold text-stone-700">{earned.length}</span>
          /{ALL_BADGES.length} earned
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {ALL_BADGES.map((id) => {
          const isEarned = earnedSet.has(id);
          const { label, emoji } = badgeInfo(id);

          return isEarned ? (
            /*
             * EARNED — feels like a physical badge:
             * Indigo-to-violet gradient, colored ring, no transparency.
             * The emoji is the full 40px — this is the reward, own it.
             */
            <div
              key={id}
              className="badge-earned flex flex-col items-center rounded-2xl px-4 py-5 text-center"
            >
              <span className="text-4xl leading-none">{emoji}</span>
              <p className="font-display text-sm font-bold text-indigo-700 mt-3 leading-tight">
                {label}
              </p>
              <span className="text-sm text-indigo-400 mt-1 font-medium">Earned ✓</span>
            </div>
          ) : (
            /*
             * LOCKED — different in three ways from earned, not just greyscale:
             * 1. Dashed border (sketch/blueprint feel — "possible but not yet real")
             * 2. Muted background (var(--mist))
             * 3. Lock icon overlaid on emoji — the emoji is still visible at lower opacity,
             *    which hints at what you'll get, making it feel worth unlocking
             */
            <div
              key={id}
              className="badge-locked flex flex-col items-center rounded-2xl px-4 py-5 text-center"
            >
              <div className="relative">
                <span className="text-4xl leading-none opacity-25 grayscale">{emoji}</span>
                <span
                  className="absolute -bottom-1 -right-1 text-base leading-none"
                  role="img"
                  aria-label="locked"
                >
                  🔒
                </span>
              </div>
              <p className="text-sm font-medium text-stone-400 mt-3 leading-tight">{label}</p>
              <span className="text-sm text-stone-400 mt-1">Locked</span>
            </div>
          );
        })}
      </div>

      {earned.length === 0 && (
        <p className="text-sm text-stone-400 text-center mt-4">
          Complete your first quiz to earn your first badge.
        </p>
      )}
    </div>
  );
}
