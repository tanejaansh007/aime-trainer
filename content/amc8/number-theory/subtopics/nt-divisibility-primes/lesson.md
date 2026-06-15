# Divisibility & Primes

The methods below are exactly the ones the problems in this set use — divisibility
tests, primality checks, counting multiples, inclusion–exclusion, and Euler's
totient. Switch levels with the selector above.

<!--band:easy-->
## Foundations · AMC 8 level

**Divisibility tests.** Check a divisor without dividing:

- **2:** last digit even. **5:** last digit $0$ or $5$.
- **3 / 9:** the *digit sum* is divisible by $3$ / $9$.
- **4:** last two digits form a multiple of $4$.
- **6:** divisible by **both** $2$ and $3$.

**Primality.** A number $>1$ is prime if no smaller prime divides it; for a
two-digit number you only need to test $2, 3, 5, 7$.

**Counting multiples.** The number of multiples of $d$ from $1$ to $N$ is
$\left\lfloor N/d \right\rfloor$.

**Worked example (palindrome ÷ 6).** A multiple of $6$ must be even *and* have a
digit sum divisible by $3$. The largest three-digit palindrome $\overline{aba}$
that is even needs $a$ even; testing downward, $888$ works ($8{+}8{+}8 = 24$).

<!--band:medium-->
## Core · AMC 10 level

**Counting multiples, then combining sets.** With $\lfloor N/d\rfloor$ as the
count of multiples of $d$:

$$ |A \cup B| = \left\lfloor \tfrac{N}{a}\right\rfloor + \left\lfloor \tfrac{N}{b}\right\rfloor - \left\lfloor \tfrac{N}{\operatorname{lcm}(a,b)}\right\rfloor. $$

- **"Divisible by $a$ or $b$":** use the formula above.
- **"Divisible by neither":** $N - |A\cup B|$.
- **"By $a$ or $b$ but not $c$":** subtract the multiples of the relevant lcm.

> **Worked example.** Integers below $1000$ divisible by neither $5$ nor $7$:
> $999 - (199 + 142 - 28) = 686$.

**Primes in a range.** Test each candidate; watch for patterns like a prime
*triplet* $p,\,p+2,\,p+6$.

<!--band:hard-->
## Advanced · AIME level

**Exactly one of two sets.** Subtract the overlap (multiples of
$\operatorname{lcm}(a,b)$) from *each* set:
$$ \big(|A|-|A\cap B|\big) + \big(|B|-|A\cap B|\big). $$

**Euler's totient $\varphi(n)$** counts integers in $[1,n]$ with no common factor
$>1$ with $n$:
$$ \varphi(n) = n\prod_{p \mid n}\left(1 - \tfrac1p\right),\qquad \varphi(2024)=2024\cdot\tfrac12\cdot\tfrac{10}{11}\cdot\tfrac{22}{23}=880. $$

**Constructive digit problems.** Because divisibility by $9$ depends only on the
digit sum, the smallest number built from a limited digit set (e.g. only $0$s and
$8$s) divisible by $18$ needs just enough $8$s to make the digit sum a multiple of
$9$ — nine of them, giving $888888888$.

**Tie it together.** A "refactorable" number is divisible by its own divisor count
$d(n)$ — combine the divisor-count idea with a divisibility check.
