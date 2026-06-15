import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const levels = await prisma.level.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        where: { parentId: null },
        orderBy: { order: "asc" },
        include: {
          children: {
            orderBy: { order: "asc" },
            include: { _count: { select: { problems: true } } },
          },
          _count: { select: { problems: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Train for AMC &amp; AIME with adaptive practice
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Pick a topic, read a short lesson, then solve problems whose difficulty
          auto-adjusts to a per-subject ELO rating. Sign in to save your progress,
          or jump in as a guest.
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
              href="/practice/number-theory"
              className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Continue as guest →
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-6">
        {levels.map((level) => (
          <div key={level.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              {level.name}
            </h2>
            <div className="space-y-4">
              {level.topics.map((topic) => {
                const subtotal = topic.children.reduce(
                  (n, c) => n + c._count.problems,
                  0,
                );
                return (
                  <div
                    key={topic.id}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{topic.name}</h3>
                        <p className="text-sm text-slate-500">
                          {subtotal + topic._count.problems} problems ·{" "}
                          {topic.children.length} subtopics
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link
                          href={`/learn/${topic.slug}`}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                        >
                          Overview
                        </Link>
                        <Link
                          href={`/practice/${topic.slug}`}
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                        >
                          Practice all
                        </Link>
                      </div>
                    </div>

                    {topic.children.length > 0 && (
                      <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                        {topic.children.map((c) => (
                          <li
                            key={c.id}
                            className="flex items-center justify-between gap-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {c.name}
                              </div>
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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
