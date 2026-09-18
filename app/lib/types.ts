// lib/types.ts
// Matches CONTRACT.md exactly — don't rename or restructure fields.

export type TopicScore = {
  score: number;
  attempts: number;
  lastAttempt: string; // ISO timestamp
};

export type Subjects = {
  [subject: string]: {
    [topic: string]: TopicScore;
  };
};

export type Wellness = {
  hydration: number;
  breaks: number;
  activities: number;
  date: string; // "YYYY-MM-DD"
};

export type DailyGoal = {
  id: string;
  label: string;
  done: boolean;
};

export type Profile = {
  userId: string;
  name: string;
  klass: number; // 1..10
  xp: number;
  streak: number;
  lastActive: string;
  badges: string[];
  subjects: Subjects;
  wellness: Wellness;
  dailyGoals: DailyGoal[];
};

export type WeakTopic = {
  subject: string;
  topic: string;
  score: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[]; // always 4
  answerIndex: number;
  explanation: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
