import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { TTeamMember } from "@/features/team-members";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { getTeamPermissions } from "../permissions";
import { myTeamsQueryOptions, useTeamMutations } from "../queries";
import {
	CreateTeamSchema,
	type TCreateTeamInput,
	type TTeam,
} from "../schemas";
import { CreateTeamDialog } from "./create-team-dialog";
import { TeamDeleteDialog } from "./team-delete-dialog";

interface ITeamSettingsProps {
	teamId: string;
	team: TTeam;
	myTeams: TTeam[];
	currentUser?: TUser;
	members: TTeamMember[];
}

/**
 * Thành phần trang thiết lập Team.
 * Cho phép quản lý thông tin chung và thực hiện quy trình xóa Team an toàn.
 */
export const TeamSettings = ({
	teamId,
	team,
	myTeams,
	currentUser,
	members,
}: ITeamSettingsProps) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { update, remove } = useTeamMutations();
	const [updatingField, setUpdatingField] = useState<
		keyof TCreateTeamInput | null
	>(null);
	const [recentlyUpdatedField, setRecentlyUpdatedField] = useState<
		keyof TCreateTeamInput | null
	>(null);
	const recentlyUpdatedTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
	const [requiresTeamCreation, setRequiresTeamCreation] = useState(false);

	const isLastTeam = myTeams?.length === 1 && myTeams?.[0]?.id === teamId;
	const permissions = getTeamPermissions(members, currentUser?.id);

	useEffect(() => {
		return () => {
			if (recentlyUpdatedTimeoutRef.current) {
				clearTimeout(recentlyUpdatedTimeoutRef.current);
			}
		};
	}, []);

	const form = useForm({
		defaultValues: {
			name: team?.name || "",
			description: team?.description || "",
			avatar_url: team?.avatar_url || "",
		} as TCreateTeamInput,
		validators: {
			onSubmit: CreateTeamSchema,
		},
	});

	const handleFieldUpdate = async (fieldName: keyof TCreateTeamInput) => {
		if (update.isPending || !permissions.canManageTeam) {
			return;
		}

		setUpdatingField(fieldName);

		try {
			const value = form.getFieldValue(fieldName);
			await update.mutateAsync({
				teamId: teamId,
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

	const handleDeleteTeam = async () => {
		if (!permissions.canManageTeam) {
			return false;
		}

		if (isLastTeam) {
			setRequiresTeamCreation(true);
			setIsCreateTeamDialogOpen(true);
			toast.info("Create a new team first, then we will delete this one");
			return true;
		}

		try {
			await remove.mutateAsync(teamId);
			toast.success("Team deleted successfully");

			const teamsAfterDelete = await queryClient.fetchQuery(
				myTeamsQueryOptions(),
			);
			const nextTeam = teamsAfterDelete.find((item) => item.id !== teamId);

			if (nextTeam) {
				navigate({
					to: "/dashboard/$teamId/overview",
					params: { teamId: nextTeam.id },
					replace: true,
				});
			} else {
				setRequiresTeamCreation(true);
				setIsCreateTeamDialogOpen(true);
				setTimeout(() => {
					toast.info("Please create a new team to continue");
				}, 250);
			}
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to delete team"));
			return false;
		}
	};

	const handleCreatedAfterDelete = async (createdTeam: TTeam) => {
		if (requiresTeamCreation) {
			try {
				await remove.mutateAsync(teamId);
				toast.success("Team deleted successfully");
			} catch (error) {
				toast.error(
					getErrorMessage(
						error,
						"New team created, but failed to delete old team",
					),
				);
			}
		}

		setRequiresTeamCreation(false);
		setIsCreateTeamDialogOpen(false);
		navigate({
			to: "/dashboard/$teamId/overview",
			params: { teamId: createdTeam.id },
			replace: true,
		});
	};

	const handleCreateTeamDialogOpenChange = (open: boolean) => {
		if (!open && requiresTeamCreation) {
			return;
		}

		setIsCreateTeamDialogOpen(open);
	};

	if (!permissions.canManageTeam) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Access denied</AlertTitle>
				<AlertDescription>
					Only team owners can manage team settings.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="w-full space-y-8">
			<div className="max-w-xl">
				<FieldGroup className="gap-6">
					<SettingField
						form={form}
						name="name"
						label="Team Name"
						placeholder="e.g. Acme Marketing"
						originalValue={team?.name}
						isPending={update.isPending && updatingField === "name"}
						keepVisible={recentlyUpdatedField === "name"}
						disableAction={update.isPending || recentlyUpdatedField === "name"}
						onUpdate={() => handleFieldUpdate("name")}
					/>

					<SettingField
						form={form}
						name="avatar_url"
						label="Avatar URL"
						placeholder="https://example.com/icon.png"
						originalValue={team?.avatar_url || ""}
						isPending={update.isPending && updatingField === "avatar_url"}
						keepVisible={recentlyUpdatedField === "avatar_url"}
						disableAction={
							update.isPending || recentlyUpdatedField === "avatar_url"
						}
						onUpdate={() => handleFieldUpdate("avatar_url")}
					/>

					<SettingField
						form={form}
						name="description"
						label="Description"
						placeholder="Brief description about this team"
						originalValue={team?.description || ""}
						isPending={update.isPending && updatingField === "description"}
						keepVisible={recentlyUpdatedField === "description"}
						disableAction={
							update.isPending || recentlyUpdatedField === "description"
						}
						onUpdate={() => handleFieldUpdate("description")}
					/>
				</FieldGroup>
			</div>

			<Separator />

			<TeamDeleteDialog
				isPending={remove.isPending}
				isLastTeam={Boolean(isLastTeam)}
				onConfirm={handleDeleteTeam}
			/>

			<CreateTeamDialog
				open={isCreateTeamDialogOpen}
				onOpenChange={handleCreateTeamDialogOpenChange}
				onCreated={handleCreatedAfterDelete}
			/>
		</div>
	);
};

interface ISettingFieldProps {
	form: any;
	name: keyof TCreateTeamInput;
	label: string;
	placeholder: string;
	originalValue: string | undefined | null;
	isPending: boolean;
	keepVisible: boolean;
	disableAction: boolean;
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
							/>
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
						</div>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				);
			}}
		/>
	);
};
