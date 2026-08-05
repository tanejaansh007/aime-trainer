# Units Digits & Cycles

A units digit is a remainder mod $10$. The tiers grow from reading basic cycles to
applying them to large exponents, sums, products, and differences.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

The units digit of a product depends only on the units digits of the factors:
$13 \times 27$: just multiply the units digits, $3\times 7 = 21$, so the units digit is $1$.

**Power cycles** repeat in short patterns:

| base units digit | cycle | length |
|---|---|---|
| $2$ | $2, 4, 8, 6$ | $4$ |
| $3$ | $3, 9, 7, 1$ | $4$ |
| $7$ | $7, 9, 3, 1$ | $4$ |
| $9$ | $9, 1$ | $2$ |
| $4$ | $4, 6$ | $2$ |
| $5, 6$ | $5, 6$ | $1$ |

So $7^4$ ends in $1$, and $9^{2024}$ (even exponent) ends in $1$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

To find the units digit of $a^e$:
1. Only the **units digit of the base** matters: $17^{83}$ behaves like $7^{83}$.
2. Find the cycle length $c$ for that digit.
3. Compute $e \bmod c$; that remainder tells you the position in the cycle.
   If the remainder is $0$, use the *last* entry in the cycle.

*Example:* $7^{2024}$. Cycle $7,9,3,1$ has length $4$; $2024 \bmod 4 = 0$, so the
units digit is the $4$th entry: $\mathbf{1}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Sums of powers.** Find each term's units digit separately, then add and take mod $10$.

*Example:* $2^{10} + 3^{10}$. $2^{10}$: $10 \bmod 4 = 2$, cycle entry $2$ is $4$.
$3^{10}$: $10 \bmod 4 = 2$, cycle entry $2$ is $9$. Sum: $4+9 = 13 \to$ units digit $\mathbf{3}$.

**Products of powers.** Same — reduce each factor to its units digit, then multiply.

**Tower exponents.** $(2^5)^3 = 2^{15}$. Simplify first, then apply the cycle.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Differences of powers.** Find each units digit, subtract, and adjust for negatives:
if the result is negative add $10$. *$8^8 - 7^7$: $8^8$ ends in $6$, $7^7$ ends in
$3$; $6 - 3 = \mathbf{3}$.*

**Cyclic sums of consecutive powers.** When adding $a^1 + a^2 + \cdots + a^n$, each
full cycle contributes the same digit-sum total. Divide $n$ by the cycle length to
count full cycles (units digit contribution $\equiv 0$ if the cycle sum ends in $0$),
then handle the remaining terms.

**Multi-base expressions.** Track each base separately through its own cycle, combine
at the end.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Large exponents in products and sums.** The same reduce-each-base approach works
even when the exponents are in the thousands — the cycle lengths are always $1$, $2$,
or $4$, so the exponent mod $4$ (or mod $2$ for bases $4$ and $9$) is all you ever need.

**Choosing the right cycle entry.** The most common mistake is treating a remainder
of $0$ as the "$0$th" entry instead of the last. If $e \equiv 0 \pmod{c}$, the
units digit is the **last** entry in the cycle.

**Check your answer.** Plug in a small exponent with the same remainder to verify —
e.g. if $e \equiv 2 \pmod 4$, check that your answer matches $a^2$.
