# GCD & LCM

The **greatest common divisor** $\gcd(a,b)$ is the largest number that divides
*both* $a$ and $b$. The **least common multiple** $\operatorname{lcm}(a,b)$ is the
smallest positive number that *both* divide into. Nearly every problem in this set
is one of three things: reading a GCD or LCM out of a word problem, using the
identity $\gcd(a,b)\cdot\operatorname{lcm}(a,b)=a\cdot b$, or hunting for the numbers
that satisfy a GCD/LCM condition.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

The reliable way to get both at once is to **prime-factorize** each number, then:

- for the **GCD**, take the **lower** power of each shared prime;
- for the **LCM**, take the **higher** power of every prime that appears.

For $8 = 2^3$ and $12 = 2^2\cdot 3$: $\gcd = 2^2 = 4$ and
$\operatorname{lcm} = 2^3\cdot 3 = 24$.

Two everyday shapes cover the whole tier:

- **LCM = "when do repeating events line up again?"** Lights that flash every $4$ s
  and $6$ s next flash together after $\operatorname{lcm}(4,6)$ seconds.
- **GCD = "what is the largest identical group?"** Splitting two piles into as many
  *identical* bundles as possible uses $\gcd$ of the pile sizes.

**Worked example (LCM).** *Two bells ring every $15$ and $20$ minutes. After how many
minutes do they next ring together?*
Factor: $15 = 3\cdot 5$ and $20 = 2^2\cdot 5$. Take the highest power of each prime:
$\operatorname{lcm} = 2^2\cdot 3\cdot 5 = 60$. They ring together again after
**$60$ minutes**.

**Worked example (GCD).** *A baker splits $36$ chocolate-chip and $48$ oatmeal
cookies into identical bags, using as many bags as possible. How many cookies are in
each bag?*
The number of bags is $\gcd(36,48)$. Since $36 = 2^2\cdot 3^2$ and $48 = 2^4\cdot 3$,
$\gcd = 2^2\cdot 3 = 12$ bags. Each bag holds $36/12 = 3$ chocolate-chip and
$48/12 = 4$ oatmeal cookies, for $3 + 4 = \mathbf{7}$ cookies.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Two-step GCD problems.** These first ask for the GCD, then a quantity you compute
*from* it. Find the GCD, then divide.

> *A teacher divides $45$ blue and $75$ red markers into identical sets, as many as
> possible. How many red markers per set?*
> There are $\gcd(45,75) = 15$ sets, so each has $75/15 = \mathbf{5}$ red markers.

**The key identity.** For any two positive integers,

$$\gcd(a,b)\cdot\operatorname{lcm}(a,b) = a\cdot b.$$

Rearranged, this answers a whole family of questions:

- $\operatorname{lcm} = \dfrac{a\,b}{\gcd}$,  $\quad\gcd = \dfrac{a\,b}{\operatorname{lcm}}$,
- and if you know $\gcd = g$, $\operatorname{lcm} = L$, and one number $a$, the other
  is $\dfrac{g\,L}{a}$.

**Worked example.** *Two positive integers have product $900$ and least common
multiple $60$. What is their greatest common divisor?*
Straight from the identity, $\gcd = \dfrac{a\,b}{\operatorname{lcm}} = \dfrac{900}{60}
= \mathbf{15}$.

**Worked example.** *Two integers have $\gcd = 7$ and $\operatorname{lcm} = 84$. One
of them is $21$. Find the other.*
Their product is $\gcd\cdot\operatorname{lcm} = 7\cdot 84 = 588$, so the other number
is $588 / 21 = \mathbf{28}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Counting pairs with a fixed LCM.** To count ordered pairs $(a,b)$ with
$\operatorname{lcm}(a,b) = N$, work one prime at a time. If $N$ has the prime power
$p^{e}$, then $a$ and $b$ carry powers $p^{i}$ and $p^{j}$ where $\max(i,j) = e$.
The number of ordered pairs $(i,j)$ with $\max = e$ is $2e + 1$ (either $i = e$ with
$j = 0,\dots,e$, or $j = e$ with $i = 0,\dots,e$, minus the once-double-counted
$(e,e)$). Multiply these across all primes.

**Worked example.** *How many ordered pairs $(a,b)$ satisfy
$\operatorname{lcm}(a,b) = 12$?*
$12 = 2^2\cdot 3$. For the prime $2$ (exponent $2$): $2(2)+1 = 5$ choices. For the
prime $3$ (exponent $1$): $2(1)+1 = 3$ choices. Total $5\cdot 3 = \mathbf{15}$.

**Finding all pairs from GCD and LCM.** Write $a = g\,m$ and $b = g\,n$ where
$g = \gcd(a,b)$. Then $m$ and $n$ are **coprime** ($\gcd(m,n) = 1$) and
$m\,n = \dfrac{\operatorname{lcm}}{\gcd}$. Listing the coprime factor pairs of that
quotient gives every valid pair.

**Worked example.** *Two integers have $\gcd = 8$ and $\operatorname{lcm} = 240$.
What is the sum of all possible values of the smaller integer?*
Write $a = 8m$, $b = 8n$ with $\gcd(m,n) = 1$ and $m\,n = 240/8 = 30$. The coprime
factor pairs of $30$ are $(1,30),(2,15),(3,10),(5,6)$. Taking the smaller of each and
scaling back by $8$ gives $8, 16, 24, 40$, which sum to $\mathbf{88}$.
