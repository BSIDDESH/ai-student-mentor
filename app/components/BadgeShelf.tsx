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
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
      >
        <span className="label-tele" style={{ color: "var(--text-3)" }}>ACHIEVEMENT REGISTRY</span>
        <span className="font-mono-data text-sm" style={{ color: "var(--text-2)" }}>
          <span style={{ color: "var(--gold)" }}>{earned.length}</span>/{ALL_BADGES.length}
        </span>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGES.map((id) => {
            const isEarned = earnedSet.has(id);
            const { label, emoji } = badgeInfo(id);

            return isEarned ? (
              /*
               * EARNED — gold border + warm glow, emoji at full brightness.
               * Defined in globals.css as .badge-earned.
               * Looks like a physical medallion against the dark canvas.
               */
              <div
                key={id}
                className="badge-earned flex flex-col items-center rounded-xl px-3 py-5 text-center"
              >
                <span className="text-4xl leading-none">{emoji}</span>
                <p
                  className="text-sm font-semibold mt-3 leading-tight"
                  style={{ color: "var(--gold)" }}
                >
                  {label}
                </p>
                <span className="label-tele mt-1" style={{ color: "var(--gold)" }}>
                  ◉ ACQUIRED
                </span>
              </div>
            ) : (
              /*
               * LOCKED — dashed border, emoji barely visible.
               * Shows what's possible without cluttering the earned ones.
               */
              <div
                key={id}
                className="badge-locked flex flex-col items-center rounded-xl px-3 py-5 text-center"
              >
                <span className="text-4xl leading-none opacity-15 grayscale">{emoji}</span>
                <p
                  className="text-sm font-medium mt-3 leading-tight"
                  style={{ color: "var(--text-3)" }}
                >
                  {label}
                </p>
                <span className="label-tele mt-1" style={{ color: "var(--text-3)" }}>
                  LOCKED
                </span>
              </div>
            );
          })}
        </div>

        {earned.length === 0 && (
          <p className="text-sm text-center mt-4 pb-2" style={{ color: "var(--text-3)" }}>
            Complete your first quiz to begin acquiring achievements.
          </p>
        )}
      </div>
    </div>
  );
}
