# Prime Factorization & Divisors

One engine runs the whole topic: the prime factorization. The tiers build from
listing divisors up to the divisor-count formula, sum of divisors, and square/cube
factor counting.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Factor first.** Write $n$ as a product of primes:
$60 = 2^2\cdot 3\cdot 5$, $588 = 2^2\cdot 3\cdot 7^2$.

**Divisors come in pairs** that multiply to $n$. List them for small numbers:
$36$ has divisors $1, 2, 3, 4, 6, 9, 12, 18, 36$ — nine divisors.

**Perfect numbers.** A number equals the sum of its proper divisors:
$6 = 1+2+3$,\ $28 = 1+2+4+7+14$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Even vs. odd divisors.** A divisor is odd exactly when it has no factor of $2$
— it only divides into the non-$2$ part of $n$. For $360 = 2^3\cdot 3^2\cdot 5$, strip
the $2$s to get $3^2\cdot 5$, giving $(2+1)(1+1) = 6$ odd divisors.

**Largest perfect square factor.** Keep each prime but cut each exponent down to the
largest even number $\le$ the exponent. For $180 = 2^2\cdot 3^2\cdot 5$, the
largest square factor is $2^2\cdot 3^2 = 36$, with square root $6$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Divisor-count formula.** Add $1$ to each exponent in the prime factorization and multiply:
$$ d(n) = (a_1+1)(a_2+1)\cdots $$
$2000 = 2^4\cdot 5^3 \Rightarrow d = (4+1)(3+1) = 5\cdot 4 = 20$.

Run it **backwards** to build a target: the smallest integer with $6$ divisors has
$d = (2+1)(1+1) = 6$, so use exponents $2$ and $1$ on the two smallest primes:
$2^2\cdot 3 = 12$.

**Sum of divisors.** For each prime power $p^a$ in the factorization, the sum of its contributions is $1 + p + p^2 + \cdots + p^a = \dfrac{p^{a+1}-1}{p-1}$. Multiply these together for all prime powers.

$288 = 2^5\cdot 3^2$: the $2^5$ piece gives $1+2+4+8+16+32 = 63$; the $3^2$ piece gives $1+3+9 = 13$; sum of divisors $= 63\cdot 13 = 819$.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Fixed divisor-count shapes.** Exactly $3$ divisors $\Rightarrow n = p^2$ (prime
squared). Exactly $4$ divisors $\Rightarrow n = p^3$ or $n = pq$ (product of two
distinct primes). Use this to list or count qualifying integers in a range.

**Square factor counting.** A divisor is a perfect square iff every exponent in its
factorization is even:
$$ \#\text{square factors of } n = \prod\!\left(\lfloor a_i/2\rfloor + 1\right). $$
For $2^3\cdot 3^5\cdot 5\cdot 7^2$: $\ (1+1)(2+1)(0+1)(1+1) = 12$.

**Cube factor counting.** Same idea with floor division by $3$:
$\prod(\lfloor a_i/3\rfloor + 1)$. For $25920 = 2^6\cdot 3^4\cdot 5$: $(2+1)(1+1)(0+1) = 6$.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Constrained minimum.** "Smallest $n$ with exactly $D$ divisors and divisible by $k$"
— factor $k$, then extend its exponents to the cheapest shape that gives $d(n)=D$,
adding new prime factors as needed. Always assign the largest exponents to the
smallest primes.

**Completing a square or cube.** Given $n$, find the smallest $k$ so that $nk$ is a
perfect square (or cube): for each prime $p^a$ in $n$, supply the extra $p^{e-a}$
where $e$ is the next multiple of $2$ (or $3$) above $a$.

**Multi-step divisor problems.** Some problems require combining multiple techniques
— e.g. finding the GCF of two numbers that itself must be a perfect square. Compute
the GCF first via factorization, then check which of its divisors are perfect squares.
