import { IconAlertCircle as AlertCircle } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import parse, {
	type DOMNode,
	domToReact,
	Element,
	type HTMLReactParserOptions,
} from "html-react-parser";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import type { MarkdownResult, RenderMarkdownOptions } from "@/lib/markdown";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

interface IMarkdownRendererProps extends RenderMarkdownOptions {
	content: string;
	className?: string;
	contentClassName?: string;
	emptyContent?: React.ReactNode;
	renderHeader?: (headings: MarkdownResult["headings"]) => React.ReactNode;
}

export const markdownContentClassName = cn(
	"markdown-content max-w-none break-words text-sm leading-6 text-foreground",
	"[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
	"[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
	"[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
	"[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight",
	"[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight",
	"[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold",
	"[&_hr]:my-4 [&_hr]:border-border",
	"[&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border",
	"[&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
	"[&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3",
	"[&_pre_code]:bg-transparent [&_pre_code]:p-0",
	"[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1.5",
	"[&_th]:border [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left",
	"[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
);

export const MarkdownRenderer = ({
	content,
	className,
	contentClassName,
	emptyContent = (
		<span className="text-sm text-muted-foreground">Nothing written yet.</span>
	),
	renderHeader,
	allowHtml,
}: IMarkdownRendererProps) => {
	const [result, setResult] = useState<MarkdownResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		let isCurrent = true;

		const render = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const rendered = await renderMarkdown(content, { allowHtml });
				if (isCurrent) {
					setResult(rendered);
				}
			} catch (error) {
				if (isCurrent) {
					setError(error);
				}
			} finally {
				if (isCurrent) {
					setIsLoading(false);
				}
			}
		};

		render();

		return () => {
			isCurrent = false;
		};
	}, [allowHtml, content]);

	if (!content.trim()) {
		return <div className={className}>{emptyContent}</div>;
	}

	if (isLoading && !result) {
		return (
			<div className={cn("flex flex-col gap-2", className)}>
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
			</div>
		);
	}

	if (error && !result) {
		return (
			<div
				className={cn(
					"flex items-center gap-2 text-xs text-destructive",
					className,
				)}
			>
				<AlertCircle className="size-4 shrink-0" />
				<span>
					{getErrorMessage(error, "Failed to render markdown content.")}
				</span>
			</div>
		);
	}

	if (!result) return null;

	const parserOptions: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (!(domNode instanceof Element)) return;

			if (domNode.name === "a") {
				const href = domNode.attribs.href;

				if (href?.startsWith("/")) {
					return (
						<Link to={href}>
							{domToReact(domNode.children as DOMNode[], parserOptions)}
						</Link>
					);
				}
			}

			if (domNode.name === "img") {
				return (
					<img
						alt={domNode.attribs.alt ?? ""}
						loading="lazy"
						src={domNode.attribs.src}
						title={domNode.attribs.title}
					/>
				);
			}
		},
	};

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{renderHeader?.(result.headings)}
			<div className={cn(markdownContentClassName, contentClassName)}>
				{parse(result.markup, parserOptions)}
			</div>
		</div>
	);
};
