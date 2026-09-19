"use client";

import { useState, useEffect } from "react";
import type { Profile, QuizQuestion } from "@/app/lib/types";
import { generateQuiz, submitQuiz } from "@/app/lib/api";
import { useCountUp, scoreHex, scoreGlow, badgeInfo } from "@/app/lib/helpers";
import { useToast } from "@/app/lib/toast";
import { Check, X, ArrowRight, RotateCcw, BookOpen } from "lucide-react";

interface Props {
  profile: Profile;
  setProfile: (p: Profile) => void;
  prefill?: { subject: string; topic: string } | null;
  onDone?: () => void;
}

type QuizState = "pick" | "loading" | "question" | "results";

export default function QuizFlow({ profile, setProfile, prefill, onDone }: Props) {
  const subjectsList   = Object.keys(profile.subjects);
  const defaultSubject = prefill?.subject || subjectsList[0] || "Mathematics";
  const defaultTopics  = Object.keys(profile.subjects[defaultSubject] || {});
  const defaultTopic   = prefill?.topic || defaultTopics[0] || "Fractions";

  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [selectedTopic,   setSelectedTopic]   = useState(defaultTopic);
  const [state, setState] = useState<QuizState>(prefill ? "loading" : "pick");
  const { showError } = useToast();

  const [questions,        setQuestions]        = useState<QuizQuestion[]>([]);
  const [currentIndex,     setCurrentIndex]     = useState(0);
  const [selectedOption,   setSelectedOption]   = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctCount,     setCorrectCount]     = useState(0);
  const [resultData, setResultData] = useState<{
    oldScore: number; newScore: number; xpEarned: number; newBadges: string[];
  } | null>(null);

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
      showError(err instanceof Error ? err.message : "Couldn't load questions. Check connection.");
      setState("pick");
    }
  }

  function handleOptionSelect(idx: number) {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    setIsAnswerRevealed(true);
    if (idx === questions[currentIndex].answerIndex) {
      setCorrectCount((p) => p + 1);
    }
  }

  async function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((p) => p + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      const finalCorrect = correctCount;
      setState("loading");
      try {
        const res = await submitQuiz(selectedSubject, selectedTopic, finalCorrect, questions.length);
        setResultData({
          oldScore: res.oldScore, newScore: res.newScore,
          xpEarned: res.xpEarned, newBadges: res.newBadges || [],
        });
        setProfile(res.profile);
        setState("results");
      } catch (err) {
        showError(err instanceof Error ? err.message : "Couldn't submit answers. Please retry.");
        setState("question");
      }
    }
  }

  // ─── PICK ────────────────────────────────────────────────────────────────────
  if (state === "pick") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
          >
            <BookOpen size={18} style={{ color: "#00d4ff" }} />
            <div>
              <p className="font-display text-base font-semibold" style={{ color: "var(--text-1)" }}>
                Select Practice Vector
              </p>
              <p className="label-tele mt-0.5" style={{ color: "var(--text-3)" }}>
                CONFIGURE · DEPLOY · REVIEW
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="label-tele block mb-2" style={{ color: "var(--text-3)" }}>SUBJECT</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  const s = e.target.value;
                  setSelectedSubject(s);
                  const topics = Object.keys(profile.subjects[s] || {});
                  setSelectedTopic(topics[0] || "");
                }}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium outline-none"
                style={{
                  background: "var(--surface-2)", color: "var(--text-1)",
                  border: "1px solid var(--border)",
                }}
              >
                {subjectsList.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label-tele block mb-2" style={{ color: "var(--text-3)" }}>TOPIC</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium outline-none"
                style={{
                  background: "var(--surface-2)", color: "var(--text-1)",
                  border: "1px solid var(--border)",
                }}
              >
                {Object.keys(profile.subjects[selectedSubject] || {}).map((t) => {
                  const s = profile.subjects[selectedSubject][t]?.score;
                  return <option key={t} value={t}>{t}{s !== undefined ? ` · ${s}%` : ""}</option>;
                })}
              </select>
            </div>

            <button
              onClick={() => startQuiz(selectedSubject, selectedTopic)}
              className="w-full py-3.5 rounded-lg font-display text-sm font-bold tracking-wide"
              style={{
                background: "rgba(0,212,255,0.10)",
                border: "1px solid rgba(0,212,255,0.30)",
                color: "#00d4ff",
                boxShadow: "0 0 16px 0 rgba(0,212,255,0.10)",
              }}
            >
              INITIATE QUIZ →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOADING ─────────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse"
            style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}
          >
            <span className="text-2xl">⬡</span>
          </div>
          <p className="font-display text-xl font-bold mb-2" style={{ color: "var(--text-1)" }}>
            Generating 5 questions…
          </p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Calibrating to Class {profile.klass} · {selectedTopic}
          </p>
          <div className="mt-6 space-y-2 max-w-xs mx-auto">
            <div className="h-1.5 rounded-full animate-pulse" style={{ background: "var(--border)" }} />
            <div className="h-1.5 rounded-full animate-pulse w-3/4 mx-auto" style={{ background: "var(--border)" }} />
          </div>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ───────────────────────────────────────────────────────────────
  if (state === "question" && questions[currentIndex]) {
    const q = questions[currentIndex];
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Progress header */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="label-tele px-2 py-1 rounded"
                style={{
                  color: "#00d4ff",
                  border: "1px solid rgba(0,212,255,0.20)",
                  background: "rgba(0,212,255,0.06)",
                }}
              >
                {selectedTopic}
              </span>
              <span className="label-tele" style={{ color: "var(--text-3)" }}>
                Q{currentIndex + 1}/{questions.length}
              </span>
            </div>
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    background:
                      i === currentIndex ? "#00d4ff"
                      : i < currentIndex  ? "#00d4aa"
                      : "rgba(255,255,255,0.12)",
                    boxShadow: i === currentIndex ? "0 0 6px #00d4ff" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Question */}
            <h3 className="font-display text-lg font-semibold leading-snug mb-6" style={{ color: "var(--text-1)" }}>
              {q.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 mb-5">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect  = idx === q.answerIndex;
                let borderColor  = "var(--border)";
                let bg           = "var(--surface-2)";
                let textColor    = "var(--text-2)";
                let icon         = null;

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    borderColor = "rgba(0,212,170,0.40)"; bg = "rgba(0,212,170,0.06)"; textColor = "#00d4aa";
                    icon = <Check size={16} style={{ color: "#00d4aa" }} />;
                  } else if (isSelected) {
                    borderColor = "rgba(255,107,107,0.40)"; bg = "rgba(255,107,107,0.06)"; textColor = "#ff6b6b";
                    icon = <X size={16} style={{ color: "#ff6b6b" }} />;
                  } else {
                    textColor = "var(--text-3)";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerRevealed}
                    onClick={() => handleOptionSelect(idx)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-left text-sm"
                    style={{ background: bg, border: `1px solid ${borderColor}`, color: textColor, transition: "all 0.2s" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono-data shrink-0"
                        style={{
                          background: isAnswerRevealed && isCorrect ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${borderColor}`,
                          color: textColor,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {icon && <span className="shrink-0">{icon}</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation banner */}
            {isAnswerRevealed && (
              <div
                className="mb-5 rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-2)",
                }}
              >
                <span className="font-semibold" style={{ color: "var(--text-1)" }}>
                  {selectedOption === q.answerIndex ? "◉ Correct — " : "▲ Incorrect — "}
                </span>
                {q.explanation}
              </div>
            )}

            {isAnswerRevealed && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-lg font-display text-sm font-bold flex items-center justify-center gap-2"
                style={{
                  background: "rgba(0,212,255,0.10)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  color: "#00d4ff",
                }}
              >
                {currentIndex + 1 < questions.length ? "NEXT CHECKPOINT" : "ANALYSE RESULTS"}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS — THE MONEY SHOT ─────────────────────────────────────────────────
  if (state === "results" && resultData) {
    return (
      <ResultsView
        subject={selectedSubject}
        topic={selectedTopic}
        correct={correctCount}
        total={questions.length}
        resultData={resultData}
        onRestart={() => startQuiz(selectedSubject, selectedTopic)}
        onDone={onDone}
      />
    );
  }

  return null;
}

// ── Results sub-component (isolated for clean hook usage) ─────────────────────
function ResultsView({
  subject, topic, correct, total, resultData, onRestart, onDone,
}: {
  subject: string; topic: string; correct: number; total: number;
  resultData: { oldScore: number; newScore: number; xpEarned: number; newBadges: string[] };
  onRestart: () => void; onDone?: () => void;
}) {
  const animatedScore  = useCountUp(resultData.oldScore, resultData.newScore, 1200);
  const crossedThreshold = resultData.oldScore < 60 && resultData.newScore >= 60;

  // The glow and bar color sweep live alongside the count-up animation
  const barColor = scoreHex(animatedScore);
  const barGlow  = scoreGlow(animatedScore);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* ── Main results card ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Status header */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
        >
          <span className="label-tele" style={{ color: "var(--text-3)" }}>
            TRAJECTORY ANALYSIS COMPLETE
          </span>
          <span className="label-tele" style={{ color: "#00d4aa" }}>
            {correct}/{total} CHECKPOINTS CLEARED
          </span>
        </div>

        <div className="px-6 py-6">
          {/* ── Score row — THE VISUAL CENTREPIECE ── */}
          <div className="flex items-end justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="label-tele mb-2" style={{ color: "var(--text-3)" }}>BEFORE</p>
              <p
                className="font-mono-data font-bold"
                style={{ fontSize: "3rem", color: scoreHex(resultData.oldScore), opacity: 0.5 }}
              >
                {resultData.oldScore}%
              </p>
            </div>

            <span className="text-2xl pb-3" style={{ color: "var(--text-3)" }}>→</span>

            <div className="text-center">
              <p className="label-tele mb-2" style={{ color: "var(--text-3)" }}>AFTER</p>
              {/* The count-up number — changes color as it crosses bands */}
              <p
                className="font-mono-data font-bold"
                style={{
                  fontSize: "4rem",
                  color: barColor,
                  textShadow: `0 0 20px ${barColor}60`,
                  transition: "color 0.1s, text-shadow 0.1s",
                }}
              >
                {animatedScore}%
              </p>
            </div>
          </div>

          {/* ── Glowing progress bar — the sweeping colour animation ── */}
          <div
            className="h-2 rounded-full mb-3"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${animatedScore}%`,
                background: barColor,
                boxShadow: barGlow,
                transition: "width 0s, background 0.1s, box-shadow 0.1s",
              }}
            />
          </div>

          {/* Threshold marker at 60% */}
          <div className="relative h-4 mb-6">
            <div
              className="absolute top-0 h-full w-px"
              style={{ left: "60%", background: "rgba(255,255,255,0.20)" }}
            />
            <span
              className="label-tele absolute top-0"
              style={{ left: "calc(60% + 4px)", color: "rgba(255,255,255,0.25)" }}
            >
              60%
            </span>
          </div>

          {/* Threshold cleared message — appears when > 60 */}
          {crossedThreshold && (
            <div
              className="rounded-lg px-5 py-3 mb-5 flex items-center gap-3"
              style={{
                background: "rgba(0,212,170,0.07)",
                border: "1px solid rgba(0,212,170,0.25)",
                boxShadow: "0 0 24px 0 rgba(0,212,170,0.08)",
              }}
            >
              <span className="text-xl">◉</span>
              <div>
                <p className="font-display text-sm font-bold" style={{ color: "#00d4aa" }}>
                  THRESHOLD CLEARED — COURSE DEVIATION RESOLVED
                </p>
                <p className="label-tele mt-1" style={{ color: "var(--text-2)" }}>
                  {topic} is no longer a weak vector
                </p>
              </div>
            </div>
          )}

          {/* XP + badges */}
          <div
            className="flex items-center gap-4 pt-4 pb-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-2.5"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
            >
              <span className="font-mono-data font-bold text-base" style={{ color: "var(--gold)" }}>
                + {resultData.xpEarned} XP
              </span>
              <span className="label-tele" style={{ color: "var(--gold)" }}>ACQUIRED</span>
            </div>

            {resultData.newBadges.length > 0 && resultData.newBadges.map((b) => {
              const info = badgeInfo(b);
              return (
                <div
                  key={b}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  <span className="text-xl">{info.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-display font-semibold"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-2)",
          }}
        >
          <RotateCcw size={15} /> RETAKE
        </button>
        <button
          onClick={onDone}
          className="flex-1 py-3 rounded-lg text-sm font-display font-bold"
          style={{
            background: "rgba(0,212,255,0.10)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "#00d4ff",
          }}
        >
          RETURN TO NAV →
        </button>
      </div>
    </div>
  );
}
