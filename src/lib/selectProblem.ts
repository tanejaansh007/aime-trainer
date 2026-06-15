// Pure matchmaking: pick the next problem whose rating is closest to the
// student's, preferring unseen problems, with a little jitter so repeated
// sessions at the same rating don't serve an identical sequence.
//
// No DB access — the caller passes the candidate pool. Determinism is
// injectable via `rng` for tests.

export interface Candidate {
  id: string;
  rating: number;
}

export interface SelectOptions {
  /** Problem ids already seen this session (de-prioritized). */
  seenIds?: Iterable<string>;
  /** Random source in [0,1); injectable for deterministic tests. */
  rng?: () => number;
  /** Std-dev-ish jitter added to each candidate's rating distance. */
  jitter?: number;
}

/**
 * Returns the chosen candidate, or null if the pool is empty.
 * Unseen candidates always win over seen ones; within a group the candidate
 * with the smallest jittered distance to `userRating` is chosen.
 */
export function selectProblem(
  pool: Candidate[],
  userRating: number,
  options: SelectOptions = {},
): Candidate | null {
  if (pool.length === 0) return null;

  const seen = new Set(options.seenIds ?? []);
  const rng = options.rng ?? Math.random;
  const jitter = options.jitter ?? 60;

  const unseen = pool.filter((p) => !seen.has(p.id));
  const group = unseen.length > 0 ? unseen : pool;

  let best: Candidate | null = null;
  let bestScore = Infinity;
  for (const candidate of group) {
    // Symmetric jitter in [-jitter, +jitter].
    const noise = (rng() * 2 - 1) * jitter;
    const score = Math.abs(candidate.rating - userRating) + Math.abs(noise);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}
