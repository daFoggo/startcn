import { toString as hastToString } from "hast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type MarkdownHeading = {
	id: string;
	text: string;
	level: number;
};

export type MarkdownResult = {
	markup: string;
	headings: Array<MarkdownHeading>;
};

export type RenderMarkdownOptions = {
	allowHtml?: boolean;
};

export async function renderMarkdown(
	content: string,
	options: RenderMarkdownOptions = {},
): Promise<MarkdownResult> {
	const headings: Array<MarkdownHeading> = [];
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: options.allowHtml ?? false });

	if (options.allowHtml) {
		processor.use(rehypeRaw);
	}

	const result = await processor
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: "wrap",
			properties: { className: ["anchor"] },
		})
		.use(() => (tree) => {
			visit(tree, "element", (node: any) => {
				if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
					headings.push({
						id: node.properties?.id || "",
						text: hastToString(node),
						level: Number.parseInt(node.tagName.charAt(1), 10),
					});
				}
			});
		})
		.use(rehypeStringify)
		.process(content);

	return {
		markup: String(result),
		headings,
	};
}
