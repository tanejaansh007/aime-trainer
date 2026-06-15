# Prime Factorization & Divisors

Every integer above $1$ breaks into primes in exactly one way — and that
factorization tells you everything about its divisors.

<!--band:easy-->
## Foundations · AMC 8 level

A **factor tree** breaks a number into primes:
$$ 60 = 6 \cdot 10 = (2\cdot 3)(2 \cdot 5) = 2^2 \cdot 3 \cdot 5. $$

To find the **divisors** of a small number, list them in pairs that multiply to it.
For $12$: $1\!\cdot\!12,\ 2\!\cdot\!6,\ 3\!\cdot\!4$ — so the divisors are
$1,2,3,4,6,12$, six of them.

**Good to know:** a perfect square has an **odd** number of divisors (one divisor,
the square root, pairs with itself).

<!--band:medium-->
## Core · AMC 10 level

Read divisor facts straight off the factorization
$n = p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k}$:

- **Number of divisors:** $d(n) = (a_1+1)(a_2+1)\cdots(a_k+1)$.
  $360 = 2^3\cdot 3^2\cdot 5 \Rightarrow d(360) = 4\cdot 3\cdot 2 = 24$.
- **Sum of divisors:** $\sigma(n) = \prod_i \dfrac{p_i^{a_i+1}-1}{p_i-1}$.
  $\sigma(100) = (1+2+4)(1+5+25) = 7\cdot 31 = 217$.

**Worked example.** Smallest perfect square divisible by $12 = 2^2\cdot 3$? A square
needs even exponents, so we need $2^2 \cdot 3^2 = 36$.

<!--band:hard-->
## Advanced · AIME level

Control the **shape** of the factorization:

- **Exactly $3$ divisors** $\Rightarrow n = p^2$ (a prime squared). Below $100$:
  $4, 9, 25, 49$ — four numbers.
- **Exactly $4$ divisors** $\Rightarrow n = p^3$ or $n = pq$.
- **Product of all divisors** of $n$ equals $n^{d(n)/2}$.

These let you count integers with prescribed divisor structure, or build the
smallest number meeting several constraints by assigning prime exponents greedily.
