"use client";

import type { Profile } from "@/app/lib/types";
import { dayArc, levelFromXp, xpToNextLevel, bandLabel } from "@/app/lib/helpers";

interface Props {
  profile: Profile;
}

export default function DayArcHero({ profile }: Props) {
  const arc   = dayArc();
  const level = levelFromXp(profile.xp);
  const toNext = xpToNextLevel(profile.xp);
  const band  = bandLabel(profile.klass);
  const xpProgress = ((profile.xp % 200) / 200) * 100;

  // Each phase: deliberately different gradient AND layout weight
  const phase = {
    morning: {
      // Warm amber sunrise — energy, start fresh
      wrap:       "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50",
      border:     "border-amber-200",
      timeLabel:  "text-amber-700",
      subLine:    "text-amber-800",
      barFill:    "bg-amber-500",
      barTrack:   "bg-amber-200",
      streakRing: "ring-amber-200",
    },
    afternoon: {
      // Pure indigo — focused, in the zone
      wrap:       "bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700",
      border:     "border-indigo-700",
      timeLabel:  "text-indigo-200",
      subLine:    "text-indigo-100",
      barFill:    "bg-white",
      barTrack:   "bg-indigo-500",
      streakRing: "ring-indigo-400",
    },
    evening: {
      // Deep slate — calm, reflect, wind down
      wrap:       "bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900",
      border:     "border-slate-700",
      timeLabel:  "text-slate-400",
      subLine:    "text-slate-300",
      barFill:    "bg-indigo-400",
      barTrack:   "bg-slate-600",
      streakRing: "ring-slate-500",
    },
  }[arc.phase];

  // Text colours differ: morning = dark, afternoon+evening = light
  const onDark = arc.phase !== "morning";
  const nameColor   = onDark ? "text-white" : "text-stone-900";
  const subColor    = onDark ? phase.subLine : "text-stone-700";
  const timeColor   = onDark ? phase.timeLabel : "text-amber-700";
  const xpNumColor  = onDark ? "text-white" : "text-stone-900";
  const xpSubColor  = onDark ? "text-indigo-200" : "text-stone-500";

  return (
    <div className={`rounded-2xl border ${phase.wrap} ${phase.border} p-6 overflow-hidden`}>
      {/* ── Top row: time label + streak ── */}
      <div className="flex items-start justify-between gap-4">
        <p className={`text-sm font-medium tracking-wide ${timeColor}`}>
          {arc.emoji} {arc.greeting}
        </p>

        {/* Streak — always prominent, always the same structure */}
        <div className={`flex flex-col items-center bg-white/20 ring-1 ${phase.streakRing} backdrop-blur-sm rounded-2xl px-4 py-3 shrink-0`}>
          <span className="text-2xl leading-none">🔥</span>
          <p className={`font-display text-2xl font-bold leading-none mt-1 tabular-nums ${nameColor}`}>
            {profile.streak}
          </p>
          <p className={`text-sm mt-1 ${subColor}`}>streak</p>
        </div>
      </div>

      {/* ── Name — the hero element ── */}
      {/* Junior (1–5): big friendly greeting. Senior (6–10): name only, confident. */}
      <div className="mt-4">
        {band.useDense ? (
          <h2 className={`font-display font-bold leading-none ${nameColor}`}
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            {profile.name}
          </h2>
        ) : (
          <>
            <p className={`font-display text-base font-medium ${subColor}`}>Hey there,</p>
            <h2 className={`font-display font-bold leading-none mt-0.5 ${nameColor}`}
                style={{ fontSize: "clamp(2.5rem, 10vw, 3.5rem)" }}>
              {profile.name} 👋
            </h2>
          </>
        )}

        {/* Class badge + arc line */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            onDark ? "bg-white/20 text-white" : "bg-white/80 text-stone-700"
          }`}>
            Class {profile.klass}
          </span>
          <p className={`text-sm leading-snug ${subColor}`}>{arc.line}</p>
        </div>
      </div>

      {/* ── XP bar ── */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-3xl font-bold tabular-nums ${xpNumColor}`}>
              {profile.xp}
            </span>
            <span className={`text-sm font-medium ${xpSubColor}`}>
              XP · Level {level}
            </span>
          </div>
          <span className={`text-sm ${xpSubColor}`}>
            {band.useDense
              ? `${toNext} to Lvl ${level + 1}`
              : `${toNext} more! ⭐`}
          </span>
        </div>

        <div className={`h-2.5 rounded-full ${phase.barTrack} overflow-hidden`}>
          <div
            className={`h-full rounded-full ${phase.barFill} transition-all duration-700`}
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
