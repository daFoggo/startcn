import { ArrowUp, Loader2 } from "lucide-react";
import { memo } from "react";
import { InputGroupButton } from "@/components/ui/input-group";

interface IMarkdownEditorFooterProps {
	onSubmit: () => void;
	isPending?: boolean;
	disabled?: boolean;
}

export const MarkdownEditorFooter = memo(
	({ onSubmit, isPending, disabled }: IMarkdownEditorFooterProps) => {
		return (
			<div className="flex justify-end w-full">
				<InputGroupButton
					type="button"
					variant="default"
					size="icon-sm"
					disabled={disabled || isPending}
					onClick={onSubmit}
					aria-label="Submit"
				>
					{isPending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
				</InputGroupButton>
			</div>
		);
	},
);
