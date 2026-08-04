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
const SUB_DIR = join(NT_DIR, "subtopics");

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
const SUBTOPICS = [
  { name: "Divisibility & Primes", slug: "nt-divisibility-primes" },
  { name: "Prime Factorization & Divisors", slug: "nt-factorization-divisors" },
  { name: "GCD & LCM", slug: "nt-gcd-lcm" },
  { name: "Modular Arithmetic & Remainders", slug: "nt-modular" },
  { name: "Units Digits & Cycles", slug: "nt-units-digits" },
  { name: "Factorials & Trailing Zeros", slug: "nt-factorials" },
  { name: "Digits & Number Bases", slug: "nt-digits-bases" },
  { name: "Terminating & Repeating Decimals", slug: "nt-decimals" },
];

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
  console.log("Seeding AIME Trainer (subjects + AMC 8 Number Theory)…");

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
    if (subj.slug === "number-theory") {
      await seedNumberTheory(level.id, topic.id);
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

async function seedNumberTheory(levelId: string, ntId: string) {
  // Parent overview lesson (band "all").
  const overview = readFileSync(join(NT_DIR, "overview.md"), "utf8");
  await upsertLesson(ntId, "all", overview);

  const nt = { id: ntId };
  const level = { id: levelId };

  // Clean slate for this topic subtree's problems.
  const existingSubs = await prisma.topic.findMany({ where: { parentId: nt.id }, select: { id: true } });
  const subtreeIds = [nt.id, ...existingSubs.map((t) => t.id)];
  await prisma.attempt.deleteMany({ where: { problem: { topicId: { in: subtreeIds } } } });
  await prisma.problem.deleteMany({ where: { topicId: { in: subtreeIds } } });

  let totalProblems = 0;
  const perSub: string[] = [];

  for (let i = 0; i < SUBTOPICS.length; i++) {
    const st = SUBTOPICS[i];
    const topic = await prisma.topic.upsert({
      where: { slug: st.slug },
      update: { name: st.name, levelId: level.id, parentId: nt.id, order: i },
      create: { name: st.name, slug: st.slug, levelId: level.id, parentId: nt.id, order: i },
    });

    // Band-leveled lesson for the subtopic (clear stale bands first).
    await prisma.lesson.deleteMany({ where: { topicId: topic.id } });
    const lessonMd = readFileSync(join(SUB_DIR, st.slug, "lesson.md"), "utf8");
    const bands = parseBands(lessonMd);
    for (const [band, body] of Object.entries(bands)) {
      if (body) await upsertLesson(topic.id, band, body);
    }

    // Problem bank for the subtopic.
    const raw: RawProblem[] = JSON.parse(
      readFileSync(join(SUB_DIR, st.slug, "problems.json"), "utf8"),
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

  console.log(`Seeded ${SUBTOPICS.length} subtopics, ${totalProblems} problems:`);
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
