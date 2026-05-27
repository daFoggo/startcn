import "./styles.css";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "@tiptap/markdown";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { markdownContentClassName } from "@/components/common/markdown-renderer";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MarkdownEditorFooter } from "./footer";
import { MarkdownEditorToolbar } from "./toolbar";

interface IMarkdownEditorProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	// Core
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;

	// Targeted classNames
	containerClassName?: string; // InputGroup wrapper
	contentClassName?: string; // scrollable div wrapping EditorContent — put max-h / overflow here
	editorClassName?: string; // .ProseMirror node (the actual tiptap div)
	headerClassName?: string; // InputGroupAddon block-start
	footerClassName?: string; // InputGroupAddon block-end

	// Toolbar header — set showToolbar={false} to hide
	showToolbar?: boolean;

	// Footer — shown only when onSubmit is provided; hide with showFooter={false}
	onSubmit?: () => void;
	showFooter?: boolean;
	isSubmitPending?: boolean;
	isSubmitDisabled?: boolean;

	// Escape hatch: override the entire header or footer slot
	header?: React.ReactNode;
	footer?: React.ReactNode;

	// Keyboard shortcut
	onModEnter?: (value: string) => void;
}

export const MarkdownEditor = ({
	value,
	onChange,
	placeholder = "Write markdown...",
	disabled,
	readOnly,
	containerClassName,
	contentClassName,
	editorClassName,
	headerClassName,
	footerClassName,
	showToolbar = true,
	onSubmit,
	showFooter = true,
	isSubmitPending,
	isSubmitDisabled,
	header,
	footer,
	onBlur,
	onModEnter,
	id,
	"aria-invalid": ariaInvalid,
	...props
}: IMarkdownEditorProps) => {
	const editorRef = useRef<Editor | null>(null);
	const lastMarkdownRef = useRef(value);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Typography,
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({ placeholder }),
			Markdown.configure({
				markedOptions: { gfm: true, breaks: false },
			}),
		],
		content: value || "",
		contentType: "markdown",
		editable: !disabled && !readOnly,
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				id: id ?? "",
				"aria-invalid": ariaInvalid ? "true" : "false",
				class: cn(
					markdownContentClassName,
					"min-h-32 px-3 py-2 outline-none",
					"[&_.is-empty:first-child::before]:pointer-events-none [&_.is-empty:first-child::before]:float-left [&_.is-empty:first-child::before]:h-0 [&_.is-empty:first-child::before]:text-muted-foreground [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]",
					disabled || readOnly ? "cursor-not-allowed opacity-60" : "",
					editorClassName,
				),
			},
			handleDOMEvents: {
				blur: (_view, event) => {
					onBlur?.(event as unknown as React.FocusEvent<HTMLDivElement>);
					return false;
				},
			},
			handleKeyDown: (_view, event) => {
				if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
					const markdown = editorRef.current?.getMarkdown() ?? value;
					onModEnter?.(markdown);
					return !!onModEnter;
				}
				return false;
			},
		},
		onUpdate: ({ editor }) => {
			queueMicrotask(() => {
				const markdown = editor.getMarkdown();
				lastMarkdownRef.current = markdown;
				onChange(markdown);
			});
		},
	});

	useEffect(() => {
		editorRef.current = editor;
	}, [editor]);

	useEffect(() => {
		editor?.setEditable(!disabled && !readOnly);
	}, [disabled, editor, readOnly]);

	useEffect(() => {
		if (!editor) return;
		if (value === lastMarkdownRef.current) return;
		lastMarkdownRef.current = value;
		editor.commands.setContent(value || "", {
			contentType: "markdown",
			emitUpdate: false,
		});
	}, [editor, value]);

	// Resolve what to render in the header slot
	const resolvedHeader =
		header ??
		(showToolbar && editor ? <MarkdownEditorToolbar editor={editor} /> : null);

	// Resolve what to render in the footer slot
	const resolvedFooter =
		footer ??
		(showFooter && onSubmit ? (
			<MarkdownEditorFooter
				onSubmit={onSubmit}
				isPending={isSubmitPending}
				disabled={isSubmitDisabled ?? !value.trim()}
			/>
		) : null);

	// Skeleton while editor initialises (editor === null on first render)
	if (!editor) {
		return (
			<InputGroup
				className={cn("h-auto items-stretch", containerClassName)}
				{...props}
			>
				<div className={cn("min-w-0 flex-1", contentClassName)}>
					<div className="flex flex-col gap-2 px-3 py-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-5/6" />
					</div>
				</div>

				{resolvedHeader !== null && (
					<InputGroupAddon
						align="block-start"
						className={cn("select-none", headerClassName)}
					>
						<Skeleton className="h-8 w-full" />
					</InputGroupAddon>
				)}

				{resolvedFooter !== null && (
					<InputGroupAddon
						align="block-end"
						className={cn("select-none", footerClassName)}
					>
						<div className="flex justify-end px-3 py-2">
							<Skeleton className="h-8 w-20" />
						</div>
					</InputGroupAddon>
				)}
			</InputGroup>
		);
	}

	return (
		<InputGroup
			className={cn("h-auto items-stretch", containerClassName)}
			{...props}
		>
			{/* EditorContent must come first in DOM for correct focus handling */}
			{/* contentClassName goes here — this is the scroll boundary */}
			<div className={cn("min-w-0 flex-1 select-text", contentClassName)}>
				<EditorContent editor={editor} />
			</div>

			{resolvedHeader && (
				<InputGroupAddon
					align="block-start"
					className={cn("select-none", headerClassName)}
				>
					{resolvedHeader}
				</InputGroupAddon>
			)}

			{resolvedFooter && (
				<InputGroupAddon
					align="block-end"
					className={cn("select-none", footerClassName)}
				>
					{resolvedFooter}
				</InputGroupAddon>
			)}
		</InputGroup>
	);
};
