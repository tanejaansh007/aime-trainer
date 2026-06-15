# GCD & LCM

The greatest common divisor and least common multiple — two sides of the same coin,
both readable from prime factorizations.

<!--band:easy-->
## Foundations · AMC 8 level

The **greatest common divisor** $\gcd(a,b)$ is the largest number dividing both;
the **least common multiple** $\operatorname{lcm}(a,b)$ is the smallest positive
number both divide into.

From factorizations, take the **lower** power of each prime for the gcd and the
**higher** power for the lcm:
$$ 12 = 2^2\cdot 3,\quad 18 = 2\cdot 3^2 \;\Rightarrow\; \gcd = 2\cdot 3 = 6,\quad \operatorname{lcm} = 2^2\cdot 3^2 = 36. $$

<!--band:medium-->
## Core · AMC 10 level

Two power tools:

- **The identity** $\gcd(a,b)\cdot \operatorname{lcm}(a,b) = a\cdot b$. If
  $\gcd = 6$, $\operatorname{lcm}=36$, and one number is $12$, the other is
  $\dfrac{6\cdot 36}{12} = 18$.
- **The Euclidean algorithm** finds a gcd fast by replacing the larger number with
  its remainder mod the smaller:
  $$ \gcd(1071,462)=\gcd(462,147)=\gcd(147,21)=21. $$

<!--band:hard-->
## Advanced · AIME level

The standard move: factor out the gcd. Write $a = g x$, $b = g y$ with
$g = \gcd(a,b)$ and $\gcd(x,y) = 1$. Then $\operatorname{lcm}(a,b) = g x y$.

**Worked example.** Two positive integers have product $144$ and $\gcd 6$. Writing
$a=6x,\ b=6y$ with $\gcd(x,y)=1$ gives $36xy = 144$, so $xy = 4$. The coprime ordered
pairs with product $4$ are $(1,4)$ and $(4,1)$ — **two** pairs.

This coprime decomposition turns gcd/lcm constraints into clean counting problems.
