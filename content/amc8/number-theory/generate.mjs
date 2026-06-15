// Deterministic problem generator for the Number Theory bank.
//
// Every answer is COMPUTED here (brute force / BigInt), never hand-written, so
// correctness reduces to the correctness of the helper functions below — which
// are self-tested against known values before any generation runs.
//
// Existing curated problems are preserved; this only ADDS generated problems to
// fill each (subtopic, band) up to its target. Output is stable across runs
// (seeded RNG), so the committed JSON is reproducible.
//
//   node content/amc8/number-theory/generate.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SUB = join(HERE, "subtopics");

// ---------------------------------------------------------------------------
// Number theory helpers (all integer math; BigInt where powers can overflow)
// ---------------------------------------------------------------------------
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
const primesUpTo = (N) => { const r = []; for (let i = 2; i <= N; i++) if (isPrime(i)) r.push(i); return r; };
const PRIMES = primesUpTo(2000);
const nextPrime = (n) => { let m = n + 1; while (!isPrime(m)) m++; return m; };
const prevPrime = (n) => { let m = n - 1; while (m >= 2 && !isPrime(m)) m--; return m >= 2 ? m : null; };
const nthPrime = (k) => PRIMES[k - 1];
const factorize = (n) => { const f = new Map(); let m = n; for (const p of PRIMES) { if (p * p > m) break; while (m % p === 0) { f.set(p, (f.get(p) || 0) + 1); m /= p; } } if (m > 1) f.set(m, (f.get(m) || 0) + 1); return f; };
const numDivisors = (n) => { let d = 1; for (const e of factorize(n).values()) d *= e + 1; return d; };
const sumDivisors = (n) => { let s = 1; for (const [p, e] of factorize(n)) s *= (p ** (e + 1) - 1) / (p - 1); return s; };
const divisorList = (n) => { const r = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) { r.push(i); if (i !== n / i) r.push(n / i); } return r.sort((a, b) => a - b); };
const distinctPrimes = (n) => [...factorize(n).keys()];
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const digitSum = (n) => String(n).split("").reduce((s, d) => s + +d, 0);
const trailingZeros = (n) => { let z = 0; for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p); return z; };
const legendre = (p, n) => { let e = 0; for (let q = p; q <= n; q *= p) e += Math.floor(n / q); return e; };
const factBig = (n) => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
const modpow = (b, e, m) => { b = BigInt(b); e = BigInt(e); m = BigInt(m); let r = 1n, x = b % m; while (e > 0n) { if (e & 1n) r = r * x % m; x = x * x % m; e >>= 1n; } return Number(r); };
const eulerPhi = (n) => { let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return c; };
const omega = (n) => factorize(n).size;
const cycleLen = (a) => { const u = a % 10; return ({ 0: 1, 1: 1, 5: 1, 6: 1, 4: 2, 9: 2, 2: 4, 3: 4, 7: 4, 8: 4 })[u]; };
const countRange = (N, pred) => { let c = 0; for (let n = 1; n <= N; n++) if (pred(n)) c++; return c; };
const smallestWithDivisors = (D) => { for (let n = 1; n < 100000; n++) if (numDivisors(n) === D) return n; return -1; };
const trailingZerosBase = (n, b) => { const f = factorize(b); let best = Infinity; for (const [p, e] of f) best = Math.min(best, Math.floor(legendre(p, n) / e)); return best; };

// ---------------------------------------------------------------------------
// Self-test: validate helpers against known values. Abort if anything is off.
// ---------------------------------------------------------------------------
function selfTest() {
  const checks = [
    [numDivisors(360), 24], [numDivisors(12), 6], [numDivisors(1000), 16],
    [sumDivisors(28), 56], [sumDivisors(100), 217], [sumDivisors(6), 12],
    [trailingZeros(100), 24], [trailingZeros(25), 6], [trailingZeros(10), 2],
    [legendre(2, 20), 18], [legendre(5, 100), 24],
    [modpow(2, 100, 7), 2], [modpow(3, 100, 7), 4], [modpow(7, 2024, 100), 1], [modpow(2, 2024, 1000), 216],
    [gcd(1071, 462), 21], [lcm(4, 6), 12], [eulerPhi(100), 40], [eulerPhi(20), 8],
    [nthPrime(5), 11], [nextPrime(20), 23], [prevPrime(20), 19],
    [distinctPrimes(60).join(","), "2,3,5"], [omega(12), 2],
    [smallestWithDivisors(16), 120], [smallestWithDivisors(9), 36],
    [trailingZerosBase(20, 12), 8], [digitSum(1234567), 28],
    [Number(factBig(10) % 1000n), 800],
  ];
  let bad = 0;
  for (const [got, exp] of checks) if (String(got) !== String(exp)) { console.error("SELF-TEST FAIL:", got, "!=", exp); bad++; }
  if (bad) throw new Error(`${bad} helper self-tests failed`);
  console.log(`Helper self-tests: ${checks.length}/${checks.length} passed.`);
}

// ---------------------------------------------------------------------------
// Seeded RNG (mulberry32) + sampling utilities
// ---------------------------------------------------------------------------
function rngFrom(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const randComposite = (rng, a, b) => { let n; do { n = ri(rng, a, b); } while (n < 4 || isPrime(n)); return n; };
const randPrime = (rng, a, b) => { const ps = PRIMES.filter((p) => p >= a && p <= b); return pick(rng, ps); };
function makeMC(rng, correct, distractors, fmt) {
  const opts = [correct, ...distractors].map((v) => ({ v, correct: v === correct }));
  // shuffle
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  const letters = ["A", "B", "C", "D", "E"];
  const choices = opts.map((o, i) => `${letters[i]}) ${fmt(o.v)}`);
  const answer = letters[opts.findIndex((o) => o.correct)];
  return { choices, answer };
}

// ---------------------------------------------------------------------------
// Templates: T[slug][band] = [ fn(rng) -> {type,statement,choices?,answer,solution} ]
// Answers are always computed. Source tag "generated".
// ---------------------------------------------------------------------------
const SA = (statement, answer, solution) => ({ type: "SHORT_ANSWER", statement, answer: String(answer), solution, source: "generated" });
const MCq = (statement, choices, answer, solution) => ({ type: "MULTIPLE_CHOICE", statement, choices, answer, solution, source: "generated" });

const T = {
  "nt-divisibility-primes": {
    easy: [
      (r) => { const n = ri(r, 4, 80); const p = nextPrime(n); return SA(`What is the smallest prime number greater than $${n}$?`, p, `Checking $${n + 1}, ${n + 2}, \\dots$, the first prime is $${p}$.`); },
      (r) => { const n = ri(r, 8, 90); const p = prevPrime(n); return SA(`What is the largest prime number less than $${n}$?`, p, `Counting down from $${n - 1}$, the first prime is $${p}$.`); },
      (r) => { const d = pick(r, [2, 3, 4, 5, 6, 9]); const N = ri(r, 20, 100); const c = Math.floor(N / d); return SA(`How many multiples of $${d}$ are there from $1$ to $${N}$?`, c, `The count is $\\lfloor ${N}/${d} \\rfloor = ${c}$.`); },
      (r) => { const d = pick(r, [2, 3, 4, 5, 6, 9, 11]); const ok = d * ri(r, 3, 9); const set = new Set([ok]); while (set.size < 5) { const x = ri(r, 12, 99); if (x % d !== 0) set.add(x); } const ds = [...set].filter((x) => x !== ok); return (() => { const { choices, answer } = makeMC(r, ok, ds, (v) => v); return MCq(`Which of these numbers is divisible by $${d}$?`, choices, answer, `$${ok} = ${d} \\cdot ${ok / d}$, so it is divisible by $${d}$.`); })(); },
      (r) => { const N = ri(r, 100, 999); return SA(`What is the sum of the digits of $${N}$?`, digitSum(N), `Add the digits of $${N}$: $${String(N).split("").join("+")} = ${digitSum(N)}$.`); },
    ],
    medium: [
      (r) => { const m = pick(r, [3, 4, 6, 7, 8, 9, 11, 12]); const a = ri(r, 10, 40) * 10; const b = a + ri(r, 80, 300); const c = Math.floor(b / m) - Math.floor((a - 1) / m); return SA(`How many integers from $${a}$ to $${b}$ are divisible by $${m}$?`, c, `Count $= \\lfloor ${b}/${m} \\rfloor - \\lfloor ${a - 1}/${m} \\rfloor = ${c}$.`); },
      (r) => { let a = pick(r, [2, 3, 4, 5, 6]); let b = pick(r, [3, 4, 5, 7, 9, 10]); if (a === b) b++; const N = ri(r, 60, 240); const c = countRange(N, (n) => n % a === 0 || n % b === 0); return SA(`How many integers from $1$ to $${N}$ are divisible by $${a}$ or $${b}$?`, c, `By inclusion–exclusion using multiples of $${a}$, $${b}$, and $${lcm(a, b)}$, the count is $${c}$.`); },
      (r) => { let a = ri(r, 5, 40); let b = a + ri(r, 10, 50); const c = countRange(b, (n) => n >= a && isPrime(n)); return SA(`How many prime numbers are there between $${a}$ and $${b}$ (inclusive)?`, c, `Listing primes in $[${a}, ${b}]$ gives $${c}$ of them.`); },
      (r) => { const d = ri(r, 7, 30); const N = ri(r, 50, 400); const m = (Math.floor(N / d) + 1) * d; return SA(`What is the smallest multiple of $${d}$ greater than $${N}$?`, m, `$${d} \\cdot ${Math.floor(N / d) + 1} = ${m}$ is the first multiple of $${d}$ above $${N}$.`); },
      (r) => { let a = pick(r, [2, 3, 4, 5, 6]); let b = pick(r, [4, 6, 8, 9, 10, 15]); const N = ri(r, 80, 300); const L = lcm(a, b); const c = Math.floor(N / L); return SA(`How many integers from $1$ to $${N}$ are divisible by both $${a}$ and $${b}$?`, c, `These are multiples of $\\operatorname{lcm}(${a},${b}) = ${L}$: $\\lfloor ${N}/${L} \\rfloor = ${c}$.`); },
    ],
    hard: [
      (r) => { const a = pick(r, [2, 3, 4]); const b = pick(r, [5, 6, 7]); const cc = pick(r, [9, 10, 11]); const N = ri(r, 120, 500); const c = countRange(N, (n) => n % a === 0 || n % b === 0 || n % cc === 0); return SA(`How many integers from $1$ to $${N}$ are divisible by at least one of $${a}$, $${b}$, or $${cc}$?`, c, `Inclusion–exclusion over the three moduli (and their pairwise/triple lcms) gives $${c}$.`); },
      (r) => { let a = pick(r, [2, 3, 5]); let b = pick(r, [4, 7, 9]); const N = ri(r, 100, 400); const c = countRange(N, (n) => n % a !== 0 && n % b !== 0); return SA(`How many integers from $1$ to $${N}$ are divisible by neither $${a}$ nor $${b}$?`, c, `Subtract those divisible by $${a}$ or $${b}$ from $${N}$ (inclusion–exclusion): $${c}$.`); },
      (r) => { const d = ri(r, 4, 25); const N = ri(r, 100, 500); let s = 0; for (let k = d; k <= N; k += d) s += k; return SA(`What is the sum of all multiples of $${d}$ from $1$ to $${N}$?`, s, `The multiples form an arithmetic series; their sum is $${s}$.`); },
      (r) => { const k = ri(r, 12, 80); return SA(`What is the $${k}$th prime number?`, nthPrime(k), `Listing primes in order, the $${k}$th is $${nthPrime(k)}$.`); },
      (r) => { const M = pick(r, [12, 15, 18, 20, 24, 30, 36]); const N = ri(r, 60, 300); const c = countRange(N, (n) => gcd(n, M) === 1); return SA(`How many integers from $1$ to $${N}$ are coprime to $${M}$?`, c, `Counting $n$ with $\\gcd(n, ${M}) = 1$ gives $${c}$.`); },
    ],
  },

  "nt-factorization-divisors": {
    easy: [
      (r) => { const n = randComposite(r, 6, 60); return SA(`How many positive divisors does $${n}$ have?`, numDivisors(n), `Its divisors are $${divisorList(n).join(", ")}$ — $${numDivisors(n)}$ in all.`); },
      (r) => { const n = randComposite(r, 6, 40); return SA(`What is the sum of all positive divisors of $${n}$?`, sumDivisors(n), `$${divisorList(n).join(" + ")} = ${sumDivisors(n)}$.`); },
      (r) => { const n = randComposite(r, 10, 99); return SA(`What is the smallest prime factor of $${n}$?`, distinctPrimes(n)[0], `Factoring $${n}$, its smallest prime factor is $${distinctPrimes(n)[0]}$.`); },
      (r) => { const n = randComposite(r, 10, 99); const ps = distinctPrimes(n); return SA(`What is the largest prime factor of $${n}$?`, ps[ps.length - 1], `Factoring $${n}$, its largest prime factor is $${ps[ps.length - 1]}$.`); },
      (r) => { const n = randComposite(r, 8, 80); const ans = distinctPrimes(n).length; return SA(`How many distinct prime factors does $${n}$ have?`, ans, `$${n} = ${[...factorize(n)].map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join(" \\cdot ")}$, so $${ans}$ distinct prime(s).`); },
    ],
    medium: [
      (r) => { const p = randPrime(r, 2, 5); const q = randPrime(r, 3, 11); if (p === q) return SA(`How many positive divisors does $${36}$ have?`, 9, `$36 = 2^2\\cdot 3^2$, so $(2+1)(2+1)=9$.`); const n = p ** ri(r, 1, 3) * q ** ri(r, 1, 2); return SA(`How many positive divisors does $${n}$ have?`, numDivisors(n), `Write $${n} = ${[...factorize(n)].map(([a, e]) => (e > 1 ? `${a}^${e}` : `${a}`)).join("\\cdot")}$; multiply $(e_i+1)$ to get $${numDivisors(n)}$.`); },
      (r) => { const n = randComposite(r, 40, 200); return SA(`What is the sum of the distinct prime factors of $${n}$?`, distinctPrimes(n).reduce((a, b) => a + b, 0), `$${n}$ has distinct prime factors $${distinctPrimes(n).join(", ")}$, summing to $${distinctPrimes(n).reduce((a, b) => a + b, 0)}$.`); },
      (r) => { const n = randComposite(r, 8, 60); let s = 1; for (const [p, e] of factorize(n)) s *= p ** (e % 2 === 0 ? e : e + 1); return SA(`What is the smallest perfect square that is a multiple of $${n}$?`, s, `Round each exponent in $${n}$'s factorization up to an even number: the result is $${s}$.`); },
      (r) => { const n = randComposite(r, 12, 120); const even = n % 2 === 0 ? numDivisors(n) - numDivisors(n / 2 ** factorize(n).get(2)) : 0; return SA(`How many divisors of $${n}$ are even?`, even, `Divisors with at least one factor of $2$: $${even}$.`); },
      (r) => { const n = randComposite(r, 30, 300); return SA(`What is the sum of all positive divisors of $${n}$?`, sumDivisors(n), `Using $\\sigma(n)=\\prod \\frac{p^{a+1}-1}{p-1}$ on $${n}$ gives $${sumDivisors(n)}$.`); },
    ],
    hard: [
      (r) => { const D = pick(r, [6, 8, 9, 10, 12, 16, 18, 20, 24]); return SA(`What is the smallest positive integer with exactly $${D}$ positive divisors?`, smallestWithDivisors(D), `Searching upward, $${smallestWithDivisors(D)}$ is the first integer with exactly $${D}$ divisors.`); },
      (r) => { const N = ri(r, 50, 600); const c = Math.floor(Math.sqrt(N - 1)); return SA(`How many positive integers less than $${N}$ have an odd number of divisors?`, c, `Only perfect squares have an odd number of divisors; there are $${c}$ below $${N}$.`); },
      (r) => { const n = randComposite(r, 60, 400); const c = divisorList(n).filter((d) => Number.isInteger(Math.sqrt(d))).length; return SA(`How many divisors of $${n}$ are perfect squares?`, c, `Among the divisors of $${n}$, $${c}$ are perfect squares.`); },
      (r) => { const n = randComposite(r, 40, 300); const m = pick(r, distinctPrimes(n)); const c = divisorList(n).filter((d) => d % m === 0).length; return SA(`How many divisors of $${n}$ are multiples of $${m}$?`, c, `Divisors of $${n}$ divisible by $${m}$ correspond to divisors of $${n}/${m} \\cdot$ adjustments — there are $${c}$.`); },
      (r) => { const p = randPrime(r, 2, 5); const q = randPrime(r, 3, 7); const s = randPrime(r, 5, 13); if (new Set([p, q, s]).size < 3) { const n = 360; return SA(`How many positive divisors does $${n}$ have?`, 24, `$360 = 2^3\\cdot3^2\\cdot5$, so $(4)(3)(2)=24$.`); } const n = p ** 2 * q * s; return SA(`How many positive divisors does $${n}$ have?`, numDivisors(n), `$${n} = ${p}^2\\cdot ${q}\\cdot ${s}$, so $(2+1)(1+1)(1+1) = ${numDivisors(n)}$.`); },
    ],
  },

  "nt-gcd-lcm": {
    easy: [
      (r) => { const a = ri(r, 6, 60); const b = ri(r, 6, 60); return SA(`What is the greatest common divisor of $${a}$ and $${b}$?`, gcd(a, b), `The largest number dividing both $${a}$ and $${b}$ is $${gcd(a, b)}$.`); },
      (r) => { const a = ri(r, 2, 14); const b = ri(r, 2, 16); return SA(`What is the least common multiple of $${a}$ and $${b}$?`, lcm(a, b), `The smallest number both $${a}$ and $${b}$ divide is $${lcm(a, b)}$.`); },
      (r) => { const a = ri(r, 8, 50); const b = ri(r, 8, 50); return SA(`What is the largest number that divides both $${a}$ and $${b}$?`, gcd(a, b), `That is $\\gcd(${a}, ${b}) = ${gcd(a, b)}$.`); },
      (r) => { const a = ri(r, 3, 15); const b = ri(r, 3, 15); return SA(`What is the smallest positive number divisible by both $${a}$ and $${b}$?`, lcm(a, b), `That is $\\operatorname{lcm}(${a}, ${b}) = ${lcm(a, b)}$.`); },
    ],
    medium: [
      (r) => { const a = ri(r, 80, 600); const b = ri(r, 80, 600); return SA(`What is the greatest common divisor of $${a}$ and $${b}$?`, gcd(a, b), `By the Euclidean algorithm, $\\gcd(${a}, ${b}) = ${gcd(a, b)}$.`); },
      (r) => { const a = ri(r, 6, 40); const b = ri(r, 6, 40); return SA(`What is the product of $\\gcd(${a},${b})$ and $\\operatorname{lcm}(${a},${b})$?`, a * b, `$\\gcd \\cdot \\operatorname{lcm} = ${a}\\cdot ${b} = ${a * b}$.`); },
      (r) => { const g = ri(r, 2, 12); let x = ri(r, 2, 9); let y = ri(r, 2, 9); while (gcd(x, y) !== 1) y++; const a = g * x, b = g * y, L = g * x * y; return SA(`Two numbers have $\\gcd ${g}$ and $\\operatorname{lcm} ${L}$. If one number is $${a}$, what is the other?`, b, `The other is $\\dfrac{\\gcd\\cdot\\operatorname{lcm}}{${a}} = \\dfrac{${g}\\cdot ${L}}{${a}} = ${b}$.`); },
      (r) => { const a = ri(r, 3, 12); const b = ri(r, 3, 14); const c = ri(r, 3, 16); return SA(`What is the least common multiple of $${a}$, $${b}$, and $${c}$?`, lcm(lcm(a, b), c), `$\\operatorname{lcm}(${a}, ${b}, ${c}) = ${lcm(lcm(a, b), c)}$.`); },
      (r) => { const a = ri(r, 12, 90); const b = ri(r, 12, 90); const c = numDivisors(gcd(a, b)); return SA(`How many positive integers divide both $${a}$ and $${b}$?`, c, `Common divisors of $${a},${b}$ are the divisors of $\\gcd = ${gcd(a, b)}$: $${c}$ of them.`); },
    ],
    hard: [
      (r) => { const g = ri(r, 2, 10); const m = pick(r, [6, 10, 12, 15, 30, 42]); const P = g * g * m; const ans = 2 ** omega(m); return SA(`Two positive integers have product $${P}$ and greatest common divisor $${g}$. How many ordered pairs $(a,b)$ are possible?`, ans, `Write $a=${g}x,\\ b=${g}y$ with $\\gcd(x,y)=1$ and $xy = ${m}$. Each of the $${omega(m)}$ prime factor(s) of $${m}$ goes wholly to $x$ or $y$, giving $2^{${omega(m)}} = ${ans}$ ordered pairs.`); },
      (r) => { const a = ri(r, 200, 1500); const b = ri(r, 200, 1500); return SA(`What is the greatest common divisor of $${a}$ and $${b}$?`, gcd(a, b), `Repeated remainders (the Euclidean algorithm) give $\\gcd(${a}, ${b}) = ${gcd(a, b)}$.`); },
      (r) => { const L = pick(r, [12, 24, 36, 48, 60, 72, 100, 120]); let ans = 1; for (const e of factorize(L).values()) ans *= 2 * e + 1; return SA(`How many ordered pairs $(x,y)$ of positive integers satisfy $\\operatorname{lcm}(x,y) = ${L}$?`, ans, `For $${L} = \\prod p^{a}$, each prime contributes $2a+1$ choices, giving $${ans}$ ordered pairs.`); },
      (r) => { const M = pick(r, [10, 12, 15, 18, 20, 24]); const N = ri(r, 50, 200); let s = 0; for (let n = 1; n <= N; n++) if (gcd(n, M) === 1) s += n; return SA(`What is the sum of all integers from $1$ to $${N}$ that are coprime to $${M}$?`, s, `Summing the $n \\le ${N}$ with $\\gcd(n, ${M})=1$ gives $${s}$.`); },
    ],
  },

  "nt-units-digits": {
    easy: [
      (r) => { const a = ri(r, 2, 9); const e = ri(r, 2, 6); return SA(`What is the units digit of $${a}^{${e}}$?`, modpow(a, e, 10), `$${a}^{${e}}$ ends in $${modpow(a, e, 10)}$.`); },
      (r) => { const a = ri(r, 12, 99); const b = ri(r, 12, 99); return SA(`What is the units digit of $${a} \\times ${b}$?`, (a * b) % 10, `Only the units digits matter: $${a % 10}\\times ${b % 10}$ ends in $${(a * b) % 10}$.`); },
      (r) => { const a = pick(r, [2, 3, 7, 8]); const e = ri(r, 2, 4); return SA(`What is the units digit of $${a}^{${e}}$?`, modpow(a, e, 10), `Following the cycle of $${a}$, $${a}^{${e}}$ ends in $${modpow(a, e, 10)}$.`); },
    ],
    medium: [
      (r) => { const a = ri(r, 2, 9); const e = ri(r, 20, 400); return SA(`What is the units digit of $${a}^{${e}}$?`, modpow(a, e, 10), `The units digit of $${a}^n$ has period $${cycleLen(a)}$; reducing $${e}$ modulo it gives units digit $${modpow(a, e, 10)}$.`); },
      (r) => { const base = ri(r, 11, 999); const e = ri(r, 15, 300); return SA(`What is the units digit of $${base}^{${e}}$?`, modpow(base, e, 10), `Only the base's units digit $${base % 10}$ matters; its cycle gives $${modpow(base, e, 10)}$.`); },
      (r) => { const a = ri(r, 2, 9); const e = ri(r, 8, 60); const b = ri(r, 2, 9); const f = ri(r, 8, 60); const ans = (modpow(a, e, 10) + modpow(b, f, 10)) % 10; return SA(`What is the units digit of $${a}^{${e}} + ${b}^{${f}}$?`, ans, `Add the units digits $${modpow(a, e, 10)} + ${modpow(b, f, 10)} = ${modpow(a, e, 10) + modpow(b, f, 10)}$, ending in $${ans}$.`); },
    ],
    hard: [
      (r) => { const a = pick(r, [3, 7, 9, 11, 13, 17, 21, 23, 27]); const e = ri(r, 10, 200); return SA(`What are the last two digits of $${a}^{${e}}$?`, String(modpow(a, e, 100)).padStart(2, "0"), `Working modulo $100$, $${a}^{${e}} \\equiv ${String(modpow(a, e, 100)).padStart(2, "0")}$.`); },
      (r) => { const a = ri(r, 2, 9), e = ri(r, 6, 40), b = ri(r, 2, 9), f = ri(r, 6, 40), c = ri(r, 2, 9), g = ri(r, 6, 40); const ans = (modpow(a, e, 10) + modpow(b, f, 10) + modpow(c, g, 10)) % 10; return SA(`What is the units digit of $${a}^{${e}} + ${b}^{${f}} + ${c}^{${g}}$?`, ans, `Sum the units digits $${modpow(a, e, 10)}+${modpow(b, f, 10)}+${modpow(c, g, 10)}$; the result ends in $${ans}$.`); },
      (r) => { const a = pick(r, [2, 3, 7, 8]); const b = ri(r, 2, 9); const c = ri(r, 2, 5); const L = cycleLen(a); const exp = modpow(b, c, L) || L; const ans = modpow(a, exp === 0 ? L : exp, 10); return SA(`What is the units digit of $${a}^{(${b}^{${c}})}$?`, ans, `The units digit of $${a}$ has period $${L}$. Reduce the exponent $${b}^{${c}} = ${b ** c}$ modulo $${L}$, then read off the cycle: units digit $${ans}$.`); },
    ],
  },

  "nt-modular": {
    easy: [
      (r) => { const m = ri(r, 3, 12); const N = ri(r, 40, 500); return SA(`What is the remainder when $${N}$ is divided by $${m}$?`, N % m, `$${N} = ${Math.floor(N / m)}\\cdot ${m} + ${N % m}$.`); },
      (r) => { const a = ri(r, 2, 6); const e = ri(r, 2, 5); const m = ri(r, 3, 9); return SA(`What is the remainder when $${a}^{${e}}$ is divided by $${m}$?`, modpow(a, e, m), `$${a}^{${e}} = ${a ** e} \\equiv ${modpow(a, e, m)} \\pmod{${m}}$.`); },
      (r) => { const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; const start = ri(r, 0, 6); const n = ri(r, 10, 100); return SA(`If today is ${days[start]}, what day of the week will it be $${n}$ days from now?`, days[(start + n) % 7], `$${n} \\equiv ${n % 7} \\pmod 7$, so count $${n % 7}$ day(s) past ${days[start]}.`); },
    ],
    medium: [
      (r) => { const a = ri(r, 2, 9); const e = ri(r, 50, 600); const m = pick(r, [5, 7, 9, 11, 13]); return SA(`What is the remainder when $${a}^{${e}}$ is divided by $${m}$?`, modpow(a, e, m), `Find a small power of $${a}$ that is $\\equiv 1 \\pmod{${m}}$ and reduce the exponent: the remainder is $${modpow(a, e, m)}$.`); },
      (r) => { const m = pick(r, [4, 5, 6, 7, 9, 11]); const rem = ri(r, 0, m - 1); const N = ri(r, 100, 1000); const c = countRange(N, (n) => n % m === rem); return SA(`How many integers $n$ with $1 \\le n \\le ${N}$ satisfy $n \\equiv ${rem} \\pmod{${m}}$?`, c, `Such $n$ form an arithmetic progression with common difference $${m}$; there are $${c}$ up to $${N}$.`); },
      (r) => { const m1 = pick(r, [3, 4, 5]); const m2 = pick(r, [7, 8, 9, 11]); const r1 = ri(r, 0, m1 - 1); const r2 = ri(r, 0, m2 - 1); let n = 1; while (!(n % m1 === r1 && n % m2 === r2)) n++; return SA(`What is the smallest positive integer that leaves remainder $${r1}$ when divided by $${m1}$ and remainder $${r2}$ when divided by $${m2}$?`, n, `By the Chinese Remainder Theorem the smallest such integer is $${n}$.`); },
    ],
    hard: [
      (r) => { const a = pick(r, [2, 3, 7, 11, 13, 17]); const e = ri(r, 100, 3000); return SA(`What are the last three digits of $${a}^{${e}}$?`, String(modpow(a, e, 1000)).padStart(3, "0"), `Compute $${a}^{${e}} \\bmod 1000$ via the Chinese Remainder Theorem (mod $8$ and mod $125$): $${String(modpow(a, e, 1000)).padStart(3, "0")}$.`); },
      (r) => { const p = randPrime(r, 11, 60); return SA(`What is the remainder when $${p - 1}!$ is divided by $${p}$?`, p - 1, `By Wilson's Theorem, $(${p}-1)! \\equiv -1 \\equiv ${p - 1} \\pmod{${p}}$.`); },
      (r) => { const m = pick(r, [5, 7, 8, 9, 11, 12]); const target = ri(r, 0, m - 1); const N = ri(r, 50, 300); const c = countRange(N, (n) => (n * n) % m === target); return SA(`How many integers $n$ with $1 \\le n \\le ${N}$ satisfy $n^2 \\equiv ${target} \\pmod{${m}}$?`, c, `The condition $n^2 \\equiv ${target} \\pmod{${m}}$ is periodic with period $${m}$; counting up to $${N}$ gives $${c}$.`); },
      (r) => { const m = pick(r, [100, 1000]); const upto = ri(r, 10, 30); let s = 0n; for (let k = 1; k <= upto; k++) s += factBig(k); const ans = Number(s % BigInt(m)); return SA(`What is the remainder when $1! + 2! + \\cdots + ${upto}!$ is divided by $${m}$?`, ans, `Large factorials are $\\equiv 0 \\pmod{${m}}$, so only the first several terms matter; the remainder is $${ans}$.`); },
    ],
  },

  "nt-factorials": {
    easy: [
      (r) => { const n = ri(r, 5, 24); return SA(`How many trailing zeros does $${n}!$ have?`, trailingZeros(n), `Count factors of $5$: $\\lfloor ${n}/5 \\rfloor${n >= 25 ? " + \\lfloor " + n + "/25 \\rfloor" : ""} = ${trailingZeros(n)}$.`); },
      (r) => { const n = ri(r, 1, 8); let s = 0n; for (let k = 1; k <= n; k++) s += factBig(k); return SA(`What is the units digit of $1! + 2! + \\cdots + ${n}!$?`, Number(s % 10n), `The sum is $${s.toString()}$, ending in $${Number(s % 10n)}$.`); },
      (r) => { const n = ri(r, 3, 7); return SA(`What is the value of $${n}!$?`, factBig(n).toString(), `$${n}! = ${Array.from({ length: n - 1 }, (_, i) => i + 2).join(" \\cdot ")} = ${factBig(n).toString()}$.`); },
      (r) => { const n = ri(r, 5, 24); return SA(`What is the exponent of $5$ in the prime factorization of $${n}!$?`, legendre(5, n), `By Legendre's formula this exponent is $${legendre(5, n)}$.`); },
    ],
    medium: [
      (r) => { const n = ri(r, 25, 250); return SA(`How many trailing zeros does $${n}!$ have?`, trailingZeros(n), `Sum $\\lfloor ${n}/5 \\rfloor + \\lfloor ${n}/25 \\rfloor + \\cdots = ${trailingZeros(n)}$.`); },
      (r) => { const k = ri(r, 2, 8); let n = 1; while (trailingZeros(n) < k) n++; return SA(`What is the smallest positive integer $n$ such that $n!$ is divisible by $10^{${k}}$?`, n, `You need $${k}$ factors of $5$; the smallest such $n$ is $${n}$.`); },
      (r) => { const n = ri(r, 30, 250); const p = pick(r, [3, 7]); return SA(`What is the exponent of $${p}$ in the prime factorization of $${n}!$?`, legendre(p, n), `By Legendre's formula, $\\sum_k \\lfloor ${n}/${p}^k \\rfloor = ${legendre(p, n)}$.`); },
    ],
    hard: [
      (r) => { const p = pick(r, [2, 3, 5, 7]); const n = ri(r, 20, 300); return SA(`What is the largest power of $${p}$ dividing $${n}!$? Give the exponent.`, legendre(p, n), `Legendre's formula gives $\\sum_k \\lfloor ${n}/${p}^k \\rfloor = ${legendre(p, n)}$.`); },
      (r) => { const b = pick(r, [6, 12, 15, 18, 20, 24]); const n = ri(r, 20, 200); return SA(`How many trailing zeros does $${n}!$ have when written in base $${b}$?`, trailingZerosBase(n, b), `Base $${b} = ${[...factorize(b)].map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join("\\cdot")}$; the limiting prime power gives $${trailingZerosBase(n, b)}$ trailing zeros.`); },
      (r) => { const p = randPrime(r, 5, 40); return SA(`What is the remainder when $${p - 1}!$ is divided by $${p}$?`, p - 1, `Wilson's Theorem: $(${p}-1)! \\equiv -1 \\equiv ${p - 1} \\pmod{${p}}$.`); },
    ],
  },
};

// ---------------------------------------------------------------------------
// Generation driver
// ---------------------------------------------------------------------------
const ORDER = ["nt-divisibility-primes", "nt-factorization-divisors", "nt-gcd-lcm", "nt-modular", "nt-units-digits", "nt-factorials"];
const BANDS = ["easy", "medium", "hard"];
const RANGE = { easy: [620, 980], medium: [1020, 1380], hard: [1420, 1880] };
const bandOf = (r) => (r < 1000 ? "easy" : r < 1400 ? "medium" : "hard");

function targets(i) { const t = { easy: 17, medium: 17, hard: 17 }; t[BANDS[i % 3]] = 16; return t; }

const line = (o) => "  { " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";

function main() {
  selfTest();
  const seenGlobal = new Set();
  let added = 0;
  const summary = [];

  ORDER.forEach((slug, i) => {
    const file = join(SUB, slug, "problems.json");
    const existing = JSON.parse(readFileSync(file, "utf8"));
    existing.forEach((p) => seenGlobal.add(p.statement));
    const have = { easy: 0, medium: 0, hard: 0 };
    existing.forEach((p) => have[bandOf(p.rating)]++);
    const tgt = targets(i);
    const out = [...existing];

    for (const band of BANDS) {
      const need = Math.max(0, tgt[band] - have[band]);
      const tmpls = T[slug][band];
      const [lo, hi] = RANGE[band];
      const rng = rngFrom((i + 1) * 1000 + BANDS.indexOf(band) * 97 + 7);
      let made = 0, attempts = 0;
      while (made < need && attempts < 20000) {
        attempts++;
        const q = pick(rng, tmpls)(rng);
        if (!q || seenGlobal.has(q.statement)) continue;
        if (q.type === "MULTIPLE_CHOICE" && (!q.choices || !q.answer)) continue;
        seenGlobal.add(q.statement);
        const rating = ri(rng, lo, hi);
        out.push({ ...q, rating });
        made++; added++;
      }
      if (made < need) throw new Error(`Could not fill ${slug}/${band}: needed ${need}, made ${made}`);
    }

    out.sort((a, b) => a.rating - b.rating);
    writeFileSync(file, "[\n" + out.map(line).join(",\n") + "\n]\n");
    const c = { easy: 0, medium: 0, hard: 0 }; out.forEach((p) => c[bandOf(p.rating)]++);
    summary.push(`${slug.padEnd(28)} total ${out.length}  (easy ${c.easy} / med ${c.medium} / hard ${c.hard})`);
  });

  console.log(`\nGenerated ${added} new problems.\n` + summary.join("\n"));
}

main();
