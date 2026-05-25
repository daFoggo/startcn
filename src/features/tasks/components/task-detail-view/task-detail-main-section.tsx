import type { AnyFieldApi } from "@tanstack/react-form";
import { TextAlignStart } from "lucide-react";
import { MarkdownEditor } from "@/components/common/markdown-editor";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import type {
	ITaskListDialogOptions,
	TTask,
	TTaskDetailFormApi,
} from "../../schemas";
import { type ITaskActivityLog, TaskActivity } from "./task-activity";
import { TaskSubTasksSection } from "./task-sub-tasks-section";

interface ITaskDetailMainSectionProps {
	form: TTaskDetailFormApi;
	task?: TTask;
	taskId?: string;
	options: ITaskListDialogOptions;
	parentTaskOptions?: TTask[];
	isLoading?: boolean;
	activities?: ITaskActivityLog[];
	isActivitiesLoading?: boolean;
	isActivitiesError?: boolean;
	activitiesError?: unknown;
	canManageTasks?: boolean;
}

export const TaskDetailMainSection = ({
	form,
	task,
	taskId,
	options,
	parentTaskOptions = [],
	isLoading,
	activities = [],
	isActivitiesLoading = false,
	isActivitiesError = false,
	activitiesError,
	canManageTasks = true,
}: ITaskDetailMainSectionProps) => {
	return (
		<div className="space-y-6 lg:col-span-3">
			<FieldGroup>
				<form.Field name="description">
					{(field: AnyFieldApi) => {
						const isInvalid =
							field.state.meta.isTouched && !!field.state.meta.errors.length;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									<div className="flex items-center gap-2 font-medium">
										<TextAlignStart className="size-4 text-muted-foreground" />
										Description
									</div>
								</FieldLabel>
								<MarkdownEditor
									id={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(value) => field.handleChange(value)}
									placeholder="Add a detailed description..."
									contentClassName="max-h-60 overflow-y-auto"
									editorClassName="min-h-40"
									aria-invalid={isInvalid}
									readOnly={!canManageTasks}
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>

			<TaskSubTasksSection
				task={task}
				options={options}
				parentTaskOptions={parentTaskOptions}
				isLoading={isLoading}
				canManageTasks={canManageTasks}
			/>

			{taskId && (
				<TaskActivity
					taskId={taskId}
					activities={activities}
					isLoading={isActivitiesLoading}
					isError={isActivitiesError}
					error={activitiesError}
					canComment={canManageTasks}
				/>
			)}
		</div>
	);
};
