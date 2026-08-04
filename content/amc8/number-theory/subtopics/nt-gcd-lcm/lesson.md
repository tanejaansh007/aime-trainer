# GCD & LCM

The tiers move from reading gcd/lcm off factorizations to the coprime decomposition
$a=gx,\,b=gy$ and counting pairs by prime exponents.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

From the factorizations, take the **lower** prime powers for the gcd and the
**higher** ones for the lcm.

- **gcd** = "largest equal pieces" (cutting $48$ and $60$ ribbons → $12$ cm).
- **lcm** = "events coinciding" (lights every $8$ and $12$ s → together every $24$ s).

The **least common multiple of several numbers** takes the highest power of each
prime across all of them: $\operatorname{lcm}(6,9,15) = 90$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**The key identity:**
$$ \gcd(a,b)\cdot\operatorname{lcm}(a,b) = a\cdot b \;\Rightarrow\; \operatorname{lcm} = \frac{a\,b}{\gcd}. $$
A product of $96$ with $\gcd 4$ gives $\operatorname{lcm} = 24$.

The largest $k$-digit multiple of $m$ is $\left\lfloor \frac{10^k-1}{m}\right\rfloor\cdot m$
— e.g. the largest three-digit multiple of $\operatorname{lcm}(3,4,5)=60$ is $960$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Find a missing number** with the identity: if $\gcd=g$, $\operatorname{lcm}=L$,
and one number is $a$, the other is $\dfrac{gL}{a}$.

**Coprime counting** uses Euler's totient: integers in $[1,100]$ relatively prime to
$100$ number $\varphi(100) = 40$.

**Conditioned gcd.** To count $n$ with $\gcd(n,m)=d$, write $n = d\,k$ where $k$
ranges over values with $\gcd(k,\,m/d)=1$.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Coprime decomposition.** Write $a = g\,x$, $b = g\,y$ with $g=\gcd(a,b)$ and
$\gcd(x,y)=1$; then $\operatorname{lcm}=g\,x\,y$ and the problem becomes one about the
coprime pair $(x,y)$.

- **Coprime ordered pairs with product $m$:** each prime power goes wholly to one
  side, so there are $2^{\omega(m)}$ of them. For $ab=2025 = 3^4 5^2$: $2^2 = 4$.
- **Sum of coprime residues:** integers $\le n$ coprime to $n$ pair as
  $k\leftrightarrow n-k$, summing to $\tfrac n2\,\varphi(n)$.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Counting pairs by prime exponents.**

- **Ordered pairs with $\operatorname{lcm}=L=\prod p^{a}$:** each prime chooses
  independently, giving $\prod(2a+1)$. For $360$: $7\cdot 5\cdot 3 = 105$.
- **gcd $=g$, lcm $=L$:** apply the coprime idea to $L/g$, giving $2^{\omega(L/g)}$.
  With $L=1260$, $g=6$: $L/g = 210 = 2\cdot3\cdot5\cdot7$, so $2^4 = 16$ ordered pairs.

These all reduce to the same move — decide, prime by prime, where each factor goes.
