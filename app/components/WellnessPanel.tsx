"use client";

import { useState, useEffect } from "react";
import type { Profile } from "@/app/lib/types";
import { logWellness } from "@/app/lib/api";
import { Droplets, Clock, Activity, Check, X, Sparkles, Smile } from "lucide-react";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
}

export default function WellnessPanel({ profile, setProfile }: Props) {
  // Session timer counting up from mount
  const [seconds, setSeconds] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        // After 25 minutes (or 25 seconds for demo/testing convenience if desired; let's trigger a nudge after 1500s or allow early test)
        if (next === 1500) {
          setShowNudge(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  async function handleLog(type: "hydration" | "break" | "activity", actionKey: string) {
    if (loadingAction) return;
    setLoadingAction(actionKey);
    try {
      const res = await logWellness(type);
      setProfile(res.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  }

  // Hydration state: 8 glasses total target
  const hydrationCount = profile.wellness.hydration;
  const maxGlasses = 8;

  const movementActivities = [
    {
      id: "stretch",
      title: "2-Minute Desk Stretch",
      desc: "Roll your shoulders back, stretch your neck gently, and reach for the ceiling.",
      icon: "🧘",
    },
    {
      id: "eyerest",
      title: "20-20-20 Eye Rest",
      desc: "Look at something 20 feet away for 20 seconds to reduce screen strain.",
      icon: "👁️",
    },
    {
      id: "walk",
      title: "Quick Water & Walk",
      desc: "Step away from your desk, walk around the room, and get a glass of water.",
      icon: "🚶",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* ── SESSION TIMER CARD ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Current Study Session
            </p>
            <p className="font-display text-2xl font-bold text-stone-800 tabular-nums">
              {formatTime(seconds)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNudge(!showNudge)}
          className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
        >
          {showNudge ? "Hide Nudge" : "Simulate 25m Nudge"}
        </button>
      </div>

      {/* ── NON-BLOCKING BREAK NUDGE ──────────────────────────────── */}
      {showNudge && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">☕</span>
            <div>
              <p className="font-display text-base font-bold text-amber-900">
                You've been studying hard!
              </p>
              <p className="text-sm text-amber-700 mt-1 leading-snug">
                Stand up, take a 5-minute break, stretch, and grab some water to refresh your brain.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleLog("break", "nudge_break");
                    setShowNudge(false);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-display text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
                >
                  Take Break (+10 XP)
                </button>
                <button
                  onClick={() => setShowNudge(false)}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowNudge(false)}
            className="text-amber-500 hover:text-amber-700 p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── HYDRATION TRACKER ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Droplets size={22} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-stone-800">Hydration Tracker</h3>
              <p className="text-xs text-stone-500">Tap a glass each time you drink water</p>
            </div>
          </div>
          <span className="font-display text-sm font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
            {hydrationCount} / {maxGlasses} glasses
          </span>
        </div>

        {/* 8 Tappable Glass Icons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 my-4">
          {Array.from({ length: maxGlasses }, (_, i) => {
            const isFilled = i < hydrationCount;
            return (
              <button
                key={i}
                disabled={isFilled}
                onClick={() => handleLog("hydration", `glass_${i}`)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  isFilled
                    ? "bg-cyan-50 border-cyan-300 text-cyan-600 cursor-default"
                    : "bg-stone-50 border-stone-200 text-stone-300 hover:border-cyan-300 hover:text-cyan-400"
                }`}
                title={isFilled ? `Glass ${i + 1} logged` : `Click to log glass ${i + 1}`}
              >
                <span className="text-2xl leading-none">{isFilled ? "🥛" : "🥤"}</span>
                <span className="text-[11px] font-bold mt-1 font-display">
                  {isFilled ? "Done" : `+10XP`}
                </span>
              </button>
            );
          })}
        </div>

        {hydrationCount >= 4 && (
          <p className="text-xs text-emerald-600 font-medium text-center mt-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            Daily hydration goal achieved! Hydration Hero progress updated.
          </p>
        )}
      </div>

      {/* ── MOVEMENT & MINDFULNESS ACTIVITIES ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Activity size={22} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-stone-800">Mindful Micro-Breaks</h3>
            <p className="text-xs text-stone-500">
              Short mental breaks boost retention and prevent fatigue
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {movementActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-stone-50 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl shrink-0">{act.icon}</span>
                <div>
                  <p className="font-display text-sm font-bold text-stone-800">{act.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5 max-w-sm">{act.desc}</p>
                </div>
              </div>

              <button
                disabled={loadingAction === act.id}
                onClick={() => handleLog("activity", act.id)}
                className="shrink-0 ml-3 bg-white border border-stone-200 hover:border-indigo-400 text-indigo-600 font-display text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Check size={14} />
                Done (+10 XP)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
