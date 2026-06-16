# Divisibility & Primes

Five tiers, each tuned to your rating. Lower tiers cover the tests and counting you
need first; higher tiers add inclusion–exclusion, Euler's totient, and constructive
arguments. Switch tiers with the selector above.

<!--band:t1-->
## Tier 1 · AMC 8 basics

**Divisibility tests** let you check a divisor without dividing:

- **2:** last digit even. **5:** last digit $0$ or $5$.
- **3 / 9:** the *digit sum* is divisible by $3$ / $9$.

**Primality.** A number $>1$ is prime if no smaller prime divides it; for a
two-digit number you only need to test $2, 3, 5, 7$.

**Worked example.** The largest three-digit palindrome divisible by $6$ must be even
*and* have a digit sum divisible by $3$. Testing downward, $888$ works
($8{+}8{+}8 = 24$).

<!--band:t2-->
## Tier 2 · AMC 8

Add two more tests and start **counting**:

- **4:** the last two digits form a multiple of $4$. **6:** divisible by both $2$
  and $3$.
- **Counting multiples:** the number of multiples of $d$ from $1$ to $N$ is
  $\left\lfloor N/d\right\rfloor$.

To count numbers with one property **but not** another, count the first and subtract
the overlap. *Divisible by $4$ but not $6$ in $1$–$100$:* $25 - 8 = 17$ (the $8$ are
multiples of $12$).

<!--band:t3-->
## Tier 3 · AMC 10

**Inclusion–exclusion** combines two divisibility conditions:
$$ |A \cup B| = \left\lfloor \tfrac{N}{a}\right\rfloor + \left\lfloor \tfrac{N}{b}\right\rfloor - \left\lfloor \tfrac{N}{\operatorname{lcm}(a,b)}\right\rfloor. $$

- **"Divisible by $a$ or $b$":** the formula above.
- **"Neither":** $N - |A\cup B|$. *Below $1000$, neither $5$ nor $7$:*
  $999 - (199 + 142 - 28) = 686$.

**Primes in a range.** Test each candidate; watch for patterns like the triplet
$p,\,p+2,\,p+6$.

<!--band:t4-->
## Tier 4 · AMC 10 / early AIME

**Exactly one of two sets.** Remove the overlap (multiples of
$\operatorname{lcm}(a,b)$) from *each* set:
$$ \big(|A|-|A\cap B|\big) + \big(|B|-|A\cap B|\big). $$
*Below $1000$, divisible by exactly one of $6$ and $10$:* with $33$ multiples of
$30$, that's $(166-33)+(99-33) = 199$.

This same "count, then carefully remove overlaps" discipline scales to three or more
conditions — just track every pairwise and triple lcm.

<!--band:t5-->
## Tier 5 · AIME

**Euler's totient $\varphi(n)$** counts integers in $[1,n]$ sharing no factor $>1$
with $n$:
$$ \varphi(n) = n\prod_{p \mid n}\left(1 - \tfrac1p\right),\qquad \varphi(2024)=2024\cdot\tfrac12\cdot\tfrac{10}{11}\cdot\tfrac{22}{23}=880. $$

**Constructive digit arguments.** Since divisibility by $9$ depends only on the
digit sum, the smallest number built from a limited digit set (only $0$s and $8$s)
divisible by $18$ needs just enough $8$s for the digit sum to reach a multiple of
$9$ — nine of them, giving $888888888$.

**Refactorable numbers** are divisible by their own divisor count $d(n)$ — combine
the divisor-count formula with a divisibility check.
