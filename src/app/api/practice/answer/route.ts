import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkAnswer, type ProblemType } from "@/lib/checkAnswer";
import { updateRating, DIFFICULTY_PRESETS } from "@/lib/elo";
import { practiceAnswerSchema } from "@/lib/validation";
import { resolveTopicScope } from "@/lib/topics";

// POST /api/practice/answer
// Grades a submitted answer, returns correctness + solution + new rating.
// For logged-in users it persists an Attempt and updates the per-subject rating
// (using the DB rating as authoritative). For guests it is pure-compute.
export async function POST(request: Request) {
  const parsed = practiceAnswerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { topicSlug, problemId, answerGiven, ratingBefore: guestRating } = parsed.data;

  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  // Rating is tracked against the practiced topic (which may be a parent that
  // aggregates several subtopics), not the problem's own leaf topic.
  const scope = await resolveTopicScope(topicSlug);
  if (!scope) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }
  const ratingTopicId = scope.topicId;

  const isCorrect = checkAnswer(problem.type as ProblemType, answerGiven, problem.answer);

  const session = await auth();
  const userId = session?.user?.id;

  let ratingBefore = guestRating;
  let problemsAttempted = 0;

  if (userId) {
    const existing = await prisma.userSubjectRating.findUnique({
      where: { userId_topicId: { userId, topicId: ratingTopicId } },
    });
    ratingBefore = existing?.rating ?? DIFFICULTY_PRESETS.medium;
    problemsAttempted = existing?.problemsAttempted ?? 0;
  }

  const { ratingAfter, delta } = updateRating(
    ratingBefore,
    problem.rating,
    isCorrect,
    problemsAttempted,
  );

  if (userId) {
    await prisma.$transaction([
      prisma.attempt.create({
        data: {
          userId,
          problemId: problem.id,
          answerGiven,
          isCorrect,
          ratingBefore,
          ratingAfter,
        },
      }),
      prisma.userSubjectRating.upsert({
        where: { userId_topicId: { userId, topicId: ratingTopicId } },
        update: { rating: ratingAfter, problemsAttempted: problemsAttempted + 1 },
        create: {
          userId,
          topicId: ratingTopicId,
          rating: ratingAfter,
          problemsAttempted: 1,
        },
      }),
    ]);
  }

  return NextResponse.json({
    isCorrect,
    correctAnswer: problem.answer,
    solution: problem.solutionMarkdown,
    ratingBefore,
    ratingAfter,
    delta,
    persisted: Boolean(userId),
  });
}
