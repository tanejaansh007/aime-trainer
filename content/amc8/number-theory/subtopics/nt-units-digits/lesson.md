# Units Digits

The **units digit** (last digit) of a number is easy to control once you know a
few patterns. For sums and products, only the units digits of the parts matter.
For powers, the units digit repeats in a short cycle. This set builds from those
basics up to exponent towers and long sums of powers.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Only the units digits matter — for sums and products.** To get the units digit of
a sum or a product, you can throw away everything except the units digits of the
pieces and work with those.

- $234 + 567 + 128$: add the last digits, $4 + 7 + 8 = 19$, so the units digit is $9$.
- $23 \times 47$: multiply the last digits, $3 \times 7 = 21$, so the units digit is $1$.

**Small powers — just compute.** For a small exponent, work the power out directly:
$2^5 = 32$ (units digit $2$), $\;9^2 = 81$ (units digit $1$).

**A few bases never change.** Every power of $5$ ends in $5$, every power of $6$ ends
in $6$, and every power of $1$ ends in $1$ — no matter how big the exponent.

**Worked example.** *What is the units digit of $4 \times 7 \times 6$?*
Multiply step by step, keeping only the units digit each time: $4 \times 7 = 28$
(units $8$), then $8 \times 6 = 48$ (units $\mathbf{8}$).

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**The cycle.** The units digits of the powers of a fixed base repeat in a short cycle
(its length always divides $4$). Find the cycle by multiplying and watching the last
digit:

$$2^1,2^2,2^3,2^4,\ldots \;\to\; 2, 4, 8, 6, \;2, 4, 8, 6, \ldots$$

To find the units digit of $b^n$, locate $n$ within the cycle using its length. **When
$n$ is a multiple of the cycle length, use the last term of the cycle.**

**Worked example (forward).** *What is the units digit of $8^{23}$?*
Powers of $8$ cycle $8, 4, 2, 6$ (length $4$). Since $23 = 5\cdot 4 + 3$, we have
$23 \equiv 3 \pmod 4$, so it matches the $3$rd term: $\mathbf{2}$.

**Working backward.** Given a target units digit, you can find *which* exponents
produce it — read off the cycle position and count.

**Worked example (backward).** *For how many integers $n$ from $1$ to $30$ does $7^n$
end in $1$?*
Powers of $7$ cycle $7, 9, 3, 1$; the units digit is $1$ exactly when $n \equiv 0
\pmod 4$. From $1$ to $30$ those are $n = 4, 8, 12, \ldots, 28$ — that is $\mathbf{7}$
values.

**Combining two bases.** Find each base's units digit from its own cycle, then add or
multiply.

**Worked example.** *What is the units digit of $2^{15} + 3^{15}$?*
$2^{15}$: cycle $2,4,8,6$, and $15 \equiv 3 \pmod 4 \to 8$. $3^{15}$: cycle $3,9,7,1$,
and $15 \equiv 3 \pmod 4 \to 7$. Sum $8 + 7 = 15$, so the units digit is $\mathbf{5}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Long sums — full cycles are free.** When you add up all the powers of one base, each
complete block of the cycle contributes a units-digit sum of $0$. For example
$2 + 4 + 8 + 6 = 20$, which adds nothing to the units digit. So only the **leftover
partial block** at the end matters.

**Worked example.** *What is the units digit of $2^1 + 2^2 + 2^3 + \cdots + 2^{50}$?*
The cycle $2,4,8,6$ has length $4$, and $50 = 12\cdot 4 + 2$: twelve full cycles
(contributing $0$) plus two leftover terms, $2^{49} \to 2$ and $2^{50} \to 4$. Their
sum is $2 + 4 = 6$, so the units digit is $\mathbf{6}$.

**Sums with a different base in every term.** For something like $1^1 + 2^2 + \cdots$,
there is no single cycle — find each term's units digit and add them up.

**Worked example.** *What is the units digit of $1^1 + 2^2 + 3^3 + \cdots + 8^8$?*
The units digits of the terms are $1, 4, 7, 6, 5, 6, 3, 6$, which sum to $38$. The
units digit of the total is $\mathbf{8}$.

**Exponent towers.** For a power like $7^{6^5}$, work from the top down: compute the
exponent first, then reduce it against the cycle length.

**Worked example.** *What is the units digit of $7^{6^5}$?*
First the exponent: $6^5 = 7776$. Powers of $7$ cycle $7, 9, 3, 1$ (length $4$), and
$7776 \equiv 0 \pmod 4$, so the units digit is the last term of the cycle:
$\mathbf{1}$.
