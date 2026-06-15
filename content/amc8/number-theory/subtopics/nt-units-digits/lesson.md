# Units Digits & Cycles

A units digit is just a value mod $10$, and the last two digits a value mod $100$.
The problems use power cycles, exponent reduction, cyclic sums, and — for the last
two digits — orders and CRT.

<!--band:easy-->
## Foundations · AMC 8 level

The units digit of a product is the product of the units digits, taken mod $10$:
$13\times 27\times 35 \to 3\cdot 7\cdot 5 = 105 \to 5$.

**Power cycles** repeat in a short pattern:

| base | cycle | length |
|------|-------|--------|
| $2$  | $2,4,8,6$ | $4$ |
| $3$  | $3,9,7,1$ | $4$ |
| $7$  | $7,9,3,1$ | $4$ |
| $9$  | $9,1$     | $2$ |

So $7^4$ lands on the $4$th entry, $1$; and $9^{2024}$ (even exponent) gives $1$.

<!--band:medium-->
## Core · AMC 10 level

Two habits handle almost everything:

1. **Only the base's units digit matters:** $17^{83}$ behaves like $7^{83}$.
2. **Reduce the exponent modulo the cycle length** (usually $4$): for $7^{2024}$,
   $2024\equiv 0\pmod 4$, so the units digit is the last cycle entry, $1$.

**Cyclic sums.** When you add consecutive powers, each full cycle of units digits
contributes a fixed total: $3+9+7+1 = 20$, which ends in $0$. So
$3^1+3^2+\cdots+3^{20}$ (five full cycles) has units digit $0$.

<!--band:hard-->
## Advanced · AIME level

**Last two digits $=$ mod $100$.** Use the multiplicative order or CRT:

- Order of $3$ mod $100$ is $20$, and $2024\equiv 4\pmod{20}$, so $3^{2024}\equiv 3^4 = 81$.
- For $2^{100}$, split via CRT: $\equiv 0\pmod 4$ and $\equiv 1\pmod{25}$ give $76$.

**Power towers $a^{(b^c)}$.** Reduce the *exponent* $b^c$ modulo the cycle length
(or order) of $a$. For $7^{(7^7)}$ mod $100$: the cycle length is $4$ and
$7^7\equiv 3\pmod 4$, so the answer is $7^3\equiv 43$.

**Cyclic sums still apply** to the last digit of long sums: in
$2^1+2^2+\cdots+2^{100}$ each block $2,4,8,6$ sums to units $0$.
