"use client";

import { useState } from "react";
import Markdown from "@/components/Markdown";
import type { PublicProblem } from "@/lib/problemDTO";

type Phase = "build" | "take" | "result";

interface GradeResult {
  problemId: string;
  isCorrect: boolean;
  correctAnswer: string | null;
  solution: string | null;
}

const DIFFICULTIES = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
] as const;

export default function ReviewSession({
  topics,
}: {
  topics: { slug: string; name: string }[];
}) {
  const [phase, setPhase] = useState<Phase>("build");
  const [selected, setSelected] = useState<string[]>(
    topics.length === 1 ? [topics[0].slug] : [],
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [length, setLength] = useState(8);

  const [problems, setProblems] = useState<PublicProblem[]>([]);
  const [reviewTestId, setReviewTestId] = useState<string | undefined>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<GradeResult[]>([]);
  const [score, setScore] = useState<{ score: number; total: number } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTopic(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  async function build() {
    if (selected.length === 0) {
      setError("Pick at least one topic.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlugs: selected, difficulty, length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not build test");
      setProblems(data.problems);
      setReviewTestId(data.reviewTestId);
      setAnswers({});
      setResults([]);
      setScore(null);
      setPhase("take");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function grade() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/review/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewTestId,
          topicSlugs: selected,
          difficulty,
          answers: problems.map((p) => ({
            problemId: p.id,
            answerGiven: answers[p.id] ?? "",
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not grade test");
      setResults(data.results);
      setScore({ score: data.score, total: data.total });
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const resultById = new Map(results.map((r) => [r.problemId, r]));

  if (phase === "build") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
        <div>
          <div className="text-sm font-semibold mb-2">Topics</div>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.slug}
                onClick={() => toggleTopic(t.slug)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  selected.includes(t.slug)
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-2">Difficulty</div>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`rounded-md border px-4 py-2 text-sm ${
                  difficulty === d.key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">
            Length: <span className="tabular-nums">{length}</span> questions
          </label>
          <input
            type="range"
            min={3}
            max={12}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={build}
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Building…" : "Generate test"}
        </button>
      </div>
    );
  }

  // take + result share the question list
  return (
    <div className="space-y-4">
      {score && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-5 text-center">
          <div className="text-sm uppercase tracking-wide text-indigo-500">Score</div>
          <div className="text-3xl font-bold text-indigo-700">
            {score.score} / {score.total}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ol className="space-y-4">
        {problems.map((p, i) => {
          const r = resultById.get(p.id);
          return (
            <li
              key={p.id}
              className="rounded-lg border border-slate-200 bg-white p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {i + 1}</span>
                {r && (
                  <span className={r.isCorrect ? "text-green-600" : "text-red-500"}>
                    {r.isCorrect ? "✓ correct" : "✗ incorrect"}
                  </span>
                )}
              </div>
              <Markdown>{p.statementMarkdown}</Markdown>

              {p.type === "MULTIPLE_CHOICE" && p.choices ? (
                <div className="grid gap-2">
                  {p.choices.map((choice) => {
                    const letter = choice.trim().charAt(0).toUpperCase();
                    const chosen = answers[p.id] === letter;
                    const isAnswer = r?.correctAnswer?.toUpperCase().includes(letter);
                    return (
                      <button
                        key={choice}
                        disabled={phase === "result"}
                        onClick={() => setAnswers((a) => ({ ...a, [p.id]: letter }))}
                        className={[
                          "text-left rounded-md border px-4 py-2",
                          phase === "result" && isAnswer
                            ? "border-green-500 bg-green-50"
                            : phase === "result" && chosen
                            ? "border-red-400 bg-red-50"
                            : chosen
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
                  value={answers[p.id] ?? ""}
                  disabled={phase === "result"}
                  onChange={(e) => setAnswers((a) => ({ ...a, [p.id]: e.target.value }))}
                  placeholder="Your answer…"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50"
                />
              )}

              {r && (
                <div className="rounded-md bg-slate-50 px-4 py-3 text-sm">
                  <span className="font-semibold">Answer: {r.correctAnswer}</span>
                  {r.solution && <Markdown>{r.solution}</Markdown>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {phase === "take" ? (
        <button
          onClick={grade}
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Grading…" : "Submit test"}
        </button>
      ) : (
        <button
          onClick={() => setPhase("build")}
          className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
        >
          Build another test
        </button>
      )}
    </div>
  );
}
