"use client";

import { useCallback, useEffect, useState } from "react";
import Markdown from "@/components/Markdown";
import type { PublicProblem } from "@/lib/problemDTO";

const PRESETS = [
  { key: "easy", label: "Easy", rating: 800 },
  { key: "medium", label: "Medium", rating: 1200 },
  { key: "hard", label: "Hard", rating: 1600 },
] as const;

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  solution: string;
  ratingBefore: number;
  ratingAfter: number;
  delta: number;
  persisted: boolean;
}

/** Label a problem rating as an approximate difficulty for display. */
function difficultyLabel(rating: number): string {
  if (rating < 1000) return "Easy";
  if (rating < 1350) return "Medium";
  if (rating < 1550) return "Hard";
  return "Very hard";
}

export default function PracticeSession({
  topicSlug,
  topicName,
  initialRating,
  isAuthed,
}: {
  topicSlug: string;
  topicName: string;
  initialRating: number | null;
  isAuthed: boolean;
}) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [problem, setProblem] = useState<PublicProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [given, setGiven] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const fetchNext = useCallback(
    async (currentRating: number, seen: string[]) => {
      setLoading(true);
      setError(null);
      setResult(null);
      setGiven("");
      try {
        const res = await fetch("/api/practice/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicSlug, currentRating, seenIds: seen }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load problem");
        if (data.done || !data.problem) {
          setDone(true);
          setProblem(null);
        } else {
          setProblem(data.problem as PublicProblem);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [topicSlug],
  );

  // Auto-start when we already have a rating (authed returning user).
  useEffect(() => {
    if (rating !== null && !problem && !done && stats.total === 0 && !loading) {
      fetchNext(rating, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startWithRating(r: number) {
    setRating(r);
    fetchNext(r, []);
  }

  async function submitAnswer() {
    if (!problem || rating === null || !given.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug,
          problemId: problem.id,
          answerGiven: given,
          ratingBefore: rating,
        }),
      });
      const data = (await res.json()) as AnswerResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to grade answer");
      setResult(data);
      setRating(data.ratingAfter);
      setSeenIds((prev) => [...prev, problem.id]);
      setStats((s) => ({
        correct: s.correct + (data.isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function nextProblem() {
    if (rating === null) return;
    fetchNext(rating, seenIds);
  }

  // ---- Difficulty picker (new session) ----
  if (rating === null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-semibold">{topicName}</h2>
        <p className="text-slate-600">
          How hard should we start? Your rating will adapt from here.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => startWithRating(p.rating)}
              className="rounded-md border border-slate-300 px-4 py-3 hover:border-indigo-500 hover:bg-indigo-50"
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-xs text-slate-500">start ~{p.rating}</div>
            </button>
          ))}
        </div>
        {!isAuthed && (
          <p className="text-xs text-amber-600">
            You&apos;re practicing as a guest — your rating won&apos;t be saved.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat bar */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Your rating
          </div>
          <div className="text-2xl font-bold tabular-nums">{rating}</div>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>
            {stats.correct} / {stats.total} correct
          </div>
          {!isAuthed && <div className="text-xs text-amber-600">guest · not saved</div>}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {done && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center space-y-3">
          <p className="text-lg font-semibold">You&apos;ve seen every problem! 🎉</p>
          <p className="text-slate-600">
            Final rating: <span className="font-bold">{rating}</span> ·{" "}
            {stats.correct}/{stats.total} correct.
          </p>
        </div>
      )}

      {!done && problem && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Difficulty: {difficultyLabel(problem.rating)} (~{problem.rating})
            </span>
            <span>{problem.type === "MULTIPLE_CHOICE" ? "Multiple choice" : "Short answer"}</span>
          </div>

          <div className="text-lg">
            <Markdown>{problem.statementMarkdown}</Markdown>
          </div>

          {/* Answer input */}
          {problem.type === "MULTIPLE_CHOICE" && problem.choices ? (
            <div className="grid gap-2">
              {problem.choices.map((choice) => {
                const letter = choice.trim().charAt(0).toUpperCase();
                const selected = given === letter;
                const locked = result !== null;
                const isAnswer = result?.correctAnswer.toUpperCase().includes(letter);
                return (
                  <button
                    key={choice}
                    disabled={locked}
                    onClick={() => setGiven(letter)}
                    className={[
                      "text-left rounded-md border px-4 py-2 transition",
                      locked && isAnswer
                        ? "border-green-500 bg-green-50"
                        : locked && selected
                        ? "border-red-400 bg-red-50"
                        : selected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={given}
              disabled={result !== null}
              onChange={(e) => setGiven(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !result) submitAnswer();
              }}
              placeholder="Type your answer…"
              className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50"
            />
          )}

          {/* Result / actions */}
          {result ? (
            <div className="space-y-4">
              <div
                className={[
                  "rounded-md px-4 py-3 font-medium",
                  result.isCorrect
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800",
                ].join(" ")}
              >
                {result.isCorrect ? "Correct!" : "Not quite."}{" "}
                <span className="font-normal">
                  Answer: <strong>{result.correctAnswer}</strong>.
                </span>{" "}
                <span className="font-normal">
                  Rating {result.ratingBefore} →{" "}
                  <strong>{result.ratingAfter}</strong> (
                  {result.delta >= 0 ? "+" : ""}
                  {result.delta}).
                </span>
              </div>
              <div className="rounded-md bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Solution
                </div>
                <Markdown>{result.solution}</Markdown>
              </div>
              <button
                onClick={nextProblem}
                disabled={loading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Loading…" : "Next problem →"}
              </button>
            </div>
          ) : (
            <button
              onClick={submitAnswer}
              disabled={loading || !given.trim()}
              className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Checking…" : "Submit answer"}
            </button>
          )}
        </div>
      )}

      {!done && !problem && loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
          Loading problem…
        </div>
      )}
    </div>
  );
}
