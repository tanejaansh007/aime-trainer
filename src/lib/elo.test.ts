import { describe, it, expect } from "vitest";
import {
  expectedScore,
  updateRating,
  clampRating,
  startingRating,
  dynamicK,
  RATING_MIN,
  RATING_MAX,
} from "./elo";

describe("expectedScore", () => {
  it("is 0.5 for equal ratings", () => {
    expect(expectedScore(1200, 1200)).toBeCloseTo(0.5, 6);
  });

  it("is bounded in (0,1)", () => {
    expect(expectedScore(100, 3000)).toBeGreaterThan(0);
    expect(expectedScore(3000, 100)).toBeLessThan(1);
  });

  it("rises as the student outrates the problem", () => {
    expect(expectedScore(1600, 1200)).toBeGreaterThan(0.5);
    expect(expectedScore(800, 1200)).toBeLessThan(0.5);
  });

  it("is symmetric: E(a,b) + E(b,a) == 1", () => {
    expect(expectedScore(1400, 900) + expectedScore(900, 1400)).toBeCloseTo(1, 6);
  });
});

describe("updateRating", () => {
  it("raises rating on a correct answer", () => {
    const r = updateRating(1200, 1200, true);
    expect(r.ratingAfter).toBeGreaterThan(1200);
    expect(r.delta).toBeGreaterThan(0);
  });

  it("lowers rating on a wrong answer", () => {
    const r = updateRating(1200, 1200, false);
    expect(r.ratingAfter).toBeLessThan(1200);
    expect(r.delta).toBeLessThan(0);
  });

  it("for an even match, a correct gain mirrors a wrong loss", () => {
    const up = updateRating(1200, 1200, true).delta;
    const down = updateRating(1200, 1200, false).delta;
    expect(up).toBe(-down);
  });

  it("rewards beating a much harder problem more than an easy one", () => {
    const hard = updateRating(1200, 1700, true).delta;
    const easy = updateRating(1200, 800, true).delta;
    expect(hard).toBeGreaterThan(easy);
  });

  it("penalizes losing to an easy problem more than a hard one", () => {
    const easyLoss = updateRating(1200, 800, false).delta; // big drop (very negative)
    const hardLoss = updateRating(1200, 1700, false).delta; // small drop
    expect(easyLoss).toBeLessThan(hardLoss);
  });

  it("never escapes the rating bounds", () => {
    expect(updateRating(RATING_MAX, 100, true).ratingAfter).toBeLessThanOrEqual(RATING_MAX);
    expect(updateRating(RATING_MIN, 3000, false).ratingAfter).toBeGreaterThanOrEqual(RATING_MIN);
  });
});

describe("dynamicK", () => {
  it("decays after many attempts", () => {
    expect(dynamicK(0)).toBeGreaterThan(dynamicK(50));
  });
  it("never drops below 16", () => {
    expect(dynamicK(1000)).toBeGreaterThanOrEqual(16);
  });
});

describe("clampRating / startingRating", () => {
  it("clamps out-of-range values", () => {
    expect(clampRating(99999)).toBe(RATING_MAX);
    expect(clampRating(-5)).toBe(RATING_MIN);
    expect(clampRating(1234)).toBe(1234);
  });
  it("maps presets to starting ratings", () => {
    expect(startingRating("easy")).toBe(750);
    expect(startingRating("medium")).toBe(1080);
    expect(startingRating("hard")).toBe(1350);
  });
});
