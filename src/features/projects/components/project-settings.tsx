import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { TIMEZONES } from "@/constants/timezone";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { getProjectPermissions } from "../permissions";
import { useProjectMutations } from "../queries";
import {
	type TProject,
	type TUpdateProjectInput,
	UpdateProjectSchema,
} from "../schemas";
import { ProjectDeleteDialog } from "./project-delete-dialog";

interface IProjectSettingsProps {
	projectId: string;
	teamId: string;
	project: TProject;
	currentUser?: TUser;
}

/**
 * Thành phần quản lý cấu hình Project.
 * Hỗ trợ cập nhật thông tin chung (name, avatar) và cung cấp tính năng xóa dự án.
 */
export const ProjectSettings = ({
	projectId,
	teamId,
	project,
	currentUser,
}: IProjectSettingsProps) => {
	const navigate = useNavigate();
	const permissions = getProjectPermissions(project, currentUser?.id);
	const { update, remove } = useProjectMutations();
	const [updatingField, setUpdatingField] = useState<
		keyof TUpdateProjectInput | null
	>(null);
	const [recentlyUpdatedField, setRecentlyUpdatedField] = useState<
		keyof TUpdateProjectInput | null
	>(null);
	const recentlyUpdatedTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);

	useEffect(() => {
		return () => {
			if (recentlyUpdatedTimeoutRef.current) {
				clearTimeout(recentlyUpdatedTimeoutRef.current);
			}
		};
	}, []);

	const form = useForm({
		defaultValues: {
			name: project?.name || "",
			description: project?.description || "",
			avatar_url: project?.avatar_url || "",
			timezone:
				project?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
		} as TUpdateProjectInput,
		validators: {
			onSubmit: UpdateProjectSchema,
		},
	});

	const handleFieldUpdate = async (fieldName: keyof TUpdateProjectInput) => {
		if (update.isPending) {
			return;
		}

		setUpdatingField(fieldName);

		try {
			const value = form.getFieldValue(fieldName);
			await update.mutateAsync({
				projectId: projectId,
				payload: { [fieldName]: value },
			});

			if (recentlyUpdatedTimeoutRef.current) {
				clearTimeout(recentlyUpdatedTimeoutRef.current);
			}

			setRecentlyUpdatedField(fieldName);
			recentlyUpdatedTimeoutRef.current = setTimeout(() => {
				setRecentlyUpdatedField((current) =>
					current === fieldName ? null : current,
				);
			}, 800);

			toast.success(`Updated ${fieldName.replace("_", " ")}`);
		} catch (error) {
			toast.error(
				getErrorMessage(
					error,
					`Failed to update ${fieldName.replace("_", " ")}`,
				),
			);
		} finally {
			setUpdatingField((current) => (current === fieldName ? null : current));
		}
	};

	const handleDeleteProject = async () => {
		try {
			await remove.mutateAsync(projectId);
			toast.success("Project deleted successfully");

			navigate({
				to: "/dashboard/$teamId/overview",
				params: { teamId },
				replace: true,
			});
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete project"));
			return false;
		}
	};

	return (
		<div className="w-full space-y-8">
			<div className="max-w-xl">
				<FieldGroup className="gap-6">
					<SettingField
						form={form}
						name="name"
						label="Project Name"
						placeholder="e.g. Website Redesign"
						originalValue={project?.name}
						isPending={update.isPending && updatingField === "name"}
						keepVisible={recentlyUpdatedField === "name"}
						disableAction={update.isPending || recentlyUpdatedField === "name"}
						readOnly={!permissions.canManageProject}
						onUpdate={() => handleFieldUpdate("name")}
					/>

					<SettingField
						form={form}
						name="avatar_url"
						label="Avatar URL"
						placeholder="https://example.com/icon.png"
						originalValue={project?.avatar_url || ""}
						isPending={update.isPending && updatingField === "avatar_url"}
						keepVisible={recentlyUpdatedField === "avatar_url"}
						disableAction={
							update.isPending || recentlyUpdatedField === "avatar_url"
						}
						readOnly={!permissions.canManageProject}
						onUpdate={() => handleFieldUpdate("avatar_url")}
					/>

					<SettingField
						form={form}
						name="description"
						label="Description"
						placeholder="Brief description about this project"
						originalValue={project?.description || ""}
						isPending={update.isPending && updatingField === "description"}
						keepVisible={recentlyUpdatedField === "description"}
						disableAction={
							update.isPending || recentlyUpdatedField === "description"
						}
						readOnly={!permissions.canManageProject}
						onUpdate={() => handleFieldUpdate("description")}
					/>

					<SettingSelectField
						form={form}
						name="timezone"
						label="Timezone"
						options={TIMEZONES}
						originalValue={
							project?.timezone ||
							Intl.DateTimeFormat().resolvedOptions().timeZone
						}
						isPending={update.isPending && updatingField === "timezone"}
						keepVisible={recentlyUpdatedField === "timezone"}
						disableAction={
							update.isPending || recentlyUpdatedField === "timezone"
						}
						readOnly={!permissions.canManageProject}
						onUpdate={() => handleFieldUpdate("timezone")}
					/>
				</FieldGroup>
			</div>

			{permissions.canManageProject && <Separator />}

			{permissions.canManageProject && (
				<ProjectDeleteDialog
					isPending={remove.isPending}
					onConfirm={handleDeleteProject}
				/>
			)}
		</div>
	);
};

interface ISettingFieldProps {
	form: any;
	name: keyof TUpdateProjectInput;
	label: string;
	placeholder: string;
	originalValue: string | undefined | null;
	isPending: boolean;
	keepVisible: boolean;
	disableAction: boolean;
	readOnly?: boolean;
	onUpdate: () => void;
}

const SettingField = ({
	form,
	name,
	label,
	placeholder,
	originalValue,
	isPending,
	keepVisible,
	disableAction,
	readOnly = false,
	onUpdate,
}: ISettingFieldProps) => {
	return (
		<form.Field
			name={name}
			children={(field: any) => {
				const isInvalid =
					field.state.meta.isTouched && !!field.state.meta.errors.length;
				const isChanged = field.state.value !== (originalValue || "");
				const shouldShowAction = isChanged || keepVisible;

				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name} className="font-bold">
							{label}
						</FieldLabel>
						<div className="flex items-center gap-2">
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value as string}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder={placeholder}
								aria-invalid={isInvalid}
								readOnly={readOnly}
							/>
							{!readOnly && (
								<Button
									type="button"
									className={`w-20 justify-center ${!shouldShowAction ? "invisible" : ""}`}
									disabled={disableAction || !isChanged}
									onClick={onUpdate}
								>
									{isPending ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<span>Update</span>
									)}
								</Button>
							)}
						</div>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				);
			}}
		/>
	);
};

interface ISettingSelectFieldProps {
	form: any;
	name: keyof TUpdateProjectInput;
	label: string;
	options: { value: string; label: string }[];
	originalValue: string | undefined | null;
	isPending: boolean;
	keepVisible: boolean;
	disableAction: boolean;
	readOnly?: boolean;
	onUpdate: () => void;
}

const SettingSelectField = ({
	form,
	name,
	label,
	options,
	originalValue,
	isPending,
	keepVisible,
	disableAction,
	readOnly = false,
	onUpdate,
}: ISettingSelectFieldProps) => {
	return (
		<form.Field
			name={name}
			children={(field: any) => {
				const isInvalid =
					field.state.meta.isTouched && !!field.state.meta.errors.length;
				const isChanged = field.state.value !== (originalValue || "");
				const shouldShowAction = isChanged || keepVisible;

				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor={field.name} className="font-bold">
							{label}
						</FieldLabel>
						<div className="flex items-center gap-2">
							<Select
								value={(field.state.value as string) || ""}
								disabled={readOnly}
								onValueChange={(val) => field.handleChange(val)}
							>
								<SelectTrigger className="w-full h-8">
									<SelectValue placeholder="Select timezone..." />
								</SelectTrigger>
								<SelectContent>
									{options.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{!readOnly && (
								<Button
									type="button"
									className={`w-20 justify-center ${!shouldShowAction ? "invisible" : ""}`}
									disabled={disableAction || !isChanged}
									onClick={onUpdate}
								>
									{isPending ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<span>Update</span>
									)}
								</Button>
							)}
						</div>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				);
			}}
		/>
	);
};
