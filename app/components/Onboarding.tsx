"use client";

import { useState } from "react";
import { createProfile } from "@/app/lib/api";
import type { Profile } from "@/app/lib/types";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Props {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [name,    setName]    = useState("");
  const [klass,   setKlass]   = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit() {
    if (!name.trim() || !klass) return;
    setLoading(true);
    setError("");
    try {
      const { profile } = await createProfile(name.trim(), klass);
      onComplete(profile);
    } catch {
      setError("Something went wrong. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!name.trim() && !!klass && !loading;

  return (
    /*
     * Dark cinematic hero — ONBOARDING ONLY.
     * Every other screen keeps the existing dark-canvas orbital design.
     * Background is slightly deeper (#0A0A0F) for maximum mascot contrast.
     */
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{
        background: "#0A0A0F",
        color: "#F5F5F0",
      }}
    >
      <div className="max-w-md mx-auto w-full px-8 py-10 flex flex-col items-center gap-0">

        {/* ── MASCOT — large, front-and-center, waving/welcoming ── */}
        <div className="fade-up w-56 h-56 md:w-64 md:h-64 mb-2">
          <img
            src="/mascot-wave.svg"
            alt="AI Mentor mascot waving"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* ── HERO HEADLINE — the one place in the app for bold marketing copy ── */}
        <h1
          className="fade-up-d1 font-display font-bold text-center leading-none mb-4"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            lineHeight: 1.05,
            color: "#F5F5F0",
          }}
        >
          Know your gaps.<br />
          <span style={{ color: "#F0824A" }}>Raise every score.</span>
        </h1>

        {/* ── SUBTITLE ── */}
        <p
          className="fade-up-d2 text-base text-center mb-8 max-w-xs"
          style={{ color: "rgba(245,245,240,0.5)", lineHeight: 1.55 }}
        >
          Adaptive quizzes and an AI mentor, matched to your class and weakest topics — every session.
        </p>

        {/* ── FORM CARD — existing name + class-picker logic, unchanged ── */}
        <div
          className="fade-up-d2 w-full rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Name input */}
          <div>
            <label
              className="text-xs font-semibold tracking-wider uppercase block mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              YOUR NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && klass && handleSubmit()}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#F5F5F0",
                caretColor: "#F0824A",
              }}
            />
          </div>

          {/* Class chips */}
          <div>
            <label
              className="text-xs font-semibold tracking-wider uppercase block mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              YOUR CLASS
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CLASSES.map((c) => {
                const isSelected = klass === c;
                return (
                  <button
                    key={c}
                    onClick={() => setKlass(c)}
                    className="py-3 rounded-xl font-display text-sm font-bold transition-all"
                    style={
                      isSelected
                        ? {
                            background: "rgba(240,130,74,0.16)",
                            border: "1px solid rgba(240,130,74,0.60)",
                            color: "#F0824A",
                            boxShadow: "0 0 16px 0 rgba(240,130,74,0.25)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(245,245,240,0.50)",
                          }
                    }
                  >
                    {String(c).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ff6b6b" }}>{error}</p>
          )}
        </div>

        {/* ── CTA — sun orange with glow, as specified ── */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="fade-up-d3 w-full mt-4 py-4 rounded-xl font-display text-sm font-bold tracking-wide disabled:opacity-40"
          style={{
            background: canSubmit ? "#F0824A" : "rgba(255,255,255,0.06)",
            color: canSubmit ? "#ffffff" : "rgba(245,245,240,0.30)",
            boxShadow: canSubmit ? "0 0 24px rgba(240,130,74,0.50)" : "none",
            border: "none",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          {loading ? "INITIALISING…" : "LAUNCH NAVIGATOR →"}
        </button>

        <p
          className="fade-up-d3 text-center text-sm mt-6"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          First Commit Hackathon · Sep 2026
        </p>
      </div>
    </div>
  );
}
