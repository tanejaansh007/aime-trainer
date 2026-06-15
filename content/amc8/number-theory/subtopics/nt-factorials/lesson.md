# Factorials & Trailing Zeros

The whole topic is "count the primes inside $n!$." That single idea — Legendre's
formula — drives trailing zeros, base-$b$ zeros, and (with Wilson's theorem)
factorials modulo a prime.

<!--band:easy-->
## Foundations · AMC 8 level

$n! = 1\cdot 2\cdots n$ grows fast, and $\dfrac{n!}{(n-1)!} = n$.

**Trailing zeros = number of factors of $5$** (there are always more $2$s than
$5$s). For $n < 25$ that is just $\lfloor n/5\rfloor$: so $15!$ ends in $3$ zeros.

Because every factorial from $5!$ on already ends in $0$, a sum like $5!+6!+7!$
ends in $0$.

<!--band:medium-->
## Core · AMC 10 level

**Trailing-zero formula.** Keep dividing by powers of $5$:
$$ Z(n) = \left\lfloor\tfrac n5\right\rfloor + \left\lfloor\tfrac n{25}\right\rfloor + \left\lfloor\tfrac n{125}\right\rfloor + \cdots,\qquad Z(200)=40+8+1=49. $$

**Legendre's formula** generalizes this to any prime $p$ — the exponent of $p$ in
$n!$ is $\sum_k \lfloor n/p^k\rfloor$. (Power of $3$ in $20!$: $6+2 = 8$.)

**Smallest $n$ for $k$ zeros:** solve $Z(n)=k$; the first $n$ that reaches three
factors of $5$ is $15$.

<!--band:hard-->
## Advanced · AIME level

**Legendre everywhere.** The exponent of $2$ in $50!$ is
$25+12+6+3+1 = 47$.

**Trailing zeros in base $b$.** Write $b=\prod p^{e}$; the number of trailing zeros
of $n!$ in base $b$ is
$$ \min_{p\mid b}\left\lfloor \frac{v_p(n!)}{e}\right\rfloor. $$
For $100!$ in base $6 = 2\cdot 3$, that is $\min(v_2, v_3) = \min(97, 48) = 48$.

**Wilson's theorem** for factorials mod a prime: $(p-1)! \equiv -1 \pmod p$, so
$12! \equiv -1 \equiv 12 \pmod{13}$.

**Threshold counting.** $n!$ becomes divisible by $1000$ once it holds three
factors of $5$, i.e. for $n \ge 15$.
