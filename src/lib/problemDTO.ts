import type { Problem } from "@/generated/prisma/client";
import type { ProblemType } from "@/lib/checkAnswer";

// Client-facing shape of a problem. Crucially this OMITS `answer` and
// `solutionMarkdown` so correct answers never reach the browser before
// submission.
export interface PublicProblem {
  id: string;
  type: ProblemType;
  statementMarkdown: string;
  choices: string[] | null;
  rating: number;
}

export function toPublicProblem(p: Problem): PublicProblem {
  return {
    id: p.id,
    type: p.type as ProblemType,
    statementMarkdown: p.statementMarkdown,
    choices: p.choices ? (JSON.parse(p.choices) as string[]) : null,
    rating: p.rating,
  };
}
