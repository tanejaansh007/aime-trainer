# Factorials & Trailing Zeros

The factorial $n! = 1\cdot 2\cdot 3\cdots n$ grows explosively, and counting the
primes hidden inside it answers a whole family of problems.

<!--band:easy-->
## Foundations · AMC 8 level

$$ 5! = 1\cdot2\cdot3\cdot4\cdot5 = 120. $$

Because every factorial from $5!$ on contains both a $2$ and a $5$, it ends in $0$.
So in a sum like $1! + 2! + 3! + 4! + 5!$, only the first few terms affect the units
digit: $1+2+6+24+120 = 153 \to 3$.

<!--band:medium-->
## Core · AMC 10 level

A trailing zero comes from a factor of $10 = 2\cdot 5$, and there are always more
$2$s than $5$s — so **count the $5$s.** The number of trailing zeros of $n!$ is
$$ \left\lfloor \tfrac{n}{5}\right\rfloor + \left\lfloor \tfrac{n}{25}\right\rfloor + \left\lfloor \tfrac{n}{125}\right\rfloor + \cdots $$
For $100!$: $20 + 4 = 24$ zeros.

**Worked example.** Smallest $n$ with $1000 = 2^3\cdot 5^3 \mid n!$? You need three
$5$s, and $\lfloor n/5\rfloor \ge 3$ first happens at $n = 15$.

<!--band:hard-->
## Advanced · AIME level

**Legendre's formula** gives the exact exponent of a prime $p$ in $n!$:
$$ v_p(n!) = \sum_{k\ge 1} \left\lfloor \frac{n}{p^k} \right\rfloor. $$
The largest power of $2$ dividing $20!$ is
$\lfloor20/2\rfloor+\lfloor20/4\rfloor+\lfloor20/8\rfloor+\lfloor20/16\rfloor
= 10+5+2+1 = 18$.

This controls divisibility of factorials and binomial coefficients, and pairs with
**Wilson's Theorem** ($(p-1)!\equiv-1\pmod p$) for factorials taken modulo a prime.
