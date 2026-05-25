import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { TaskTypeCreateSchema, type TTaskTypeCreateInput } from "../../schemas";

interface ICreateTaskTypeDialogProps {
	projectId: string;
	nextOrder: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const CreateTaskTypeDialog = ({
	projectId,
	nextOrder,
	open,
	onOpenChange,
}: ICreateTaskTypeDialogProps) => {
	const { createType } = useTaskConfigMutations();
	const form = useForm({
		defaultValues: {
			name: "",
			color: TAILWIND_500_COLORS.gray,
			icon: "",
			order: nextOrder,
			is_default: false,
		} as TTaskTypeCreateInput,
		validators: {
			onSubmit: TaskTypeCreateSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createType.mutateAsync({ projectId, payload: value });
				toast.success("Task type created successfully");
				onOpenChange(false);
				form.reset();
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to create task type"));
				console.error(error);
			}
		},
	});

	useEffect(() => {
		if (!open) return;
		form.setFieldValue("order", nextOrder);
	}, [open, nextOrder, form]);

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
						<DialogTitle>Create new task type</DialogTitle>
						<DialogDescription>
							Add a new type to classify tasks in your project.
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
										<FieldLabel htmlFor={field.name}>Type Name</FieldLabel>
										<Input
											id={field.name}
											autoFocus
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Bug"
											aria-invalid={isInvalid}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="icon"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Icon</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. CircleDot"
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

						<form.Field
							name="order"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Order</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="number"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(parseInt(e.target.value, 10))
											}
											placeholder="0"
											aria-invalid={isInvalid}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="is_default"
							children={(field) => (
								<div className="flex items-center gap-2">
									<Checkbox
										id={field.name}
										checked={field.state.value}
										onCheckedChange={(checked) =>
											field.handleChange(checked as boolean)
										}
									/>
									<FieldLabel htmlFor={field.name} className="mb-0">
										Set as default type
									</FieldLabel>
								</div>
							)}
						/>
					</FieldGroup>

					<DialogFooter>
						<Button
							type="button"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							disabled={createType.isPending}
						>
							Cancel
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit]) => (
								<Button
									type="submit"
									disabled={!canSubmit || createType.isPending}
								>
									{createType.isPending && (
										<Loader2 className="mr-2 size-4 animate-spin" />
									)}
									Create Type
								</Button>
							)}
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
