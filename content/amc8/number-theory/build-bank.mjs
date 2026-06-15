// Curated competition-style problem bank for Number Theory.
//
// Each problem is hand-authored (clean numbers, real AMC 8 / AMC 10 / AIME
// framing) but paired with a compute() that DERIVES the answer in code, so the
// stored answer is never a hand-typed guess. Helpers are self-tested first.
// Bands: easy ~ AMC 8, medium ~ AMC 10, hard ~ AIME. Ratings are per-problem.
//
//   node content/amc8/number-theory/build-bank.mjs

import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SUB = join(HERE, "subtopics");

// ---- helpers (all integer / BigInt) ----
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const primesUpTo = (N) => { const r = []; for (let i = 2; i <= N; i++) if (isPrime(i)) r.push(i); return r; };
const PRIMES = primesUpTo(5000);
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
const eulerPhi = (n) => { let r = n; for (const p of distinctPrimes(n)) r -= r / p; return r; };
const omega = (n) => factorize(n).size;
const countRange = (N, pred) => { let c = 0; for (let n = 1; n <= N; n++) if (pred(n)) c++; return c; };
const sumRange = (N, pred) => { let s = 0; for (let n = 1; n <= N; n++) if (pred(n)) s += n; return s; };
const isPalindrome = (n) => { const s = String(n); return s === [...s].reverse().join(""); };
const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function selfTest() {
  const C = [
    [numDivisors(360), 24], [sumDivisors(360), 1170], [eulerPhi(2024), 880], [eulerPhi(100), 40],
    [trailingZeros(100), 24], [trailingZeros(1000), 249], [legendre(2, 50), 47], [legendre(3, 20), 8],
    [modpow(3, 2024, 1000), 481], [modpow(2, 2024, 1000), 216], [modpow(2, 100, 100), 76], [modpow(7, 7 ** 7, 100), 43],
    [gcd(48, 60), 12], [lcm(8, 12), 24], [nthPrime(5), 11], [omega(2025), 2], [digitSum(821), 11],
  ];
  let bad = 0;
  for (const [g, e] of C) if (String(g) !== String(e)) { console.error("SELF-TEST FAIL", g, "!=", e); bad++; }
  if (bad) throw new Error(`${bad} self-tests failed`);
  console.log(`Helper self-tests: ${C.length}/${C.length} passed.`);
}

const DP = "nt-divisibility-primes", FD = "nt-factorization-divisors", GL = "nt-gcd-lcm",
  MOD = "nt-modular", UD = "nt-units-digits", FAC = "nt-factorials";

// Each: { sub, band, rating, statement, sol:(a)=>string, compute:()=>answer }
const P = [
  // ===================== DIVISIBILITY & PRIMES =====================
  { sub: DP, band: "easy", rating: 760, statement: "A palindrome reads the same forwards and backwards, like $373$. What is the largest three-digit palindrome that is divisible by $6$?", compute: () => { for (let n = 999; n >= 100; n--) if (isPalindrome(n) && n % 6 === 0) return n; }, sol: (a) => `A multiple of $6$ must be even, so the first (and last) digit is even; checking downward, $${a}$ works ($${a}/6=${a / 6}$).` },
  { sub: DP, band: "easy", rating: 820, statement: "How many two-digit numbers are prime?", compute: () => countRange(99, (n) => n >= 10 && isPrime(n)), sol: (a) => `Counting the primes from $11$ to $97$ gives $${a}$.` },
  { sub: DP, band: "easy", rating: 700, statement: "A two-digit prime less than $30$ has digits that add up to $10$. What is it?", compute: () => { let hits = []; for (let n = 10; n < 30; n++) if (isPrime(n) && digitSum(n) === 10) hits.push(n); if (hits.length !== 1) throw new Error("non-unique prime problem: " + hits); return hits[0]; }, sol: (a) => `Among two-digit primes below $30$, only $${a}$ has digit sum $10$.` },
  { sub: DP, band: "easy", rating: 740, statement: "Of the first five primes $2, 3, 5, 7, 11$, how many are divisors of $2024$?", compute: () => [2, 3, 5, 7, 11].filter((p) => 2024 % p === 0).length, sol: (a) => `$2024 = 2^3\\cdot 11\\cdot 23$, so $2$ and $11$ divide it: $${a}$.` },
  { sub: DP, band: "easy", rating: 900, statement: "How many integers from $1$ to $100$ are divisible by $4$ but not by $6$?", compute: () => countRange(100, (n) => n % 4 === 0 && n % 6 !== 0), sol: (a) => `Multiples of $4$ number $25$; remove the $8$ that are also multiples of $12$ to get $${a}$.` },
  { sub: DP, band: "medium", rating: 1200, statement: "How many positive integers less than $1000$ are divisible by neither $5$ nor $7$?", compute: () => countRange(999, (n) => n % 5 !== 0 && n % 7 !== 0), sol: (a) => `By inclusion–exclusion, $999 - (199 + 142 - 28) = ${a}$.` },
  { sub: DP, band: "medium", rating: 1100, statement: "What is the smallest positive integer $n$ such that $n$, $n+1$, and $n+2$ are all composite?", compute: () => { for (let n = 1; ; n++) if (!isPrime(n) && !isPrime(n + 1) && !isPrime(n + 2)) return n; }, sol: (a) => `$${a}, ${+a + 1}, ${+a + 2}$ are the first three consecutive composites.` },
  { sub: DP, band: "medium", rating: 1150, statement: "What is the sum of all prime numbers $p$ with $100 < p < 110$?", compute: () => PRIMES.filter((p) => p > 100 && p < 110).reduce((s, p) => s + p, 0), sol: (a) => `The primes are $101, 103, 107, 109$, summing to $${a}$.` },
  { sub: DP, band: "medium", rating: 1250, statement: "How many integers from $1$ to $200$ are divisible by $3$ or $4$ but not by $12$?", compute: () => countRange(200, (n) => (n % 3 === 0 || n % 4 === 0) && n % 12 !== 0), sol: (a) => `Those divisible by $3$ or $4$ number $100$; removing the $16$ multiples of $12$ leaves $${a}$.` },
  { sub: DP, band: "medium", rating: 1300, statement: "For how many primes $p < 50$ are $p$, $p+2$, and $p+6$ all prime?", compute: () => PRIMES.filter((p) => p < 50 && isPrime(p + 2) && isPrime(p + 6)).length, sol: (a) => `The values $p = 5, 11, 17, 41$ work, giving $${a}$.` },
  { sub: DP, band: "hard", rating: 1550, statement: "How many positive integers less than $1000$ are divisible by exactly one of $6$ and $10$?", compute: () => countRange(999, (n) => (n % 6 === 0) !== (n % 10 === 0)), sol: (a) => `$(166-33) + (99-33) = ${a}$, removing the multiples of $\\operatorname{lcm}(6,10)=30$ from each.` },
  { sub: DP, band: "hard", rating: 1700, statement: "Find the sum of all positive integers $n < 100$ that are divisible by their number of positive divisors.", compute: () => sumRange(99, (n) => n % numDivisors(n) === 0), sol: (a) => `These 'refactorable' numbers below $100$ sum to $${a}$.` },
  { sub: DP, band: "hard", rating: 1600, statement: "What is the largest three-digit prime with three distinct digits whose digits sum to $11$?", compute: () => { for (let n = 999; n >= 100; n--) { const s = String(n); if (isPrime(n) && new Set(s).size === 3 && digitSum(n) === 11) return n; } }, sol: (a) => `Searching downward, $${a}$ is prime with distinct digits summing to $11$.` },
  { sub: DP, band: "hard", rating: 1650, statement: "How many positive integers $n$ with $1 \\le n \\le 2024$ share no common factor greater than $1$ with $2024$?", compute: () => eulerPhi(2024), sol: (a) => `$2024 = 2^3\\cdot 11\\cdot 23$, so $\\varphi(2024) = 2024\\cdot\\frac12\\cdot\\frac{10}{11}\\cdot\\frac{22}{23} = ${a}$.` },
  { sub: DP, band: "hard", rating: 1780, statement: "The smallest positive multiple of $18$ whose digits are all $0$s and $8$s is $N$. What is $N / 18$?", compute: () => { for (let n = 18; ; n += 18) if (/^[08]+$/.test(String(n))) return n / 18; }, sol: (a) => `Divisibility by $9$ forces nine $8$s, giving $N = 888888888$ and $N/18 = ${a}$.` },

  // ===================== PRIME FACTORIZATION & DIVISORS =====================
  { sub: FD, band: "easy", rating: 720, statement: "How many rectangles with whole-number side lengths have an area of $36$ square units? (A $4\\times 9$ rectangle is the same as a $9\\times 4$ one.)", compute: () => Math.ceil(numDivisors(36) / 2), sol: (a) => `Each rectangle is a divisor pair of $36$; with $9$ divisors there are $${a}$ unordered pairs.` },
  { sub: FD, band: "easy", rating: 780, statement: "What is the smallest positive integer with exactly $6$ positive divisors?", compute: () => { for (let n = 1; ; n++) if (numDivisors(n) === 6) return n; }, sol: (a) => `$${a} = 2^2\\cdot 3$ has $(2+1)(1+1) = 6$ divisors, and nothing smaller does.` },
  { sub: FD, band: "easy", rating: 860, statement: "A number equals the sum of its proper divisors (divisors less than itself); for example $6 = 1+2+3$. What is the next such 'perfect' number after $6$?", compute: () => { for (let n = 7; ; n++) if (sumDivisors(n) - n === n) return n; }, sol: (a) => `$${a} = 1+2+4+7+14$, the next perfect number after $6$.` },
  { sub: FD, band: "easy", rating: 800, statement: "Writing $60$ as a product of primes ($60 = 2\\cdot 2\\cdot 3\\cdot 5$), what is the sum of those prime factors, counted with repetition?", compute: () => { let s = 0; for (const [p, e] of factorize(60)) s += p * e; return s; }, sol: (a) => `$2 + 2 + 3 + 5 = ${a}$.` },
  { sub: FD, band: "easy", rating: 840, statement: "How many positive divisors of $100$ are even?", compute: () => divisorList(100).filter((d) => d % 2 === 0).length, sol: (a) => `$100$ has $9$ divisors; removing the $3$ odd ones ($1,5,25$) leaves $${a}$ even divisors.` },
  { sub: FD, band: "medium", rating: 1150, statement: "What is the smallest positive integer with exactly $12$ positive divisors?", compute: () => { for (let n = 1; ; n++) if (numDivisors(n) === 12) return n; }, sol: (a) => `$${a} = 2^2\\cdot 3\\cdot 5$ gives $(3)(2)(2) = 12$ divisors, the smallest to do so.` },
  { sub: FD, band: "medium", rating: 1300, statement: "How many positive divisors of $7!$ are perfect squares?", compute: () => divisorList(Number(factBig(7))).filter((d) => Number.isInteger(Math.sqrt(d))).length, sol: (a) => `$7! = 2^4\\cdot 3^2\\cdot 5\\cdot 7$; square divisors use even exponents: $3\\cdot 2\\cdot 1\\cdot 1 = ${a}$.` },
  { sub: FD, band: "medium", rating: 1250, statement: "The number $N = 2^a \\cdot 3^b$ has exactly $15$ positive divisors. What is the smallest possible value of $N$?", compute: () => { let best = Infinity; for (let a = 0; a < 15; a++) for (let b = 0; b < 15; b++) if ((a + 1) * (b + 1) === 15) best = Math.min(best, 2 ** a * 3 ** b); return best; }, sol: (a) => `$(a+1)(b+1) = 15$; taking $a=4, b=2$ gives $2^4\\cdot 3^2 = ${a}$.` },
  { sub: FD, band: "medium", rating: 1100, statement: "How many positive integers from $1$ to $50$ have an odd number of positive divisors?", compute: () => countRange(50, (n) => numDivisors(n) % 2 === 1), sol: (a) => `Only perfect squares have an odd divisor count: $1,4,9,16,25,36,49$ — that's $${a}$.` },
  { sub: FD, band: "medium", rating: 1200, statement: "What is the sum of all positive divisors of $360$?", compute: () => sumDivisors(360), sol: (a) => `$360 = 2^3\\cdot 3^2\\cdot 5$, so $\\sigma = 15\\cdot 13\\cdot 6 = ${a}$.` },
  { sub: FD, band: "hard", rating: 1500, statement: "How many positive integers less than $1000$ have exactly $3$ positive divisors?", compute: () => countRange(999, (n) => numDivisors(n) === 3), sol: (a) => `Exactly $3$ divisors means $n = p^2$; the primes $p$ with $p^2 < 1000$ number $${a}$.` },
  { sub: FD, band: "hard", rating: 1650, statement: "What is the smallest positive integer that has exactly $18$ positive divisors and is itself divisible by $18$?", compute: () => { for (let n = 18; ; n += 18) if (numDivisors(n) === 18) return n; }, sol: (a) => `$${a} = 2^2\\cdot 3^2\\cdot 5$ has $(3)(3)(2) = 18$ divisors and is divisible by $18$.` },
  { sub: FD, band: "hard", rating: 1720, statement: "The number $2024 = 2^3 \\cdot 11 \\cdot 23$. How many positive divisors of $2024^2$ are less than $2024$ but do not divide $2024$?", compute: () => { const N = 2024; const d2 = numDivisors(N * N); const less = (d2 - 1) / 2; const dN = numDivisors(N) - 1; return less - dN; }, sol: (a) => `$2024^2$ has $63$ divisors, so $31$ are below $2024$; of these $15$ divide $2024$, leaving $${a}$.` },
  { sub: FD, band: "hard", rating: 1550, statement: "How many positive integers divide $10!$ but do not divide $9!$?", compute: () => numDivisors(Number(factBig(10))) - numDivisors(Number(factBig(9))), sol: (a) => `$d(10!) - d(9!) = 270 - 160 = ${a}$ (every divisor of $9!$ also divides $10!$).` },
  { sub: FD, band: "hard", rating: 1600, statement: "What is the smallest positive integer with exactly $16$ positive divisors, none of whose prime factors exceeds $5$?", compute: () => { let best = Infinity; for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) for (let c = 0; c < 16; c++) if ((a + 1) * (b + 1) * (c + 1) === 16) best = Math.min(best, 2 ** a * 3 ** b * 5 ** c); return best; }, sol: (a) => `$${a} = 2^3\\cdot 3\\cdot 5$ gives $(4)(2)(2) = 16$ divisors using only primes $\\le 5$.` },

  // ===================== GCD & LCM =====================
  { sub: GL, band: "easy", rating: 720, statement: "A red light flashes every $8$ seconds and a blue light every $12$ seconds. If they flash together now, after how many seconds will they next flash together?", compute: () => lcm(8, 12), sol: (a) => `They re-synchronize after $\\operatorname{lcm}(8,12) = ${a}$ seconds.` },
  { sub: GL, band: "easy", rating: 760, statement: "Two ribbons of lengths $48$ cm and $60$ cm are each cut into equal pieces of the greatest possible whole-number length, with none left over. How long is each piece?", compute: () => gcd(48, 60), sol: (a) => `The greatest common length is $\\gcd(48,60) = ${a}$ cm.` },
  { sub: GL, band: "easy", rating: 880, statement: "What is the largest three-digit number divisible by each of $3$, $4$, and $5$?", compute: () => { const L = lcm(lcm(3, 4), 5); return Math.floor(999 / L) * L; }, sol: (a) => `Such numbers are multiples of $\\operatorname{lcm}(3,4,5)=60$; the largest below $1000$ is $${a}$.` },
  { sub: GL, band: "easy", rating: 820, statement: "Two positive integers have a product of $96$ and a greatest common divisor of $4$. What is their least common multiple?", compute: () => 96 / 4, sol: (a) => `Since $\\gcd \\cdot \\operatorname{lcm} = $ product, $\\operatorname{lcm} = 96/4 = ${a}$.` },
  { sub: GL, band: "easy", rating: 800, statement: "What is the least common multiple of $6$, $9$, and $15$?", compute: () => lcm(lcm(6, 9), 15), sol: (a) => `$\\operatorname{lcm}(6,9,15) = ${a}$.` },
  { sub: GL, band: "medium", rating: 1150, statement: "The greatest common divisor of two numbers is $6$ and their least common multiple is $90$. If one of the numbers is $18$, what is the other?", compute: () => (6 * 90) / 18, sol: (a) => `The other is $\\dfrac{\\gcd\\cdot\\operatorname{lcm}}{18} = \\dfrac{6\\cdot 90}{18} = ${a}$.` },
  { sub: GL, band: "medium", rating: 1250, statement: "How many positive integers from $1$ to $100$ are relatively prime to $100$?", compute: () => eulerPhi(100), sol: (a) => `$\\varphi(100) = 100\\cdot\\frac12\\cdot\\frac45 = ${a}$.` },
  { sub: GL, band: "medium", rating: 1200, statement: "Three bells ring at intervals of $12$, $15$, and $18$ minutes. If they ring together at $9{:}00$, how many minutes later do they next ring together?", compute: () => lcm(lcm(12, 15), 18), sol: (a) => `$\\operatorname{lcm}(12,15,18) = ${a}$ minutes.` },
  { sub: GL, band: "medium", rating: 1100, statement: "What is the sum of the greatest common divisor and the least common multiple of $24$ and $36$?", compute: () => gcd(24, 36) + lcm(24, 36), sol: (a) => `$\\gcd = 12$ and $\\operatorname{lcm} = 72$, so the sum is $${a}$.` },
  { sub: GL, band: "medium", rating: 1300, statement: "For how many integers $n$ with $1 \\le n \\le 50$ is $\\gcd(n, 50) = 5$?", compute: () => countRange(50, (n) => gcd(n, 50) === 5), sol: (a) => `These are $n = 5, 15, 35, 45$ — exactly $${a}$.` },
  { sub: GL, band: "hard", rating: 1450, statement: "How many ordered pairs $(a, b)$ of positive integers satisfy $a \\cdot b = 2025$ and $\\gcd(a, b) = 1$?", compute: () => 2 ** omega(2025), sol: (a) => `$2025 = 3^4\\cdot 5^2$ has $2$ distinct primes, so $2^2 = ${a}$ coprime ordered pairs.` },
  { sub: GL, band: "hard", rating: 1620, statement: "How many ordered pairs $(x, y)$ of positive integers satisfy $\\operatorname{lcm}(x, y) = 360$?", compute: () => { let p = 1; for (const e of factorize(360).values()) p *= 2 * e + 1; return p; }, sol: (a) => `For $360 = 2^3\\cdot 3^2\\cdot 5$, each prime gives $2e+1$ choices: $7\\cdot 5\\cdot 3 = ${a}$.` },
  { sub: GL, band: "hard", rating: 1650, statement: "Two positive integers have least common multiple $1260$ and greatest common divisor $6$. How many such ordered pairs are there?", compute: () => 2 ** omega(1260 / 6), sol: (a) => `Writing the numbers as $6x, 6y$ with $\\gcd(x,y)=1$ and $xy = 210 = 2\\cdot3\\cdot5\\cdot7$ gives $2^4 = ${a}$ ordered pairs.` },
  { sub: GL, band: "hard", rating: 1500, statement: "What is the sum of all positive integers $n \\le 30$ with $\\gcd(n, 30) = 1$?", compute: () => sumRange(30, (n) => gcd(n, 30) === 1), sol: (a) => `The numbers coprime to $30$ pair up to $30$, giving $\\tfrac{30}{2}\\cdot\\varphi(30) = ${a}$.` },
  { sub: GL, band: "hard", rating: 1560, statement: "For how many positive integers $n$ is $\\operatorname{lcm}(n, 12) = 60$?", compute: () => countRange(60, (n) => lcm(n, 12) === 60), sol: (a) => `$n$ must supply the factor $5$ exactly and not exceed the other exponents: $n \\in \\{5,10,20,15,30,60\\}$, so $${a}$.` },

  // ===================== MODULAR ARITHMETIC & REMAINDERS =====================
  { sub: MOD, band: "easy", rating: 780, statement: "Today is Wednesday. What day of the week will it be $100$ days from now?", compute: () => WEEK[(3 + 100) % 7], sol: (a) => `$100 \\equiv 2 \\pmod 7$, so two days past Wednesday is ${a}.` },
  { sub: MOD, band: "easy", rating: 760, statement: "A number leaves a remainder of $3$ when divided by $7$. What is the remainder when twice that number is divided by $7$?", compute: () => (2 * 3) % 7, sol: (a) => `Doubling the remainder: $2\\cdot 3 = 6 \\equiv ${a} \\pmod 7$.` },
  { sub: MOD, band: "easy", rating: 800, statement: "What is the remainder when $1 + 2 + 3 + \\cdots + 10$ is divided by $4$?", compute: () => 55 % 4, sol: (a) => `The sum is $55$, and $55 = 13\\cdot 4 + ${a}$.` },
  { sub: MOD, band: "easy", rating: 820, statement: "It is now $10$ o'clock. What time will it show $50$ hours from now on a $12$-hour clock?", compute: () => ((10 + 50) % 12) || 12, sol: (a) => `$10 + 50 = 60 \\equiv 0 \\pmod{12}$, which reads as $${a}$ o'clock.` },
  { sub: MOD, band: "easy", rating: 740, statement: "What is the remainder when $2^6$ is divided by $7$?", compute: () => modpow(2, 6, 7), sol: (a) => `$2^6 = 64 = 9\\cdot 7 + ${a}$.` },
  { sub: MOD, band: "medium", rating: 1100, statement: "What is the remainder when $3^{100}$ is divided by $5$?", compute: () => modpow(3, 100, 5), sol: (a) => `$3^4 \\equiv 1 \\pmod 5$ and $100 \\equiv 0 \\pmod 4$, so the remainder is $${a}$.` },
  { sub: MOD, band: "medium", rating: 1250, statement: "What is the remainder when $2^{2024}$ is divided by $9$?", compute: () => modpow(2, 2024, 9), sol: (a) => `$2^6 \\equiv 1 \\pmod 9$ and $2024 \\equiv 2 \\pmod 6$, so $2^{2024} \\equiv 2^2 = ${a}$.` },
  { sub: MOD, band: "medium", rating: 1150, statement: "What is the smallest positive integer that leaves a remainder of $1$ when divided by $4$ and a remainder of $2$ when divided by $5$?", compute: () => { let n = 1; while (!(n % 4 === 1 && n % 5 === 2)) n++; return n; }, sol: (a) => `Checking the residues, $${a}$ is the smallest such integer.` },
  { sub: MOD, band: "medium", rating: 1300, statement: "When a positive integer is divided by $7$ the remainder is $4$, and when divided by $11$ the remainder is $9$. What is the smallest such integer?", compute: () => { let n = 1; while (!(n % 7 === 4 && n % 11 === 9)) n++; return n; }, sol: (a) => `By the Chinese Remainder Theorem the smallest value is $${a}$.` },
  { sub: MOD, band: "medium", rating: 1200, statement: "What is the remainder when $1! + 2! + 3! + \\cdots + 50!$ is divided by $15$?", compute: () => { let s = 0n; for (let k = 1; k <= 50; k++) s += factBig(k); return Number(s % 15n); }, sol: (a) => `For $k \\ge 5$, $k!$ is divisible by $15$; the first four terms give remainder $${a}$.` },
  { sub: MOD, band: "hard", rating: 1600, statement: "What is the remainder when $3^{2024}$ is divided by $1000$?", compute: () => modpow(3, 2024, 1000), sol: (a) => `Via CRT (mod $8$ and mod $125$), $3^{2024} \\equiv ${a} \\pmod{1000}$.` },
  { sub: MOD, band: "hard", rating: 1550, statement: "What is the remainder when $2^{2024}$ is divided by $1000$?", compute: () => modpow(2, 2024, 1000), sol: (a) => `$2^{2024} \\equiv 0 \\pmod 8$ and $\\equiv 91 \\pmod{125}$, giving $${a} \\pmod{1000}$.` },
  { sub: MOD, band: "hard", rating: 1480, statement: "What is the remainder when $5^{30}$ is divided by $13$?", compute: () => modpow(5, 30, 13), sol: (a) => `$5^2 \\equiv -1 \\pmod{13}$, so $5^{30} = (5^2)^{15} \\equiv (-1)^{15} \\equiv ${a} \\pmod{13}$.` },
  { sub: MOD, band: "hard", rating: 1650, statement: "What is the smallest positive integer that is congruent to $2 \\pmod 3$, $3 \\pmod 5$, and $2 \\pmod 7$?", compute: () => { let n = 1; while (!(n % 3 === 2 && n % 5 === 3 && n % 7 === 2)) n++; return n; }, sol: (a) => `Combining the three congruences with the Chinese Remainder Theorem gives $${a}$.` },
  { sub: MOD, band: "hard", rating: 1750, statement: "How many integers $n$ with $1 \\le n \\le 1000$ satisfy $n^2 \\equiv 1 \\pmod{24}$?", compute: () => countRange(1000, (n) => (n * n) % 24 === 1), sol: (a) => `The solutions are the $8$ residues coprime to $24$ in each block; over $1$–$1000$ there are $${a}$.` },

  // ===================== UNITS DIGITS & CYCLES =====================
  { sub: UD, band: "easy", rating: 700, statement: "A whole number ends in the digit $6$. What is the units digit of its square?", compute: () => (6 * 6) % 10, sol: (a) => `$6^2 = 36$, so the square ends in $${a}$.` },
  { sub: UD, band: "easy", rating: 760, statement: "What is the units digit of $13 \\times 27 \\times 35$?", compute: () => (3 * 7 * 5) % 10, sol: (a) => `Multiply the units digits: $3\\cdot 7\\cdot 5 = 105$, ending in $${a}$.` },
  { sub: UD, band: "easy", rating: 720, statement: "What is the units digit of $7^4$?", compute: () => modpow(7, 4, 10), sol: (a) => `Powers of $7$ cycle $7,9,3,1$; the $4$th is $${a}$.` },
  { sub: UD, band: "easy", rating: 820, statement: "What is the units digit of $3^3 + 4^2$?", compute: () => (27 + 16) % 10, sol: (a) => `$27 + 16 = 43$, ending in $${a}$.` },
  { sub: UD, band: "easy", rating: 780, statement: "What is the units digit of $9^{2024}$?", compute: () => modpow(9, 2024, 10), sol: (a) => `Powers of $9$ alternate $9, 1$; an even exponent gives $${a}$.` },
  { sub: UD, band: "medium", rating: 1100, statement: "What is the units digit of $7^{2024}$?", compute: () => modpow(7, 2024, 10), sol: (a) => `The cycle $7,9,3,1$ has length $4$ and $2024 \\equiv 0 \\pmod 4$, so the units digit is $${a}$.` },
  { sub: UD, band: "medium", rating: 1250, statement: "What is the units digit of $2^{2024} + 3^{2024}$?", compute: () => (modpow(2, 2024, 10) + modpow(3, 2024, 10)) % 10, sol: (a) => `$2^{2024}$ ends in $6$ and $3^{2024}$ ends in $1$; $6 + 1 = 7$, so $${a}$.` },
  { sub: UD, band: "medium", rating: 1150, statement: "What is the units digit of $17^{83}$?", compute: () => modpow(17, 83, 10), sol: (a) => `Only the base's units digit $7$ matters; its cycle $7,9,3,1$ with $83 \\equiv 3 \\pmod 4$ gives $${a}$.` },
  { sub: UD, band: "medium", rating: 1300, statement: "What is the units digit of $3^1 + 3^2 + 3^3 + \\cdots + 3^{20}$?", compute: () => { let s = 0; for (let k = 1; k <= 20; k++) s += modpow(3, k, 10); return s % 10; }, sol: (a) => `Each block of four exponents contributes $3+9+7+1 = 20$ to the units digit; over $20$ terms the total ends in $${a}$.` },
  { sub: UD, band: "medium", rating: 1200, statement: "What is the units digit of $123^{456}$?", compute: () => modpow(123, 456, 10), sol: (a) => `Only $3$ matters; its cycle has length $4$ and $456 \\equiv 0 \\pmod 4$, giving $${a}$.` },
  { sub: UD, band: "hard", rating: 1450, statement: "What are the last two digits of $3^{2024}$?", compute: () => String(modpow(3, 2024, 100)).padStart(2, "0"), sol: (a) => `The order of $3$ mod $100$ is $20$, and $2024 \\equiv 4 \\pmod{20}$, so $3^{2024} \\equiv 3^4 = ${a}$.` },
  { sub: UD, band: "hard", rating: 1760, statement: "What are the last two digits of $7^{(7^7)}$?", compute: () => String(modpow(7, 7 ** 7, 100)).padStart(2, "0"), sol: (a) => `Mod $100$, powers of $7$ cycle with length $4$. Since $7^7 \\equiv 3 \\pmod 4$, the answer is $7^3 \\equiv ${a}$.` },
  { sub: UD, band: "hard", rating: 1550, statement: "What is the units digit of $2^1 + 2^2 + 2^3 + \\cdots + 2^{100}$?", compute: () => { let s = 0; for (let k = 1; k <= 100; k++) s += modpow(2, k, 10); return s % 10; }, sol: (a) => `Each block $2,4,8,6$ sums to $20$ (units $0$); over $100$ terms the total ends in $${a}$.` },
  { sub: UD, band: "hard", rating: 1600, statement: "What are the last two digits of $2^{100}$?", compute: () => String(modpow(2, 100, 100)).padStart(2, "0"), sol: (a) => `By CRT, $2^{100} \\equiv 0 \\pmod 4$ and $\\equiv 1 \\pmod{25}$, giving $${a} \\pmod{100}$.` },
  { sub: UD, band: "hard", rating: 1650, statement: "What is the units digit of $7^{2024} + 8^{2024} + 9^{2024}$?", compute: () => (modpow(7, 2024, 10) + modpow(8, 2024, 10) + modpow(9, 2024, 10)) % 10, sol: (a) => `The units digits are $1, 6, 1$; their sum $8$ ends in $${a}$.` },

  // ===================== FACTORIALS & TRAILING ZEROS =====================
  { sub: FAC, band: "easy", rating: 720, statement: "In how many zeros does the product $1 \\times 2 \\times 3 \\times \\cdots \\times 10$ end?", compute: () => trailingZeros(10), sol: (a) => `$10!$ has $\\lfloor 10/5 \\rfloor = ${a}$ factors of $5$, hence $${a}$ trailing zeros.` },
  { sub: FAC, band: "easy", rating: 700, statement: "What is the value of $6! \\div 5!$?", compute: () => Number(factBig(6) / factBig(5)), sol: (a) => `$6!/5! = 6 = ${a}$.` },
  { sub: FAC, band: "easy", rating: 760, statement: "What is the units digit of $5! + 6! + 7!$?", compute: () => Number((factBig(5) + factBig(6) + factBig(7)) % 10n), sol: (a) => `Every factorial from $5!$ on ends in $0$, so the sum ends in $${a}$.` },
  { sub: FAC, band: "easy", rating: 820, statement: "How many trailing zeros does $15!$ have?", compute: () => trailingZeros(15), sol: (a) => `$\\lfloor 15/5 \\rfloor = ${a}$.` },
  { sub: FAC, band: "easy", rating: 780, statement: "What is the value of $5! + 4!$?", compute: () => Number(factBig(5) + factBig(4)), sol: (a) => `$120 + 24 = ${a}$.` },
  { sub: FAC, band: "medium", rating: 1150, statement: "How many trailing zeros does $50!$ have?", compute: () => trailingZeros(50), sol: (a) => `$\\lfloor 50/5 \\rfloor + \\lfloor 50/25 \\rfloor = 10 + 2 = ${a}$.` },
  { sub: FAC, band: "medium", rating: 1250, statement: "What is the smallest positive integer $n$ such that $n!$ ends in exactly $3$ zeros?", compute: () => { for (let n = 1; ; n++) if (trailingZeros(n) === 3) return n; }, sol: (a) => `$${a}!$ first reaches $3$ factors of $5$.` },
  { sub: FAC, band: "medium", rating: 1300, statement: "What is the exponent of the largest power of $3$ that divides $20!$?", compute: () => legendre(3, 20), sol: (a) => `$\\lfloor 20/3 \\rfloor + \\lfloor 20/9 \\rfloor = 6 + 2 = ${a}$.` },
  { sub: FAC, band: "medium", rating: 1200, statement: "How many trailing zeros does $100!$ have?", compute: () => trailingZeros(100), sol: (a) => `$20 + 4 = ${a}$.` },
  { sub: FAC, band: "medium", rating: 1350, statement: "How many trailing zeros does $200!$ have?", compute: () => trailingZeros(200), sol: (a) => `$\\lfloor 200/5\\rfloor + \\lfloor 200/25\\rfloor + \\lfloor 200/125\\rfloor = 40 + 8 + 1 = ${a}$.` },
  { sub: FAC, band: "hard", rating: 1550, statement: "What is the exponent of the largest power of $2$ that divides $50!$?", compute: () => legendre(2, 50), sol: (a) => `$25 + 12 + 6 + 3 + 1 = ${a}$.` },
  { sub: FAC, band: "hard", rating: 1680, statement: "How many trailing zeros does $1000!$ have?", compute: () => trailingZeros(1000), sol: (a) => `$200 + 40 + 8 + 1 = ${a}$.` },
  { sub: FAC, band: "hard", rating: 1500, statement: "What is the remainder when $12!$ is divided by $13$?", compute: () => Number(factBig(12) % 13n), sol: (a) => `By Wilson's Theorem, $12! \\equiv -1 \\equiv ${a} \\pmod{13}$.` },
  { sub: FAC, band: "hard", rating: 1600, statement: "How many trailing zeros does $100!$ have when written in base $6$?", compute: () => Math.min(legendre(2, 100), legendre(3, 100)), sol: (a) => `Base $6 = 2\\cdot 3$; the limiting exponent is $\\min(v_2, v_3) = \\min(97, 48) = ${a}$.` },
  { sub: FAC, band: "hard", rating: 1700, statement: "How many of the numbers $1!, 2!, 3!, \\ldots, 100!$ are divisible by $1000$?", compute: () => { let c = 0; for (let n = 1; n <= 100; n++) if (trailingZeros(n) >= 3) c++; return c; }, sol: (a) => `$n!$ is divisible by $1000$ once it has three factors of $5$, i.e. for $n \\ge 15$: that's $${a}$ values.` },
];

// ---- build ----
const bandOf = (r) => (r < 1000 ? "easy" : r < 1400 ? "medium" : "hard");
const line = (o) => "  { " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";

function main() {
  selfTest();
  // compute answers + validate
  const bySub = {};
  const seen = new Set();
  for (const p of P) {
    const ans = p.compute();
    if (ans === undefined || ans === null || String(ans).trim() === "") throw new Error("empty answer: " + p.statement);
    if (bandOf(p.rating) !== p.band) throw new Error(`band/rating mismatch (${p.band} vs rating ${p.rating}): ${p.statement}`);
    if (seen.has(p.statement)) throw new Error("duplicate statement: " + p.statement);
    seen.add(p.statement);
    const answer = String(ans);
    const solution = typeof p.sol === "function" ? p.sol(answer) : p.sol;
    (bySub[p.sub] ??= []).push({ type: "SHORT_ANSWER", statement: p.statement, answer, solution, rating: p.rating, source: "curated" });
  }
  // Replace ONLY problems.json per subtopic; keep the band lesson.md files.
  const SUBTOPICS = [DP, FD, GL, MOD, UD, FAC];
  let total = 0;
  for (const slug of SUBTOPICS) {
    const probs = (bySub[slug] || []).sort((a, b) => a.rating - b.rating);
    const bands = { easy: 0, medium: 0, hard: 0 };
    probs.forEach((p) => bands[bandOf(p.rating)]++);
    if (probs.length !== 15) throw new Error(`${slug} has ${probs.length} (expected 15)`);
    mkdirSync(join(SUB, slug), { recursive: true });
    writeFileSync(join(SUB, slug, "problems.json"), "[\n" + probs.map(line).join(",\n") + "\n]\n");
    total += probs.length;
    console.log(`  ${slug.padEnd(28)} ${probs.length}  (easy ${bands.easy} / med ${bands.medium} / hard ${bands.hard})`);
  }
  console.log(`\nWrote ${total} curated problems.`);
}

main();
