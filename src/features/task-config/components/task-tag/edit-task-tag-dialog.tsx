import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TAILWIND_COLOR_OPTIONS } from "@/constants/color-options";
import { getErrorMessage } from "@/lib/error";
import { useTaskConfigMutations } from "../../queries";
import {
	TaskTagUpdateSchema,
	type TTaskTag,
	type TTaskTagUpdateInput,
} from "../../schemas";

interface IEditTaskTagDialogProps {
	tag: TTaskTag;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const EditTaskTagDialog = ({
	tag,
	open,
	onOpenChange,
}: IEditTaskTagDialogProps) => {
	const { updateTag } = useTaskConfigMutations();
	const form = useForm({
		defaultValues: { name: tag.name, color: tag.color } as TTaskTagUpdateInput,
		validators: { onSubmit: TaskTagUpdateSchema },
		onSubmit: async ({ value }) => {
			try {
				await updateTag.mutateAsync({
					projectId: tag.project_id,
					tagId: tag.id,
					payload: value,
				});
				toast.success("Task tag updated successfully");
				onOpenChange(false);
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to update task tag"));
				console.error(error);
			}
		},
	});

	useEffect(() => {
		if (open) form.reset();
	}, [open, form.reset]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:min-w-xl">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>Edit task tag</DialogTitle>
						<DialogDescription>
							Update the task tag information.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<form.Field
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tag Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Frontend"
											aria-invalid={isInvalid}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>
						<form.Field
							name="color"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Color</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={field.handleChange}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{TAILWIND_COLOR_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<div className="flex items-center gap-2">
															<div
																className="size-4 rounded-full"
																style={{ backgroundColor: option.value }}
															/>
															{option.label}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							disabled={updateTag.isPending}
						>
							Cancel
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit]) => (
								<Button
									type="submit"
									disabled={!canSubmit || updateTag.isPending}
								>
									{updateTag.isPending && (
										<Loader2 className="mr-2 size-4 animate-spin" />
									)}
									Update Tag
								</Button>
							)}
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
