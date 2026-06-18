// Importer for the "AMC 8 Prime Factorization" problem set (user-provided doc).
//
// Each problem carries the document's stated answer AND a compute() that derives
// the answer independently. The two must agree, or the build aborts — this
// catches both transcription/OCR errors and any mistake in the source doc.
//
//   node content/amc8/number-theory/import-pf.mjs

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "subtopics", "nt-factorization-divisors", "problems.json");

// helpers
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const PRIMES = (() => { const r = []; for (let i = 2; i <= 5000; i++) if (isPrime(i)) r.push(i); return r; })();
const factorize = (n) => { const f = new Map(); let m = n; for (const p of PRIMES) { if (p * p > m) break; while (m % p === 0) { f.set(p, (f.get(p) || 0) + 1); m /= p; } } if (m > 1) f.set(m, (f.get(m) || 0) + 1); return f; };
const numDivisors = (n) => { let d = 1; for (const e of factorize(n).values()) d *= e + 1; return d; };
const sumDivisors = (n) => { let s = 1; for (const [p, e] of factorize(n)) s *= (p ** (e + 1) - 1) / (p - 1); return s; };
const divisorList = (n) => { const r = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) { r.push(i); if (i !== n / i) r.push(n / i); } return r.sort((a, b) => a - b); };
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const isSquare = (n) => { const r = Math.round(Math.sqrt(n)); return r * r === n; };
const isCube = (n) => { const r = Math.round(Math.cbrt(n)); return r * r * r === n; };
const cubeDivisorCount = (n) => divisorList(n).filter(isCube).length;

const P = [
  { rating: 880, statement: "What is the smallest positive integer $k$ such that $120k$ is a perfect square?", doc: 30, compute: () => { for (let k = 1; ; k++) if (isSquare(120 * k)) return k; }, sol: (a) => `$120 = 2^3\\cdot 3\\cdot 5$. Each prime with an odd exponent needs one more factor, so $k = 2\\cdot 3\\cdot 5 = ${a}$ (and $120\\cdot ${a} = 3600 = 60^2$).` },
  { rating: 720, statement: "How many positive integer divisors does $2000$ have?", doc: 20, compute: () => numDivisors(2000), sol: (a) => `$2000 = 2^4\\cdot 5^3$, so $(4+1)(3+1) = ${a}$.` },
  { rating: 950, statement: "A positive integer $P$ has exactly three positive integer factors. If $P$ is less than $50$, what is the sum of all possible values of $P$?", doc: 87, compute: () => { let s = 0; for (let n = 2; n < 50; n++) if (numDivisors(n) === 3) s += n; return s; }, sol: (a) => `Exactly three factors means $P = p^2$ for a prime $p$: $4, 9, 25, 49$, summing to $${a}$.` },
  { rating: 820, statement: "How many odd positive factors does $360$ have?", doc: 6, compute: () => divisorList(360).filter((d) => d % 2 === 1).length, sol: (a) => `$360 = 2^3\\cdot 3^2\\cdot 5$; the odd factors are the divisors of $3^2\\cdot 5$: $(2+1)(1+1) = ${a}$.` },
  { rating: 760, statement: "The product of three prime numbers is $105$. What is the sum of these three numbers?", doc: 15, compute: () => [...factorize(105).keys()].reduce((s, p) => s + p, 0), sol: (a) => `$105 = 3\\cdot 5\\cdot 7$, so the sum is $${a}$.` },
  { rating: 850, statement: "What is the smallest positive integer that has exactly $6$ positive divisors?", doc: 12, compute: () => { for (let n = 1; ; n++) if (numDivisors(n) === 6) return n; }, sol: (a) => `$${a} = 2^2\\cdot 3$ has $(2+1)(1+1) = 6$ divisors, and nothing smaller does.` },
  { rating: 1000, statement: "The prime factorization of $x$ is $2^3 \\times 3^2$, and the prime factorization of $y$ is $2^2 \\times 3^4 \\times 5$. How many positive integer factors do $x$ and $y$ share?", doc: 9, compute: () => numDivisors(gcd(2 ** 3 * 3 ** 2, 2 ** 2 * 3 ** 4 * 5)), sol: (a) => `Shared factors are the divisors of $\\gcd(x,y) = 2^2\\cdot 3^2 = 36$: $(2+1)(2+1) = ${a}$.` },
  { rating: 1050, statement: "What is the smallest positive integer $n$ such that $720n$ is a perfect cube?", doc: 300, compute: () => { for (let n = 1; ; n++) if (isCube(720 * n)) return n; }, sol: (a) => `$720 = 2^4\\cdot 3^2\\cdot 5$. To make every exponent a multiple of $3$, $n = 2^2\\cdot 3\\cdot 5^2 = ${a}$ (and $720\\cdot ${a} = 60^3$).` },
  { rating: 1050, statement: "How many positive integer divisors of $1000$ are divisible by $10$?", doc: 9, compute: () => divisorList(1000).filter((d) => d % 10 === 0).length, sol: (a) => `Such divisors correspond to divisors of $1000/10 = 100 = 2^2\\cdot 5^2$: $(2+1)(2+1) = ${a}$.` },
  { rating: 1000, statement: "How many perfect square factors does $2^3 \\times 3^5 \\times 5 \\times 7^2$ have?", doc: 12, compute: () => { const e = [3, 5, 1, 2]; return e.reduce((p, x) => p * (Math.floor(x / 2) + 1), 1); }, sol: (a) => `A square factor uses even exponents, giving $\\prod(\\lfloor e/2\\rfloor + 1) = 2\\cdot 3\\cdot 1\\cdot 2 = ${a}$.` },
  { rating: 700, statement: "How many distinct prime factors does $588$ have?", doc: 3, compute: () => factorize(588).size, sol: (a) => `$588 = 2^2\\cdot 3\\cdot 7^2$, so it has $${a}$ distinct prime factors.` },
  { rating: 1250, statement: "What is the least number that has $15$ positive integer factors and is divisible by $11$?", doc: 1936, compute: () => { for (let n = 11; ; n += 11) if (numDivisors(n) === 15) return n; }, sol: (a) => `$15 = 3\\cdot 5$ needs exponents $2$ and $4$. Including $11$, the smallest is $2^4\\cdot 11^2 = ${a}$.` },
  { rating: 1100, statement: "What is the sum of all positive integer factors of $288$?", doc: 819, compute: () => sumDivisors(288), sol: (a) => `$288 = 2^5\\cdot 3^2$, so $\\sigma = (2^6-1)(1+3+9) = 63\\cdot 13 = ${a}$.` },
  { rating: 900, statement: "What is the greatest common factor of $720$ and $1008$?", doc: 144, compute: () => gcd(720, 1008), sol: (a) => `$720 = 2^4\\cdot 3^2\\cdot 5$ and $1008 = 2^4\\cdot 3^2\\cdot 7$, so $\\gcd = 2^4\\cdot 3^2 = ${a}$.` },
  { rating: 1300, statement: "How many ordered pairs of positive integers $(x, y)$ satisfy $\\gcd(x, y) = 15$ and $\\operatorname{lcm}(x, y) = 10800$?", doc: 8, compute: () => { const L = 10800, g = 15; const ds = divisorList(L); let c = 0; for (const x of ds) for (const y of ds) if (gcd(x, y) === g && lcm(x, y) === L) c++; return c; }, sol: (a) => `$\\operatorname{lcm}/\\gcd = 720 = 2^4\\cdot 3^2\\cdot 5$ has $3$ distinct primes; each goes to $x$ or $y$, giving $2^3 = ${a}$ ordered pairs.` },
  { rating: 1350, statement: "How many positive integers $n$ are there such that $n < 200$ and $2n$ has exactly $8$ positive integer factors?", doc: 49, compute: () => { let c = 0; for (let n = 1; n < 200; n++) if (numDivisors(2 * n) === 8) c++; return c; }, sol: (a) => `Counting $n < 200$ for which $2n$ has $8$ divisors gives $${a}$.` },
  { rating: 1100, statement: "What is the positive square root of the largest perfect square factor of $58800$?", doc: 140, compute: () => { let r = 1; for (const [p, e] of factorize(58800)) r *= p ** Math.floor(e / 2); return r; }, sol: (a) => `$58800 = 2^4\\cdot 3\\cdot 5^2\\cdot 7^2$; the largest square factor is $2^4\\cdot 5^2\\cdot 7^2$, whose root is $2^2\\cdot 5\\cdot 7 = ${a}$.` },
  { rating: 1050, statement: "How many perfect cube factors does $25920$ have?", doc: 6, compute: () => cubeDivisorCount(25920), sol: (a) => `$25920 = 2^6\\cdot 3^4\\cdot 5$; cube factors use exponents that are multiples of $3$: $3\\cdot 2\\cdot 1 = ${a}$.` },
  { rating: 1300, statement: "Let $x$ be the least positive integer with $4$ perfect cube factors, and let $y$ be the least perfect square with $15$ factors. What is $\\gcd(x, y)$?", doc: 72, compute: () => { let x = 0; for (let n = 1; ; n++) if (cubeDivisorCount(n) === 4) { x = n; break; } let y = 0; for (let n = 1; ; n++) if (isSquare(n) && numDivisors(n) === 15) { y = n; break; } return gcd(x, y); }, sol: (a) => `$x = 216 = 2^3\\cdot 3^3$ (cube factors $1, 8, 27, 216$) and $y = 144 = 2^4\\cdot 3^2$ ($15$ factors), so $\\gcd = 2^3\\cdot 3^2 = ${a}$.` },
  { rating: 1150, statement: "What is the greatest common factor of $900$ and $1008$ that is a perfect square?", doc: 36, compute: () => { const g = gcd(900, 1008); return divisorList(g).filter(isSquare).pop(); }, sol: (a) => `$\\gcd(900, 1008) = 36 = 6^2$, which is itself a perfect square, so the answer is $${a}$.` },
];

// verify + write
let bad = 0;
const out = P.map((p) => {
  const got = p.compute();
  if (got !== p.doc) { console.error(`MISMATCH: "${p.statement.slice(0, 50)}…" computed ${got} vs doc ${p.doc}`); bad++; }
  return { type: "SHORT_ANSWER", statement: p.statement, answer: String(p.doc), solution: p.sol(String(p.doc)), rating: p.rating, source: "AMC 8 · Prime Factorization" };
});
if (bad) throw new Error(`${bad} answer mismatches — aborting import.`);

out.sort((a, b) => a.rating - b.rating);
const line = (o) => "  { " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";
writeFileSync(OUT, "[\n" + out.map(line).join(",\n") + "\n]\n");
const rs = out.map((p) => p.rating);
console.log(`Verified ${out.length}/20 answers (0 mismatches). Wrote ${OUT.split("/").slice(-2).join("/")}`);
console.log(`ELO range ${Math.min(...rs)}–${Math.max(...rs)}.`);
