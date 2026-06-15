import { describe, it, expect } from "vitest";
import { selectProblem, type Candidate } from "./selectProblem";

const pool: Candidate[] = [
  { id: "a", rating: 800 },
  { id: "b", rating: 1200 },
  { id: "c", rating: 1600 },
];

// Deterministic rng that yields 0 → zero jitter, so closest-rating wins.
const noJitter = () => 0.5; // 0.5*2-1 = 0 → noise 0

describe("selectProblem", () => {
  it("returns null for an empty pool", () => {
    expect(selectProblem([], 1200)).toBeNull();
  });

  it("picks the closest-rated problem with no jitter", () => {
    expect(selectProblem(pool, 1180, { rng: noJitter })?.id).toBe("b");
    expect(selectProblem(pool, 850, { rng: noJitter })?.id).toBe("a");
    expect(selectProblem(pool, 1550, { rng: noJitter })?.id).toBe("c");
  });

  it("prefers unseen problems even if a seen one is closer", () => {
    const chosen = selectProblem(pool, 1200, {
      seenIds: ["b"],
      rng: noJitter,
    });
    expect(chosen?.id).not.toBe("b");
    expect(["a", "c"]).toContain(chosen?.id);
  });

  it("falls back to the seen pool when everything has been seen", () => {
    const chosen = selectProblem(pool, 1200, {
      seenIds: ["a", "b", "c"],
      rng: noJitter,
    });
    expect(chosen?.id).toBe("b");
  });
});
