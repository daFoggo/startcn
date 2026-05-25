import { useForm } from "@tanstack/react-form";
import {
	AlertCircle,
	CalendarPlus,
	FileText,
	Loader2,
	Users,
	X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/common/date-picker";
import { MultiSelectCombobox } from "@/components/common/multi-select-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { TTeamMember } from "@/features/team-members";
import type { TUser } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import type { IBigCalendarEvent } from "@/types/big-calendar";
import { EVENT_TYPE_OPTIONS } from "../constants";
import { useEventMutations } from "../queries";
import {
	CreateEventBaseSchema,
	type TEventType,
	UpdateEventSchema,
} from "../schemas";

type TMode = "create" | "edit";

interface IEventActionBarProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event?: IBigCalendarEvent | null;
	teamId: string;
	currentUser?: TUser;
	teamMembers: TTeamMember[];
	isCurrentUserLoading?: boolean;
	isCurrentUserError?: boolean;
	currentUserError?: unknown;
	isTeamMembersLoading?: boolean;
	isTeamMembersError?: boolean;
	teamMembersError?: unknown;
	onSuccess?: () => void;
}

export const EventActionBar = ({
	open,
	onOpenChange,
	event,
	teamId,
	currentUser,
	teamMembers,
	isCurrentUserLoading = false,
	isCurrentUserError = false,
	currentUserError,
	isTeamMembersLoading = false,
	isTeamMembersError = false,
	teamMembersError,
	onSuccess,
}: IEventActionBarProps) => {
	const mode: TMode = event && !event.id.startsWith("new") ? "edit" : "create";
	const { create, update } = useEventMutations();
	const titleRef = useRef<HTMLInputElement>(null);

	const isDependencyLoading = isCurrentUserLoading || isTeamMembersLoading;
	const dependencyError = currentUserError ?? teamMembersError;
	const hasDependencyError = isCurrentUserError || isTeamMembersError;

	const form = useForm({
		defaultValues: {
			team_id: teamId,
			user_id: currentUser?.id || "",
			title: "",
			description: "" as string,
			type: "meeting" as TEventType,
			start_time: new Date(),
			end_time: new Date(Date.now() + 3_600_000),
			participant_ids: [] as string[],
		},
		validators: {
			onSubmit: (mode === "edit"
				? UpdateEventSchema
				: CreateEventBaseSchema) as any,
		},
		onSubmit: async ({ value }) => {
			// Manual check to be 100% sure title is present before sending to API
			if (!value.title || value.title.trim() === "") {
				toast.error("Tiêu đề không được để trống");
				return;
			}

			try {
				const payload = {
					...value,
					start_time:
						value.start_time instanceof Date
							? value.start_time.toISOString()
							: value.start_time,
					end_time:
						value.end_time instanceof Date
							? value.end_time.toISOString()
							: value.end_time,
				};

				if (mode === "edit" && event) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { user_id, team_id, ...updatePayload } = payload;
					await update.mutateAsync({
						eventId: event.id,
						payload: updatePayload as any,
					});
					toast.success("Event updated successfully");
				} else {
					await create.mutateAsync(payload as any);
					toast.success("Event created successfully");
				}

				onOpenChange(false);
				onSuccess?.();
			} catch (error) {
				toast.error(getErrorMessage(error));
			}
		},
	});

	useEffect(() => {
		if (open) {
			if (event) {
				form.reset({
					team_id: teamId,
					user_id: currentUser?.id || "",
					title: event.title || "",
					description: (event.meta?.description as string) || "",
					type: (event.meta?.type as TEventType) || "meeting",
					start_time: event.start ? new Date(event.start) : new Date(),
					end_time: event.end ? new Date(event.end) : new Date(),
					participant_ids: (event.meta?.participant_ids as string[]) || [],
				});
			} else {
				form.reset({
					team_id: teamId,
					user_id: currentUser?.id || "",
					title: "",
					description: "",
					type: "meeting",
					start_time: new Date(),
					end_time: new Date(Date.now() + 3_600_000),
					participant_ids: [],
				});
			}
			// Auto-focus title input
			requestAnimationFrame(() => titleRef.current?.focus());
		} else {
			form.reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		open,
		event?.id,
		currentUser?.id,
		form.reset,
		event?.meta?.type,
		teamId,
		event?.meta?.participant_ids,
		event,
	]);

	const isPending = create.isPending || update.isPending;
	const isSubmitDisabled =
		isPending ||
		isDependencyLoading ||
		hasDependencyError ||
		!teamId ||
		!currentUser?.id;

	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onOpenChange(false);
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [open, onOpenChange]);

	return (
		<>
			<div
				aria-hidden
				onClick={() => onOpenChange(false)}
				className={cn(
					"pointer-events-none fixed inset-0 z-40 transition-all duration-300",
					open && "pointer-events-auto",
				)}
			/>

			<div
				role="dialog"
				className={cn(
					"fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2",
					"cubic-bezier(0.16, 1, 0.3, 1) transition-all duration-300",
					open
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-10 opacity-0",
				)}
			>
				<div className="mx-auto">
					<div className="flex flex-col overflow-hidden rounded-xl border bg-popover">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
						>
							<div className="flex flex-col gap-0 p-4">
								<form.Field
									name="type"
									children={(field) => (
										<div className="flex items-center justify-between">
											<Tabs
												value={field.state.value}
												onValueChange={(v) =>
													field.handleChange(v as TEventType)
												}
												className="justify-start"
											>
												<TabsList variant="line">
													{EVENT_TYPE_OPTIONS.filter(
														(opt) => opt.value !== "task",
													).map((opt) => {
														const Icon = opt.icon;
														return (
															<TabsTrigger key={opt.value} value={opt.value}>
																<Icon
																	className={cn("size-3.5", opt.colorClass)}
																/>
																{opt.label}
															</TabsTrigger>
														);
													})}
												</TabsList>
											</Tabs>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="rounded-lg text-muted-foreground hover:text-foreground"
												onClick={() => onOpenChange(false)}
											>
												<X className="size-3.5" />
											</Button>
										</div>
									)}
								/>

								<div className="flex flex-col gap-2 pt-4">
									{isDependencyLoading && <Skeleton className="h-4 w-48" />}
									{hasDependencyError && (
										<div className="flex items-center gap-1.5 text-xs text-destructive">
											<AlertCircle className="size-3.5 shrink-0" />
											<span>
												{getErrorMessage(
													dependencyError,
													"Could not load event dependencies.",
												)}
											</span>
										</div>
									)}
									{/* ── Title Input ────────────────────────────────────────── */}
									<form.Field
										name="title"
										children={(field) => (
											<div className="px-1">
												{(() => {
													const titleError = field.state.meta.errors[0];
													const titleErrorMessage =
														typeof titleError === "string"
															? titleError
															: titleError?.message;

													return (
														<>
															<input
																ref={titleRef}
																name={field.name}
																value={field.state.value}
																onBlur={field.handleBlur}
																onChange={(e) =>
																	field.handleChange(e.target.value)
																}
																placeholder="Add title"
																className={cn(
																	"w-full bg-transparent text-base font-semibold",
																	"placeholder:text-muted-foreground/50",
																	"border-0 ring-0 outline-none",
																	field.state.meta.errors.length > 0 &&
																		"text-destructive placeholder:text-destructive/50",
																)}
															/>
															{titleErrorMessage && (
																<span className="text-xs font-medium text-destructive">
																	{titleErrorMessage}
																</span>
															)}
														</>
													);
												})()}
											</div>
										)}
									/>

									{/* ── Date & Time Row ────────────────────────────────────── */}
									<div className="flex flex-wrap items-center gap-2 border-b pb-4">
										<form.Field
											name="start_time"
											children={(field) => (
												<DateTimePicker
													date={field.state.value}
													onChange={field.handleChange}
													hideIcon
													triggerClassName="rounded-lg border-0 w-auto"
												/>
											)}
										/>
										<span className="text-sm font-medium text-muted-foreground">
											to
										</span>
										<form.Field
											name="end_time"
											children={(field) => (
												<DateTimePicker
													date={field.state.value}
													onChange={field.handleChange}
													hideIcon
													triggerClassName="rounded-lg border-0 w-auto"
												/>
											)}
										/>
									</div>
								</div>

								<form.Field
									name="type"
									children={(field) => {
										if (field.state.value !== "meeting") return null;
										return (
											<div className="flex flex-col gap-2 py-4">
												<form.Field
													name="participant_ids"
													children={(pField) => (
														<div className="flex items-start gap-2">
															<div className="mt-2 flex size-5 items-center justify-center">
																<Users className="size-4 text-muted-foreground" />
															</div>
															<MultiSelectCombobox
																hideBorder
																items={teamMembers}
																value={teamMembers.filter((m) =>
																	pField.state.value.includes(m.id),
																)}
																onValueChange={(vals) =>
																	pField.handleChange(vals.map((m) => m.id))
																}
																isLoading={isTeamMembersLoading}
																itemToString={(m) => m.user?.name || ""}
																itemToValue={(m) => m.id}
																placeholder="Add participants"
																renderItem={(m) => (
																	<div className="flex items-center gap-2">
																		<Avatar className="size-6">
																			<AvatarImage src={m.user?.avatar_url} />
																			<AvatarFallback>
																				{m.user?.name?.charAt(0)}
																			</AvatarFallback>
																		</Avatar>
																		<div className="flex flex-col">
																			<span className="text-sm font-medium">
																				{m.user?.name}
																			</span>
																			<span className="text-xs text-muted-foreground">
																				{m.user?.email}
																			</span>
																		</div>
																	</div>
																)}
															/>
														</div>
													)}
												/>
											</div>
										);
									}}
								/>

								<div className="flex flex-col gap-2 py-4">
									<form.Field
										name="description"
										children={(field) => (
											<div className="flex items-start gap-2">
												<div className="mt-0.5 flex size-5 items-center justify-center">
													<FileText className="size-4 text-muted-foreground" />
												</div>
												<Textarea
													name={field.name}
													value={field.state.value || ""}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													placeholder="Add description"
													className="resize-none border-0"
												/>
											</div>
										)}
									/>
								</div>

								<div className="flex items-center gap-2">
									<div className="ml-auto flex items-center gap-2">
										<form.Subscribe
											selector={(state) => [
												state.canSubmit,
												state.isSubmitting,
											]}
											children={([canSubmit, isSubmitting]) => (
												<Button
													type="submit"
													disabled={
														!canSubmit || isSubmitDisabled || isSubmitting
													}
												>
													{isPending || isSubmitting ? (
														<>
															<Loader2 className="size-4 animate-spin" />
															<span>
																{mode === "create"
																	? "Creating Event"
																	: "Saving changes"}
															</span>
														</>
													) : (
														<>
															<CalendarPlus />
															<span>
																{mode === "create"
																	? "Create Event"
																	: "Save changes"}
															</span>
														</>
													)}
												</Button>
											)}
										/>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};
