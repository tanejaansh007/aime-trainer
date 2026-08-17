# Modular Arithmetic & Remainders

Working "mod $m$" means caring only about the **remainder** after dividing by $m$.
We write $a \equiv b \pmod m$ when $a$ and $b$ leave the same remainder. The power of
this idea is that you can reduce numbers to their remainders *before* adding,
subtracting, multiplying, or taking powers — which keeps everything small.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Finding a remainder.** Divide and keep what's left over: $47 = 7\times 6 + 5$, so the
remainder when $47$ is divided by $6$ is $5$. In symbols, $47 \equiv 5 \pmod 6$.

**Checking candidates.** Many problems hand you a few numbers and ask which one fits a
remainder condition — reduce each and compare.

**Worked example.** *Which of $22, 27, 31$ leaves a remainder of $1$ when divided by
$6$?*
$22 \equiv 4$, $27 \equiv 3$, $31 \equiv 1 \pmod 6$. The answer is $\mathbf{31}$.

**Two numbers, same remainder?** $a$ and $b$ agree mod $m$ exactly when $a - b$ is a
multiple of $m$. For instance $23$ and $38$ both leave remainder $3$ mod $5$, so they
are congruent mod $5$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Remainders combine.** You can reduce first, then add or multiply:
if $a \equiv 4$ and $b \equiv 5 \pmod 7$, then $a + b \equiv 4 + 5 = 9 \equiv 2 \pmod
7$ — without ever knowing $a$ or $b$ themselves.

**Where this shows up: cycles in real life.** Days of the week repeat every $7$, clock
hours every $12$, a repeating pattern every however-many items. Only the remainder
matters.

**Worked example (days).** *Today is Wednesday. What day is it in $100$ days?*
$100 = 14\times 7 + 2$, so $100$ days ahead is the same as $2$ days ahead:
Wednesday $+ 2 = \mathbf{Friday}$.

**Worked example (clock).** *It is $10$ o'clock. What time is it in $75$ hours?*
On a $12$-hour clock, $75 \equiv 3 \pmod{12}$, so the clock advances $3$ hours to
$\mathbf{1}$ o'clock.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Powers cycle.** The remainders of $b^1, b^2, b^3, \ldots$ mod $m$ repeat in a short
cycle. Find the cycle by multiplying, then use the exponent's position in it.

**Worked example.** *What is the remainder when $3^{17}$ is divided by $5$?*
Powers of $3$ mod $5$ cycle $3, 4, 2, 1$ (period $4$). Since $17 \equiv 1 \pmod 4$, it
matches the $1$st term: remainder $\mathbf{3}$.

**Reduce each term of a sum first.** You never have to compute a big sum before taking
its remainder — reduce the pieces.

**Worked example.** *What is the remainder when $123 + 456 + 789$ is divided by $9$?*
Using digit sums, $123 \equiv 6$, $456 \equiv 6$, $789 \equiv 6 \pmod 9$. The total is
$6 + 6 + 6 = 18 \equiv \mathbf{0} \pmod 9$ — far easier than dividing $1368$.

**Relating two moduli.** If you know a number mod $9$, you know it mod $3$ (since $3$
divides $9$): a number $9k + 4$ is $\equiv 4 \equiv 1 \pmod 3$.

**Simultaneous conditions — just list.** For "leaves remainder $2$ mod $5$ and $3$ mod
$7$," list one sequence and check the other: $12, 17, 22, \ldots$ ($\equiv 2 \pmod 5$);
$12 \equiv 5$, $17 \equiv 3 \pmod 7$ — so $\mathbf{17}$. No special theorem needed; the
answer always turns up within a few terms.
