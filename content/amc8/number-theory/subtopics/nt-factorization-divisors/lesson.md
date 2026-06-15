# Prime Factorization & Divisors

Everything here runs on one engine: the prime factorization. The problems use the
divisor-count formula, the sum-of-divisors formula, counting square divisors, and
the divisor-pairing trick — each covered below.

<!--band:easy-->
## Foundations · AMC 8 level

**Factor first.** $n = p_1^{a_1}p_2^{a_2}\cdots$, e.g. $60 = 2^2\cdot 3\cdot 5$.

**Divisors come in pairs** multiplying to $n$. The number of *unordered* pairs —
the rectangles of area $n$ — is $\lceil d(n)/2 \rceil$, where $d(n)$ is the divisor
count.

**Perfect numbers.** A number equal to the sum of its proper divisors, like
$6 = 1+2+3$ and $28 = 1+2+4+7+14$.

**Even divisors.** Count all divisors, then subtract the divisors of the odd part.

> **Worked example.** $100$ has $9$ divisors; the odd ones are $1, 5, 25$, so
> $9 - 3 = 6$ are even.

<!--band:medium-->
## Core · AMC 10 level

**Divisor-count formula.** For $n = \prod p_i^{a_i}$,
$$ d(n) = \prod (a_i + 1). $$
Run it **backwards** to build numbers: to get exactly $D$ divisors, write $D$ as a
product of $(a_i+1)$ factors and give the **largest exponents to the smallest
primes** for the minimum value.

**Sum of divisors.**
$$ \sigma(n) = \prod_i \frac{p_i^{a_i+1}-1}{p_i-1},\qquad \sigma(360) = 15\cdot 13\cdot 6 = 1170. $$

**Square divisors.** A divisor is a perfect square iff every exponent is even, so
the count is $\prod\left(\lfloor a_i/2\rfloor + 1\right)$. For $7! = 2^4 3^2 5\cdot 7$
that is $3\cdot 2\cdot 1\cdot 1 = 6$.

**Odd divisor count** happens exactly for perfect squares.

<!--band:hard-->
## Advanced · AIME level

**Numbers with a fixed divisor count.** Exactly $3$ divisors $\Rightarrow n=p^2$;
exactly $4 \Rightarrow p^3$ or $pq$. Constrained minimization (fewest value, or
only certain primes allowed) is the divisor-count formula run in reverse.

**Divisors of factorials.** Factor $n!$, then $d(n)$ follows; e.g. the divisors of
$10!$ that do **not** divide $9!$ number $d(10!)-d(9!)$.

**The $N^2$ pairing trick.** Divisors of $N^2$ pair as $d \leftrightarrow N^2/d$
around $N$, so exactly $\frac{d(N^2)-1}{2}$ of them are **less than $N$**. To count
those *not* dividing $N$, subtract the $d(N)-1$ divisors of $N$ below $N$:
$$ \frac{d(N^2)-1}{2} - \big(d(N)-1\big). $$
For $N = 2024$ this gives $31 - 15 = 16$.
