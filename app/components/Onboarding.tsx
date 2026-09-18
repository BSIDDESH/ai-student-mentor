"use client";

import { useState } from "react";
import type { Profile } from "@/app/lib/types";
import { createProfile } from "@/app/lib/api";

interface Props {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [klass, setKlass] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!klass) return setError("Please pick your class.");
    setError("");
    setLoading(true);
    try {
      const { profile } = await createProfile(name.trim(), klass);
      onComplete(profile);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--chalk)" }}>
      <div className="bg-white rounded-3xl border border-stone-100 p-8 w-full max-w-md shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl mx-auto mb-3">
            🎓
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Welcome to AI Mentor!</h1>
          <p className="text-stone-500 text-sm mt-1.5 leading-relaxed">
            Your personal adaptive learning companion. Tell us about yourself to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <div>
            <label className="block font-display text-sm font-bold text-stone-700 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Class selection: 10 tappable chips */}
          <div>
            <label className="block font-display text-sm font-bold text-stone-700 mb-2">
              Select your class (1 to 10)
            </label>
            <p className="text-xs text-stone-400 mb-3">
              This sets the tone and difficulty of questions and AI explanations.
            </p>
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setKlass(c)}
                  className={`py-3 rounded-xl text-sm font-display font-bold border-2 transition-all ${
                    klass === c
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm scale-[1.03]"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:border-indigo-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-display text-base font-semibold rounded-xl py-3.5 transition-colors shadow-sm"
          >
            {loading ? "Creating your profile…" : "Start Learning →"}
          </button>
        </form>
      </div>
    </div>
  );
}
