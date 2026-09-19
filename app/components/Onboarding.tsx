"use client";

import { useState } from "react";
import { createProfile } from "@/app/lib/api";
import type { Profile } from "@/app/lib/types";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Props {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [klass, setKlass] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!klass) return setError("Please select your class.");

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
    <div
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 overflow-hidden select-none"
      style={{
        backgroundColor: "#0A0A0F",
        color: "#F5F5F0",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.03); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-kenburns {
          animation: slowZoom 9s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          transform-origin: center center;
          will-change: transform;
        }

        .anim-fadeup { animation: fadeUp 0.5s ease-out both; }
        .anim-fadeup-1 { animation: fadeUp 0.5s ease-out 0.08s both; }
        .anim-fadeup-2 { animation: fadeUp 0.5s ease-out 0.16s both; }
        .anim-fadeup-3 { animation: fadeUp 0.5s ease-out 0.24s both; }
      `}</style>

      {/* ── Full-Bleed Animated Background Scene ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/onboarding-bg.webp"
          alt=""
          width="1600"
          height="900"
          loading="eager"
          className="anim-kenburns w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        {/* Subtle dark overlay for optimal typography legibility */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(10, 10, 15, 0.35)" }}
        />
      </div>

      {/* ── Content Container (Above Background) ── */}
      <div className="relative z-10 max-w-md w-full mx-auto flex flex-col items-center text-center">
        {/* ── Mascot: large, front-and-center, waving ── */}
        <div className="anim-fadeup w-48 h-48 md:w-56 md:h-56 mb-2 shrink-0">
          <img
            src="/mascot-wave.svg"
            alt="AI Mentor mascot welcoming you"
            className="w-full h-full object-contain select-none drop-shadow-xl"
            draggable={false}
          />
        </div>

        {/* ── Headline: under 6 words, confident, marketing tone ── */}
        <h1
          className="anim-fadeup-1 font-display font-bold leading-none mb-3 drop-shadow-md"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4.25rem)",
            lineHeight: 1.05,
            color: "#F5F5F0",
            fontWeight: 700,
          }}
        >
          Know your gaps.<br />
          <span style={{ color: "#F0824A" }}>Raise every score.</span>
        </h1>

        {/* ── Subtitle ── */}
        <p
          className="anim-fadeup-2 text-sm md:text-base mb-7 max-w-sm drop-shadow"
          style={{
            color: "rgba(245, 245, 240, 0.85)",
            lineHeight: 1.5,
          }}
        >
          Adaptive quizzes and a personal AI mentor, matched to your class and weakest topics.
        </p>

        {/* ── Form Card ── */}
        <form
          onSubmit={handleSubmit}
          className="anim-fadeup-2 w-full rounded-2xl p-6 text-left space-y-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="student-name"
              className="block text-xs font-semibold uppercase tracking-wider mb-2 font-display"
              style={{ color: "rgba(245, 245, 240, 0.7)" }}
            >
              Your Name
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-stone-400"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#F5F5F0",
                caretColor: "#F0824A",
              }}
            />
          </div>

          {/* Class Picker */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2.5 font-display"
              style={{ color: "rgba(245, 245, 240, 0.7)" }}
            >
              Your Class (1 to 10)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CLASSES.map((c) => {
                const isSelected = klass === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setKlass(c)}
                    className="py-3 rounded-xl font-display text-sm font-bold transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: "rgba(240, 130, 74, 0.22)",
                            border: "1.5px solid #F0824A",
                            color: "#F0824A",
                            boxShadow: "0 0 16px 0 rgba(240, 130, 74, 0.35)",
                            transform: "scale(1.02)",
                          }
                        : {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            color: "rgba(245, 245, 240, 0.75)",
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
            <p className="text-sm font-medium text-rose-400 bg-rose-500/15 border border-rose-500/25 px-3.5 py-2 rounded-xl">
              {error}
            </p>
          )}

          {/* ── Glowing CTA Button ── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="anim-fadeup-3 w-full py-4 rounded-xl font-display text-sm font-bold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: canSubmit ? "#F0824A" : "rgba(255, 255, 255, 0.08)",
              color: canSubmit ? "#FFFFFF" : "rgba(245, 245, 240, 0.35)",
              boxShadow: canSubmit ? "0 0 24px rgba(240, 130, 74, 0.5)" : "none",
              border: "none",
            }}
          >
            {loading ? "Initialising…" : "Launch Navigator →"}
          </button>
        </form>

        <p
          className="anim-fadeup-3 text-xs mt-6 tracking-wide drop-shadow"
          style={{ color: "rgba(245, 245, 240, 0.45)" }}
        >
          First Commit Hackathon · Sep 2026
        </p>
      </div>
    </div>
  );
}
