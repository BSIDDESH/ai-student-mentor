"use client";

import { useState } from "react";
import type { Profile } from "@/app/lib/types";
import { weakTopics, levelFromXp } from "@/app/lib/helpers";
import DayArcHero from "./DayArcHero";
import SubjectProgress from "./SubjectProgress";
import WeakTopicFlags from "./WeakTopicFlags";
import DailyGoals from "./DailyGoals";
import BadgeShelf from "./BadgeShelf";
import MentorChat from "./MentorChat";
import QuizFlow from "./QuizFlow";
import WellnessPanel from "./WellnessPanel";
import { Home, MessageCircle, BookOpen, Droplets, LogOut } from "lucide-react";

type Tab = "dashboard" | "chat" | "quiz" | "wellness";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  signOut?: () => void;
}

export default function DashboardShell({ profile, setProfile, signOut }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [quizPrefill, setQuizPrefill] = useState<{ subject: string; topic: string } | null>(null);

  const level = levelFromXp(profile.xp);
  const weak  = weakTopics(profile.subjects);

  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "dashboard", label: "Home",     icon: Home },
    { id: "chat",      label: "Mentor",   icon: MessageCircle },
    { id: "quiz",      label: "Quiz",     icon: BookOpen },
    { id: "wellness",  label: "Wellness", icon: Droplets },
  ];

  function handleWeakTopicClick(subject: string, topic: string) {
    setQuizPrefill({ subject, topic });
    setTab("quiz");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--chalk)" }}>

      {/* ── Sidebar — desktop only ─────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen shrink-0 border-r"
        style={{ background: "white", borderColor: "#e7e5e4" }}
      >
        {/* App identity */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "#f0ede8" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="font-display text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <p className="font-display text-base font-bold text-stone-800 leading-none">
                AI Mentor
              </p>
              <p className="text-sm text-stone-400 mt-1">Study companion</p>
            </div>
          </div>
        </div>

        {/* XP summary */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "#f0ede8" }}>
          <div className="rounded-2xl p-4" style={{ background: "var(--mist)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display text-2xl font-bold text-stone-900 tabular-nums leading-none">
                  {profile.xp}
                </p>
                <p className="text-sm text-stone-500 mt-1">XP · Level {level}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl leading-none">🔥</span>
                <p className="font-display text-sm font-bold text-stone-700 mt-1 tabular-nums">
                  {profile.streak}d
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                style={{ width: `${((profile.xp % 200) / 200) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                tab === id
                  ? "bg-indigo-600 text-white"
                  : "text-stone-500"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Profile footer */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "#f0ede8" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold text-stone-800">{profile.name}</p>
              <p className="text-sm text-stone-400">Class {profile.klass}</p>
            </div>
            {signOut && (
              <button onClick={signOut} className="p-2 text-stone-400 rounded-lg" title="Sign out">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        {tab === "dashboard" && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            <DayArcHero profile={profile} />
            {weak.length > 0 && (
              <WeakTopicFlags weak={weak} onTopicClick={handleWeakTopicClick} />
            )}
            <SubjectProgress subjects={profile.subjects} />
            <DailyGoals goals={profile.dailyGoals} />
            <BadgeShelf earned={profile.badges} />
          </div>
        )}

        {tab === "chat" && <MentorChat profile={profile} />}

        {tab === "quiz" && (
          <QuizFlow
            profile={profile}
            setProfile={setProfile}
            prefill={quizPrefill}
            onDone={() => {
              setQuizPrefill(null);
              setTab("dashboard");
            }}
          />
        )}

        {tab === "wellness" && (
          <WellnessPanel profile={profile} setProfile={setProfile} />
        )}
      </main>

      {/* ── Bottom tab bar — mobile only ──────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex md:hidden z-20">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 ${
              tab === id ? "text-indigo-600" : "text-stone-400"
            }`}
          >
            <Icon size={20} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
