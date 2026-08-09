# Prime Factorization & Divisors

Every whole number greater than $1$ breaks into primes in exactly one way — its
**prime factorization**. Once you have it, you can read off almost everything else:
how many divisors the number has, what they sum to, whether it is a perfect square,
and which numbers fit a given divisor count. This set builds from finding
factorizations to using them backward.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Factoring a number.** Pull out the smallest prime that divides it, over and over,
until you are left with $1$. Then collect equal primes into exponents.

$$90 = 2\cdot 45 = 2\cdot 9\cdot 5 = 2\cdot 3^2\cdot 5.$$

**Testing whether a number is prime.** Trial-divide by primes $2, 3, 5, 7, 11, \dots$
up to the number's square root. The classic trap is stopping at $2, 3, 5$: some
composites hide a larger factor.

**Worked example (factor).** *Write $500$ in exponent form.*
$500 = 2\cdot 250 = 2\cdot 2\cdot 125 = 2^2\cdot 5^3$.

**Worked example (prime or not).** *Is $187$ prime?*
It is not even, its digits sum to $16$ (not a multiple of $3$), and it does not end in
$0$ or $5$. Testing further, $187 / 7$ is not whole, but $187 / 11 = 17$. So
$187 = 11\cdot 17$ — **composite**, not prime.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

Everything here starts by factoring, then applies a formula.

**Number of divisors.** If $n = p_1^{e_1} p_2^{e_2}\cdots$, then the number of
divisors of $n$ is

$$(e_1 + 1)(e_2 + 1)\cdots,$$

because each divisor independently picks an exponent from $0$ up to $e_i$ for each
prime.

> *How many divisors does $72$ have?* $72 = 2^3\cdot 3^2$, so
> $(3+1)(2+1) = \mathbf{12}$.

**Sum of divisors.** Multiply, over each prime, the sum $1 + p + p^2 + \cdots + p^{e}$.

**Worked example.** *What is the sum of the divisors of $40$?*
$40 = 2^3\cdot 5$, so the sum is $(1+2+4+8)(1+5) = 15\cdot 6 = \mathbf{90}$.

**Reaching a perfect square.** A number is a perfect square exactly when *every*
exponent in its factorization is even. To reach the nearest perfect-square multiple,
multiply by the product of the primes that currently have an **odd** exponent.

**Worked example.** *What is the smallest positive integer that turns $294$ into a
perfect square when multiplied?*
$294 = 2\cdot 3\cdot 7^2$. The odd exponents are on $2$ and $3$, so multiply by
$2\cdot 3 = \mathbf{6}$ (indeed $294\cdot 6 = 1764 = 42^2$).

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Working backward from a divisor count.** Read the divisor formula in reverse:

- Exactly $3$ divisors means $(e+1) = 3$, so the number is $p^2$ — a **prime
  squared**.
- Exactly $5$ divisors means $p^4$ — a **prime to the fourth**.

**Worked example.** *How many positive integers below $200$ have exactly $3$
divisors?*
They are the prime squares $p^2 < 200$, i.e. $p < \sqrt{200} \approx 14.1$. The primes
are $2, 3, 5, 7, 11, 13$, giving $4, 9, 25, 49, 121, 169$ — that is $\mathbf{6}$
numbers.

**Casework over exponent patterns.** When a number has fixed primes and a fixed
divisor count, list the exponent patterns, keep the ones that obey the constraints,
and compare the values.

**Worked example.** *The number $N = 2^a\cdot 3^b\cdot 7$ has exactly $24$ divisors,
with $a \ge b \ge 1$. Find the smallest possible $N$.*
The divisor count is $(a+1)(b+1)(1+1) = 24$, so $(a+1)(b+1) = 12$. With $a \ge b \ge
1$, the options are $(a,b) = (5,1)$ giving $2^5\cdot 3\cdot 7 = 672$, and $(3,2)$
giving $2^3\cdot 3^2\cdot 7 = 504$. The smallest is $\mathbf{504}$.
