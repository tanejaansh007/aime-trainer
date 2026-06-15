import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkAnswer, type ProblemType } from "@/lib/checkAnswer";
import { reviewGradeSchema } from "@/lib/validation";

// POST /api/review/grade
// Grades a completed review test. Returns per-question correctness, the correct
// answer, and the solution. For logged-in users it records the attempts (tagged
// with the review test) without moving the adaptive practice rating.
export async function POST(request: Request) {
  const parsed = reviewGradeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { answers, reviewTestId } = parsed.data;

  const problems = await prisma.problem.findMany({
    where: { id: { in: answers.map((a) => a.problemId) } },
  });
  const byId = new Map(problems.map((p) => [p.id, p]));

  const session = await auth();
  const userId = session?.user?.id;

  const results = answers.map((a) => {
    const problem = byId.get(a.problemId);
    if (!problem) {
      return {
        problemId: a.problemId,
        isCorrect: false,
        correctAnswer: null as string | null,
        solution: null as string | null,
      };
    }
    const isCorrect = checkAnswer(
      problem.type as ProblemType,
      a.answerGiven,
      problem.answer,
    );
    return {
      problemId: a.problemId,
      isCorrect,
      correctAnswer: problem.answer,
      solution: problem.solutionMarkdown,
    };
  });

  if (userId) {
    // Record review attempts for history; ratings are unchanged for review tests.
    const ratingByTopic = new Map<string, number>();
    for (const r of results) {
      const problem = byId.get(r.problemId);
      if (!problem) continue;
      if (!ratingByTopic.has(problem.topicId)) {
        const existing = await prisma.userSubjectRating.findUnique({
          where: { userId_topicId: { userId, topicId: problem.topicId } },
        });
        ratingByTopic.set(problem.topicId, existing?.rating ?? problem.rating);
      }
      const snapshot = ratingByTopic.get(problem.topicId)!;
      await prisma.attempt.create({
        data: {
          userId,
          problemId: problem.id,
          answerGiven: answers.find((a) => a.problemId === r.problemId)!.answerGiven,
          isCorrect: r.isCorrect,
          ratingBefore: snapshot,
          ratingAfter: snapshot,
          reviewTestId: reviewTestId ?? null,
        },
      });
    }
  }

  const score = results.filter((r) => r.isCorrect).length;
  return NextResponse.json({
    score,
    total: results.length,
    results,
    persisted: Boolean(userId),
  });
}
