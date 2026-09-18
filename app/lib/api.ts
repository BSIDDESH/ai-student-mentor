// lib/api.ts — THE ONLY PLACE fetch() APPEARS
// Flip these to false one endpoint at a time as Siddu's routes go live.
// NEVER call fetch() directly from a component — always go through here.

import { fetchAuthSession } from "aws-amplify/auth";
import { MOCK_PROFILE, MOCK_QUIZ } from "./mocks";
import type { Profile, QuizQuestion, ChatMessage } from "./types";

// ── Mock switches (flip per-endpoint as Siddu's routes go live) ──────────────
const USE_MOCKS = {
  profile: true,
  chat: true,
  quiz: true,
  wellness: true,
};

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// Artificial delay — keep these. They force real loading states on Day 1
// so real latency on Friday doesn't surprise you.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Auth header helper (used from Day 2 onward) ───────────────────────────────
async function authHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch {
    // During mock phase, auth isn't configured — return empty headers
    return { "Content-Type": "application/json" };
  }
}

// ── Base fetch wrapper ────────────────────────────────────────────────────────
async function call(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: await authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data;
}

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
