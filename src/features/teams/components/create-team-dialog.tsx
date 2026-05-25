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
import { useTeamMutations } from "../queries";
import type { TTeam } from "../schemas";
import { CreateTeamSchema, type TCreateTeamInput } from "../schemas";

interface ICreateTeamDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: (team: TTeam) => void;
}

/**
 * Dialog thông tin để khởi tạo một Team mới trong hệ thống.
 */
export const CreateTeamDialog = ({
	open,
	onOpenChange,
	onCreated,
}: ICreateTeamDialogProps) => {
	const { create } = useTeamMutations();

	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
			avatar_url: "",
		} as TCreateTeamInput,
		validators: {
			onSubmit: CreateTeamSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const team = await create.mutateAsync(value);
				toast.success("Team created successfully");
				onCreated?.(team);
				onOpenChange(false);
				form.reset();
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to create team"));
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
						<DialogTitle>Create new team</DialogTitle>
						<DialogDescription>
							Teams are where your projects live. You can invite members later.
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
										<FieldLabel htmlFor={field.name}>Team Name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Acme Marketing"
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
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="What does this team do?"
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
											<span>Create Team</span>
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
