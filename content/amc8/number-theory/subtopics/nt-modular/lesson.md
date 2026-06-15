# Modular Arithmetic & Remainders

Working with remainders directly. The single most useful idea in competition number
theory — and the one that scales furthest, from AMC 8 up to AIME.

<!--band:easy-->
## Foundations · AMC 8 level

The **remainder** of $a$ divided by $m$ is what's left after taking out as many
$m$'s as possible: $23 = 4\cdot 5 + 3$, so $23$ leaves remainder $3$ mod $5$.

Remainders behave like a clock that wraps around. If today is Monday, then $30$ days
later is the same as $30 \bmod 7 = 2$ days later — Wednesday.

You can take remainders **before** multiplying or adding, which keeps numbers small.

<!--band:medium-->
## Core · AMC 10 level

Write $a \equiv r \pmod m$ when $a$ and $r$ have the same remainder. The key trick
for big powers: **find a small exponent giving $1$, then reduce.**

$$ 2^3 = 8 \equiv 1 \pmod 7 \;\Rightarrow\; 2^{100} = (2^3)^{33}\cdot 2 \equiv 2 \pmod 7. $$

- **Fermat's Little Theorem:** if $p$ is prime and $p \nmid a$, then
  $a^{p-1} \equiv 1 \pmod p$. So $8^{12} \equiv 1 \pmod{13}$ instantly.
- **Simultaneous congruences** (CRT, light): the smallest $n$ with $n\equiv 2\pmod3$
  and $n\equiv 3\pmod 5$ is $8$; all solutions are $8 + 15k$.

<!--band:hard-->
## Advanced · AIME level

- **Multiplicative order.** The smallest $k>0$ with $a^k\equiv 1 \pmod m$ divides
  $\lambda(m)$ (Carmichael). It tells you exactly how to reduce huge exponents.
- **Last three digits = mod $1000$.** Split via CRT into mod $8$ and mod $125$, solve
  each with orders, then recombine. E.g. $2^{2024} \equiv 0 \pmod 8$ and
  $\equiv 2^{24} \equiv 91 \pmod{125}$ give $2^{2024} \equiv 216 \pmod{1000}$.
- **Wilson's Theorem:** for prime $p$, $(p-1)! \equiv -1 \pmod p$, so
  $100! \equiv -1 \equiv 100 \pmod{101}$.
- **Counting by periodicity.** A congruence condition repeats with some period;
  count solutions in one period and scale to the whole range.
