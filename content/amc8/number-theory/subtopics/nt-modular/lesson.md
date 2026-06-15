# Modular Arithmetic & Remainders

These problems are solved with four moves: reduce-before-computing, find a small
power that is $\equiv 1$, the Chinese Remainder Theorem, and counting solutions by
periodicity. Each is below.

<!--band:easy-->
## Foundations · AMC 8 level

The **remainder** of $a$ divided by $m$ is written $a \bmod m$. Remainders **add and
multiply**:
$$ (a\cdot b)\bmod m = \big[(a\bmod m)(b\bmod m)\big]\bmod m. $$
So if a number leaves remainder $3$ mod $7$, twice it leaves $2\cdot3=6$.

**Reduce before computing** to keep numbers small: $2^6 = 64 \equiv 1 \pmod 7$.

**Clock / cyclic arithmetic.** Days of the week repeat mod $7$; a $12$-hour clock
works mod $12$. ($100 \equiv 2 \pmod 7$, so $100$ days past Wednesday is Friday.)

<!--band:medium-->
## Core · AMC 10 level

**The big-power method:** find the smallest $k$ with $a^{k}\equiv 1\pmod m$, then
$a^{e}\equiv a^{\,e \bmod k}$.

$$ 3^4\equiv 1\!\pmod 5 \Rightarrow 3^{100}\equiv 1; \qquad 2^6\equiv 1\!\pmod 9 \Rightarrow 2^{2024}\equiv 2^{2}=4. $$

**Fermat's Little Theorem** hands you such a $k$: $a^{p-1}\equiv1\pmod p$ for prime
$p\nmid a$.

**Simultaneous congruences (CRT).** To find the smallest $n$ with $n\equiv r_1
\pmod{m_1}$ and $n\equiv r_2\pmod{m_2}$, step through one progression
($r_1, r_1+m_1, \dots$) until the other condition holds.

**Vanishing factorials.** In a sum like $1!+\cdots+50! \pmod{15}$, every $k!$ with
$k\ge 5$ is divisible by $15$, so only the first few terms matter.

<!--band:hard-->
## Advanced · AIME level

**Split the modulus with CRT.** Last three digits $=$ mod $1000 = $ mod $8$ **and**
mod $125$, solved separately and recombined:
$$ 2^{2024}\equiv 0 \!\pmod 8,\quad 2^{2024}\equiv 91 \!\pmod{125} \;\Rightarrow\; 2^{2024}\equiv 216 \!\pmod{1000}. $$

**Multiplicative order** is the smallest $k$ with $a^k\equiv1$; it divides
$\lambda(m)$ and tells you how far to reduce a huge exponent.

**Look for $\equiv -1$.** Shortcuts collapse the work: $5^2\equiv -1\pmod{13}$, so
$5^{30}=(5^2)^{15}\equiv(-1)^{15}\equiv 12$.

**Counting solutions over a range.** A congruence condition (e.g. $n^2\equiv1
\pmod{24}$) is **periodic** with period $m$: count the solutions in one block of
$m$, multiply by the number of full blocks, then handle the leftover.
