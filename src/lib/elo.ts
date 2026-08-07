// Pure ELO engine. No DB access — unit-testable in isolation.
//
// Both the student and each problem carry a rating. In the MVP only the
// student's rating moves; problem ratings are seeded and fixed.

export const DEFAULT_K = 32;

// AMC 8 ELO scale: a warm-up #1 sits ~450 and a true #25 ~1500. The range is
// deliberately stretched so the hardest problems feel genuinely hard.
// All difficulty anchors are relative to AMC 8 only.
export const DIFFICULTY_PRESETS = {
  easy: 750,
  medium: 1080,
  hard: 1350,
} as const;

export type Difficulty = keyof typeof DIFFICULTY_PRESETS;

export const RATING_MIN = 100;
export const RATING_MAX = 3000;

/**
 * Canonical AMC 8 position→rating curve (index 0 = problem #1 … index 24 = #25).
 * Every problem generator anchors ratings to this curve, so it is the single
 * source of truth for translating between a raw ELO and an AMC 8 position.
 */
export const POSITION_RATINGS = [
  450, 500, 550, 600, 650, 700, 740, 780, 820, 860, 900, 940, 980,
  1020, 1060, 1100, 1145, 1190, 1240, 1290, 1340, 1390, 1435, 1470, 1500,
] as const;

/** Rating anchored to an AMC 8 position (1–25). Clamps out-of-range positions. */
export function ratingForPosition(pos: number): number {
  const i = Math.min(POSITION_RATINGS.length, Math.max(1, Math.round(pos))) - 1;
  return POSITION_RATINGS[i];
}

/** Nearest AMC 8 position (1–25) to a raw rating. */
export function positionForRating(rating: number): number {
  let best = 1;
  let bestDist = Infinity;
  for (let i = 0; i < POSITION_RATINGS.length; i++) {
    const dist = Math.abs(POSITION_RATINGS[i] - rating);
    if (dist < bestDist) {
      bestDist = dist;
      best = i + 1;
    }
  }
  return best;
}

/** Absolute AMC 8 difficulty tier name for a position (1–25). */
export function tierForPosition(pos: number): string {
  if (pos <= 5) return "Intro";
  if (pos <= 12) return "Easy";
  if (pos <= 18) return "Medium";
  if (pos <= 22) return "Hard";
  return "Challenge";
}

/**
 * Probability the student answers correctly, per the ELO logistic curve.
 * Returns a value in (0, 1).
 */
export function expectedScore(userRating: number, problemRating: number): number {
  return 1 / (1 + Math.pow(10, (problemRating - userRating) / 400));
}

/**
 * K-factor that gently decays as the student logs more attempts, so early
 * results move the rating fast and it stabilizes over time. Always >= 16.
 */
export function dynamicK(problemsAttempted: number, base = DEFAULT_K): number {
  if (problemsAttempted >= 30) return Math.max(16, base / 2);
  return base;
}

export interface RatingUpdate {
  ratingBefore: number;
  ratingAfter: number;
  expected: number;
  delta: number;
}

/**
 * Compute the student's new rating after answering a problem.
 *
 * @param userRating      current student rating
 * @param problemRating   the problem's fixed rating
 * @param correct         whether the answer was correct
 * @param problemsAttempted attempts so far (drives K decay)
 * @param k               base K-factor (default 32)
 */
export function updateRating(
  userRating: number,
  problemRating: number,
  correct: boolean,
  problemsAttempted = 0,
  k: number = DEFAULT_K,
): RatingUpdate {
  const expected = expectedScore(userRating, problemRating);
  const actual = correct ? 1 : 0;
  const effectiveK = dynamicK(problemsAttempted, k);
  const raw = userRating + effectiveK * (actual - expected);
  const ratingAfter = clampRating(Math.round(raw));
  return {
    ratingBefore: userRating,
    ratingAfter,
    expected,
    delta: ratingAfter - userRating,
  };
}

export function clampRating(rating: number): number {
  return Math.min(RATING_MAX, Math.max(RATING_MIN, rating));
}

/** Map a difficulty preset to its starting rating. */
export function startingRating(difficulty: Difficulty): number {
  return DIFFICULTY_PRESETS[difficulty];
}

/**
 * Bucket a rating into a coarse practice band (kept for any 3-way uses).
 */
export function bandForRating(rating: number): Difficulty {
  if (rating < 960) return "easy";
  if (rating < 1200) return "medium";
  return "hard";
}

/**
 * Five graduated lesson tiers across the AMC 8 difficulty range (~450–1500).
 * t1 = AMC 8 intro (#1–5), t5 = AMC 8 hardest (#23–25).
 */
export const LESSON_BANDS = [
  { key: "t1", label: "Tier 1 · AMC 8 Intro", max: 700 },
  { key: "t2", label: "Tier 2 · AMC 8 Developing", max: 960 },
  { key: "t3", label: "Tier 3 · AMC 8 Proficient", max: 1200 },
  { key: "t4", label: "Tier 4 · AMC 8 Advanced", max: 1400 },
  { key: "t5", label: "Tier 5 · AMC 8 Expert", max: Infinity },
] as const;

export type LessonBand = (typeof LESSON_BANDS)[number]["key"];

/** Map a rating to one of the five lesson tiers. */
export function lessonBandForRating(rating: number): LessonBand {
  return (LESSON_BANDS.find((b) => rating < b.max) ?? LESSON_BANDS[LESSON_BANDS.length - 1]).key;
}
