# Modular Arithmetic & Remainders

From basic remainders to cycle-based exponent tricks and two-condition problems —
all within AMC 8 territory.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

The **remainder** of $a$ divided by $m$ is $a \bmod m$. Remainders **add and
multiply**, so reduce *before* computing: $7^2 = 49 \equiv 4 \pmod 5$.

**Clock / calendar arithmetic.** Days repeat mod $7$, hours mod $12$. Since
$100 \equiv 2 \pmod 7$, one hundred days past Wednesday is Friday.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Powers cycle.** Compute $a^1, a^2, a^3, \dots \pmod m$ — eventually you hit $1$
and the sequence repeats. Finding that cycle length is the key to every large-power
remainder problem.

*Example:* Powers of $3$ mod $7$: $3, 2, 6, 4, 5, 1, 3, 2, \dots$ — period $6$.
So $3^{100} \equiv 3^4 \equiv 4 \pmod 7$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**The big-power method.** Find the smallest $k$ with $a^k \equiv 1 \pmod m$, then
$a^e \equiv a^{e \bmod k} \pmod m$.

When $m$ is prime and $m \nmid a$, **Fermat's Little Theorem** tells you
$a^{m-1} \equiv 1 \pmod m$, giving a cycle length that divides $m-1$.

**Vanishing terms.** In a sum $1! + 2! + \cdots + n! \pmod{15}$, every $k! \ge 5!$
is divisible by $15$, so only the first few terms matter.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Two-condition remainder problems.** "Find the smallest $n$ with $n \equiv r_1
\pmod{m_1}$ and $n \equiv r_2 \pmod{m_2}$" — step through the first arithmetic
progression ($r_1, r_1+m_1, r_1+2m_1, \dots$) until the second condition is met.
Once you find the smallest solution, all others are spaced $\operatorname{lcm}(m_1, m_2)$
apart.

**Counting by period.** How many integers in $\{1, \dots, N\}$ leave remainder $r$
when divided by $m$? The answer is $\left\lfloor\frac{N-r}{m}\right\rfloor + 1$
(when $r \le N$, $0$ otherwise).

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Chaining remainder conditions.** With three or more congruences, solve the first
two to get a single combined congruence, then combine that with the third. The
spacing between solutions grows as the LCM of the moduli.

**Combined remainder + size arguments.** The hardest AMC 8 remainder problems ask
you to count or sum integers satisfying a remainder condition inside a bounded range
— use the period to break the range into full blocks plus a leftover chunk.

**Remainders and last digits.** Since the units digit is the remainder mod $10$,
every units-digit question is a modular arithmetic question. The two topics use
exactly the same cycle-and-reduce technique.
