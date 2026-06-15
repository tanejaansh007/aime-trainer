// Server-side answer checking. Lives apart from the client so correct answers
// never reach the browser until after submission.

export type ProblemType = "MULTIPLE_CHOICE" | "SHORT_ANSWER";

/** Lowercase, trim, collapse internal whitespace, strip a single pair of $…$. */
export function normalizeText(s: string): string {
  return s
    .trim()
    .replace(/^\$+|\$+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/** Parse a numeric answer, tolerating commas, surrounding $, and simple fractions a/b. */
export function parseNumeric(s: string): number | null {
  const cleaned = s.trim().replace(/[$,\s]/g, "");
  if (cleaned === "") return null;
  const frac = cleaned.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const denom = Number(frac[2]);
    if (denom === 0) return null;
    return Number(frac[1]) / denom;
  }
  if (!/^-?\d+(?:\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

const EPSILON = 1e-9;

/**
 * Check a submitted answer against the canonical answer.
 *
 * - MULTIPLE_CHOICE: compare the chosen letter (A–E), case-insensitive,
 *   ignoring any "A)"/"A." decoration.
 * - SHORT_ANSWER: numeric equivalence when both parse as numbers, otherwise
 *   normalized-text equality.
 */
export function checkAnswer(
  type: ProblemType,
  given: string,
  canonical: string,
): boolean {
  if (given == null) return false;

  if (type === "MULTIPLE_CHOICE") {
    return normalizeChoice(given) === normalizeChoice(canonical);
  }

  const g = parseNumeric(given);
  const c = parseNumeric(canonical);
  if (g !== null && c !== null) {
    return Math.abs(g - c) < EPSILON;
  }
  return normalizeText(given) === normalizeText(canonical);
}

/** Extract a single choice letter A–E from inputs like "b", "B)", "(C)", "D." */
function normalizeChoice(s: string): string {
  const m = s.trim().toUpperCase().match(/[A-E]/);
  return m ? m[0] : normalizeText(s);
}
