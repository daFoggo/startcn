import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { useProjectMutations } from "../queries";
import type { TProject } from "../schemas";
import { CreateProjectSchema, type TCreateProjectInput } from "../schemas";

interface ICreateProjectDialogProps {
	open: boolean;
	teamId: string;
	onOpenChange: (open: boolean) => void;
	onCreated?: (project: TProject) => void;
}

/**
 * Dialog thông tin để khởi tạo một Project mới trong Team hiện tại.
 */
export const CreateProjectDialog = ({
	open,
	teamId,
	onOpenChange,
	onCreated,
}: ICreateProjectDialogProps) => {
	const { create } = useProjectMutations();

	const form = useForm({
		defaultValues: {
			team_id: teamId,
			name: "",
			description: "",
			avatar_url: undefined,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		} as TCreateProjectInput,
		validators: {
			onSubmit: CreateProjectSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const payload: TCreateProjectInput = {
					...value,
					team_id: teamId,
				};

				const project = await create.mutateAsync(payload);
				toast.success("Project created successfully");
				onCreated?.(project);
				onOpenChange(false);
				form.reset();
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to create project"));
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
						<DialogTitle>Create new project</DialogTitle>
						<DialogDescription>
							Projects are where your tasks, views, and workflows are managed.
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
										<FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Website Revamp"
											aria-invalid={isInvalid}
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="What is this project about?"
											className="min-h-25 resize-none"
											aria-invalid={isInvalid}
										/>
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
							disabled={create.isPending}
						>
							Cancel
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting || create.isPending}
								>
									{isSubmitting || create.isPending ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											<span>Creating...</span>
										</>
									) : (
										<>
											<Plus className="size-4" />
											<span>Create Project</span>
										</>
									)}
								</Button>
							)}
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
