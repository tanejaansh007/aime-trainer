import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { toPublicProblem } from "@/lib/problemDTO";
import { reviewBuildSchema } from "@/lib/validation";
import { startingRating } from "@/lib/elo";
import { resolveTopicScope } from "@/lib/topics";

// POST /api/review
// Builds a fixed-length test from the bank: the `length` problems whose ratings
// sit closest to the chosen difficulty band, across the selected topics.
export async function POST(request: Request) {
  const parsed = reviewBuildSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { topicSlugs, difficulty, length } = parsed.data;

  const scopes = await Promise.all(topicSlugs.map((s) => resolveTopicScope(s)));
  const scopeIds = [...new Set(scopes.flatMap((s) => s?.scopeIds ?? []))];
  if (scopeIds.length === 0) {
    return NextResponse.json({ error: "No matching topics" }, { status: 404 });
  }

  const target = startingRating(difficulty);
  const pool = await prisma.problem.findMany({
    where: { topicId: { in: scopeIds } },
  });
  if (pool.length === 0) {
    return NextResponse.json({ error: "No problems available" }, { status: 404 });
  }

  const chosen = [...pool]
    .sort((a, b) => Math.abs(a.rating - target) - Math.abs(b.rating - target))
    .slice(0, Math.min(length, pool.length))
    // present in ascending difficulty
    .sort((a, b) => a.rating - b.rating);

  const session = await auth();
  const userId = session?.user?.id;

  let reviewTestId: string | undefined;
  if (userId) {
    const test = await prisma.reviewTest.create({
      data: {
        userId,
        topicIds: JSON.stringify(topicSlugs),
        difficulty,
        problemIds: JSON.stringify(chosen.map((p) => p.id)),
      },
    });
    reviewTestId = test.id;
  }

  return NextResponse.json({
    reviewTestId,
    difficulty,
    problems: chosen.map(toPublicProblem),
  });
}
