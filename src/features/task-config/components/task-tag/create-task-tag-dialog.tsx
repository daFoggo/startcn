import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
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
import {
	TAILWIND_500_COLORS,
	TAILWIND_COLOR_OPTIONS,
} from "@/constants/color-options";
import { getErrorMessage } from "@/lib/error";
import { useTaskConfigMutations } from "../../queries";
import { TaskTagCreateSchema, type TTaskTagCreateInput } from "../../schemas";

interface ICreateTaskTagDialogProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const CreateTaskTagDialog = ({
	projectId,
	open,
	onOpenChange,
}: ICreateTaskTagDialogProps) => {
	const { createTag } = useTaskConfigMutations();
	const form = useForm({
		defaultValues: {
			name: "",
			color: TAILWIND_500_COLORS.gray,
		} as TTaskTagCreateInput,
		validators: { onSubmit: TaskTagCreateSchema },
		onSubmit: async ({ value }) => {
			try {
				await createTag.mutateAsync({ projectId, payload: value });
				toast.success("Task tag created successfully");
				onOpenChange(false);
				form.reset();
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to create task tag"));
				console.error(error);
			}
		},
	});

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
						<DialogTitle>Create new task tag</DialogTitle>
						<DialogDescription>
							Add a new tag to classify tasks.
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
							disabled={createTag.isPending}
						>
							Cancel
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit]) => (
								<Button
									type="submit"
									disabled={!canSubmit || createTag.isPending}
								>
									{createTag.isPending && (
										<Loader2 className="mr-2 size-4 animate-spin" />
									)}
									Create Tag
								</Button>
							)}
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
