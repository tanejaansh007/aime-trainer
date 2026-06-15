import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import PracticeSession from "@/components/PracticeSession";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  let initialRating: number | null = null;
  if (userId) {
    const rating = await prisma.userSubjectRating.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } },
    });
    initialRating = rating?.rating ?? null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          ← All topics
        </Link>
        <Link
          href={`/learn/${topic.slug}`}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Review lesson
        </Link>
      </div>

      <PracticeSession
        topicSlug={topic.slug}
        topicName={topic.name}
        initialRating={initialRating}
        isAuthed={Boolean(userId)}
      />
    </div>
  );
}
