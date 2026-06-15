# Number Theory (AMC 8)

Number theory is the study of the integers — how they divide, factor, and leave
remainders. Almost every AMC 8 has two or three problems that come straight from
the ideas below. Read this once, then practice; the problems adapt to your level.

## 1. Divisibility

We say $a$ **divides** $b$ (written $a \mid b$) if $b = a\cdot k$ for some integer
$k$. Handy divisibility tests:

- **By 2:** last digit is even.
- **By 3:** the digit sum is divisible by 3. (e.g. $345 \to 3+4+5 = 12$, so $3 \mid 345$.)
- **By 4:** the last two digits form a multiple of 4.
- **By 5:** last digit is $0$ or $5$.
- **By 9:** the digit sum is divisible by 9.
- **By 11:** the alternating digit sum is divisible by 11.

## 2. Primes and prime factorization

A **prime** is an integer greater than $1$ whose only positive divisors are $1$ and
itself: $2, 3, 5, 7, 11, 13, \dots$. Note $2$ is the only even prime, and $1$ is
**not** prime.

Every integer greater than $1$ has a unique **prime factorization**:
$$ 360 = 2^3 \cdot 3^2 \cdot 5. $$
This factorization is the key that unlocks most number-theory questions.

### Counting divisors

If $n = p_1^{a_1} p_2^{a_2}\cdots p_k^{a_k}$, then the number of positive divisors is
$$ d(n) = (a_1+1)(a_2+1)\cdots(a_k+1). $$
For $360 = 2^3\cdot 3^2 \cdot 5^1$ that is $(3+1)(2+1)(1+1) = 24$ divisors.

The **sum** of the divisors factors the same way:
$$ \sigma(360) = (1+2+4+8)(1+3+9)(1+5) = 15\cdot 13\cdot 6. $$

## 3. GCD and LCM

The **greatest common divisor** $\gcd(a,b)$ is the largest integer dividing both;
the **least common multiple** $\operatorname{lcm}(a,b)$ is the smallest positive
multiple of both. A fact worth memorizing:
$$ \gcd(a,b)\cdot \operatorname{lcm}(a,b) = a\cdot b. $$

To compute a GCD quickly, use the **Euclidean algorithm** — repeatedly replace the
larger number by its remainder modulo the smaller:
$$ \gcd(1071, 462)=\gcd(462,147)=\gcd(147,21)=21. $$

## 4. Modular arithmetic and remainders

Write $a \equiv r \pmod{m}$ when $a$ and $r$ leave the same remainder upon division
by $m$. Remainders add and multiply just like ordinary numbers:
$$ 100 \equiv 2 \pmod 7, \qquad 2^{100} = (2^3)^{33}\cdot 2 \equiv 1^{33}\cdot 2 = 2 \pmod 7. $$
The trick above — find a small power that is $\equiv 1$, then reduce the exponent —
solves most "remainder of a big power" problems.

## 5. Units digits and cycles

The units digit of a power repeats in a short cycle. For powers of $7$:
$$ 7^1=7,\; 7^2=49,\; 7^3=343,\; 7^4=2401,\dots \to 7,9,3,1,7,9,3,1,\dots $$
a cycle of length $4$. So the units digit of $7^{100}$ is the $4^{\text{th}}$ entry
($100$ is a multiple of $4$): a $1$.

## 6. Trailing zeros and factorials

The number of trailing zeros of $n!$ equals the number of factors of $5$ it contains:
$$ \left\lfloor \tfrac{n}{5}\right\rfloor + \left\lfloor \tfrac{n}{25}\right\rfloor + \cdots $$
For $100!$ that is $20 + 4 = 24$ trailing zeros.

---

**Now practice.** The session below picks problems near your current rating: get one
right and it nudges harder, miss one and it eases off. Aim for a streak where about
two-thirds feel solvable — that is the sweet spot for improvement.
