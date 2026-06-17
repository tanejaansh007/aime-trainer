import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const session = await auth();

  // Top-level subjects become the tabs.
  const subjects = await prisma.topic.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: {
      children: {
        orderBy: { order: "asc" },
        include: { _count: { select: { problems: true } } },
      },
      _count: { select: { problems: true } },
    },
  });

  if (subjects.length === 0) {
    return <p className="text-slate-500">No subjects have been seeded yet.</p>;
  }

  const problemCount = (s: (typeof subjects)[number]) =>
    s._count.problems + s.children.reduce((n, c) => n + c._count.problems, 0);

  // Active subject: ?subject= wins, else the first one that has content.
  const active =
    subjects.find((s) => s.slug === subject) ??
    subjects.find((s) => problemCount(s) > 0) ??
    subjects[0];
  const activeCount = problemCount(active);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Train for AMC &amp; AIME with adaptive practice
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Pick a subject and topic, read a lesson at your level, then solve problems
          whose difficulty auto-adjusts to a per-subject ELO rating.
        </p>
        {!session?.user && (
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create account / sign in
            </Link>
            <Link
              href={`/practice/${activeCount > 0 ? active.slug : "number-theory"}`}
              className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Continue as guest →
            </Link>
          </div>
        )}
      </section>

      {/* Subject tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {subjects.map((s) => {
          const isActive = s.id === active.id;
          const count = problemCount(s);
          return (
            <Link
              key={s.id}
              href={`/?subject=${s.slug}`}
              scroll={false}
              className={[
                "px-4 py-2 text-sm -mb-px border-b-2",
                isActive
                  ? "border-indigo-600 text-indigo-700 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              {s.name}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-slate-400">{count}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Active subject */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{active.name}</h2>
            <p className="text-sm text-slate-500">
              {activeCount} problems · {active.children.length} subtopics
            </p>
          </div>
          {activeCount > 0 && (
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/learn/${active.slug}`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                Overview
              </Link>
              <Link
                href={`/practice/${active.slug}`}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
              >
                Practice all
              </Link>
            </div>
          )}
        </div>

        {active.children.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            <p className="font-medium text-slate-600">{active.name} is coming soon.</p>
            <p className="text-sm mt-1">
              Problems and lessons for this subject haven&apos;t been added yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {active.children.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    {c._count.problems} problems
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/learn/${c.slug}`}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100"
                  >
                    Lesson
                  </Link>
                  <Link
                    href={`/practice/${c.slug}`}
                    className="rounded-md bg-indigo-600/90 px-2.5 py-1 text-xs text-white hover:bg-indigo-700"
                  >
                    Practice
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
