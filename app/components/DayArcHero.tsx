"use client";

import type { Profile } from "@/app/lib/types";
import { dayArc, levelFromXp, xpToNextLevel, bandLabel } from "@/app/lib/helpers";

interface Props {
  profile: Profile;
}

// ── Orbital XP Ring (SVG, pure CSS transition — zero JS animation cost) ───────
function XpRing({
  progress,
  xp,
  level,
  accentHex,
}: {
  progress: number;
  xp: number;
  level: number;
  accentHex: string;
}) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(progress, 1));

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      aria-label={`${xp} XP, Level ${level}`}
    >
      {/* Outer decorative ring — very faint, astrolabe feel */}
      <circle
        cx="50" cy="50" r="48"
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="0.5"
      />
      {/* Tick marks — 12 evenly spaced, like a compass face */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const inner = 44, outer = 47;
        return (
          <line
            key={i}
            x1={50 + inner * Math.cos(angle)}
            y1={50 + inner * Math.sin(angle)}
            x2={50 + outer * Math.cos(angle)}
            y2={50 + outer * Math.sin(angle)}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />
        );
      })}
      {/* Track */}
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="3.5"
      />
      {/* Progress arc */}
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={accentHex}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50px 50px",
          transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
          filter: `drop-shadow(0 0 4px ${accentHex})`,
        }}
      />
      {/* XP number */}
      <text
        x="50" y="45"
        textAnchor="middle"
        fill={accentHex}
        fontSize="17"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="700"
      >
        {xp}
      </text>
      {/* XP label */}
      <text
        x="50" y="56"
        textAnchor="middle"
        fill="rgba(255,255,255,0.35)"
        fontSize="7"
        fontFamily="'Inter', sans-serif"
        fontWeight="600"
        letterSpacing="1.5"
      >
        XP
      </text>
      {/* Level label */}
      <text
        x="50" y="66"
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontSize="6.5"
        fontFamily="'Inter', sans-serif"
        fontWeight="600"
        letterSpacing="1.5"
      >
        LVL {String(level).padStart(2, "0")}
      </text>
    </svg>
  );
}

export default function DayArcHero({ profile }: Props) {
  const arc     = dayArc();
  const level   = levelFromXp(profile.xp);
  const toNext  = xpToNextLevel(profile.xp);
  const band    = bandLabel(profile.klass);
  const xpProgress = (profile.xp % 200) / 200;

  // Phase accent colour — each phase has a different mission mode
  const phaseAccent = {
    morning:   "#c9a84c",   // gold — dawn, calibration
    afternoon: "#00d4ff",   // cyan — peak output, mission active
    evening:   "#a855f7",   // violet — reflection, orbit established
  }[arc.phase];

  const phaseDim = {
    morning:   "rgba(201,168,76,0.06)",
    afternoon: "rgba(0,212,255,0.06)",
    evening:   "rgba(168,85,247,0.06)",
  }[arc.phase];

  const phaseLabel = {
    morning:   "DAWN CALIBRATION",
    afternoon: "MISSION ACTIVE",
    evening:   "ORBIT ESTABLISHED",
  }[arc.phase];

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")} IST`;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 70% 30%, ${phaseDim} 0%, var(--surface) 65%)`,
        borderColor: "var(--border)",
      }}
    >
      {/* ── Top status bar ── */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.20)" }}
      >
        <span className="label-tele">{phaseLabel} · {timeStr}</span>
        <span className="label-tele" style={{ color: phaseAccent }}>
          ● READOUT ACTIVE
        </span>
      </div>

      {/* ── Main content: ring + data ── */}
      <div className="flex items-center gap-6 px-6 py-5">
        {/* SVG ring — the astrolabe moment */}
        <div className="shrink-0">
          <XpRing
            progress={xpProgress}
            xp={profile.xp}
            level={level}
            accentHex={phaseAccent}
          />
        </div>

        {/* Data column */}
        <div className="flex-1 min-w-0">
          {/* Student name */}
          <h2
            className="font-display font-bold leading-none text-[var(--text-1)] truncate"
            style={{ fontSize: "clamp(1.75rem, 6vw, 2.75rem)" }}
          >
            {band.useDense ? profile.name : `${profile.name}`}
          </h2>

          {/* Class · Level chips */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className="label-tele px-2.5 py-1 rounded-md"
              style={{
                color: phaseAccent,
                border: `1px solid ${phaseAccent}30`,
                background: `${phaseAccent}0d`,
              }}
            >
              CLASS {String(profile.klass).padStart(2, "0")}
            </span>
            <span className="label-tele" style={{ color: "var(--text-3)" }}>·</span>
            <span className="label-tele" style={{ color: "var(--text-2)" }}>
              LVL {String(level).padStart(2, "0")}
            </span>
          </div>

          {/* Streak readout */}
          <div
            className="flex items-center gap-4 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div>
              <p className="label-tele mb-1">STREAK</p>
              <p
                className="font-mono-data font-bold text-2xl leading-none"
                style={{ color: phaseAccent }}
              >
                🔥 {String(profile.streak).padStart(2,"0")}
                <span className="text-sm font-normal ml-1" style={{ color: "var(--text-3)" }}>d</span>
              </p>
            </div>

            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "1rem" }}>
              <p className="label-tele mb-1">NEXT LVL</p>
              <p className="font-mono-data text-base font-semibold" style={{ color: "var(--text-2)" }}>
                {toNext}
                <span className="text-xs font-normal ml-1" style={{ color: "var(--text-3)" }}>XP</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase greeting line ── */}
      <div
        className="px-6 py-3"
        style={{ borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.15)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          {arc.emoji}{" "}
          {band.useDense
            ? arc.line
            : `${arc.greeting}, ${profile.name}. ${arc.line}`}
        </p>
      </div>
    </div>
  );
}
