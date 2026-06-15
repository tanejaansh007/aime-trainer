import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Markdown from "@/components/Markdown";
import { bandForRating, type Difficulty } from "@/lib/elo";

const BANDS: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy · AMC 8" },
  { key: "medium", label: "Medium · AMC 10" },
  { key: "hard", label: "Hard · AIME" },
];

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicSlug: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { topicSlug } = await params;
  const { level } = await searchParams;

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      lessons: true,
      children: { orderBy: { order: "asc" } },
    },
  });
  if (!topic) notFound();

  const leveled = topic.lessons.filter((l) => l.band !== "all");
  const hasBands = leveled.length > 0;

  // Choose the band: explicit ?level= wins, else the logged-in user's rating
  // for this topic, else medium.
  let band: Difficulty = "medium";
  if (level === "easy" || level === "medium" || level === "hard") {
    band = level;
  } else {
    const session = await auth();
    if (session?.user?.id) {
      const r = await prisma.userSubjectRating.findUnique({
        where: { userId_topicId: { userId: session.user.id, topicId: topic.id } },
      });
      if (r) band = bandForRating(r.rating);
    }
  }

  const body = hasBands
    ? topic.lessons.find((l) => l.band === band)?.bodyMarkdown
    : topic.lessons.find((l) => l.band === "all")?.bodyMarkdown;

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
          ← All topics
        </Link>
        <Link
          href={`/practice/${topic.slug}`}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Start practice →
        </Link>
      </div>

      <h1 className="text-2xl font-bold">{topic.name}</h1>

      {hasBands && (
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Lesson difficulty
          </div>
          <div className="flex flex-wrap gap-2">
            {BANDS.map((b) => (
              <Link
                key={b.key}
                href={`/learn/${topic.slug}?level=${b.key}`}
                scroll={false}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  b.key === band
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {body ? (
          <Markdown>{body}</Markdown>
        ) : (
          <p className="text-slate-500">No lesson is available for this topic yet.</p>
        )}
      </div>

      {/* Parent overview: link out to each subtopic */}
      {topic.children.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Subtopics
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {topic.children.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <span>{c.name}</span>
                <span className="flex gap-2">
                  <Link href={`/learn/${c.slug}`} className="text-indigo-600 hover:underline">
                    Lesson
                  </Link>
                  <Link href={`/practice/${c.slug}`} className="text-indigo-600 hover:underline">
                    Practice
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <Link
          href={`/practice/${topic.slug}`}
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
        >
          I&apos;m ready — practice {topic.name} →
        </Link>
      </div>
    </article>
  );
}
