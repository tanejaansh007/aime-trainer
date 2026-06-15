import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const [ratings, attempts] = await Promise.all([
    prisma.userSubjectRating.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: { rating: "desc" },
    }),
    prisma.attempt.findMany({
      where: { userId },
      include: { problem: { include: { topic: true } } },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const totalCorrect = attempts.filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {session.user.name || session.user.email}
        </h1>
        <Link
          href="/practice/number-theory"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Practice →
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Subject ratings
        </h2>
        {ratings.length === 0 ? (
          <p className="text-slate-500">
            No ratings yet —{" "}
            <Link href="/practice/number-theory" className="text-indigo-600 underline">
              start practicing
            </Link>{" "}
            to build one.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ratings.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-slate-200 bg-white p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{r.topic.name}</div>
                  <div className="text-xs text-slate-500">
                    {r.problemsAttempted} problems attempted
                  </div>
                </div>
                <div className="text-3xl font-bold tabular-nums text-indigo-600">
                  {r.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recent attempts
          {attempts.length > 0 && (
            <span className="ml-2 font-normal normal-case text-slate-400">
              ({totalCorrect}/{attempts.length} correct)
            </span>
          )}
        </h2>
        {attempts.length === 0 ? (
          <p className="text-slate-500">No attempts yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {attempts.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className={
                      a.isCorrect ? "text-green-600" : "text-red-500"
                    }
                  >
                    {a.isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-500">{a.problem.topic.name}</span>
                  {a.reviewTestId && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                      review
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-slate-400">
                  {a.ratingBefore} → {a.ratingAfter}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
