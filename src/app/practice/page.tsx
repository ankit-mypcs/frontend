/**
 * PURPOSE: Interactive practice page — fetch random PYQs, answer with UPPCS marking
 * USED BY: App Router (/practice?subject=3)
 * DEPENDS ON: api.ts, Nav.tsx, Footer.tsx
 */

"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Question, AnswerResult } from "@/lib/api";

/* ── Constants ── */
const SET_SIZE = 10;
const MARKS_CORRECT = 2.0;
const MARKS_WRONG = -0.66;

/** Wrapper to provide Suspense boundary for useSearchParams. */
export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <>
          <Nav />
          <main
            className="min-h-screen flex items-center justify-center"
            style={{ background: "#FAF8F5" }}
          >
            <div className="text-center">
              <div
                className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: "#E8E4DC", borderTopColor: "#E07020" }}
              />
              <p className="font-bold">Loading...</p>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject_id")
    ? Number(searchParams.get("subject_id"))
    : undefined;
  const subjectName = searchParams.get("subject_name") || undefined;

  /* ── State ── */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [startTime] = useState(Date.now());

  /* ── Fetch questions ── */
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRandomSet(SET_SIZE, subjectId);
      setQuestions(data);
    } catch {
      /* API error — questions stays empty */
    }
    setLoading(false);
  }, [subjectId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  /* ── Handlers ── */
  const handleSelect = (option: string) => {
    if (result) return; // already answered
    setSelected(option);
  };

  const handleSubmit = async () => {
    if (!selected || result) return;
    setSubmitting(true);
    try {
      const q = questions[currentIndex];
      const res = await api.checkAnswer(q.id, selected);
      setResult(res);
      setScore((prev) => prev + res.marks);
      if (res.is_correct) setCorrect((prev) => prev + 1);
      else setWrong((prev) => prev + 1);
    } catch {
      /* error submitting */
    }
    setSubmitting(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setSessionDone(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setResult(null);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setResult(null);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setSessionDone(false);
    loadQuestions();
  };

  /* ── Derived values ── */
  const question = questions[currentIndex];
  const progress = questions.length
    ? ((currentIndex + (result ? 1 : 0)) / questions.length) * 100
    : 0;
  const elapsedMin = Math.round((Date.now() - startTime) / 60000);
  const accuracy =
    correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  /* ── Loading state ── */
  if (loading) {
    return (
      <>
        <Nav />
        <main
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#FAF8F5" }}
        >
          <div className="text-center">
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#E8E4DC", borderTopColor: "#E07020" }}
            />
            <p className="font-bold">Loading questions...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Empty state ── */
  if (questions.length === 0) {
    return (
      <>
        <Nav />
        <main
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: "#FAF8F5" }}
        >
          <div className="text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg font-bold mb-2">No questions found</p>
            <p className="text-sm mb-6" style={{ color: "#7A7168" }}>
              Try a different subject or check if the API is running.
            </p>
            <a
              href="/subjects"
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ background: "#E07020" }}
            >
              ← Back to Subjects
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Session complete ── */
  if (sessionDone) {
    return (
      <>
        <Nav />
        <main
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: "#FAF8F5" }}
        >
          <div
            className="bg-white border rounded-2xl p-8 max-w-md w-full text-center"
            style={{ borderColor: "#E8E4DC" }}
          >
            <div className="text-5xl mb-4">
              {accuracy >= 70 ? "🎯" : accuracy >= 40 ? "💪" : "📚"}
            </div>
            <h2 className="text-2xl font-black mb-1">Session Complete!</h2>
            <p className="text-sm mb-6" style={{ color: "#7A7168" }}>
              {accuracy >= 70
                ? "Excellent work! Keep this momentum going."
                : accuracy >= 40
                  ? "Good effort! Focus on your weak areas."
                  : "Every mistake is a lesson. Review and try again!"}
            </p>

            {/* Stats grid */}
            <div
              className="grid grid-cols-2 gap-px rounded-xl overflow-hidden mb-6"
              style={{ background: "#E8E4DC" }}
            >
              {[
                { label: "Accuracy", value: `${accuracy}%`, color: "#000080" },
                {
                  label: "Marks",
                  value: score >= 0 ? `+${score.toFixed(2)}` : score.toFixed(2),
                  color: score >= 0 ? "#046A38" : "#DC2626",
                },
                { label: "Correct", value: String(correct), color: "#046A38" },
                { label: "Wrong", value: String(wrong), color: "#DC2626" },
                {
                  label: "Time",
                  value: `${elapsedMin || "<1"} min`,
                  color: "#7A7168",
                },
                {
                  label: "Questions",
                  value: String(questions.length),
                  color: "#7A7168",
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-white py-4 px-3">
                  <div
                    className="text-xl font-black"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[0.62rem] font-bold uppercase tracking-wider mt-1"
                    style={{ color: "#B5AEA4" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* UPPCS marking reminder */}
            <div
              className="text-xs rounded-lg p-3 mb-6"
              style={{ background: "#FAF8F5", color: "#7A7168" }}
            >
              UPPCS Marking: +{MARKS_CORRECT.toFixed(2)} correct /{" "}
              {MARKS_WRONG.toFixed(2)} wrong
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-white"
                style={{ background: "#E07020" }}
              >
                Practice Again →
              </button>
              <a
                href="/subjects"
                className="flex-1 py-3 rounded-lg text-sm font-bold border text-center"
                style={{ borderColor: "#E8E4DC", color: "#3D3730" }}
              >
                Change Subject
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Question card ── */
  const options = [
    { key: "A", text: question.option_a },
    { key: "B", text: question.option_b },
    { key: "C", text: question.option_c },
    { key: "D", text: question.option_d },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen" style={{ background: "#FAF8F5" }}>
        {/* ── Top bar: progress + score ── */}
        <div
          className="border-b px-4 py-3"
          style={{ borderColor: "#E8E4DC", background: "white" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center text-sm mb-2">
              <span style={{ color: "#7A7168" }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="font-bold" style={{ color: "#000080" }}>
                Score: {score >= 0 ? "+" : ""}
                {score.toFixed(2)}
              </span>
            </div>
            {/* Progress bar */}
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "#E8E4DC" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "#E07020" }}
              />
            </div>
          </div>
        </div>

        {/* ── Question ── */}
        <section className="max-w-2xl mx-auto px-4 py-8">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.subject_name && (
              <span
                className="px-2.5 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(0,0,128,0.08)",
                  color: "#000080",
                }}
              >
                {question.subject_name}
              </span>
            )}
            {question.difficulty && (
              <span
                className="px-2.5 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(224,112,32,0.08)",
                  color: "#E07020",
                }}
              >
                {question.difficulty}
              </span>
            )}
            {question.year > 0 && (
              <span
                className="px-2.5 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(0,0,0,0.04)",
                  color: "#7A7168",
                }}
              >
                {question.year}
              </span>
            )}
          </div>

          {/* Stem */}
          <h2
            className="text-lg font-bold leading-relaxed mb-6"
            style={{ fontFamily: "'Lexend',sans-serif" }}
          >
            {question.stem}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {options.map((opt) => {
              let borderColor = "#E8E4DC";
              let bg = "white";
              let textColor = "#3D3730";

              if (result) {
                // After answer submitted
                if (opt.key === result.correct_answer) {
                  borderColor = "#046A38";
                  bg = "rgba(4,106,56,0.06)";
                  textColor = "#046A38";
                } else if (
                  opt.key === selected &&
                  !result.is_correct
                ) {
                  borderColor = "#DC2626";
                  bg = "rgba(220,38,38,0.06)";
                  textColor = "#DC2626";
                }
              } else if (opt.key === selected) {
                borderColor = "#E07020";
                bg = "rgba(224,112,32,0.06)";
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={!!result}
                  className="w-full text-left border rounded-xl p-4 transition-all flex gap-3 items-start"
                  style={{
                    borderColor,
                    background: bg,
                    color: textColor,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ borderColor }}
                  >
                    {opt.key}
                  </span>
                  <span
                    className="text-sm leading-relaxed pt-1"
                    style={{ fontFamily: "'Lexend',sans-serif" }}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit / Next button */}
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: "#E07020" }}
            >
              {submitting ? "Checking..." : "Submit Answer"}
            </button>
          ) : (
            <div>
              {/* Result banner */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: result.is_correct
                    ? "rgba(4,106,56,0.08)"
                    : "rgba(220,38,38,0.08)",
                  borderLeft: `4px solid ${result.is_correct ? "#046A38" : "#DC2626"}`,
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-bold"
                    style={{
                      color: result.is_correct ? "#046A38" : "#DC2626",
                    }}
                  >
                    {result.is_correct ? "✓ Correct!" : "✗ Wrong"}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: result.is_correct ? "#046A38" : "#DC2626",
                    }}
                  >
                    {result.marks > 0 ? "+" : ""}
                    {result.marks.toFixed(2)} marks
                  </span>
                </div>
                {result.question.explanation && (
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{
                      color: "#7A7168",
                      fontFamily: "'Lexend',sans-serif",
                    }}
                  >
                    {result.question.explanation}
                  </p>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "#000080" }}
              >
                {currentIndex + 1 >= questions.length
                  ? "See Results →"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
