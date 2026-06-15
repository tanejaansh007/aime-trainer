import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { selectProblem } from "@/lib/selectProblem";
import { toPublicProblem } from "@/lib/problemDTO";
import { practiceNextSchema } from "@/lib/validation";
import { resolveTopicScope } from "@/lib/topics";

// POST /api/practice/next
// { topicSlug, currentRating, seenIds } -> the next adaptive problem (no answer leaked).
export async function POST(request: Request) {
  const parsed = practiceNextSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { topicSlug, currentRating, seenIds } = parsed.data;

  const scope = await resolveTopicScope(topicSlug);
  if (!scope) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const candidates = await prisma.problem.findMany({
    where: { topicId: { in: scope.scopeIds } },
    select: { id: true, rating: true },
  });

  const chosen = selectProblem(candidates, currentRating, { seenIds });
  if (!chosen) {
    // No problems at all, or every problem has been seen and the pool is empty.
    return NextResponse.json({ done: true, problem: null });
  }

  const problem = await prisma.problem.findUnique({ where: { id: chosen.id } });
  if (!problem) {
    return NextResponse.json({ done: true, problem: null });
  }

  return NextResponse.json({
    done: false,
    problem: toPublicProblem(problem),
    poolSize: candidates.length,
  });
}
