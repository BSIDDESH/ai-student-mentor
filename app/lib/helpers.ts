// lib/helpers.ts
// Reusable helpers used across the whole app.
// Import from here — never re-implement these inline in a component.

import { useEffect, useState } from "react";
import type { Subjects, WeakTopic } from "./types";

// ── Weak topic detection ───────────────────────────────────────────────────────
export const WEAK_THRESHOLD = 60;

export function weakTopics(subjects: Subjects): WeakTopic[] {
  return Object.entries(subjects)
    .flatMap(([subject, topics]) =>
      Object.entries(topics)
        .filter(([, t]) => t.score < WEAK_THRESHOLD)
        .map(([topic, t]) => ({ subject, topic, score: t.score }))
    )
    .sort((a, b) => a.score - b.score); // worst first
}

// ── Score colour bands (dark-canvas calibrated) ────────────────────────────
// coral-red <60 · amber 60–79 · cyan-teal 80+
// These render against var(--canvas) / var(--surface) backgrounds.
export const scoreColor = (score: number): string =>
  score < 60 ? "bg-[#ff6b6b]" : score < 80 ? "bg-amber-400" : "bg-[#00d4aa]";

export const scoreTextColor = (score: number): string =>
  score < 60 ? "text-[#ff6b6b]" : score < 80 ? "text-amber-400" : "text-[#00d4aa]";

export const scoreBorderColor = (score: number): string =>
  score < 60 ? "border-[#ff6b6b]" : score < 80 ? "border-amber-400" : "border-[#00d4aa]";

// Inline box-shadow string — for glowing progress bars (no JS cost)
export const scoreGlow = (score: number): string =>
  score < 60
    ? "0 0 8px 1px rgba(255, 107, 107, 0.55)"
    : score < 80
    ? "0 0 8px 1px rgba(245, 158, 11, 0.55)"
    : "0 0 8px 1px rgba(0, 212, 170, 0.55)";

// Raw hex — for SVG stroke colour and inline style use
export const scoreHex = (score: number): string =>
  score < 60 ? "#ff6b6b" : score < 80 ? "#f59e0b" : "#00d4aa";

// ── Day arc (time-of-day greeting) ────────────────────────────────────────────
type DayArcPhase = "morning" | "afternoon" | "evening";
type DayArc = { phase: DayArcPhase; greeting: string; line: string; emoji: string };

export function dayArc(d = new Date()): DayArc {
  const h = d.getHours();
  if (h < 12)
    return {
      phase: "morning",
      greeting: "Good morning",
      line: "Fresh mind — let's tackle your toughest topic first.",
      emoji: "🌅",
    };
  if (h < 17)
    return {
      phase: "afternoon",
      greeting: "Good afternoon",
      line: "Good going. Keep the momentum up.",
      emoji: "☀️",
    };
  return {
    phase: "evening",
    greeting: "Good evening",
    line: "Time to revise gently and wind down.",
    emoji: "🌙",
  };
}

// ── Class band label ──────────────────────────────────────────────────────────
// Returns copy variant based on class. Used wherever UI copy should adapt.
export type BandLabel = {
  band: "junior" | "middle" | "senior";
  goalLabel: string;      // e.g. "Great job!" vs "Accuracy improved"
  quizLabel: string;      // e.g. "Let's practise!" vs "Quiz yourself"
  scoreLabel: string;     // e.g. "Your score" vs "Accuracy"
  useDense: boolean;      // true for Classes 6–10 (denser info layout)
};

export function bandLabel(klass: number): BandLabel {
  if (klass <= 5) {
    return {
      band: "junior",
      goalLabel: "Great job! 🎉",
      quizLabel: "Let's practise! ✏️",
      scoreLabel: "Your score",
      useDense: false,
    };
  }
  if (klass <= 8) {
    return {
      band: "middle",
      goalLabel: "Well done!",
      quizLabel: "Quiz yourself",
      scoreLabel: "Score",
      useDense: true,
    };
  }
  return {
    band: "senior",
    goalLabel: "Accuracy improved",
    quizLabel: "Test your knowledge",
    scoreLabel: "Accuracy",
    useDense: true,
  };
}

// ── XP → Level ────────────────────────────────────────────────────────────────
export const levelFromXp = (xp: number): number => Math.floor(xp / 200) + 1;

export const xpToNextLevel = (xp: number): number => {
  const level = levelFromXp(xp);
  return level * 200 - xp;
};

// ── Score count-up animation ──────────────────────────────────────────────────
// Drive BOTH the number label and the bar width from the same value,
// so they move together. This is the 45→68 animation the roadmap calls out.
export function useCountUp(from: number, to: number, ms = 1000): number {
  const [n, setN] = useState(from);

  useEffect(() => {
    if (from === to) {
      setN(to);
      return;
    }
    setN(from);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setN(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);

  return n;
}

// ── Badge display name ────────────────────────────────────────────────────────
const BADGE_NAMES: Record<string, { label: string; emoji: string }> = {
  first_quiz: { label: "First Quiz", emoji: "🏆" },
  streak_3: { label: "3-Day Streak", emoji: "🔥" },
  streak_7: { label: "Week Warrior", emoji: "⚡" },
  hydration_hero: { label: "Hydration Hero", emoji: "💧" },
  quiz_master: { label: "Quiz Master", emoji: "🎯" },
  weakness_cleared: { label: "Weakness Cleared", emoji: "💪" },
};

export function badgeInfo(id: string): { label: string; emoji: string } {
  return BADGE_NAMES[id] ?? { label: id, emoji: "🏅" };
}
