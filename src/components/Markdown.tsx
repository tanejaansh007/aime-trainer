"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

// Renders markdown that may contain inline ($…$) and display ($$…$$) LaTeX,
// using KaTeX (via rehype-katex). rehypeRaw allows trusted inline HTML/SVG in
// the content (used for geometry diagrams); it runs before rehypeKatex so raw
// nodes are parsed into the tree before math is rendered. Content is authored
// by us (never user input), so raw HTML is safe here.
// Shared by the lesson, practice, and review UIs.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
