# Divisibility Rules

Divisibility rules let you check whether one number divides another *without actually
dividing*. This set uses the rules for $2, 3, 4, 5, 6, 8, 9, 10,$ and $11$ — first
applying one at a time, then combining two of them, and finally solving digit puzzles
where two rules pin down two unknown digits at once.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

The rules split into three families:

| Divisor | Test |
|---|---|
| $2$ | last digit is even |
| $5$ | last digit is $0$ or $5$ |
| $10$ | last digit is $0$ |
| $4$ | last **two** digits form a multiple of $4$ |
| $8$ | last **three** digits form a multiple of $8$ |
| $3$ | digit sum is a multiple of $3$ |
| $9$ | digit sum is a multiple of $9$ |
| $6$ | passes **both** the $2$ and the $3$ tests |
| $11$ | alternating sum of digits is a multiple of $11$ |

**Worked example (last digits).** *Is $5128$ divisible by $8$?*
Look only at the last three digits: $128 = 8\cdot 16$, so **yes**.

**Worked example (digit sum).** *Which of $4275$, $3310$, $6148$ is divisible by $9$?*
Their digit sums are $18$, $7$, and $19$. Only $18$ is a multiple of $9$, so
$\mathbf{4275}$.

**Worked example (alternating sum).** *Is $7163$ divisible by $11$?*
Alternate signs from the right: $3 - 6 + 1 - 7 = -9$. That is not a multiple of $11$,
so **no**.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Solving for a missing digit.** When a blank makes a number divisible by $9$ (or
$3$), the digit sum must land on a multiple of $9$ (or $3$). Set up the digit sum and
solve for the blank.

**Worked example.** *For which digit $d$ is $\overline{82d4}$ divisible by $9$?*
The digit sum is $8 + 2 + d + 4 = 14 + d$. For divisibility by $9$ we need
$14 + d \equiv 0 \pmod 9$, so $d = \mathbf{4}$ (making the sum $18$).

**Combining two rules.** "Divisible by both $A$ and $B$" is the same as "divisible by
$\operatorname{lcm}(A,B)$." Find that single number and search for its multiples.

**Worked example.** *What is the smallest three-digit number divisible by both $6$ and
$8$?*
$\operatorname{lcm}(6,8) = 24$. The smallest three-digit multiple of $24$ is
$24\cdot 5 = \mathbf{120}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Divisibility meets counting.** A digit-sum rule can *guarantee* one condition for
free. For example, a digit sum of $12$ is automatically a multiple of $3$, so among
numbers with that digit sum, being a multiple of $6$ only requires being **even** —
turning the problem into counting digit combinations with an even last digit.

**Inclusion-exclusion.** To count numbers up to $N$ divisible by $A$ **or** $B$, add
the two counts and subtract the overlap (multiples of the LCM), so you don't
double-count:

$$\left\lfloor\tfrac{N}{A}\right\rfloor + \left\lfloor\tfrac{N}{B}\right\rfloor - \left\lfloor\tfrac{N}{\operatorname{lcm}(A,B)}\right\rfloor.$$

**Worked example.** *For how many integers $n$ from $1$ to $120$ is $n$ divisible by
$4$ or $6$?*
$\left\lfloor\tfrac{120}{4}\right\rfloor + \left\lfloor\tfrac{120}{6}\right\rfloor -
\left\lfloor\tfrac{120}{12}\right\rfloor = 30 + 20 - 10 = \mathbf{40}$.

**Two unknown digits, two rules.** For divisibility by a number like $36 = 4\cdot 9$,
use each rule to restrict a different blank: the **last-digits** rule pins down a
short list for one blank, and the **digit-sum** rule then fixes the other. Check the
surviving combinations.

**Worked example.** *How many numbers $\overline{4x7y}$ are divisible by $36$?*
Divisibility by $4$ needs the last two digits $\overline{7y}$ to be a multiple of $4$,
giving $y \in \{2, 6\}$. Divisibility by $9$ needs $4 + x + 7 + y = 11 + x + y \equiv 0
\pmod 9$. For $y = 2$ that forces $x = 5$; for $y = 6$ it forces $x = 1$. So there are
$\mathbf{2}$ such numbers ($4572$ and $4176$).
