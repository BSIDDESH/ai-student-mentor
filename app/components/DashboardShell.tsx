"use client";

import { useState, useEffect } from "react";
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
import {
  SkeletonHero,
  SkeletonChat,
  SkeletonQuiz,
  SkeletonWellness,
} from "./ui/Skeleton";
import { ToastProvider } from "@/app/lib/toast";
import { Home, MessageCircle, BookOpen, Droplets, LogOut } from "lucide-react";

type Tab = "dashboard" | "chat" | "quiz" | "wellness";

const TAB_DELAY: Record<Tab, number> = {
  dashboard: 0,
  chat:      250,
  quiz:      200,
  wellness:  220,
};

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  signOut?: () => void;
}

export default function DashboardShell({ profile, setProfile, signOut }: Props) {
  const [tab,           setTab]          = useState<Tab>("dashboard");
  const [loadingTab,    setLoadingTab]   = useState<Tab | null>(null);
  const [quizPrefill,   setQuizPrefill]  = useState<{ subject: string; topic: string } | null>(null);

  const level = levelFromXp(profile.xp);
  const weak  = weakTopics(profile.subjects);

  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "dashboard", label: "Home",     icon: Home },
    { id: "chat",      label: "Mentor",   icon: MessageCircle },
    { id: "quiz",      label: "Quiz",     icon: BookOpen },
    { id: "wellness",  label: "Wellness", icon: Droplets },
  ];

  function switchTab(newTab: Tab) {
    if (newTab === tab && loadingTab === null) return;
    const delay = TAB_DELAY[newTab];
    if (delay > 0) {
      setLoadingTab(newTab);
      setTab(newTab);
      const t = setTimeout(() => setLoadingTab(null), delay);
      return () => clearTimeout(t);
    } else {
      setTab(newTab);
      setLoadingTab(null);
    }
  }

  function handleWeakTopicClick(subject: string, topic: string) {
    setQuizPrefill({ subject, topic });
    switchTab("quiz");
  }

  useEffect(() => {
    if (quizPrefill) switchTab("quiz");
  }, [quizPrefill]);

  const isLoading = loadingTab === tab;

  return (
  <ToastProvider>
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ background: "var(--canvas)" }}
    >
      {/* ── Sidebar — desktop ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen shrink-0"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Brand */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            {/* Mini orbital logo */}
            <svg width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="15" fill="none" stroke="rgba(0,212,255,0.20)" strokeWidth="0.8" />
              <circle cx="17" cy="17" r="10" fill="none" stroke="rgba(0,212,255,0.30)" strokeWidth="0.8" />
              <circle cx="17" cy="17" r="5"  fill="rgba(0,212,255,0.06)" stroke="#00d4ff" strokeWidth="1" />
              <circle cx="17" cy="17" r="2"  fill="#00d4ff" />
            </svg>
            <div>
              <p className="font-display text-base font-bold" style={{ color: "var(--text-1)" }}>AI Mentor</p>
              <p className="label-tele" style={{ color: "var(--text-3)" }}>NAVIGATOR ACTIVE</p>
            </div>
          </div>
        </div>

        {/* Profile readout */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <p className="font-display text-xl font-bold truncate" style={{ color: "var(--text-1)" }}>
              {profile.name}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="label-tele" style={{ color: "var(--text-3)" }}>
                CLASS {String(profile.klass).padStart(2,"0")}
              </span>
              <span style={{ color: "var(--border)" }}>·</span>
              <span className="label-tele" style={{ color: "var(--text-3)" }}>
                LVL {String(level).padStart(2,"0")}
              </span>
            </div>

            {/* XP bar */}
            <div className="mt-3">
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${((profile.xp % 200) / 200) * 100}%`,
                    background: "#00d4ff",
                    boxShadow: "0 0 6px 0 rgba(0,212,255,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="label-tele" style={{ color: "var(--text-3)" }}>
                  {profile.xp % 200} XP
                </span>
                <span className="label-tele" style={{ color: "var(--text-3)" }}>200</span>
              </div>
            </div>

            {/* Streak */}
            <div
              className="flex items-center gap-2 mt-3 pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span className="text-base">🔥</span>
              <span className="font-mono-data text-sm font-bold" style={{ color: "#c9a84c" }}>
                {profile.streak}d streak
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold relative"
                style={{
                  background:   isActive ? "rgba(0,212,255,0.08)" : "transparent",
                  border:       isActive ? "1px solid rgba(0,212,255,0.20)" : "1px solid transparent",
                  color:        isActive ? "#00d4ff" : "var(--text-3)",
                }}
              >
                <Icon size={16} />
                {label}
                {isLoading && tab === id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4ff" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        {signOut && (
          <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{ color: "var(--text-3)", border: "1px solid var(--border)" }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        {tab === "dashboard" && !isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
            <DayArcHero profile={profile} />
            {weak.length > 0 && (
              <WeakTopicFlags weak={weak} onTopicClick={handleWeakTopicClick} />
            )}
            <SubjectProgress subjects={profile.subjects} />
            <DailyGoals goals={profile.dailyGoals} />
            <BadgeShelf earned={profile.badges} />
          </div>
        )}
        {tab === "dashboard" && isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-6"><SkeletonHero /></div>
        )}

        {tab === "chat" && !isLoading && <MentorChat profile={profile} />}
        {tab === "chat" && isLoading && <SkeletonChat />}

        {tab === "quiz" && !isLoading && (
          <QuizFlow
            profile={profile}
            setProfile={setProfile}
            prefill={quizPrefill}
            onDone={() => { setQuizPrefill(null); switchTab("dashboard"); }}
          />
        )}
        {tab === "quiz" && isLoading && <SkeletonQuiz />}

        {tab === "wellness" && !isLoading && (
          <WellnessPanel profile={profile} setProfile={setProfile} />
        )}
        {tab === "wellness" && isLoading && <SkeletonWellness />}
      </main>

      {/* ── Bottom tab bar — mobile ────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden z-20"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 relative"
              style={{ color: isActive ? "#00d4ff" : "var(--text-3)" }}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
              {isActive && (
                <span
                  className="absolute top-1.5 right-[28%] w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00d4ff", boxShadow: "0 0 4px #00d4ff" }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  </ToastProvider>
  );
}
