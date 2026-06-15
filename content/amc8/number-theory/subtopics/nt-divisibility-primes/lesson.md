# Divisibility & Primes

How integers divide each other, and the prime building blocks they're made of.
The depth below is tuned to your rating — switch levels with the selector above.

<!--band:easy-->
## Foundations · AMC 8 level

We say $d$ **divides** $n$ when $n$ is a whole number of $d$'s. Quick tests:

- **2:** the last digit is even.
- **3:** the digit sum is a multiple of $3$ (e.g. $51 \to 5+1=6$, so $3 \mid 51$).
- **5:** the last digit is $0$ or $5$.
- **9:** the digit sum is a multiple of $9$.

A **prime** is a whole number greater than $1$ whose only divisors are $1$ and
itself: $2, 3, 5, 7, 11, \dots$. Note that $2$ is the only even prime, and $1$ is
**not** prime.

**Worked example.** Is $51$ prime? Its digit sum $6$ is divisible by $3$, so
$51 = 3 \cdot 17$ — composite.

<!--band:medium-->
## Core · AMC 10 level

Beyond the basics, learn the longer tests and how to **count**:

- **4:** last two digits form a multiple of $4$. **8:** last three digits.
- **11:** the alternating digit sum is a multiple of $11$.
- A number divisible by both $2$ and $3$ is divisible by $6$.

**Counting multiples.** The number of multiples of $d$ in $\{1,\dots,N\}$ is
$\left\lfloor N/d \right\rfloor$. So two-digit multiples of $7$ number
$\lfloor 99/7\rfloor - \lfloor 9/7\rfloor = 14 - 1 = 13$.

**Inclusion–exclusion.** Count of $1\le n\le 100$ divisible by $3$ **or** $5$:
$$ \lfloor100/3\rfloor + \lfloor100/5\rfloor - \lfloor100/15\rfloor = 33 + 20 - 6 = 47. $$

<!--band:hard-->
## Advanced · AIME level

At competition level, divisibility becomes a tool inside larger arguments.

- **Optimization with primes.** If two primes sum to $36$, both must be odd (using
  $2$ forces $34$, not prime), and the product is largest when they're closest:
  $17 \cdot 19 = 323$.
- **Careful inclusion–exclusion** over several moduli, watching floor terms, counts
  integers satisfying combined divisibility constraints.
- **Structural facts:** there are infinitely many primes; among any $d$ consecutive
  integers exactly one is divisible by $d$; a prime $p>3$ satisfies $p \equiv \pm1 \pmod 6$.

These ideas pair with modular arithmetic and factorization on hard problems.
