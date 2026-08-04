# Prime Factorization & Divisors

One engine runs the whole topic: the prime factorization. The tiers build from
listing divisors up to the divisor-count and sum-of-divisors formulas and the
$N^2$-pairing trick.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Factor first:** $n = p_1^{a_1}p_2^{a_2}\cdots$, e.g. $60 = 2^2\cdot 3\cdot 5$.

**Divisors come in pairs** that multiply to $n$. The number of *unordered* pairs —
the rectangles of area $n$ — is $\lceil d(n)/2\rceil$, where $d(n)$ counts divisors.

**Count by listing** for small $n$: $36$ has divisors $1,2,3,4,6,9,12,18,36$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Sum of divisors and perfect numbers.** Add up all divisors; a *perfect* number
equals the sum of its proper divisors, like $6 = 1+2+3$ and $28 = 1+2+4+7+14$.

**Even divisors.** Count all divisors, then subtract the divisors of the odd part.
*Of $100$'s $9$ divisors, the odd ones are $1,5,25$, so $9-3 = 6$ are even.*

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Divisor-count formula.** For $n = \prod p_i^{a_i}$, $\;d(n) = \prod (a_i+1)$. Run
it **backwards** to build a number with a target divisor count, giving the largest
exponents to the smallest primes for the minimum value.

**Sum of divisors.** $\sigma(n) = \prod_i \dfrac{p_i^{a_i+1}-1}{p_i-1}$;
$\sigma(360) = 15\cdot 13\cdot 6 = 1170$.

**Square divisors** use even exponents, so the count is $\prod(\lfloor a_i/2\rfloor + 1)$;
for $7! = 2^4 3^2 5\cdot 7$ that is $3\cdot 2 = 6$. (Perfect squares are exactly the
numbers with an *odd* divisor count.)

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Numbers with a fixed divisor count.** Exactly $3$ divisors $\Rightarrow n = p^2$;
exactly $4 \Rightarrow p^3$ or $pq$. So the integers below $1000$ with exactly $3$
divisors are the squares of primes $p < 32$.

**Divisors of factorials.** Factor $n!$ and apply $d$. The divisors of $10!$ that do
**not** divide $9!$ number $d(10!) - d(9!) = 270 - 160 = 110$.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Constrained minimization.** "Smallest with $D$ divisors using only primes $\le 5$"
is the divisor-count formula in reverse with a prime restriction — assign exponents
greedily to the smallest primes.

**The $N^2$ pairing trick.** Divisors of $N^2$ pair as $d \leftrightarrow N^2/d$
around $N$, so exactly $\frac{d(N^2)-1}{2}$ are **less than $N$**. To count those not
dividing $N$, subtract the $d(N)-1$ divisors of $N$ below $N$:
$$ \frac{d(N^2)-1}{2} - \big(d(N)-1\big). $$
For $N = 2024$ this is $31 - 15 = 16$.
