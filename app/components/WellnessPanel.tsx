"use client";

import { useState, useEffect } from "react";
import type { Profile } from "@/app/lib/types";
import { logWellness } from "@/app/lib/api";
import { useToast } from "@/app/lib/toast";
import { Droplets, Clock, Activity, Check } from "lucide-react";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
}

const ACTIVITIES = [
  { key: "stretch",   emoji: "🤸", title: "Quick Stretch",    desc: "Stand up, roll your shoulders, touch your toes." },
  { key: "eyes",      emoji: "👁️",  title: "Eye Rest (20-20)", desc: "Look at something 20 ft away for 20 seconds." },
  { key: "breathe",   emoji: "🌬️", title: "Box Breathing",   desc: "4s in · 4s hold · 4s out. One round." },
];

export default function WellnessPanel({ profile, setProfile }: Props) {
  const [seconds,       setSeconds]       = useState(0);
  const [showNudge,     setShowNudge]     = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (next === 1500) setShowNudge(true);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  async function handleLog(type: "hydration" | "break" | "activity", actionKey: string) {
    if (loadingAction) return;
    setLoadingAction(actionKey);
    try {
      const res = await logWellness(type);
      setProfile(res.profile);
      const msg =
        type === "hydration" ? `Glass logged · +${res.xpEarned} XP 💧` :
        type === "break"     ? `Break taken · +${res.xpEarned} XP ☕` :
                               `Activity done · +${res.xpEarned} XP ✅`;
      showSuccess(msg);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Couldn't log. Check connection.");
    } finally {
      setLoadingAction(null);
    }
  }

  const hydration = profile.wellness.hydration;
  const maxGlasses = 8;
  const hydrationGoalMet = hydration >= 4;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <p className="label-tele px-1" style={{ color: "var(--text-3)" }}>CREW WELLNESS SYSTEMS</p>

      {/* ── Session Timer ── */}
      <div
        className="rounded-xl flex items-center justify-between px-5 py-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}
          >
            <Clock size={20} style={{ color: "#00d4ff" }} />
          </div>
          <div>
            <p className="label-tele mb-1" style={{ color: "var(--text-3)" }}>SESSION ELAPSED</p>
            <p className="font-mono-data text-2xl font-bold" style={{ color: "var(--text-1)" }}>
              {formatTime(seconds)}
            </p>
          </div>
        </div>
        {seconds >= 1500 && (
          <span
            className="label-tele px-3 py-1.5 rounded-lg"
            style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.06)" }}
          >
            ▲ REST DUE
          </span>
        )}
      </div>

      {/* Break nudge */}
      {showNudge && (
        <div
          className="rounded-xl px-5 py-4 flex items-start gap-4"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.20)",
          }}
        >
          <span className="text-2xl shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="font-display text-sm font-bold mb-1" style={{ color: "#f59e0b" }}>
              25-MINUTE MARK — REST RECOMMENDED
            </p>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Sustained focus sessions benefit from a 5-minute recovery window.
            </p>
          </div>
          <button
            onClick={() => { setShowNudge(false); handleLog("break", "break"); }}
            className="label-tele px-3 py-2 rounded-lg shrink-0"
            style={{ color: "#00d4ff", border: "1px solid rgba(0,212,255,0.20)", background: "rgba(0,212,255,0.06)" }}
          >
            LOG BREAK
          </button>
          <button
            onClick={() => setShowNudge(false)}
            className="label-tele px-3 py-2 rounded-lg shrink-0"
            style={{ color: "var(--text-3)", border: "1px solid var(--border)" }}
          >
            DISMISS
          </button>
        </div>
      )}

      {/* ── Hydration ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <Droplets size={16} style={{ color: "#00d4ff" }} />
            <span className="label-tele" style={{ color: "var(--text-3)" }}>HYDRATION LOG</span>
          </div>
          <span
            className="font-mono-data text-sm font-bold"
            style={{ color: hydrationGoalMet ? "#00d4aa" : "#00d4ff" }}
          >
            {hydration}/{maxGlasses}
          </span>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-4">
            {Array.from({ length: maxGlasses }, (_, i) => {
              const filled = i < hydration;
              return (
                <button
                  key={i}
                  onClick={() => !filled && handleLog("hydration", `glass-${i}`)}
                  disabled={filled || loadingAction !== null}
                  className="rounded-xl aspect-square flex flex-col items-center justify-center gap-1"
                  style={{
                    background: filled ? "rgba(0,212,255,0.12)" : "var(--surface-2)",
                    border: `1px solid ${filled ? "rgba(0,212,255,0.30)" : "var(--border)"}`,
                    boxShadow: filled ? "0 0 8px 0 rgba(0,212,255,0.15)" : "none",
                  }}
                >
                  <span className="text-xl leading-none">{filled ? "💧" : "○"}</span>
                  {filled && <Check size={10} style={{ color: "#00d4ff" }} />}
                </button>
              );
            })}
          </div>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Target: 4 glasses per session.{" "}
            {hydrationGoalMet ? <span style={{ color: "#00d4aa" }}>◉ Goal met.</span> : "Tap to log."}
          </p>
        </div>
      </div>

      {/* ── Movement activities ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
        >
          <Activity size={16} style={{ color: "#a855f7" }} />
          <span className="label-tele" style={{ color: "var(--text-3)" }}>MICRO-RECOVERY PROTOCOLS</span>
        </div>

        <div className="p-4 space-y-2.5">
          {ACTIVITIES.map(({ key, emoji, title, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-4 rounded-lg"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl leading-none">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{title}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>{desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleLog("activity", key)}
                disabled={loadingAction !== null}
                className="label-tele px-3 py-2 rounded-lg shrink-0 disabled:opacity-40"
                style={{
                  color: "#a855f7",
                  border: "1px solid rgba(168,85,247,0.25)",
                  background: "rgba(168,85,247,0.08)",
                }}
              >
                {loadingAction === key ? "…" : "EXECUTE"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
