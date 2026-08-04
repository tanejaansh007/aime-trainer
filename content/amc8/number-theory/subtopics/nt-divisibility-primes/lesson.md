# Divisibility & Primes

Five tiers across AMC 8 difficulty. Lower tiers cover divisibility tests and basic
primality; higher tiers build to multi-condition counting and harder prime arguments.
Switch tiers with the selector above.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Divisibility tests** let you check a divisor without dividing:

- **2:** last digit even. **5:** last digit $0$ or $5$.
- **3 / 9:** the *digit sum* is divisible by $3$ / $9$.
- **6:** divisible by **both** $2$ and $3$.

**Primality.** A number $>1$ is prime if no smaller prime divides it. For a
two-digit number you only need to test $2, 3, 5, 7$. Remember: $1$ is not prime.

**Worked example.** Is $91$ prime? Test $2$ (odd), $3$ (digit sum $10$, no), $5$
(ends in $1$, no), $7$: $91 = 7\times 13$. Composite.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

Add two more tests and start **counting multiples**:

- **4:** the last two digits form a multiple of $4$.
- **Counting multiples:** the number of multiples of $d$ in $\{1,\dots,N\}$ is
  $\left\lfloor N/d\right\rfloor$.

**"But not" problems.** To count integers divisible by $a$ but **not** $b$, count
multiples of $a$ then subtract those also divisible by $b$ (i.e. multiples of
$\text{lcm}(a,b)$).

*Example:* Multiples of $4$ but not $6$ in $\{1,\dots,100\}$: $25 - 8 = 17$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Inclusion–exclusion** — counting divisible by $a$ **or** $b$:
$$ |A \cup B| = \left\lfloor \tfrac{N}{a}\right\rfloor + \left\lfloor \tfrac{N}{b}\right\rfloor - \left\lfloor \tfrac{N}{\operatorname{lcm}(a,b)}\right\rfloor. $$

- Divisible by $3$ or $5$ in $1$–$100$: $33 + 20 - 6 = 47$.
- Divisible by **neither**: $N - |A\cup B|$.

**Primes in a range.** List and test; the primes between $10$ and $30$ are
$11, 13, 17, 19, 23, 29$ — six of them.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Exactly one of two sets.** Remove the overlap from each set separately:
$$ \big(|A| - |A\cap B|\big) + \big(|B| - |A\cap B|\big). $$

**Three conditions.** Extend inclusion–exclusion to three sets:
$$ |A\cup B\cup C| = |A|+|B|+|C| - |A\cap B| - |A\cap C| - |B\cap C| + |A\cap B\cap C|. $$
Each pairwise and triple overlap is a floor-of-$N$ over the relevant lcm.

**Sum of primes** in a range: after listing them, add. Watch for the special case
$2$ — it is the only even prime and may satisfy an extra condition others don't.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Digit-sum divisibility extended.** A number is divisible by $9$ iff its digit sum
is; for divisibility by $11$ the *alternating* digit sum must be divisible by $11$.
Use these to build or identify numbers with prescribed divisibility from digit
constraints alone.

**Prime gaps and twin primes.** Among larger primes, the only even prime is $2$, so
any prime pair summing to an even number must include $2$ (if the sum is odd, one of
them is $2$). This forces the other to equal the sum minus $2$.

**Combining conditions.** Hard AMC 8 divisibility problems layer a divisibility
condition with a size bound or a digit property — work each constraint separately,
then intersect. Listing systematically beats guessing.
