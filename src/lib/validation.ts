import { z } from "zod";

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const practiceNextSchema = z.object({
  topicSlug: z.string().min(1),
  currentRating: z.number().int().min(0).max(4000),
  seenIds: z.array(z.string()).max(500).default([]),
});

export const practiceAnswerSchema = z.object({
  topicSlug: z.string().min(1),
  problemId: z.string().min(1),
  answerGiven: z.string().max(200),
  // Used only for guests (authoritative rating comes from the DB for logged-in users).
  ratingBefore: z.number().int().min(0).max(4000),
});

export const reviewBuildSchema = z.object({
  topicSlugs: z.array(z.string().min(1)).min(1).max(10),
  difficulty: difficultySchema,
  length: z.number().int().min(3).max(20).default(8),
});

export const reviewGradeSchema = z.object({
  reviewTestId: z.string().optional(),
  topicSlugs: z.array(z.string().min(1)).min(1).max(10),
  difficulty: difficultySchema,
  answers: z
    .array(z.object({ problemId: z.string().min(1), answerGiven: z.string().max(200) }))
    .min(1)
    .max(20),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(200),
  name: z.string().max(100).optional(),
});

export type Difficulty = z.infer<typeof difficultySchema>;
