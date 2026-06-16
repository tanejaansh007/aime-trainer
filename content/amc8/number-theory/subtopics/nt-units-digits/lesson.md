# Units Digits & Cycles

A units digit is a value mod $10$; the last two digits, mod $100$. The tiers grow
from reading cycles to exponent reduction and, at the top, orders, CRT, and power
towers.

<!--band:t1-->
## Tier 1 · AMC 8 basics

The units digit of a product is the product of the units digits, mod $10$:
$13\times 27\times 35 \to 3\cdot 7\cdot 5 = 105 \to 5$.

**Power cycles** repeat in short patterns — $2{:}\,2,4,8,6$; $3{:}\,3,9,7,1$;
$7{:}\,7,9,3,1$; $9{:}\,9,1$. So $7^4$ ends in $1$, and $9^{2024}$ (even exponent)
ends in $1$.

<!--band:t2-->
## Tier 2 · AMC 8 → AMC 10 bridge

To read any power's units digit, find the cycle of its **base's** units digit, then
locate the exponent's position within that cycle. Every cycle here has length $1$,
$2$, or $4$, so you only ever need the exponent modulo $4$. Internalize the four
cycles above — the next tiers are just this idea applied to huge exponents.

<!--band:t3-->
## Tier 3 · AMC 10

Two habits handle large exponents:

1. **Only the base's units digit matters:** $17^{83}$ behaves like $7^{83}$.
2. **Reduce the exponent modulo the cycle length** (usually $4$): for $7^{2024}$,
   $2024\equiv 0\pmod 4$, so the units digit is the last entry, $1$.

**Cyclic sums.** Adding consecutive powers, each full cycle of units digits
contributes a fixed total: $3+9+7+1 = 20$, ending in $0$.

<!--band:t4-->
## Tier 4 · AMC 10 / early AIME

**The last two digits** mean working mod $100$, where cycles are longer. The order of
$3$ mod $100$ is $20$, and $2024\equiv 4\pmod{20}$, so $3^{2024}\equiv 3^4 = 81$.

**Long cyclic sums** still collapse: in $2^1 + 2^2 + \cdots + 2^{100}$ each block
$2,4,8,6$ sums to units $0$, so the whole sum ends in $0$.

<!--band:t5-->
## Tier 5 · AIME

**Last two digits via CRT.** Split mod $100$ into mod $4$ and mod $25$: for $2^{100}$,
$\equiv 0\pmod 4$ and $\equiv 1\pmod{25}$ give $76$.

**Power towers $a^{(b^c)}$.** Reduce the *exponent* $b^c$ modulo the cycle length (or
order) of $a$. For $7^{(7^7)}$ mod $100$: the cycle length is $4$ and $7^7\equiv 3
\pmod 4$, so the answer is $7^3\equiv 43$.

**Sums of several powers** combine these: reduce each term, then add the units
digits.
