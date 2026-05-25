import { type Editor, useEditorState } from "@tiptap/react";
import {
	BoldIcon,
	CheckSquareIcon,
	CodeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	QuoteIcon,
	StrikethroughIcon,
} from "lucide-react";
import { memo } from "react";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

interface IMarkdownEditorToolbarProps {
	editor: Editor;
}

export const MarkdownEditorToolbar = memo(
	({ editor }: IMarkdownEditorToolbarProps) => {
		const state = useEditorState({
			editor,
			selector: ({ editor: e }) => ({
				isBold: e.isActive("bold"),
				isItalic: e.isActive("italic"),
				isStrike: e.isActive("strike"),
				isCode: e.isActive("code"),
				isHeading1: e.isActive("heading", { level: 1 }),
				isHeading2: e.isActive("heading", { level: 2 }),
				isHeading3: e.isActive("heading", { level: 3 }),
				isBulletList: e.isActive("bulletList"),
				isOrderedList: e.isActive("orderedList"),
				isTaskList: e.isActive("taskList"),
				isBlockquote: e.isActive("blockquote"),
			}),
		});

		return (
			<div className="flex flex-wrap items-center gap-0.5">
				{/* Inline formatting */}
				<Toggle
					size="sm"
					pressed={state.isBold}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
					aria-label="Bold"
				>
					<BoldIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isItalic}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
					aria-label="Italic"
				>
					<ItalicIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isStrike}
					onPressedChange={() => editor.chain().focus().toggleStrike().run()}
					aria-label="Strikethrough"
				>
					<StrikethroughIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isCode}
					onPressedChange={() => editor.chain().focus().toggleCode().run()}
					aria-label="Inline code"
				>
					<CodeIcon />
				</Toggle>

				<Separator orientation="vertical" />

				<Toggle
					size="sm"
					pressed={state.isHeading1}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					aria-label="Heading 1"
				>
					<Heading1Icon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isHeading2}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					aria-label="Heading 2"
				>
					<Heading2Icon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isHeading3}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					aria-label="Heading 3"
				>
					<Heading3Icon />
				</Toggle>

				<Separator orientation="vertical" />

				{/* Lists */}
				<Toggle
					size="sm"
					pressed={state.isBulletList}
					onPressedChange={() =>
						editor.chain().focus().toggleBulletList().run()
					}
					aria-label="Bullet list"
				>
					<ListIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isOrderedList}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
					aria-label="Ordered list"
				>
					<ListOrderedIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isTaskList}
					onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
					aria-label="Task list"
				>
					<CheckSquareIcon />
				</Toggle>

				<Toggle
					size="sm"
					pressed={state.isBlockquote}
					onPressedChange={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
					aria-label="Blockquote"
				>
					<QuoteIcon />
				</Toggle>
			</div>
		);
	},
);
