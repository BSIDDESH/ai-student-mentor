// lib/api.ts — THE ONLY PLACE fetch() APPEARS
// Endpoints wired to backend with client-generated X-User-Id + ngrok header.
// NEVER call fetch() directly from a component — always go through here.

import { MOCK_PROFILE, MOCK_QUIZ } from "./mocks";
import type { Profile, QuizQuestion, ChatMessage } from "./types";

// ── Mock switches (flip per-endpoint as backend routes go live) ──────────────
export const USE_MOCKS = {
  profile: false,
  chat: false,
  quiz: false,
  wellness: false,
};

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// Storage key for anonymous user identity
const USER_ID_KEY = "ai_mentor_user_id";

// ── Client-side User ID helper with SSR guard ─────────────────────────────────
export function getUserId(): string {
  if (typeof window === "undefined") {
    return "ssr-user";
  }
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return "fallback-user";
  }
}

// ── Auth headers helper ───────────────────────────────────────────────────────
export function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-User-Id": getUserId(),
    "ngrok-skip-browser-warning": "true",
  };
}

// ── Base fetch wrapper ────────────────────────────────────────────────────────
async function call(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : data.error || (Array.isArray(data.detail) && data.detail[0]?.msg ? data.detail[0].msg : "Something went wrong. Please try again.");
    throw new Error(message);
  }
  return data;
}

// Artificial delay for mock mode
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<{ exists: boolean; profile?: Profile }> {
  if (USE_MOCKS.profile) {
    await sleep(400);
    return { exists: true, profile: MOCK_PROFILE };
  }
  return call("/profile");
}

export async function createProfile(name: string, klass: number): Promise<{ profile: Profile }> {
  if (USE_MOCKS.profile) {
    await sleep(400);
    return { profile: { ...MOCK_PROFILE, name, klass } };
  }
  return call("/profile", "POST", { name, klass });
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export async function sendChat(
  message: string,
  history: ChatMessage[]
): Promise<{ reply: string }> {
  if (USE_MOCKS.chat) {
    await sleep(900);
    return {
      reply:
        "Good question! Before I explain, tell me this: if you cut a chapati into 4 equal pieces and eat 1, how much is left?",
    };
  }
  return call("/chat", "POST", { message, history: history.slice(-10) });
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

export async function generateQuiz(
  subject: string,
  topic: string
): Promise<{ questions: QuizQuestion[] }> {
  if (USE_MOCKS.quiz) {
    await sleep(1500);
    return { questions: MOCK_QUIZ };
  }
  return call("/quiz/generate", "POST", { subject, topic });
}

export async function submitQuiz(
  subject: string,
  topic: string,
  correct: number,
  total: number
): Promise<{
  oldScore: number;
  newScore: number;
  xpEarned: number;
  newBadges: string[];
  profile: Profile;
}> {
  if (USE_MOCKS.quiz) {
    await sleep(600);
    const oldScore = MOCK_PROFILE.subjects[subject]?.[topic]?.score ?? 45;
    const newScore = 68;
    if (MOCK_PROFILE.subjects[subject]?.[topic]) {
      MOCK_PROFILE.subjects[subject][topic].score = newScore;
      MOCK_PROFILE.subjects[subject][topic].attempts += 1;
    }
    MOCK_PROFILE.xp += 50;
    if (!MOCK_PROFILE.badges.includes("first_quiz")) {
      MOCK_PROFILE.badges.push("first_quiz");
    }
    const quizGoal = MOCK_PROFILE.dailyGoals.find((g) => g.id === "quiz1");
    if (quizGoal) quizGoal.done = true;

    return {
      oldScore,
      newScore,
      xpEarned: 50,
      newBadges: ["first_quiz"],
      profile: { ...MOCK_PROFILE },
    };
  }
  return call("/quiz/submit", "POST", { subject, topic, correct, total });
}

// ── Wellness ──────────────────────────────────────────────────────────────────

export async function logWellness(
  type: "hydration" | "break" | "activity"
): Promise<{ xpEarned: number; profile: Profile }> {
  if (USE_MOCKS.wellness) {
    await sleep(300);
    if (type === "hydration") {
      MOCK_PROFILE.wellness.hydration = Math.min(8, MOCK_PROFILE.wellness.hydration + 1);
      if (MOCK_PROFILE.wellness.hydration >= 4) {
        const wg = MOCK_PROFILE.dailyGoals.find((g) => g.id === "water4");
        if (wg) wg.done = true;
      }
    } else if (type === "break") {
      MOCK_PROFILE.wellness.breaks += 1;
    } else if (type === "activity") {
      MOCK_PROFILE.wellness.activities += 1;
      const mg = MOCK_PROFILE.dailyGoals.find((g) => g.id === "move1");
      if (mg) mg.done = true;
    }
    MOCK_PROFILE.xp += 10;
    return { xpEarned: 10, profile: { ...MOCK_PROFILE } };
  }
  return call("/wellness", "POST", { type });
}
