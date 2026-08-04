# Digits & Number Bases

Digit problems and base arithmetic share the same foundation: **place value**. A
digit's contribution to a number depends on its position. In base $10$ the tens
digit is multiplied by $10$; in base $3$ that same position is multiplied by $3$.
Mastering one makes the other natural.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Place value in base 10.** The two-digit number $\overline{AB}$ means $10A + B$
(where $A$ and $B$ are single digits, $A \ne 0$). The three-digit number
$\overline{ABC}$ means $100A + 10B + C$.

**Digit sum and digit product.** These come up constantly:
digit sum of $374$ is $3+7+4 = 14$; digit product is $3\times7\times4 = 84$.

**Digit puzzles.** "A two-digit number equals five times the sum of its digits."
Write it as $10A + B = 5(A+B)$, expand to $5A = 4B$, and list the single-digit
solutions: $A=4, B=5$ gives $45$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Reversed digits.** If $\overline{AB}$ is the original number, its reversal is
$\overline{BA} = 10B + A$. Their difference is $(10A+B)-(10B+A) = 9(A-B)$ —
always a multiple of $9$. Their sum is $11(A+B)$ — always a multiple of $11$.

**Swapping digits changes the number predictably.** Use this to set up equations
when the problem gives you a relationship between a number and its reversal.

**Reading bases.** In base $b$, the number $\overline{d_n d_{n-1} \cdots d_1 d_0}_b$
equals $d_n b^n + \cdots + d_1 b + d_0$. The digits must each be less than $b$.

$\overline{132}_5 = 1\cdot25 + 3\cdot5 + 2 = 42_{10}$.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Converting to base 10.** Expand using place values:
$\overline{1011}_2 = 8+0+2+1 = 11_{10}$.

**Converting from base 10.** Repeatedly divide by $b$ and record remainders
(bottom-to-top gives the base-$b$ digits):
$42 \div 5 = 8\ R\ 2$; $8 \div 5 = 1\ R\ 3$; $1 \div 5 = 0\ R\ 1$. So $42_{10} = \overline{132}_5$.

**Cryptarithmetic.** Letter-substitution addition problems (like $\text{SEND}+\text{MORE}=\text{MONEY}$
on AMC 8 scale). Each letter is a distinct digit $0$–$9$; use carrying rules and
constraints (leading digits $\ne 0$) to narrow possibilities.

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

**Arithmetic in other bases.** Add or multiply directly in base $b$: carry when a
column sum reaches $b$ (not $10$).
$\overline{34}_5 + \overline{23}_5$: units $4+3=7=1\cdot5+2$, write $2$ carry $1$;
fives $3+2+1=6=1\cdot5+1$, write $1$ carry $1$; result $\overline{112}_5$.

**Same number, two bases.** "The base-$6$ representation of $n$ is $\overline{AB}_6$
and the base-$9$ is $\overline{BA}_9$." Set up $6A+B = 9B+A$ → $5A = 8B$ and find
single-digit solutions satisfying both base constraints.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Counting digits in a base.** A positive integer $n$ has $\lfloor\log_b n\rfloor + 1$
digits in base $b$. Since logs aren't on AMC 8, use powers: $n$ has $k$ digits in
base $b$ iff $b^{k-1} \le n < b^k$. How many integers from $1$ to $100$ have
exactly $3$ digits in base $4$? Need $16 \le n \le 63$: that's $48$ integers.

**Multi-base constraints.** Problems that give two different base representations
of the same number reduce to a Diophantine equation in the digits. Solve by
checking all digit combinations that satisfy both the equation and the per-base
digit bounds.
