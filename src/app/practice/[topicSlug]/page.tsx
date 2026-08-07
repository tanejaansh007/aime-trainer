import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { resolveTopicScope } from "@/lib/topics";
import { positionForRating } from "@/lib/elo";
import PracticeSession, { type PoolStats } from "@/components/PracticeSession";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const scope = await resolveTopicScope(topicSlug);
  if (!scope) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  let initialRating: number | null = null;
  if (userId) {
    const rating = await prisma.userSubjectRating.findUnique({
      where: { userId_topicId: { userId, topicId: scope.topicId } },
    });
    initialRating = rating?.rating ?? null;
  }

  // Summarize the actual problem pool so the picker and the difficulty meter
  // reflect what this section really contains — not a fixed global scale.
  const rows = await prisma.problem.findMany({
    where: { topicId: { in: scope.scopeIds } },
    select: { rating: true },
  });

  let pool: PoolStats | null = null;
  if (rows.length > 0) {
    const ratings = rows.map((r) => r.rating).sort((a, b) => a - b);
    const minRating = ratings[0];
    const maxRating = ratings[ratings.length - 1];
    const minPos = positionForRating(minRating);
    const maxPos = positionForRating(maxRating);
    pool = { count: ratings.length, minRating, maxRating, minPos, maxPos };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          ← All topics
        </Link>
        <Link
          href={`/learn/${topicSlug}`}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Review lesson
        </Link>
      </div>

      <PracticeSession
        topicSlug={topicSlug}
        topicName={scope.name}
        initialRating={initialRating}
        isAuthed={Boolean(userId)}
        pool={pool}
      />
    </div>
  );
}
