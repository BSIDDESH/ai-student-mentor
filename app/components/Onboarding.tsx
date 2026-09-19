"use client";

import { useState } from "react";
import { createProfile } from "@/app/lib/api";
import type { Profile } from "@/app/lib/types";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Props {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [name,      setName]      = useState("");
  const [klass,     setKlass]     = useState<number | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: "var(--canvas)",
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo mark — decorative orbital ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="40" cy="40" r="37" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
              {/* Middle ring */}
              <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(0,212,255,0.20)" strokeWidth="1" />
              {/* Inner circle */}
              <circle cx="40" cy="40" r="16" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.35)" strokeWidth="1" />
              {/* Center dot */}
              <circle cx="40" cy="40" r="3" fill="#00d4ff" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: "var(--text-1)" }}>
            AI Mentor
          </h1>
          <p className="label-tele mb-3" style={{ color: "var(--text-3)" }}>
            INITIALISE YOUR NAVIGATOR PROFILE
          </p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Your study companion for Classes 1–10. Adaptive, persistent, personalized.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 space-y-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Name input */}
          <div>
            <label className="label-tele block mb-2" style={{ color: "var(--text-3)" }}>
              CALLSIGN (YOUR NAME)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && klass && handleSubmit()}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-1)",
                caretColor: "#00d4ff",
              }}
            />
          </div>

          {/* Class chips */}
          <div>
            <label className="label-tele block mb-3" style={{ color: "var(--text-3)" }}>
              MISSION CLASS
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CLASSES.map((c) => {
                const isSelected = klass === c;
                return (
                  <button
                    key={c}
                    onClick={() => setKlass(c)}
                    className="py-3 rounded-xl font-mono-data text-sm font-bold"
                    style={
                      isSelected
                        ? {
                            background: "rgba(0,212,255,0.12)",
                            border: "1px solid rgba(0,212,255,0.40)",
                            color: "#00d4ff",
                            boxShadow: "0 0 12px 0 rgba(0,212,255,0.15)",
                          }
                        : {
                            background: "var(--surface-2)",
                            border: "1px solid var(--border)",
                            color: "var(--text-2)",
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

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !klass || loading}
            className="w-full py-4 rounded-xl font-display text-sm font-bold disabled:opacity-40"
            style={{
              background: name.trim() && klass ? "rgba(0,212,255,0.10)" : "var(--surface-2)",
              border: `1px solid ${name.trim() && klass ? "rgba(0,212,255,0.30)" : "var(--border)"}`,
              color: name.trim() && klass ? "#00d4ff" : "var(--text-3)",
              boxShadow: name.trim() && klass ? "0 0 20px 0 rgba(0,212,255,0.10)" : "none",
            }}
          >
            {loading ? "INITIALISING…" : "LAUNCH NAVIGATOR →"}
          </button>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-3)" }}>
          First Commit Hackathon · Sep 2026
        </p>
      </div>
    </div>
  );
}
