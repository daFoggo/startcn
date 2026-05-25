import type { AnyFieldApi } from "@tanstack/react-form";
import {
	CalendarArrowDown,
	CalendarArrowUp,
	CalendarDays,
	CircleDashed,
	Clock,
	Flag,
	GitBranch,
	ListChecks,
	Loader2,
	Sparkles,
	Timer,
	Users,
} from "lucide-react";
import { DateTimePicker } from "@/components/common/date-picker";
import { MultiSelectCombobox } from "@/components/common/multi-select-combobox";
import { TaskPriorityBadge } from "@/components/common/task-priority-badge";
import { TaskStatusBadge } from "@/components/common/task-status-badge";
import { TaskTypeBadge } from "@/components/common/task-type-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type {
	ITaskListDialogOptions,
	TTask,
	TTaskAIEstimationExplanation,
	TTaskDetailFormApi,
} from "../../schemas";
import {
	TaskAIEstimationAlert,
	TaskAIEstimationAlertSkeleton,
} from "../task-table/task-ai-estimation-alert";

interface TaskDetailSidebarSectionProps {
	form: TTaskDetailFormApi;
	task?: TTask;
	options: ITaskListDialogOptions;
	parentTaskOptions: TTask[];
	aiExplanation: TTaskAIEstimationExplanation | null;
	isEstimating: boolean;
	onAIEstimate: () => void;
	canManageTasks?: boolean;
}

const getOptionById = <T extends { id: string; name: string; color?: string }>(
	items: Array<T>,
	id: string,
) => items.find((item) => item.id === id);

const NO_PARENT_VALUE = "__no_parent__";

const collectDescendantTaskIds = (task: TTask, allTasks: TTask[]) => {
	const descendantIds = new Set<string>();
	const taskByParentId = new Map<string, TTask[]>();

	for (const item of allTasks) {
		if (!item.parent_id) continue;
		const siblings = taskByParentId.get(item.parent_id) ?? [];
		siblings.push(item);
		taskByParentId.set(item.parent_id, siblings);
	}

	const visit = (item: TTask) => {
		const children = [
			...(item.sub_tasks ?? []),
			...(taskByParentId.get(item.id) ?? []),
		];

		for (const child of children) {
			if (descendantIds.has(child.id)) continue;
			descendantIds.add(child.id);
			visit(child);
		}
	};

	visit(task);

	return descendantIds;
};

export const TaskDetailSidebarSection = ({
	form,
	task,
	options,
	parentTaskOptions,
	aiExplanation,
	isEstimating,
	onAIEstimate,
	canManageTasks = true,
}: TaskDetailSidebarSectionProps) => {
	const unavailableParentIds = new Set<string>();

	if (task) {
		unavailableParentIds.add(task.id);
		for (const descendantId of collectDescendantTaskIds(
			task,
			parentTaskOptions,
		)) {
			unavailableParentIds.add(descendantId);
		}
	}

	const availableParentTasks = parentTaskOptions.filter(
		(parentTask) => !unavailableParentIds.has(parentTask.id),
	);

	return (
		<div className="lg:col-span-2 lg:border-l lg:pl-4">
			<FieldGroup>
				<form.Field name="parent_id">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;
						const selectedParent = parentTaskOptions.find(
							(parentTask) => parentTask.id === field.state.value,
						);

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<GitBranch className="size-3.5 text-muted-foreground" />
										Parent Task
									</div>
								</FieldLabel>
								<div className="min-w-0 flex-1 space-y-1">
									<Select
										value={field.state.value ?? NO_PARENT_VALUE}
										disabled={!canManageTasks}
										onValueChange={(value) =>
											field.handleChange(
												value === NO_PARENT_VALUE ? null : value,
											)
										}
									>
										<SelectTrigger
											id={field.name}
											className="w-full max-w-72"
											aria-invalid={isInvalid}
										>
											<SelectValue placeholder="Select parent task">
												{selectedParent?.title ?? "No parent"}
											</SelectValue>
										</SelectTrigger>
										<SelectContent className="max-h-64">
											<SelectItem value={NO_PARENT_VALUE}>No parent</SelectItem>
											{availableParentTasks.map((parentTask) => (
												<SelectItem key={parentTask.id} value={parentTask.id}>
													<span className="truncate">{parentTask.title}</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="status_id">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;
						const status = getOptionById(options.statuses, field.state.value);

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<CircleDashed className="size-3.5 text-muted-foreground" />
										Status
									</div>
								</FieldLabel>
								<TaskStatusBadge
									name={status?.name || "Unknown"}
									color={status?.color}
									interactive={canManageTasks}
									options={options.statuses}
									value={field.state.value}
									onValueChange={field.handleChange}
									className="h-auto"
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="type_id">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;
						const type = getOptionById(options.types, field.state.value);

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<ListChecks className="size-3.5 text-muted-foreground" />
										Type
									</div>
								</FieldLabel>
								<TaskTypeBadge
									name={type?.name || "Unknown"}
									color={type?.color}
									interactive={canManageTasks}
									options={options.types}
									value={field.state.value}
									onValueChange={field.handleChange}
									className="h-auto"
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="priority_id">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;
						const priority = getOptionById(
							options.priorities,
							field.state.value,
						);

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<Flag className="size-3.5 text-muted-foreground" />
										Priority
									</div>
								</FieldLabel>
								<TaskPriorityBadge
									name={priority?.name || "Unknown"}
									color={priority?.color}
									interactive={canManageTasks}
									options={options.priorities}
									value={field.state.value}
									onValueChange={field.handleChange}
									className="h-auto"
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="member_ids">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<Users className="size-3.5 text-muted-foreground" />
										Members
									</div>
								</FieldLabel>
								<MultiSelectCombobox
									className={
										canManageTasks
											? "w-fit"
											: "pointer-events-none w-fit opacity-70"
									}
									items={options.members}
									value={options.members.filter((item: any) =>
										field.state.value.includes(item.user_id),
									)}
									onValueChange={(values) => {
										if (!canManageTasks) return;
										field.handleChange(values.map((item: any) => item.user_id));
									}}
									itemToString={(item: any) => item.user?.name || ""}
									itemToValue={(item: any) => item.user_id}
									placeholder="Select members"
									renderItem={(member: any) => (
										<div className="flex items-center gap-2">
											<Avatar className="size-5">
												<AvatarImage src={member.user?.avatar_url} />
												<AvatarFallback>
													{member.user?.name?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span>{member.user?.name}</span>
										</div>
									)}
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="due_date">
					{(field: AnyFieldApi) => (
						<Field orientation="horizontal" className="gap-4">
							<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
								<div className="flex items-center gap-2">
									<CalendarDays className="size-3.5 text-muted-foreground" />
									Due Date
								</div>
							</FieldLabel>
							<DateTimePicker
								className="w-fit"
								date={
									field.state.value instanceof Date
										? field.state.value
										: new Date()
								}
								onChange={field.handleChange}
								disabled={!canManageTasks}
							/>
						</Field>
					)}
				</form.Field>

				<form.Field name="estimated_hours">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;

						return (
							<Field
								data-invalid={isInvalid}
								orientation="horizontal"
								className="gap-4"
							>
								<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
									<div className="flex items-center gap-2">
										<Clock className="size-3.5 text-muted-foreground" />
										Est. Hours
									</div>
								</FieldLabel>
								<Input
									id={field.name}
									type="number"
									step="0.5"
									min="0"
									className="w-24"
									value={field.state.value ?? ""}
									onChange={(e) => {
										const val = e.target.value;
										field.handleChange(val === "" ? undefined : Number(val));
									}}
									aria-invalid={isInvalid}
									placeholder="Hours"
									readOnly={!canManageTasks}
								/>
								{canManageTasks && (
									<Button
										type="button"
										variant="outline"
										className="ml-auto"
										onClick={onAIEstimate}
										disabled={isEstimating}
									>
										{isEstimating ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Sparkles className="size-4 text-primary" />
										)}
										AI Estimate
									</Button>
								)}
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>

				{task && (
					<form.Field name="actual_hours">
						{(field: AnyFieldApi) => {
							const isInvalid =
								field.state.meta.isTouched && !!field.state.meta.errors.length;

							return (
								<Field
									data-invalid={isInvalid}
									orientation="horizontal"
									className="gap-4"
								>
									<FieldLabel htmlFor={field.name} className="w-32 flex-none!">
										<div className="flex items-center gap-2">
											<Timer className="size-3.5 text-muted-foreground" />
											Act. Hours
										</div>
									</FieldLabel>
									<Input
										id={field.name}
										type="number"
										step="0.1"
										min="0"
										className="w-24"
										value={field.state.value ?? ""}
										onChange={(e) => {
											const val = e.target.value;
											field.handleChange(val === "" ? undefined : Number(val));
										}}
										aria-invalid={isInvalid}
										placeholder="Hours"
										readOnly={!canManageTasks}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							);
						}}
					</form.Field>
				)}

				{task?.started_at && (
					<Field orientation="horizontal" className="gap-4">
						<FieldLabel className="w-32 flex-none!">
							<div className="flex items-center gap-2 ">
								<CalendarArrowUp className="size-3.5 text-muted-foreground" />
								Started At
							</div>
						</FieldLabel>
						<span className="text-muted-foreground">
							{new Date(task.started_at).toLocaleString("vi-VN")}
						</span>
					</Field>
				)}

				{task?.completed_at && (
					<Field orientation="horizontal" className="gap-4">
						<FieldLabel className="w-32 flex-none!">
							<div className="flex items-center gap-2 ">
								<CalendarArrowDown className="size-3.5 text-muted-foreground" />
								Completed At
							</div>
						</FieldLabel>
						<span className="text-muted-foreground">
							{new Date(task.completed_at).toLocaleString("vi-VN")}
						</span>
					</Field>
				)}

				{isEstimating ? (
					<TaskAIEstimationAlertSkeleton />
				) : (
					<TaskAIEstimationAlert aiExplanation={aiExplanation} />
				)}
			</FieldGroup>
		</div>
	);
};
