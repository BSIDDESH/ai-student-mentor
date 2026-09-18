// lib/mocks.ts
// Fake data shaped exactly like CONTRACT.md.
// Seed data: weak topics pre-seeded in the 40s so the dashboard has
// something to flag red on first login — critical for the demo story.

import type { Profile, QuizQuestion } from "./types";

export const MOCK_PROFILE: Profile = {
  userId: "mock-user-001",
  name: "Arjun",
  klass: 7,
  xp: 120,
  streak: 3,
  lastActive: new Date().toISOString(),
  badges: ["first_quiz", "streak_3"],
  subjects: {
    Mathematics: {
      Fractions: { score: 45, attempts: 2, lastAttempt: new Date().toISOString() },
      Algebra: { score: 72, attempts: 3, lastAttempt: new Date().toISOString() },
      Geometry: { score: 88, attempts: 4, lastAttempt: new Date().toISOString() },
    },
    Science: {
      "Light & Optics": { score: 41, attempts: 1, lastAttempt: new Date().toISOString() },
      Electricity: { score: 65, attempts: 2, lastAttempt: new Date().toISOString() },
      "Force & Motion": { score: 80, attempts: 3, lastAttempt: new Date().toISOString() },
    },
    English: {
      Grammar: { score: 55, attempts: 2, lastAttempt: new Date().toISOString() },
      Comprehension: { score: 90, attempts: 5, lastAttempt: new Date().toISOString() },
    },
  },
  wellness: {
    hydration: 2,
    breaks: 1,
    activities: 0,
    date: new Date().toISOString().split("T")[0],
  },
  dailyGoals: [
    { id: "quiz1", label: "Complete 1 practice quiz", done: false },
    { id: "water4", label: "Log 4 glasses of water", done: false },
    { id: "move1", label: "One movement break", done: false },
    { id: "chat1", label: "Ask your mentor a question", done: false },
  ],
};

// Named MOCK_QUIZ — matches the import in api.ts exactly
export const MOCK_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is 3/4 + 1/4?",
    options: ["1/2", "1", "3/8", "7/8"],
    answerIndex: 1,
    explanation: "When fractions share a denominator, add numerators: 3+1=4, so 4/4 = 1.",
  },
  {
    id: "q2",
    question: "Which of the following is an improper fraction?",
    options: ["1/2", "3/4", "7/3", "2/5"],
    answerIndex: 2,
    explanation: "An improper fraction has a numerator larger than its denominator. 7 > 3.",
  },
  {
    id: "q3",
    question: "Simplify 6/8.",
    options: ["3/4", "2/3", "1/2", "4/6"],
    answerIndex: 0,
    explanation: "Divide both by GCD (2): 6÷2=3, 8÷2=4 → 3/4.",
  },
  {
    id: "q4",
    question: "What is 1/2 × 4?",
    options: ["2", "4", "1/8", "8"],
    answerIndex: 0,
    explanation: "Multiply numerator by 4: 1×4=4, keep denominator: 4/2 = 2.",
  },
  {
    id: "q5",
    question: "Convert 5/4 to a mixed number.",
    options: ["1 1/4", "2 1/4", "1 1/2", "1 3/4"],
    answerIndex: 0,
    explanation: "5 ÷ 4 = 1 remainder 1, so 5/4 = 1 and 1/4.",
  },
];
