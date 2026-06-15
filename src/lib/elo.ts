// Pure ELO engine. No DB access — unit-testable in isolation.
//
// Both the student and each problem carry a rating. In the MVP only the
// student's rating moves; problem ratings are seeded and fixed.

export const DEFAULT_K = 32;

/** Difficulty presets used to seed a starting rating. */
export const DIFFICULTY_PRESETS = {
  easy: 800,
  medium: 1200,
  hard: 1600,
} as const;

export type Difficulty = keyof typeof DIFFICULTY_PRESETS;

export const RATING_MIN = 100;
export const RATING_MAX = 3000;

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
 * Bucket a rating into a lesson band. Boundaries sit between the presets
 * (easy 800 / medium 1200 / hard 1600): < 1000 → easy, < 1400 → medium,
 * otherwise hard.
 */
export function bandForRating(rating: number): Difficulty {
  if (rating < 1000) return "easy";
  if (rating < 1400) return "medium";
  return "hard";
}
