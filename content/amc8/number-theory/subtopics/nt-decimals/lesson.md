# Terminating & Repeating Decimals

Every fraction in lowest terms is either a **terminating** decimal (it stops, like
$\tfrac34 = 0.75$) or a **repeating** one (a block of digits repeats forever, like
$\tfrac13 = 0.\overline{3}$). The denominator's prime factors decide which, and the
same factors control the length and shape of the decimal.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Fraction to decimal.** Divide the top by the bottom, or scale the fraction so the
denominator becomes a power of $10$.

$$\frac{3}{5} = \frac{6}{10} = 0.6, \qquad \frac{5}{8} = 0.625.$$

**When it terminates.** If the denominator is built only from $2$s and $5$s, the
decimal stops. Powers of $2$ (like $8, 16$) and powers of $5$ always terminate.

**Notation for repeats.** A bar marks the repeating block:
$\tfrac13 = 0.\overline{3}$ and $\tfrac17 = 0.\overline{142857}$.

**Worked example.** *Write $\tfrac{7}{16}$ as a decimal.*
Since $16 = 2^4$ is a pure power of $2$, the decimal terminates. Long division gives
$7 \div 16 = \mathbf{0.4375}$. (Check by scaling: $\tfrac{7}{16} = \tfrac{7\cdot 625}
{10000} = \tfrac{4375}{10000}$.)

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**The terminating test — reduce first!** A fraction terminates **if and only if**,
*after reducing to lowest terms*, its denominator has no prime factors other than $2$
and $5$. Reducing matters: $\tfrac{14}{35} = \tfrac{2}{5}$ terminates, even though $35$
looks like it has a $7$ — the $7$ cancels.

> *Which of $\tfrac{5}{14}$, $\tfrac{17}{25}$, $\tfrac{9}{22}$ terminates?* Only
> $25 = 5^2$ has just $2$s and $5$s, so $\tfrac{17}{25}$ terminates; the others keep a
> $7$ or an $11$.

**Repeating decimal to fraction.** A pure repeating block of $k$ digits equals that
block over $k$ nines, then reduce:
$$0.\overline{27} = \frac{27}{99} = \frac{3}{11}.$$

**Length of the repeating block.** Do the long division of $\tfrac1q$ and watch the
**remainders**. When a remainder comes back around, the block closes, and the number
of steps is the block length.

**Worked example.** *How many digits are in the repeating block of $\tfrac{1}{13}$?*
Track the remainders: $1 \to 10 \to 9 \to 12 \to 3 \to 4 \to 1$. It returns to $1$
after $6$ steps, so the block has $\mathbf{6}$ digits ($\tfrac{1}{13} =
0.\overline{076923}$).

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**The $n$-th digit of a repeating decimal.** Find the block length $p$. The digits
cycle with period $p$, so the $n$-th digit is the same as position $n \bmod p$ within
the block (a remainder of $0$ means the *last* digit of the block).

**Worked example.** *What is the $50$th digit after the decimal point in
$\tfrac{2}{13}$?*
$\tfrac{2}{13} = 0.\overline{153846}$, period $6$. Since $50 = 8\cdot 6 + 2$, we have
$50 \equiv 2 \pmod 6$, so it is the $2$nd digit of the block: $\mathbf{5}$.

**Mixed decimals (some digits, then a repeat).** If the reduced denominator has both
$2$s/$5$s *and* another prime, a few digits appear before the repeat begins. The
number of these non-repeating digits equals the **larger** of the count of $2$s and
the count of $5$s in the denominator.

**Worked example.** *For $\tfrac{7}{12}$, how many digits come before the repeat?*
$12 = 2^2\cdot 3$, so the count of $2$s is $2$ and of $5$s is $0$; the non-repeating
part is $\max(2,0) = \mathbf{2}$ digits ($\tfrac{7}{12} = 0.58\overline{3}$).

**Combining conversions.** Harder problems mix a terminating and a repeating decimal.
Convert each to a fraction separately, then do the arithmetic. For instance
$0.375 = \tfrac{3}{8}$ and $0.\overline{123} = \tfrac{123}{999} = \tfrac{41}{333}$, so
an equation like $0.375 + x = 0.\overline{123}$ becomes $x = \tfrac{41}{333} -
\tfrac{3}{8}$.
