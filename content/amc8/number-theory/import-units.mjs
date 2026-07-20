// Importer for the "AMC 8 Units Digits — Level 1" set (user-provided image).
//
// The source gives problems only (no answers), so each units digit is computed
// exactly via BigInt modular exponentiation. A hand-computed `doc` value is kept
// alongside as a cross-check: compute() must equal it, or the import aborts.
//
//   node content/amc8/number-theory/import-units.mjs

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "subtopics", "nt-units-digits", "problems.json");

// units digit of b^e, exactly
const u = (b, e) => { b = BigInt(b); e = BigInt(e); let r = 1n, x = b % 10n; while (e > 0n) { if (e & 1n) r = r * x % 10n; x = x * x % 10n; e >>= 1n; } return Number(r); };
const sub = (a, b) => ((a - b) % 10 + 10) % 10; // units digit of a positive difference

const P = [
  { rating: 640, statement: "What is the units digit of $2^{2026}$?", doc: 4, compute: () => u(2, 2026), sol: (a) => `Powers of $2$ cycle $2,4,8,6$ (length $4$); $2026 \\equiv 2 \\pmod 4$, so the units digit is $${a}$.` },
  { rating: 620, statement: "What is the last digit of $3^{45}$?", doc: 3, compute: () => u(3, 45), sol: (a) => `Powers of $3$ cycle $3,9,7,1$; $45 \\equiv 1 \\pmod 4$, giving $${a}$.` },
  { rating: 660, statement: "What is the units digit of $7^{100}$?", doc: 1, compute: () => u(7, 100), sol: (a) => `Powers of $7$ cycle $7,9,3,1$; $100 \\equiv 0 \\pmod 4$, so the units digit is the last entry, $${a}$.` },
  { rating: 700, statement: "What is the units digit of $8^{53}$?", doc: 8, compute: () => u(8, 53), sol: (a) => `Powers of $8$ cycle $8,4,2,6$; $53 \\equiv 1 \\pmod 4$, giving $${a}$.` },
  { rating: 680, statement: "What is the last digit of $14^{23}$?", doc: 4, compute: () => u(14, 23), sol: (a) => `Only the base's units digit $4$ matters; $4$ cycles $4,6$ (length $2$), and an odd exponent gives $${a}$.` },
  { rating: 680, statement: "What is the units digit of $19^{88}$?", doc: 1, compute: () => u(19, 88), sol: (a) => `The units digit $9$ cycles $9,1$; an even exponent gives $${a}$.` },
  { rating: 700, statement: "What is the units digit of $5^{2026} + 6^{2026}$?", doc: 1, compute: () => (u(5, 2026) + u(6, 2026)) % 10, sol: (a) => `$5^n$ always ends in $5$ and $6^n$ always ends in $6$; $5+6=11$, so the units digit is $${a}$.` },
  { rating: 760, statement: "What is the units digit of $2^{10} + 3^{10}$?", doc: 3, compute: () => (u(2, 10) + u(3, 10)) % 10, sol: (a) => `$2^{10}$ ends in $4$ and $3^{10}$ ends in $9$; $4+9=13$, giving $${a}$.` },
  { rating: 780, statement: "What is the last digit of the product $7^{25} \\times 9^{26}$?", doc: 7, compute: () => (u(7, 25) * u(9, 26)) % 10, sol: (a) => `$7^{25}$ ends in $7$ and $9^{26}$ ends in $1$; $7 \\times 1 = ${a}$.` },
  { rating: 800, statement: "What is the units digit of $13^{13} + 17^{17}$?", doc: 0, compute: () => (u(13, 13) + u(17, 17)) % 10, sol: (a) => `$13^{13}$ ends in $3$ and $17^{17}$ ends in $7$; $3+7=10$, so the units digit is $${a}$.` },
  { rating: 820, statement: "What is the units digit of $4^{100} - 3^{100}$?", doc: 5, compute: () => sub(u(4, 100), u(3, 100)), sol: (a) => `$4^{100}$ ends in $6$ and $3^{100}$ ends in $1$; $6-1=${a}$.` },
  { rating: 740, statement: "What is the units digit of $1^1 + 2^2 + 3^3 + 4^4$?", doc: 8, compute: () => (1 ** 1 + 2 ** 2 + 3 ** 3 + 4 ** 4) % 10, sol: (a) => `$1 + 4 + 27 + 256 = 288$, which ends in $${a}$.` },
  { rating: 720, statement: "What is the last digit of $(2^5)^3$?", doc: 8, compute: () => u(2, 15), sol: (a) => `$(2^5)^3 = 2^{15}$; $15 \\equiv 3 \\pmod 4$, so the cycle $2,4,8,6$ gives $${a}$.` },
  { rating: 700, statement: "What is the units digit of $123^{456}$?", doc: 1, compute: () => u(123, 456), sol: (a) => `Only the units digit $3$ matters; $3$ cycles $3,9,7,1$ and $456 \\equiv 0 \\pmod 4$, giving $${a}$.` },
  { rating: 840, statement: "What is the units digit of $8^8 - 7^7$?", doc: 3, compute: () => sub(u(8, 8), u(7, 7)), sol: (a) => `$8^8$ ends in $6$ and $7^7$ ends in $3$; $6-3=${a}$.` },
];

let bad = 0;
const out = P.map((p) => {
  const got = p.compute();
  if (got !== p.doc) { console.error(`MISMATCH: "${p.statement.slice(0, 46)}…" computed ${got} vs hand ${p.doc}`); bad++; }
  return { type: "SHORT_ANSWER", statement: p.statement, answer: String(p.doc), solution: p.sol(String(p.doc)), rating: p.rating, source: "AMC 8 · Units Digits (Level 1)" };
});
if (bad) throw new Error(`${bad} answer mismatches — aborting import.`);

out.sort((a, b) => a.rating - b.rating);
const line = (o) => "  { " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";
writeFileSync(OUT, "[\n" + out.map(line).join(",\n") + "\n]\n");
const rs = out.map((p) => p.rating);
console.log(`Verified ${out.length}/15 units digits (0 mismatches). ELO range ${Math.min(...rs)}–${Math.max(...rs)}.`);
console.log("answers:", out.map((p) => p.answer).join(", "));
