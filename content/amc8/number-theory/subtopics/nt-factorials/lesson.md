# Factorials

The factorial $n! = 1\cdot 2\cdot 3\cdots n$ is the product of the whole numbers up
to $n$. The key to almost every problem here is **not** computing giant factorials
in full — it's cancelling them in ratios and counting how many times each prime
appears inside them.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Computing small factorials.** Multiply up: $4! = 4\cdot 3\cdot 2\cdot 1 = 24$, and
$5! = 120$, $6! = 720$. They grow fast.

**Ratios cancel — this is the big idea.** You almost never need both factorials in a
ratio. The bottom cancels most of the top:

$$\frac{8!}{6!} = \frac{8\cdot 7\cdot 6!}{6!} = 8\cdot 7 = 56.$$

Only the factors *above* the denominator survive.

**Worked example.** *Simplify $\dfrac{9!}{7!}$.*
The $7!$ cancels, leaving $9\cdot 8 = \mathbf{72}$ — no need to compute $9!$ or $7!$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Trailing zeros = count the $5$s.** A trailing zero comes from a factor of $10 = 2
\times 5$, and factors of $2$ are always more plentiful, so the number of trailing
zeros of $n!$ is the number of factors of $5$:

$$\left\lfloor\tfrac{n}{5}\right\rfloor + \left\lfloor\tfrac{n}{25}\right\rfloor + \left\lfloor\tfrac{n}{125}\right\rfloor + \cdots$$

**Worked example.** *How many trailing zeros does $30!$ have?*
$\lfloor30/5\rfloor + \lfloor30/25\rfloor = 6 + 1 = \mathbf{7}$.

**Factorial sums stop mattering.** From $5!$ on, every factorial ends in $0$. So the
units digit of $1! + 2! + \cdots + n!$ (for any $n \ge 4$) comes entirely from
$1! + 2! + 3! + 4! = 33$ — units digit $\mathbf{3}$.

**Equations from ratios.** Since $\dfrac{n!}{(n-2)!} = n(n-1)$, a ratio set equal to a
number becomes an equation you can solve.

**Worked example.** *For what $n$ does $\dfrac{n!}{(n-2)!} = 90$?*
$n(n-1) = 90$, and $10\cdot 9 = 90$, so $n = \mathbf{10}$.

**Counting any prime's factors.** The same "add up the floors" idea works for any
prime, not just $5$. The largest power of $3$ dividing $10!$ has exponent
$\lfloor10/3\rfloor + \lfloor10/9\rfloor = 3 + 1 = \mathbf{4}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Full factorization, then divisor count.** Count each prime's exponent with the floor
sums, then apply the divisor-count formula.

**Worked example.** *How many positive divisors does $8!$ have?*
The exponents are: $2 \to \lfloor8/2\rfloor+\lfloor8/4\rfloor+\lfloor8/8\rfloor = 7$;
$3 \to \lfloor8/3\rfloor = 2$; $5 \to 1$; $7 \to 1$. So $8! = 2^7\cdot 3^2\cdot 5\cdot
7$, and the number of divisors is $(7+1)(2+1)(1+1)(1+1) = \mathbf{96}$.

**Composite bases: the weakest prime wins.** To divide by $6^k = (2\cdot 3)^k$ you need
$k$ copies of both $2$ and $3$, so $k$ is limited by whichever prime is scarcer.

**Worked example.** *What is the largest $k$ with $6^k \mid 9!$?*
Factors of $2$ in $9!$: $7$. Factors of $3$: $\lfloor9/3\rfloor+\lfloor9/9\rfloor = 4$.
So $k = \min(7, 4) = \mathbf{4}$.

**Reverse trailing-zero search.** To find the smallest $n$ whose factorial has a target
number of zeros, close in on the boundary.

**Worked example.** *Smallest $n$ with at least $20$ trailing zeros?*
At $n = 84$: $16 + 3 = 19$ (not enough). At $n = 85$: $17 + 3 = 20$. So $n = \mathbf{85}$.

**Ratio exponents subtract.** The exponent of a prime in $\dfrac{n!}{m!}$ is just the
difference of its exponents in $n!$ and $m!$ — no need to expand the ratio.

**Worked example.** *Largest power of $2$ dividing $\dfrac{12!}{6!}$?*
Factors of $2$ in $12!$: $6 + 3 + 1 = 10$; in $6!$: $3 + 1 = 4$. The difference is
$10 - 4 = \mathbf{6}$.
