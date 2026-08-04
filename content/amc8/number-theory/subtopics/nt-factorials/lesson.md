# Factorials & Trailing Zeros

The core idea: count the prime factors inside $n!$ — specifically, count the $5$s,
since those are the bottleneck for trailing zeros.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

$n! = 1\cdot 2\cdots n$, so $\dfrac{n!}{(n-1)!} = n$.

**Trailing zeros = factors of $10 = 2\cdot 5$.** There are always more $2$s than
$5$s, so count the $5$s. For $n < 25$: $\lfloor n/5 \rfloor$ trailing zeros.
$15!$ ends in $\lfloor 15/5\rfloor = 3$ zeros.

**Factorials in sums.** Since every $k!$ with $k \ge 5$ ends in zero, the units
digit of $1! + 2! + 3! + 4! + 5! + \cdots$ depends only on $1!+2!+3!+4! = 33$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Multiples of $25$ give extra $5$s.** $25 = 5^2$ contributes two factors of $5$,
$125 = 5^3$ contributes three, etc. The full count of trailing zeros is:
$$ Z(n) = \left\lfloor\frac{n}{5}\right\rfloor + \left\lfloor\frac{n}{25}\right\rfloor + \left\lfloor\frac{n}{125}\right\rfloor + \cdots $$

$Z(50) = 10 + 2 = 12$. \quad $Z(100) = 20 + 4 = 24$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Applying the formula to larger values.**
$Z(200) = 40 + 8 + 1 = 49$. \quad $Z(1000) = 200 + 40 + 8 + 1 = 249$.

**Finding the smallest $n$ with exactly $k$ zeros.** Increase $n$ until $Z(n) = k$.
Note: $Z$ jumps by more than $1$ at multiples of $25$, so some values of $k$ are
skipped (you can never have exactly $25$ trailing zeros in any $n!$).

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Counting factorials divisible by a power of $10$.** $n!$ is divisible by $10^k$
iff $Z(n) \ge k$. To count how many of $1!, 2!, \dots, 100!$ are divisible by $10^3$
(i.e. end in at least $3$ zeros), find the smallest $n$ with $Z(n) \ge 3$ — that's
$n = 15$ — so $100 - 15 + 1 = 86$ factorials qualify.

**Counting trailing zeros in a product.** $n! = 1\cdot 2\cdots n$, but sometimes
a problem asks about the product of several factorials or a partial product. Add up
the $5$-factor counts from each piece.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**The jump at powers of $5$.** Because $Z(25) = 6$ and $Z(24) = 4$, there is no $n$
with $Z(n) = 5$. In general, every multiple of $5^k$ causes $Z$ to jump by $k$
extra, potentially skipping values. Identifying these jumps is the key to "how many
values of $k$ are possible" questions.

**Combining with units digit.** A problem may ask for the units digit of $n!$ for
large $n$ — since $n! \equiv 0 \pmod{10}$ for all $n \ge 5$, the units digit is
always $0$. No cycle needed; the trailing zeros formula already tells you this.

**Working backwards.** Given a number of trailing zeros, identify the possible
values of $n$: find the smallest $n$ in each "jump window" and note the gap.
