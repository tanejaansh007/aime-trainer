# GCD & LCM

The tiers move from reading GCD/LCM off factorizations, to the product identity,
to multi-step problems that chain these ideas together.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

From the factorizations, take the **lower** prime powers for the GCD and the
**higher** ones for the LCM.

- **GCD** = "largest equal pieces" (cutting ribbons of $48$ and $60$ cm → $12$ cm pieces).
- **LCM** = "events coinciding" (lights every $8$ s and $12$ s → together every $24$ s).

The LCM of several numbers takes the highest power of each prime across all of them:
$\operatorname{lcm}(6, 9, 15) = 2\cdot 3^2\cdot 5 = 90$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**The key identity:**
$$ \gcd(a,b)\cdot\operatorname{lcm}(a,b) = a\cdot b. $$
If the product is $96$ and $\gcd = 4$, then $\operatorname{lcm} = 96/4 = 24$.

**Largest multiple in range.** The largest $k$-digit multiple of $m$ is
$\left\lfloor\frac{10^k-1}{m}\right\rfloor\cdot m$.

**Finding a missing number.** Given $\gcd = g$, $\operatorname{lcm} = L$, and one
number $a$, the other is $\dfrac{gL}{a}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**GCD of large numbers.** Use the Euclidean algorithm: repeatedly replace the larger
number with its remainder mod the smaller.
$\gcd(720, 1008)$: $1008 = 1\cdot 720 + 288$, $720 = 2\cdot 288 + 144$,
$288 = 2\cdot 144$, so $\gcd = 144$.

**Sum of an arithmetic sequence.** When you need the sum of all multiples of $d$
from $1$ to $N$, they form an arithmetic sequence with $\lfloor N/d\rfloor$ terms;
use the average-times-count formula.

**Checking GCF with a condition.** "The GCF of $a$ and $b$ that is a perfect
square" — compute the GCF, then find its largest square factor.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**LCM from three or more numbers.** For each prime, take the highest exponent
appearing in any of the numbers. Then verify divisibility separately.

**Chain the product identity.** In multi-step problems, set up equations using
$\gcd\cdot\operatorname{lcm} = $ product and solve for the unknown. If two
conditions are given (e.g. GCD and LCM both fixed), list divisors of the LCM that
also divide the GCD correctly.

**Periodic problems.** If two events repeat every $a$ and $b$ steps, they coincide
every $\operatorname{lcm}(a,b)$ steps. To count coincidences in a range, divide the
range length by the LCM.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Building from GCD structure.** Write $a = g\cdot x$ and $b = g\cdot y$ where
$g = \gcd(a,b)$. Then $\gcd(x,y) = 1$, and $\operatorname{lcm}(a,b) = g\cdot x\cdot y$.
This lets you translate a GCD/LCM condition into a product condition on coprime
numbers — useful for finding all valid pairs by listing factor pairs of $L/g$.

**Combining with divisibility.** The hardest AMC 8 GCD/LCM problems layer a
GCD/LCM condition with a divisibility or size constraint. Factorize everything first,
then apply the constraints one at a time.
