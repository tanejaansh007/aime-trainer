# Modular Arithmetic & Remainders

Remainders, built up across five tiers: from clock arithmetic to the
exponent-reduction trick, the Chinese Remainder Theorem, and counting solutions by
periodicity.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

The **remainder** of $a$ divided by $m$ is $a \bmod m$. Remainders **add and
multiply**, so you can reduce *before* computing: $2^6 = 64 \equiv 1 \pmod 7$.

**Clock / cyclic arithmetic.** Days repeat mod $7$, a clock mod $12$. Since
$100 \equiv 2 \pmod 7$, $100$ days past Wednesday is Friday.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

Write $a \equiv r \pmod m$ when $a$ and $r$ leave the same remainder. The crucial
observation: **powers cycle.** Computing $2^1, 2^2, 2^3, \dots \pmod m$ you eventually
hit $1$, and from there the pattern repeats. Spotting that repeat is the key that
unlocks every large-power remainder in the higher tiers.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**The big-power method:** find the smallest $k$ with $a^{k}\equiv 1\pmod m$, then
$a^{e}\equiv a^{\,e \bmod k}$. Since $2^6\equiv 1\pmod 9$ and $2024\equiv 2\pmod 6$,
$2^{2024}\equiv 2^2 = 4$. **Fermat's Little Theorem** supplies such a $k$:
$a^{p-1}\equiv 1\pmod p$ for prime $p\nmid a$.

**Simultaneous congruences (CRT).** To find the smallest $n$ with $n\equiv r_1
\pmod{m_1}$ and $n\equiv r_2\pmod{m_2}$, step through one progression until the other
holds. (In a sum like $1!+\cdots+50! \pmod{15}$, every $k!$ with $k\ge5$ vanishes.)

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Look for $\equiv -1$** to collapse the work: $5^2\equiv -1 \pmod{13}$, so
$5^{30} = (5^2)^{15}\equiv (-1)^{15}\equiv 12$.

**Splitting a modulus begins here.** To get a remainder mod $1000$, handle mod $8$
and mod $125$ separately and recombine — the first step of the full CRT machinery in
the next tier.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Full CRT split.** Last three digits $=$ mod $1000 = $ mod $8$ **and** mod $125$:
$$ 2^{2024}\equiv 0 \!\pmod 8,\quad 2^{2024}\equiv 91 \!\pmod{125} \;\Rightarrow\; 216 \!\pmod{1000}. $$
Stack a third congruence the same way ($2\pmod3,\,3\pmod5,\,2\pmod7 \Rightarrow 23$).

**Multiplicative order** — the smallest $k$ with $a^k\equiv1$ — divides $\lambda(m)$
and tells you exactly how far to reduce a giant exponent.

**Counting solutions over a range.** A congruence like $n^2\equiv1\pmod{24}$ is
**periodic** with period $24$: count the solutions in one block, multiply by the
number of full blocks, then handle the leftover.
