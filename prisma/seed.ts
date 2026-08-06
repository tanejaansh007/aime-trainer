import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const ROOT = process.cwd();
const NT_DIR = join(ROOT, "content", "amc8", "number-theory");
const GEO_DIR = join(ROOT, "content", "amc8", "geometry");

interface RawProblem {
  type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  statement: string;
  choices?: string[];
  answer: string;
  solution: string;
  rating: number;
  source?: string;
}

// Number Theory subtopics (leaf topics that carry the lesson + problem bank).
const NT_SUBTOPICS = [
  { name: "Divisibility & Primes", slug: "nt-divisibility-primes" },
  { name: "Prime Factorization & Divisors", slug: "nt-factorization-divisors" },
  { name: "GCD & LCM", slug: "nt-gcd-lcm" },
  { name: "Modular Arithmetic & Remainders", slug: "nt-modular" },
  { name: "Units Digits & Cycles", slug: "nt-units-digits" },
  { name: "Factorials & Trailing Zeros", slug: "nt-factorials" },
  { name: "Digits & Number Bases", slug: "nt-digits-bases" },
  { name: "Terminating & Repeating Decimals", slug: "nt-decimals" },
];

// Geometry subtopics. Lessons are written; problem banks fill in over time.
const GEO_SUBTOPICS = [
  { name: "Angles & Parallel Lines", slug: "geo-angles" },
  { name: "Triangle Sides & Pythagorean Theorem", slug: "geo-triangle-sides" },
  { name: "Triangle Area", slug: "geo-triangle-area" },
  { name: "Similarity & Congruence", slug: "geo-similarity-congruence" },
  { name: "Polygons & Quadrilaterals", slug: "geo-polygons-quads" },
  { name: "Circles", slug: "geo-circles" },
  { name: "Solid Geometry", slug: "geo-solids" },
  { name: "Coordinate Geometry", slug: "geo-coordinates" },
];

// Subjects that carry real content: overview + tiered subtopics under a directory.
const CONTENT_SUBJECTS: Record<
  string,
  { dir: string; subtopics: { name: string; slug: string }[] }
> = {
  "number-theory": { dir: NT_DIR, subtopics: NT_SUBTOPICS },
  geometry: { dir: GEO_DIR, subtopics: GEO_SUBTOPICS },
};

/**
 * Split a band-sectioned lesson into per-band bodies. Text before the first
 * `<!--band:...-->` marker is a shared intro prepended to every band.
 */
function parseBands(md: string): Record<string, string> {
  const parts = md.split(/<!--band:([\w-]+)-->/);
  const intro = parts[0].trim();
  const out: Record<string, string> = {};
  for (let i = 1; i < parts.length; i += 2) {
    const band = parts[i];
    const body = (parts[i + 1] ?? "").trim();
    out[band] = intro ? `${intro}\n\n${body}` : body;
  }
  return out;
}

async function upsertLesson(topicId: string, band: string, bodyMarkdown: string) {
  await prisma.lesson.upsert({
    where: { topicId_band: { topicId, band } },
    update: { bodyMarkdown },
    create: { topicId, band, bodyMarkdown },
  });
}

// Major subjects, shown as tabs. Only Number Theory has content so far; the
// others are created as empty top-level topics ready to receive problems.
const SUBJECTS = [
  { name: "Combinatorics", slug: "combinatorics" },
  { name: "Geometry", slug: "geometry" },
  { name: "Algebra", slug: "algebra" },
  { name: "Number Theory", slug: "number-theory" },
];

async function main() {
  console.log("Seeding AIME Trainer (subjects + AMC 8 content)…");

  const level = await prisma.level.upsert({
    where: { key: "AMC8" },
    update: { name: "AMC 8", order: 0 },
    create: { key: "AMC8", name: "AMC 8", order: 0 },
  });

  for (let i = 0; i < SUBJECTS.length; i++) {
    const subj = SUBJECTS[i];
    const topic = await prisma.topic.upsert({
      where: { slug: subj.slug },
      update: { name: subj.name, levelId: level.id, parentId: null, order: i },
      create: { name: subj.name, slug: subj.slug, levelId: level.id, order: i },
    });
    const content = CONTENT_SUBJECTS[subj.slug];
    if (content) {
      await seedSubjectContent(level.id, topic.id, content.dir, content.subtopics);
    } else {
      // Placeholder overview until problems/subtopics arrive.
      await prisma.lesson.deleteMany({ where: { topicId: topic.id } });
      await upsertLesson(
        topic.id,
        "all",
        `# ${subj.name}\n\nProblems and lessons for **${subj.name}** are coming soon.`,
      );
    }
  }

  console.log("Seeded subjects: " + SUBJECTS.map((s) => s.name).join(", "));
}

async function seedSubjectContent(
  levelId: string,
  subjectId: string,
  contentDir: string,
  subtopics: { name: string; slug: string }[],
) {
  const subDir = join(contentDir, "subtopics");

  // Parent overview lesson (band "all").
  const overview = readFileSync(join(contentDir, "overview.md"), "utf8");
  await upsertLesson(subjectId, "all", overview);

  // Clean slate for this subject subtree's problems.
  const existingSubs = await prisma.topic.findMany({ where: { parentId: subjectId }, select: { id: true } });
  const subtreeIds = [subjectId, ...existingSubs.map((t) => t.id)];
  await prisma.attempt.deleteMany({ where: { problem: { topicId: { in: subtreeIds } } } });
  await prisma.problem.deleteMany({ where: { topicId: { in: subtreeIds } } });

  let totalProblems = 0;
  const perSub: string[] = [];

  for (let i = 0; i < subtopics.length; i++) {
    const st = subtopics[i];
    const topic = await prisma.topic.upsert({
      where: { slug: st.slug },
      update: { name: st.name, levelId, parentId: subjectId, order: i },
      create: { name: st.name, slug: st.slug, levelId, parentId: subjectId, order: i },
    });

    // Band-leveled lesson for the subtopic (clear stale bands first).
    await prisma.lesson.deleteMany({ where: { topicId: topic.id } });
    const lessonMd = readFileSync(join(subDir, st.slug, "lesson.md"), "utf8");
    const bands = parseBands(lessonMd);
    for (const [band, body] of Object.entries(bands)) {
      if (body) await upsertLesson(topic.id, band, body);
    }

    // Problem bank for the subtopic.
    const raw: RawProblem[] = JSON.parse(
      readFileSync(join(subDir, st.slug, "problems.json"), "utf8"),
    );
    for (const p of raw) {
      await prisma.problem.create({
        data: {
          topicId: topic.id,
          type: p.type,
          statementMarkdown: p.statement,
          choices: p.choices ? JSON.stringify(p.choices) : null,
          answer: p.answer,
          solutionMarkdown: p.solution,
          rating: p.rating,
          source: p.source ?? null,
        },
      });
    }
    totalProblems += raw.length;
    const ratings = raw.map((p) => p.rating).sort((a, b) => a - b);
    const range = raw.length ? ` (${ratings[0]}–${ratings[ratings.length - 1]})` : " (empty)";
    perSub.push(`${st.name}: ${raw.length}${range}`);
  }

  console.log(`Seeded ${subtopics.length} subtopics, ${totalProblems} problems:`);
  perSub.forEach((s) => console.log("  • " + s));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
