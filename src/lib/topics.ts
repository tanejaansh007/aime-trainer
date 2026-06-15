import { prisma } from "@/lib/prisma";

// Resolve a topic slug to the set of topic ids whose problems it should serve:
// the topic itself plus all descendant subtopics. This lets both a leaf
// subtopic slug and the parent "number-theory" slug drive practice/review.
export async function resolveTopicScope(slug: string): Promise<{
  topicId: string;
  name: string;
  scopeIds: string[];
} | null> {
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) return null;

  // One level of children is enough for the current curriculum depth; recurse
  // defensively in case the tree grows deeper later.
  const scopeIds = [topic.id];
  let frontier = [topic.id];
  while (frontier.length) {
    const children = await prisma.topic.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });
    const ids = children.map((c) => c.id);
    if (ids.length === 0) break;
    scopeIds.push(...ids);
    frontier = ids;
  }

  return { topicId: topic.id, name: topic.name, scopeIds };
}
