# GCD & LCM

The problems here lean on four tools: reading gcd/lcm from factorizations, the
$\gcd\cdot\operatorname{lcm}=ab$ identity, the coprime decomposition $a=gx,\,b=gy$,
and counting pairs by prime exponents.

<!--band:easy-->
## Foundations · AMC 8 level

From the factorizations, take the **lower** prime powers for the gcd and the
**higher** ones for the lcm.

- **gcd** = "largest equal pieces" (cutting $48$ and $60$ into equal lengths → $12$).
- **lcm** = "events coinciding" (lights every $8$ and $12$ s → together every $24$ s).

**The key identity:**
$$ \gcd(a,b)\cdot\operatorname{lcm}(a,b) = a\cdot b \;\Rightarrow\; \operatorname{lcm} = \frac{a\,b}{\gcd}. $$
So a product of $96$ with $\gcd 4$ gives $\operatorname{lcm} = 96/4 = 24$.

The largest $k$-digit multiple of $m$ is $\left\lfloor \frac{10^k-1}{m}\right\rfloor\cdot m$.

<!--band:medium-->
## Core · AMC 10 level

**Find a missing number** with the identity: if $\gcd=g$, $\operatorname{lcm}=L$,
and one number is $a$, the other is $\dfrac{gL}{a}$.

**Coprime counting** uses Euler's totient: the integers in $[1,100]$ relatively
prime to $100$ number $\varphi(100)=40$.

**lcm of several numbers:** take the highest power of each prime across all of them.

**Conditioned gcd.** Counting $n$ with $\gcd(n,m)=d$: write $n=d\,k$ where $k$ runs
over values with $\gcd(k,\,m/d)=1$.

<!--band:hard-->
## Advanced · AIME level

**Coprime decomposition.** Write $a = g\,x$, $b = g\,y$ with $g=\gcd(a,b)$ and
$\gcd(x,y)=1$. Then $\operatorname{lcm}(a,b)=g\,x\,y$, and product/lcm conditions
turn into conditions on the **coprime** pair $(x,y)$.

**Counting by prime exponents.**

- **Coprime ordered pairs with product $m$:** each prime power of $m$ goes wholly
  to one side, so there are $2^{\omega(m)}$ pairs ($\omega$ = number of distinct
  primes). For $ab=2025=3^4 5^2$: $2^2 = 4$.
- **gcd $=g$, lcm $=L$:** the same idea on $L/g$, giving $2^{\omega(L/g)}$.
- **Ordered pairs with $\operatorname{lcm}=L=\prod p^{a}$:** each prime chooses
  independently, giving $\prod(2a+1)$. For $360$: $7\cdot5\cdot3 = 105$.

**Sum of coprime residues.** The integers $\le n$ coprime to $n$ pair as
$k \leftrightarrow n-k$, so their sum is $\tfrac{n}{2}\,\varphi(n)$.
