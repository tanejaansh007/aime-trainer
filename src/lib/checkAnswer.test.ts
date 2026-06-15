import { describe, it, expect } from "vitest";
import { checkAnswer, normalizeText, parseNumeric } from "./checkAnswer";

describe("normalizeText", () => {
  it("lowercases, trims, collapses whitespace, strips $", () => {
    expect(normalizeText("  $Hello   World$ ")).toBe("hello world");
  });
});

describe("parseNumeric", () => {
  it("parses ints, decimals, commas, and fractions", () => {
    expect(parseNumeric("42")).toBe(42);
    expect(parseNumeric("3.5")).toBe(3.5);
    expect(parseNumeric("1,024")).toBe(1024);
    expect(parseNumeric("3/4")).toBe(0.75);
    expect(parseNumeric("$7$")).toBe(7);
  });
  it("returns null for non-numeric and divide-by-zero", () => {
    expect(parseNumeric("abc")).toBeNull();
    expect(parseNumeric("1/0")).toBeNull();
    expect(parseNumeric("")).toBeNull();
  });
});

describe("checkAnswer — MULTIPLE_CHOICE", () => {
  it("matches the letter regardless of case or decoration", () => {
    expect(checkAnswer("MULTIPLE_CHOICE", "b", "B")).toBe(true);
    expect(checkAnswer("MULTIPLE_CHOICE", "B)", "B")).toBe(true);
    expect(checkAnswer("MULTIPLE_CHOICE", "(C)", "C")).toBe(true);
    expect(checkAnswer("MULTIPLE_CHOICE", "D.", "D")).toBe(true);
  });
  it("rejects the wrong letter", () => {
    expect(checkAnswer("MULTIPLE_CHOICE", "A", "B")).toBe(false);
  });
});

describe("checkAnswer — SHORT_ANSWER", () => {
  it("treats numerically equivalent answers as equal", () => {
    expect(checkAnswer("SHORT_ANSWER", "007", "7")).toBe(true);
    expect(checkAnswer("SHORT_ANSWER", "3/4", "0.75")).toBe(true);
    expect(checkAnswer("SHORT_ANSWER", " 1,000 ", "1000")).toBe(true);
  });
  it("falls back to normalized text when not numeric", () => {
    expect(checkAnswer("SHORT_ANSWER", "Even", "even")).toBe(true);
    expect(checkAnswer("SHORT_ANSWER", "odd", "even")).toBe(false);
  });
  it("rejects wrong numbers", () => {
    expect(checkAnswer("SHORT_ANSWER", "8", "7")).toBe(false);
  });
});
