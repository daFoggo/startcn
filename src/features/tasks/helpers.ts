/**
 * Interface cho các tùy chọn trong Dialog quản lý Task
 */
import type {
	ITaskListDialogOptions,
	TTask,
	TTaskDetailFormValues,
} from "./schemas";

export type { ITaskListDialogOptions } from "./schemas";
export function getStatusOption(
	value: string,
	options: ITaskListDialogOptions,
) {
	const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]+/g, "");
	return options.statuses.find((s) => {
		const normalizedCatalogValue = s.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "");
		const normalizedLabel = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
		return (
			normalizedCatalogValue === normalizedValue ||
			normalizedLabel === normalizedValue
		);
	});
}

export function getPriorityOption(
	value: string,
	options: ITaskListDialogOptions,
) {
	const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]+/g, "");
	return options.priorities.find((p) => {
		const normalizedCatalogValue = p.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "");
		const normalizedLabel = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
		return (
			normalizedCatalogValue === normalizedValue ||
			normalizedLabel === normalizedValue
		);
	});
}

export function getTypeOption(value: string, options: ITaskListDialogOptions) {
	const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]+/g, "");
	return options.types.find((t) => {
		const normalizedCatalogValue = t.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "");
		const normalizedLabel = t.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
		return (
			normalizedCatalogValue === normalizedValue ||
			normalizedLabel === normalizedValue
		);
	});
}

/**
 * Chuyển đổi giá trị sang đối tượng Date cho các Component lịch/ngày tháng
 */
export const toCalendarDateValue = (
	value?: string | Date | null,
): Date | undefined => {
	if (!value) return undefined;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return undefined;
	return date;
};

/**
 * Chuyển đổi Date sang định dạng ISO string (có hỗ trợ thiết lập đầu/cuối ngày)
 */
export const toIsoDateTime = (
	value?: Date,
	options?: { endOfDay?: boolean; startOfDay?: boolean },
): string | undefined => {
	if (!value || Number.isNaN(value.getTime())) return undefined;

	const date = new Date(value);

	if (options?.endOfDay) {
		date.setHours(23, 59, 59, 999);
	} else if (options?.startOfDay) {
		date.setHours(0, 0, 0, 0);
	}

	return date.toISOString();
};

/**
 * Định dạng Date hiển thị theo chuẩn Việt Nam (DD/MM/YYYY HH:mm)
 */
export const formatCalendarDate = (value?: Date): string => {
	if (!value || Number.isNaN(value.getTime())) return "";

	return new Intl.DateTimeFormat("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(value);
};

/**
 * Tìm kiếm các ID mặc định cho Status, Type, Priority từ danh sách Option
 */
export const resolveDefaultTaskOptionIds = (
	options: ITaskListDialogOptions,
): {
	statusId: string;
	typeId: string;
	priorityId: string;
} => {
	const statusId =
		options.statuses.find((item) => item.is_default)?.id ??
		options.statuses[0]?.id ??
		"";
	const typeId =
		options.types.find((item) => item.is_default)?.id ??
		options.types[0]?.id ??
		"";
	const priorityId =
		options.priorities.find((item) => item.is_default)?.id ??
		options.priorities[0]?.id ??
		"";

	return {
		statusId,
		typeId,
		priorityId,
	};
};

export const getTaskDetailDefaultValues = (
	task: TTask | undefined,
	options: ITaskListDialogOptions,
	defaultStatusId?: string,
	defaultParentId?: string | null,
): TTaskDetailFormValues => {
	const defaults = resolveDefaultTaskOptionIds(options);

	return {
		title: task?.title || "",
		description: task?.description ?? "",
		parent_id: task?.parent_id ?? defaultParentId ?? null,
		status_id: task?.status_id ?? defaultStatusId ?? defaults.statusId,
		type_id: task?.type_id ?? defaults.typeId,
		priority_id: task?.priority_id ?? defaults.priorityId,
		member_ids: task?.task_members?.map((member) => member.user_id) ?? [],
		due_date: toCalendarDateValue(task?.due_date) ?? new Date(),
		order: task?.order ?? 0,
		estimated_hours: task?.estimated_hours ?? undefined,
		actual_hours: task?.actual_hours ?? undefined,
	};
};

export const buildTaskDetailPayload = (value: TTaskDetailFormValues) => {
	const dueDateIso = toIsoDateTime(
		value.due_date instanceof Date ? value.due_date : undefined,
	);

	if (!dueDateIso) return null;

	const estimatedHours =
		value.estimated_hours !== undefined && value.estimated_hours !== null
			? Number(value.estimated_hours)
			: null;

	const actualHours =
		value.actual_hours !== undefined && value.actual_hours !== null
			? Number(value.actual_hours)
			: null;

	return {
		dueDateIso,
		payload: {
			title: value.title,
			status_id: value.status_id,
			type_id: value.type_id,
			priority_id: value.priority_id,
			parent_id: value.parent_id || null,
			member_ids: value.member_ids,
			description: value.description || null,
			due_date: dueDateIso,
			estimated_hours: estimatedHours,
			actual_hours: actualHours,
		},
	};
};

export const serializeTaskDetailFormValues = (value: TTaskDetailFormValues) =>
	JSON.stringify({
		title: value.title,
		description: value.description,
		status_id: value.status_id,
		type_id: value.type_id,
		priority_id: value.priority_id,
		parent_id: value.parent_id ?? null,
		member_ids: value.member_ids,
		due_date:
			value.due_date instanceof Date ? value.due_date.toISOString() : null,
		estimated_hours:
			value.estimated_hours !== undefined && value.estimated_hours !== null
				? Number(value.estimated_hours)
				: null,
		actual_hours:
			value.actual_hours !== undefined && value.actual_hours !== null
				? Number(value.actual_hours)
				: null,
	});

export const cloneTaskDetailFormValues = (
	value: TTaskDetailFormValues,
): TTaskDetailFormValues => ({
	...value,
	parent_id: value.parent_id ?? null,
	member_ids: [...value.member_ids],
	due_date:
		value.due_date instanceof Date ? new Date(value.due_date) : new Date(),
});

export function mapTaskData(
	task: TTask,
	options: {
		statuses: Array<{ id: string; name: string; color?: string }>;
		types: Array<{ id: string; name: string; color?: string }>;
		priorities: Array<{ id: string; name: string; color?: string }>;
	},
): TTask {
	const display = (
		id: string,
		catalog: Array<{ id: string; name: string; color?: string }>,
	) => catalog.find((item) => item.id === id);

	const typeOpt = display(task.type_id, options.types);
	const statusOpt = display(task.status_id, options.statuses);
	const priorityOpt = display(task.priority_id, options.priorities);

	return {
		id: task.id,
		project_id: task.project_id,
		parent_id: task.parent_id ?? null,
		title: task.title,
		description: task.description ?? null,
		status_id: task.status_id,
		type_id: task.type_id,
		priority_id: task.priority_id,
		type: typeOpt?.name ?? task.type_id,
		status: statusOpt?.name ?? task.status_id,
		priority: priorityOpt?.name ?? task.priority_id,
		type_color: typeOpt?.color,
		status_color: statusOpt?.color,
		priority_color: priorityOpt?.color,
		task_members: task.task_members || [],
		started_at: task.started_at
			? new Date(task.started_at).toISOString()
			: null,
		completed_at: task.completed_at
			? new Date(task.completed_at).toISOString()
			: null,
		due_date: task.due_date
			? new Date(task.due_date).toISOString()
			: new Date().toISOString(),
		created_at: task.created_at
			? new Date(task.created_at).toISOString()
			: new Date().toISOString(),
		updated_at: task.updated_at
			? new Date(task.updated_at).toISOString()
			: new Date().toISOString(),
		order: task.order ?? 0,
		is_archived: !!task.is_archived,
		is_deleted: !!task.is_deleted,
		estimated_hours:
			task.estimated_hours != null ? Number(task.estimated_hours) : undefined,
		actual_hours:
			task.actual_hours != null ? Number(task.actual_hours) : undefined,
		sub_tasks: task.sub_tasks?.map((subTask) => mapTaskData(subTask, options)),
	};
}
