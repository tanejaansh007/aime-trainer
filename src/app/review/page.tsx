import { prisma } from "@/lib/prisma";
import ReviewSession from "@/components/ReviewSession";

export default async function ReviewPage() {
  // Topics that actually have problems to draw from.
  const topics = await prisma.topic.findMany({
    where: { problems: { some: {} } },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Build a review test</h1>
        <p className="text-slate-600">
          Pick one or more topics and a difficulty. We&apos;ll assemble a
          fixed-length test from the problem bank and score it.
        </p>
      </div>
      <ReviewSession topics={topics} />
    </div>
  );
}
