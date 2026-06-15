# Units Digits & Cycles

The units digit of a number is just its remainder mod $10$ — and the units digits of
powers repeat in short, predictable cycles.

<!--band:easy-->
## Foundations · AMC 8 level

To get the units digit of a product, multiply only the units digits:
$7 \times 7 = 49 \to 9$.

Units digits of powers **cycle**:

| base | cycle | length |
|------|-------|--------|
| $2$  | $2,4,8,6$ | $4$ |
| $3$  | $3,9,7,1$ | $4$ |
| $7$  | $7,9,3,1$ | $4$ |
| $9$  | $9,1$     | $2$ |

So $2^4 = 16 \to 6$, and $3^4 = 81 \to 1$.

<!--band:medium-->
## Core · AMC 10 level

For a large exponent, **reduce the exponent modulo the cycle length.**

$7^{100}$: the cycle $7,9,3,1$ has length $4$, and $100 \equiv 0 \pmod 4$, so we land
on the last entry — units digit $1$.

Only the base's units digit matters: $13^{2024}$ has the same units digit as
$3^{2024}$. Since $2024 \equiv 0 \pmod 4$, that's $1$.

<!--band:hard-->
## Advanced · AIME level

- **Sums of powers.** Reduce each term's units digit, then add. For
  $2^2 + 4^4 + 6^6 + 8^8$ the units digits are $4, 6, 6, 6$ (note $8$ cycles
  $8,4,2,6$ and $8 \equiv 0 \pmod 4$ lands on $6$); the sum $22$ ends in $2$.
- **Last two / three digits** generalize this to mod $100$ and mod $1000$, where the
  cycles are longer and the Chinese Remainder Theorem (splitting the modulus) does the
  heavy lifting — see the Modular Arithmetic lesson.
