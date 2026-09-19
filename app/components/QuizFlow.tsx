"use client";

import { useState, useEffect } from "react";
import type { Profile, QuizQuestion } from "@/app/lib/types";
import { generateQuiz, submitQuiz } from "@/app/lib/api";
import { useCountUp, scoreColor, scoreTextColor, badgeInfo } from "@/app/lib/helpers";
import { useToast } from "@/app/lib/toast";
import { Check, X, ArrowRight, RotateCcw, Award, Sparkles, BookOpen } from "lucide-react";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  prefill?: { subject: string; topic: string } | null;
  onDone?: () => void;
}

type QuizState = "pick" | "loading" | "question" | "results";

export default function QuizFlow({ profile, setProfile, prefill, onDone }: Props) {
  const subjectsList = Object.keys(profile.subjects);
  const defaultSubject = prefill?.subject || subjectsList[0] || "Mathematics";
  const defaultTopics = Object.keys(profile.subjects[defaultSubject] || {});
  const defaultTopic = prefill?.topic || defaultTopics[0] || "Fractions";

  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [state, setState] = useState<QuizState>(prefill ? "loading" : "pick");
  const { showError } = useToast();

  // Questions and progress
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Result animation states
  const [resultData, setResultData] = useState<{
    oldScore: number;
    newScore: number;
    xpEarned: number;
    newBadges: string[];
  } | null>(null);

  // Automatically fetch questions if prefilled
  useEffect(() => {
    if (prefill) {
      setSelectedSubject(prefill.subject);
      setSelectedTopic(prefill.topic);
      startQuiz(prefill.subject, prefill.topic);
    }
  }, [prefill]);

  async function startQuiz(subject: string, topic: string) {
    setState("loading");
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setCorrectCount(0);
    setResultData(null);

    try {
      const res = await generateQuiz(subject, topic);
      setQuestions(res.questions);
      setState("question");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't load questions. Check your connection.";
      showError(msg);
      setState("pick");
    }
  }

  function handleOptionSelect(optionIdx: number) {
    if (isAnswerRevealed) return;

    setSelectedOption(optionIdx);
    setIsAnswerRevealed(true);

    const isCorrect = optionIdx === questions[currentIndex].answerIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  }

  async function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      // Quiz finished — correctCount already includes this question's result
      const finalCorrect = correctCount;

      setState("loading");
      try {
        const res = await submitQuiz(selectedSubject, selectedTopic, finalCorrect, questions.length);
        setResultData({
          oldScore: res.oldScore,
          newScore: res.newScore,
          xpEarned: res.xpEarned,
          newBadges: res.newBadges || [],
        });
        // Immediately update global profile state so goals/XP/badges sync
        setProfile(res.profile);
        setState("results");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Couldn't submit your answers. Please try again.";
        showError(msg);
        setState("question"); // drop back — don't lose the student's answers
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* ── STATE 1: PICK TOPIC ────────────────────────────────────── */}
      {state === "pick" && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-stone-800">Choose Practice Quiz</h2>
              <p className="text-sm text-stone-500">Pick a subject and topic to test your skills</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  const s = e.target.value;
                  setSelectedSubject(s);
                  const topics = Object.keys(profile.subjects[s] || {});
                  setSelectedTopic(topics[0] || "");
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium text-stone-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {subjectsList.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium text-stone-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {Object.keys(profile.subjects[selectedSubject] || {}).map((t) => {
                  const score = profile.subjects[selectedSubject][t]?.score;
                  return (
                    <option key={t} value={t}>
                      {t} {score !== undefined ? `(${score}%)` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            onClick={() => startQuiz(selectedSubject, selectedTopic)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display text-base font-semibold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Start Quiz →
          </button>
        </div>
      )}

      {/* ── STATE 2: LOADING SKELETON (MASCOT INTEGRATION) ─────────── */}
      {state === "loading" && (
        <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm text-center">
          {/* Mascot idle — thinking/studying pose */}
          <div className="w-36 h-36 mx-auto mb-4">
            <img
              src="/mascot-idle.svg"
              alt="AI Mentor writing questions…"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-800 mb-2">
            Writing 5 questions just for you…
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mb-6">
            Adapting difficulty to Class {profile.klass} and tailoring to your previous attempts on {selectedTopic}.
          </p>

          <div className="space-y-3 max-w-md mx-auto">
            <div className="h-3 bg-stone-100 rounded-full animate-pulse w-3/4 mx-auto" />
            <div className="h-3 bg-stone-100 rounded-full animate-pulse w-1/2 mx-auto" />
          </div>
        </div>
      )}

      {/* ── STATE 3: QUESTIONS (1 AT A TIME) ──────────────────────── */}
      {state === "question" && questions[currentIndex] && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
          {/* Progress dots & Topic indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedTopic}
              </span>
              <p className="font-display text-sm font-bold text-stone-700 mt-1.5">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-indigo-600 scale-110"
                      : i < currentIndex
                      ? "bg-emerald-500"
                      : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="font-display text-lg font-bold text-stone-900 mb-6 leading-relaxed">
            {questions[currentIndex].question}
          </h3>

          {/* 4 Options */}
          <div className="space-y-3 mb-6">
            {questions[currentIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === questions[currentIndex].answerIndex;

              let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:border-indigo-300";
              let badgeStyle = "bg-white text-stone-500 border-stone-200";

              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                  badgeStyle = "bg-emerald-500 text-white border-emerald-500";
                } else if (isSelected) {
                  btnStyle = "bg-rose-50 border-rose-300 text-rose-900 font-semibold";
                  badgeStyle = "bg-rose-500 text-white border-rose-500";
                } else {
                  btnStyle = "bg-stone-50 border-stone-100 text-stone-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerRevealed}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all text-sm ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center font-display text-xs font-bold shrink-0 ${badgeStyle}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerRevealed && isCorrectAnswer && (
                    <Check size={18} className="text-emerald-600 shrink-0" />
                  )}
                  {isAnswerRevealed && isSelected && !isCorrectAnswer && (
                    <X size={18} className="text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant feedback explanation banner */}
          {isAnswerRevealed && (
            <div className="mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm">
              <p className="font-semibold text-stone-800 mb-1">
                {selectedOption === questions[currentIndex].answerIndex ? "🎉 Correct!" : "💡 Not quite"}
              </p>
              <p className="text-stone-600 leading-relaxed">
                {questions[currentIndex].explanation}
              </p>
            </div>
          )}

          {/* Next / Submit Button */}
          {isAnswerRevealed && (
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display text-base font-semibold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {currentIndex + 1 < questions.length ? "Next Question" : "See Final Results"}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* ── STATE 4: RESULTS (THE 45% -> 68% MONEY SHOT) ─────────── */}
      {state === "results" && resultData && (
        <ResultsView
          subject={selectedSubject}
          topic={selectedTopic}
          correct={correctCount}
          total={questions.length}
          resultData={resultData}
          onRestart={() => startQuiz(selectedSubject, selectedTopic)}
          onDone={onDone}
        />
      )}
    </div>
  );
}

// Separate Subcomponent for Results to isolate count-up hooks cleanly
function ResultsView({
  subject,
  topic,
  correct,
  total,
  resultData,
  onRestart,
  onDone,
}: {
  subject: string;
  topic: string;
  correct: number;
  total: number;
  resultData: {
    oldScore: number;
    newScore: number;
    xpEarned: number;
    newBadges: string[];
  };
  onRestart: () => void;
  onDone?: () => void;
}) {
  // Use count-up hook from helpers
  const animatedScore = useCountUp(resultData.oldScore, resultData.newScore, 1200);
  const crossedThreshold = resultData.oldScore < 60 && resultData.newScore >= 60;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm text-center">
        <span className="text-4xl block mb-2">🎯</span>
        <h2 className="font-display text-2xl font-bold text-stone-900 mb-1">Practice Complete!</h2>
        <p className="text-sm text-stone-500 mb-6">
          You got <span className="font-bold text-stone-800">{correct}</span> out of {total} correct on {topic}
        </p>

        {/* ── VISIBLE SCORE ANIMATION (MONEY SHOT) ── */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Topic Mastery Progress
          </p>

          <div className="flex items-baseline justify-center gap-3 mb-3">
            <span className="text-sm line-through text-stone-400 font-display">
              {resultData.oldScore}%
            </span>
            <span className="text-sm text-stone-400 font-display">→</span>
            <span
              className={`font-display text-4xl font-bold tabular-nums ${scoreTextColor(
                animatedScore
              )}`}
            >
              {animatedScore}%
            </span>
          </div>

          {/* Animating Progress Bar */}
          <div className="h-4 rounded-full bg-stone-200 overflow-hidden max-w-md mx-auto mb-3">
            <div
              className={`h-full rounded-full ${scoreColor(animatedScore)} transition-none`}
              style={{ width: `${animatedScore}%` }}
            />
          </div>

          {crossedThreshold && (
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mt-2">
              <Sparkles size={16} />
              <span>{topic} is no longer a weak topic!</span>
            </div>
          )}
        </div>

        {/* XP & Rewards */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
            <Award size={20} className="text-indigo-600" />
            <span className="font-display font-bold text-indigo-700">+{resultData.xpEarned} XP Earned</span>
          </div>
        </div>

        {/* ── BADGE CELEBRATION (MASCOT INTEGRATION) ── */}
        {resultData.newBadges.length > 0 && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 text-center">
            {/* Mascot celebrating pose */}
            <div className="w-28 h-28 mx-auto mb-3">
              <img
                src="/mascot-celebrate.svg"
                alt="Achievement Unlocked!"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            <p className="text-xs uppercase font-bold tracking-wider text-indigo-600 mb-2">
              🏆 New Achievement Unlocked!
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              {resultData.newBadges.map((b) => {
                const info = badgeInfo(b);
                return (
                  <div key={b} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-indigo-100">
                    <span className="text-2xl">{info.emoji}</span>
                    <span className="font-display text-sm font-bold text-stone-800">{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-display text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            Retake Quiz
          </button>
          <button
            onClick={onDone}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-display text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
