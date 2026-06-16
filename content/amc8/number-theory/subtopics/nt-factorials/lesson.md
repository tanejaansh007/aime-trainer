# Factorials & Trailing Zeros

The whole topic is "count the primes inside $n!$." That one idea — Legendre's formula
— grows across the tiers into trailing zeros, base-$b$ zeros, and Wilson's theorem.

<!--band:t1-->
## Tier 1 · AMC 8 basics

$n! = 1\cdot 2\cdots n$ grows fast, and $\dfrac{n!}{(n-1)!} = n$.

**Trailing zeros = number of factors of $5$** (there are always more $2$s). For
$n < 25$ that is just $\lfloor n/5\rfloor$, so $15!$ ends in $3$ zeros. And since every
factorial from $5!$ on already ends in $0$, a sum like $5!+6!+7!$ ends in $0$.

<!--band:t2-->
## Tier 2 · AMC 8 → AMC 10 bridge

Why count $5$s and not $2$s? A trailing zero needs a factor of $10 = 2\cdot 5$, and
$n!$ always has more $2$s than $5$s, so the $5$s are the bottleneck. Once $n$ reaches
$25$, you also pick up an *extra* $5$ from each multiple of $25$ — the correction term
that the next tier formalizes.

<!--band:t3-->
## Tier 3 · AMC 10

**Trailing-zero formula.** Keep dividing by powers of $5$:
$$ Z(n) = \left\lfloor\tfrac n5\right\rfloor + \left\lfloor\tfrac n{25}\right\rfloor + \left\lfloor\tfrac n{125}\right\rfloor + \cdots,\qquad Z(100)=20+4=24. $$

**Legendre's formula** generalizes this to any prime $p$: the exponent of $p$ in $n!$
is $\sum_k \lfloor n/p^k\rfloor$. (Power of $3$ in $20!$: $6+2 = 8$.) To find the
smallest $n$ with exactly $k$ zeros, solve $Z(n)=k$.

<!--band:t4-->
## Tier 4 · AMC 10 / early AIME

**Legendre for any prime, larger $n$.** The exponent of $2$ in $50!$ is
$25+12+6+3+1 = 47$; trailing zeros of $200!$ are $40+8+1 = 49$.

**Wilson's theorem** handles a factorial *modulo a prime*: $(p-1)! \equiv -1 \pmod p$,
so $12! \equiv -1 \equiv 12 \pmod{13}$.

<!--band:t5-->
## Tier 5 · AIME

**Trailing zeros in base $b$.** Write $b=\prod p^{e}$; the count for $n!$ is
$$ \min_{p\mid b}\left\lfloor \frac{v_p(n!)}{e}\right\rfloor. $$
For $100!$ in base $6 = 2\cdot 3$, that is $\min(v_2, v_3) = \min(97, 48) = 48$.

**Threshold counting.** $n!$ becomes divisible by $1000$ once it holds three factors
of $5$, i.e. for $n \ge 15$ — so $86$ of $1!,\dots,100!$ qualify.

These all rest on Legendre's formula; the only new step is interpreting the exponent
counts (a base, a divisibility threshold, a modulus).
