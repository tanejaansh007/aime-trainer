# Triangle Area

One quantity, several formulas — pick the one that matches what you are given. The
tiers move from the basic base-height formula to Heron's and the circumradius /
inradius formulas.

<!--band:t1-->
## Tier 1 · AMC 8 Intro

**Base times height.**
$$ \text{Area} = \tfrac12 \, b h, $$
where $h$ is the perpendicular height to the chosen base $b$. For a right triangle
the two legs are a base–height pair, so the area is $\tfrac12 (\text{leg})(\text{leg})$.

<!--band:t2-->
## Tier 2 · AMC 8 Developing

**Finding the height.** When the height is not given, recover it with the
Pythagorean Theorem (drop an altitude) or read it off a coordinate grid. Then apply
$\tfrac12 bh$ as usual.

<!--band:t3-->
## Tier 3 · AMC 8 Proficient

**Heron's formula.** When you know all three sides $a, b, c$ but no height, let
$s = \dfrac{a+b+c}{2}$ (the semiperimeter). Then
$$ \text{Area} = \sqrt{s(s-a)(s-b)(s-c)}. $$

<!--band:t4-->
## Tier 4 · AMC 8 Advanced

Two more formulas connect a triangle's area to its circle radii, with
$s$ the semiperimeter:

- **Inradius:** $\text{Area} = r s$, where $r$ is the radius of the inscribed circle.
- **Circumradius:** $\text{Area} = \dfrac{abc}{4R}$, where $R$ is the radius of the circumscribed circle.

<!--band:t5-->
## Tier 5 · AMC 8 Expert

**Choosing and combining.** The hardest problems make you pick the right formula (or
chain two of them — e.g. use Heron's to get the area, then $\text{Area}=rs$ to solve
for the inradius) and often finish with an area **ratio** between related triangles.
