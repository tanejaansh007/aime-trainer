"use client";

import { useCallback, useEffect, useState } from "react";
import Markdown from "@/components/Markdown";
import type { PublicProblem } from "@/lib/problemDTO";
import {
  RATING_MIN,
  RATING_MAX,
  clampRating,
  ratingForPosition,
  tierForPosition,
} from "@/lib/elo";

/** Difficulty summary of the section's actual problem pool (server-computed). */
export interface PoolStats {
  count: number;
  minRating: number;
  maxRating: number;
  minPos: number;
  maxPos: number;
}

// Fallback presets for a section with no pool stats (empty pool). Aligned to
// AMC 8 bands on the stretched scale (#1≈450 … #25≈1500).
const FALLBACK_PRESETS = [
  { rating: 550,  label: "Intro",     sub: "AMC 8 #1–5"   },
  { rating: 820,  label: "Easy",      sub: "AMC 8 #6–12"  },
  { rating: 1080, label: "Medium",    sub: "AMC 8 #13–18" },
  { rating: 1310, label: "Hard",      sub: "AMC 8 #19–22" },
  { rating: 1470, label: "Challenge", sub: "AMC 8 #23–25" },
];

/**
 * Build starting-rating options from the section's real pool: evenly spaced
 * AMC 8 positions between the easiest and hardest problems present, so every
 * option maps to problems that actually exist here.
 */
function poolStartOptions(pool: PoolStats) {
  const { minPos, maxPos } = pool;
  if (minPos >= maxPos) {
    return [{ rating: ratingForPosition(minPos), label: tierForPosition(minPos), sub: `AMC 8 #${minPos}` }];
  }
  const wanted = Math.min(5, maxPos - minPos + 1);
  const anchors: number[] = [];
  for (let i = 0; i < wanted; i++) {
    const pos = Math.round(minPos + (i * (maxPos - minPos)) / (wanted - 1));
    if (!anchors.includes(pos)) anchors.push(pos);
  }
  return anchors.map((pos) => ({
    rating: ratingForPosition(pos),
    label: tierForPosition(pos),
    sub: `AMC 8 #${pos}`,
  }));
}

/** Text-forward difficulty summary: the section's hardest level, stated plainly. */
function SectionDifficulty({ pool }: { pool: PoolStats }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Section difficulty</h3>
        <span className="text-xs text-slate-400">{pool.count} problems</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-indigo-700">
          {tierForPosition(pool.maxPos)}
        </span>
        <span className="text-sm text-slate-500">
          up to AMC 8 <strong>#{pool.maxPos}</strong> (~{pool.maxRating} ELO)
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Spans AMC 8 #{pool.minPos}–#{pool.maxPos} · ELO {pool.minRating}–{pool.maxRating}
      </p>
    </div>
  );
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  solution: string;
  ratingBefore: number;
  ratingAfter: number;
  delta: number;
  persisted: boolean;
}

/** Label a problem rating within the AMC 8 difficulty range. */
function difficultyLabel(rating: number): string {
  if (rating < 700)  return "Intro";
  if (rating < 960)  return "Easy";
  if (rating < 1200) return "Medium";
  if (rating < 1400) return "Hard";
  return "Challenge";
}

export default function PracticeSession({
  topicSlug,
  topicName,
  initialRating,
  isAuthed,
  pool,
}: {
  topicSlug: string;
  topicName: string;
  initialRating: number | null;
  isAuthed: boolean;
  pool: PoolStats | null;
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
  const [custom, setCustom] = useState("");

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
    const options = pool ? poolStartOptions(pool) : FALLBACK_PRESETS;
    // Clamp custom entry to the pool so you can't start above the hardest
    // problem that actually exists in this section.
    const lo = pool ? pool.minRating : RATING_MIN;
    const hi = pool ? pool.maxRating : RATING_MAX;
    const clampToPool = (r: number) => Math.min(hi, Math.max(lo, clampRating(r)));
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-semibold">{topicName}</h2>

        {pool && <SectionDifficulty pool={pool} />}

        <p className="text-slate-600">
          How hard should we start? Your rating will adapt from here.
        </p>
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 5)}, minmax(0, 1fr))` }}
        >
          {options.map((p) => (
            <button
              key={`${p.rating}-${p.sub}`}
              onClick={() => startWithRating(p.rating)}
              className="rounded-md border border-slate-300 px-3 py-3 hover:border-indigo-500 hover:bg-indigo-50"
            >
              <div className="font-semibold text-sm">{p.label}</div>
              <div className="text-xs text-slate-500">{p.sub}</div>
            </button>
          ))}
        </div>

        {/* Custom starting rating — clamped to this section's range. */}
        <div className="flex items-end gap-2 pt-1">
          <label className="flex-1">
            <span className="block text-xs text-slate-500 mb-1">
              Or enter a starting rating ({lo}–{hi})
            </span>
            <input
              type="number"
              min={lo}
              max={hi}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && custom.trim()) {
                  startWithRating(clampToPool(Math.round(Number(custom))));
                }
              }}
              placeholder={`e.g. ${hi}`}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <button
            disabled={!custom.trim() || Number.isNaN(Number(custom))}
            onClick={() => startWithRating(clampToPool(Math.round(Number(custom))))}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Start
          </button>
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
          {pool && (
            <div className="text-xs text-slate-400">
              section maxes at #{pool.maxPos} (~{pool.maxRating})
            </div>
          )}
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
