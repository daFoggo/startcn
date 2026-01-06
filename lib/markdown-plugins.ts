import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const remarkPlugins = [remarkGfm, remarkMath];
export const rehypePlugins = [rehypeKatex];
