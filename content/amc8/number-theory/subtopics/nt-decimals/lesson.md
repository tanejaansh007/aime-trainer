# Terminating & Repeating Decimals

Every fraction either terminates (stops) or repeats forever. Knowing which — and
being able to convert between fraction and decimal form — is the core skill here.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Terminating decimals** are fractions whose decimal expansion ends:
$\frac{1}{4} = 0.25$, $\frac{3}{8} = 0.375$.

**Repeating decimals** go on forever with a repeating block:
$\frac{1}{3} = 0.\overline{3}$, $\frac{1}{7} = 0.\overline{142857}$.

Every fraction $\frac{p}{q}$ (in lowest terms) eventually falls into one of these
two categories — there is no other possibility.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Which fractions terminate?** A fraction $\frac{p}{q}$ in lowest terms terminates
in base $10$ **if and only if** the denominator $q$ has no prime factors other than
$2$ and $5$.

- $\frac{7}{20}$: $20 = 2^2\cdot5$, only $2$s and $5$s → **terminates** ($= 0.35$).
- $\frac{5}{12}$: $12 = 2^2\cdot3$, has a $3$ → **repeats**.

**Finding the decimal.** To convert $\frac{p}{q}$ to a terminating decimal, multiply
top and bottom to make the denominator a power of $10$:
$\frac{7}{25} = \frac{28}{100} = 0.28$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Converting a repeating decimal to a fraction.** Let $x = 0.\overline{36}$.
Then $100x = 36.\overline{36}$, so $99x = 36$, giving $x = \frac{36}{99} = \frac{4}{11}$.

For a mixed repeat like $0.1\overline{6}$: let $x = 0.1\overline{6}$, then
$10x = 1.\overline{6}$ and $100x = 16.\overline{6}$. Subtracting: $90x = 15$,
so $x = \frac{15}{90} = \frac{1}{6}$.

**Length of the repeating block.** For $\frac{1}{q}$ (with $\gcd(10,q)=1$) the
block length is the smallest $k$ with $10^k \equiv 1 \pmod q$.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Counting terminating fractions.** To count fractions $\frac{p}{q}$ with $q \le N$
that terminate: for each valid denominator (only prime factors $2$ and $5$), count
the valid numerators.

**Sum of a repeating decimal.** A pure repeat $0.\overline{d_1 d_2 \cdots d_k}$
equals $\frac{\overline{d_1 d_2 \cdots d_k}}{10^k - 1}$ (the repeating block over
that many $9$s).

**Denominators and nines.** $\frac{1}{9} = 0.\overline{1}$, $\frac{1}{99} = 0.\overline{01}$,
$\frac{1}{999} = 0.\overline{001}$. Any $k$-digit repeating decimal has denominator
dividing $\underbrace{99\cdots9}_{k}$.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Terminating in other bases.** $\frac{p}{q}$ terminates in base $b$ iff every
prime factor of $q$ also divides $b$. So $\frac{1}{3}$ terminates in base $3$
(as $0.1_3$) but repeats in base $10$. Problems may ask you to find a base in
which a given fraction terminates.

**Combining fraction ↔ decimal conversions.** Hard AMC 8 problems layer conversion
with arithmetic: e.g. "what fraction equals $0.\overline{4} + 0.\overline{5}$?"
Convert each to a fraction ($\frac{4}{9}$ and $\frac{5}{9}$), add, simplify.
