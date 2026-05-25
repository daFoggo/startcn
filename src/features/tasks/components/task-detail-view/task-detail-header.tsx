import type { AnyFieldApi } from "@tanstack/react-form";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TTask, TTaskDetailFormApi } from "../../schemas";

interface TaskDetailHeaderProps {
	task?: TTask;
	form: TTaskDetailFormApi;
	canSubmit: boolean;
	isPending: boolean;
	canManageTasks?: boolean;
	onBack: () => void;
	onOpenDeleteDialog: () => void;
}

export const TaskDetailHeader = ({
	task,
	form,
	canSubmit,
	isPending,
	canManageTasks = true,
	onBack,
	onOpenDeleteDialog,
}: TaskDetailHeaderProps) => {
	return (
		<CardHeader className="border-b">
			<CardTitle className="flex flex-1 items-center gap-2 overflow-hidden py-0.5">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={onBack}
					className="shrink-0"
					aria-label="Back to tasks"
				>
					<ArrowLeft className="size-4" />
				</Button>
				<form.Field name="title">
					{(field: AnyFieldApi) => (
						<div className="w-full max-w-lg">
							<Input
								id={field.name}
								autoFocus
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={task ? "Edit task title" : "New task title"}
								readOnly={!canManageTasks}
								className="w-full border-none bg-transparent! text-lg font-semibold transition-colors outline-none hover:bg-muted!"
							/>
						</div>
					)}
				</form.Field>
			</CardTitle>
			<CardAction className="flex h-auto items-center gap-2">
				<form.Subscribe
					selector={(state: any) => [state.canSubmit, state.isSubmitting]}
				>
					{(state: any[]) => {
						const [formCanSubmit, isSubmitting] = state as [boolean, boolean];
						const shouldDisable =
							!canSubmit || !formCanSubmit || isPending || isSubmitting;

						if (!canManageTasks) {
							return null;
						}

						if (!task) {
							return (
								<Button type="submit" size="sm" disabled={shouldDisable}>
									{isPending ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Save className="size-4" />
									)}
									Create Task
								</Button>
							);
						}

						return (
							<div className="flex items-center gap-2">
								{isPending ? (
									<Button
										type="button"
										variant="ghost"
										className="flex animate-in items-center gap-2 text-xs font-medium text-muted-foreground duration-500 select-none fade-in"
									>
										<Loader2 className="size-3.5 animate-spin" />
										<span>Saving changes...</span>
									</Button>
								) : null}
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={onOpenDeleteDialog}
								>
									<Trash2 className="size-4" />
									Delete
								</Button>
							</div>
						);
					}}
				</form.Subscribe>
			</CardAction>
		</CardHeader>
	);
};
