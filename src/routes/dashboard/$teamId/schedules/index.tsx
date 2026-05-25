import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarPlus, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	BigCalendar,
	BigCalendarEventContent,
	BigCalendarEventPopover,
	BigCalendarSkeleton,
} from "@/components/common/big-calendar";
import { NestedErrorFallback } from "@/components/common/error-pages";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DeleteEventDialog,
	EVENT_TYPE_OPTIONS,
	EventActionBar,
	EventPopoverContent,
	EventTypeFilter,
	eventsQueryOptions,
	useEventMutations,
} from "@/features/events";
import {
	formatSchedules,
	mySchedulesQueryOptions,
	WorkTimePattern,
} from "@/features/schedules";
import { tasksQueryOptions, useTaskMutations } from "@/features/tasks";
import { teamMembersQueryOptions } from "@/features/team-members";
import { userMeQueryOptions } from "@/features/users";
import { getErrorMessage } from "@/lib/error";
import type { IBigCalendarEvent } from "@/types/big-calendar";

export const Route = createFileRoute("/dashboard/$teamId/schedules/")({
	errorComponent: NestedErrorFallback,
	loader: ({ context, params }) => {
		void context.queryClient.prefetchQuery(mySchedulesQueryOptions());
		void context.queryClient.prefetchQuery(userMeQueryOptions());
		void context.queryClient.prefetchQuery(
			eventsQueryOptions({ team_id__eq: params.teamId }),
		);
		void context.queryClient.prefetchQuery(
			teamMembersQueryOptions(params.teamId),
		);
		void context.queryClient.prefetchQuery(
			tasksQueryOptions(undefined, {
				team_id__eq: params.teamId,
				page_size: "all",
			}),
		);
	},
	component: RouteComponent,
	staticData: {
		getTitle: () => "Schedules",
		fixedHeight: true,
	},
});

function RouteComponent() {
	const [selectedEventTypes, setSelectedEventTypes] = useState<Array<string>>(
		EVENT_TYPE_OPTIONS.map((opt) => opt.value),
	);
	const [isMounted, setIsMounted] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<IBigCalendarEvent | null>(
		null,
	);

	const { update: updateEvent } = useEventMutations();
	const { update: updateTask } = useTaskMutations();

	// Action bar state
	const [actionBarOpen, setActionBarOpen] = useState(false);
	const [actionBarEvent, setActionBarEvent] =
		useState<IBigCalendarEvent | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const params = Route.useParams();
	const {
		data: userData,
		isLoading: isLoadingUser,
		isError: isErrorUser,
		error: userError,
	} = useQuery(userMeQueryOptions());
	const {
		data: teamMembersData,
		isLoading: isLoadingTeamMembers,
		isError: isErrorTeamMembers,
		error: teamMembersError,
	} = useQuery(teamMembersQueryOptions(params.teamId));
	const {
		data: eventsData,
		isLoading: isLoadingEvents,
		isError: isErrorEvents,
		error: eventsError,
	} = useQuery(eventsQueryOptions({ team_id__eq: params.teamId }));
	const {
		data: taskData,
		isLoading: isLoadingTasks,
		isError: isErrorTasks,
		error: tasksError,
	} = useQuery(
		tasksQueryOptions(undefined, {
			team_id__eq: params.teamId,
			page_size: "all",
		}),
	);
	const {
		data: rawSchedules,
		isLoading: isLoadingSchedules,
		isError: isErrorSchedules,
		error: schedulesError,
	} = useQuery(mySchedulesQueryOptions());

	const isCalendarDataLoading =
		isLoadingUser || isLoadingEvents || isLoadingTasks || isLoadingSchedules;
	const isCalendarError =
		isErrorUser || isErrorEvents || isErrorTasks || isErrorSchedules;
	const calendarError =
		userError ?? eventsError ?? tasksError ?? schedulesError ?? null;

	const schedules = useMemo(
		() => formatSchedules(rawSchedules, params.teamId, userData?.id),
		[rawSchedules, params.teamId, userData?.id],
	);

	const formattedEvents = eventsData?.formattedEvents || [];

	// Map tasks to calendar events
	const taskEvents = useMemo(() => {
		if (!taskData?.founds || !userData?.id) return [];
		return taskData.founds
			.filter((task) => {
				if (!task.due_date) return false;

				// Ensure the current user is a member of this task
				const isMember = task.task_members?.some(
					(m: any) => m.user_id === userData.id,
				);

				return isMember;
			})
			.map((task) => {
				const dueDate = new Date(task.due_date || "");
				// 3-hour duration leading to deadline
				const startDate = new Date(dueDate.getTime() - 3 * 60 * 60 * 1000);

				return {
					id: task.id,
					title: task.title,
					start: startDate,
					end: dueDate,
					color: EVENT_TYPE_OPTIONS.find((opt) => opt.value === "task")
						?.calendarColor,
					meta: {
						...task,
						type: "task",
						participants: task.task_members,
					},
				};
			}) as Array<IBigCalendarEvent>;
	}, [taskData?.founds, userData?.id]);

	const filteredEvents = useMemo(() => {
		const allEvents = [...formattedEvents, ...taskEvents];
		return allEvents.filter((event) => {
			const type = event.meta?.type as string | undefined;
			if (!type) return true;
			return selectedEventTypes.includes(type);
		});
	}, [selectedEventTypes, formattedEvents, taskEvents]);

	const getSlotClassName = (date: Date, hour: number) => {
		const scheduleDay = schedules[date.getDay()];
		if (scheduleDay.is_off) return "bg-stripes";
		const startH = scheduleDay.start_time
			? parseInt(scheduleDay.start_time.split(":")[0], 10)
			: 0;
		const endH = scheduleDay.end_time
			? parseInt(scheduleDay.end_time.split(":")[0], 10)
			: 24;
		if (hour < startH || hour >= endH) return "bg-stripes";
		return "";
	};

	const openCreate = () => {
		setActionBarEvent(null);
		setActionBarOpen(true);
	};

	const openCreateWithSlot = (slot: any) => {
		setActionBarEvent({
			id: `new-${Date.now()}`,
			title: "",
			start: slot.start,
			end: slot.end,
			meta: {
				type: "meeting",
			},
		} as any);
		setActionBarOpen(true);
	};

	const openEdit = (event: IBigCalendarEvent) => {
		setActionBarEvent(event);
		setActionBarOpen(true);
	};

	const closeActionBar = (open: boolean) => {
		setActionBarOpen(open);
		if (!open) setActionBarEvent(null);
	};

	const handleEventChange = (
		event: IBigCalendarEvent,
		start: Date,
		end: Date,
	) => {
		const type = event.meta?.type as string;
		if (type === "task") {
			const task = event.meta as any;
			updateTask.mutate({
				projectId: task.project_id,
				taskId: event.id,
				payload: {
					due_date: end.toISOString(),
				},
			});
		} else {
			updateEvent.mutate({
				eventId: event.id,
				payload: {
					start_time: start.toISOString(),
					end_time: end.toISOString(),
				},
			});
		}
	};

	return (
		<div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm md:flex-row">
				{/* Left Side */}
				<section className="no-scrollbar flex min-h-0 flex-col gap-4 overflow-y-auto border-r bg-card p-2 md:w-64 md:shrink-0">
					{/* Create button */}
					<div className="p-2">
						<Button className="w-full" onClick={openCreate}>
							<CalendarPlus className="size-4" />
							Create new event
						</Button>
					</div>

					<WorkTimePattern
						schedules={schedules}
						teamId={params.teamId}
						userId={userData?.id}
						isLoading={isLoadingUser || isLoadingSchedules}
						error={userError ?? schedulesError}
					/>
					<EventTypeFilter
						value={selectedEventTypes}
						onChange={setSelectedEventTypes}
					/>
				</section>

				{/* Right Side — BigCalendar */}
				<section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
					{isMounted && isCalendarError ? (
						<div className="flex flex-1 items-center justify-center p-8">
							<Alert variant="destructive" className="max-w-md">
								<TriangleAlert className="size-4" />
								<AlertTitle>Error loading schedules</AlertTitle>
								<AlertDescription>
									{getErrorMessage(
										calendarError,
										"We encountered an error trying to load your schedule, task, and event data. Please try refreshing the page.",
									)}
								</AlertDescription>
							</Alert>
						</div>
					) : isMounted && !isCalendarDataLoading ? (
						<BigCalendar
							events={filteredEvents}
							weekStartsOn={1}
							startHour={0}
							endHour={24}
							scrollToHour={6}
							headerClassName="p-4"
							slotClassName={getSlotClassName}
							onEventDrop={handleEventChange}
							onEventResize={handleEventChange}
							onSelectSlot={openCreateWithSlot}
							renderEvent={(event, layout) => (
								<BigCalendarEventPopover
									event={event}
									customContent={(evt) => (
										<EventPopoverContent
											event={evt}
											onEditClick={openEdit}
											onDeleteClick={setEventToDelete}
										/>
									)}
								>
									{event.meta?.type === "task" ? (
										<div
											className="flex h-full w-full flex-col gap-1 overflow-hidden rounded-md border px-2 py-1.5 shadow-sm backdrop-blur-xs transition-all hover:brightness-95"
											style={{
												borderColor: `color-mix(in oklch, ${event.color || "var(--primary)"} 30%, transparent)`,
												backgroundColor: `color-mix(in oklch, ${event.color || "var(--primary)"} 15%, transparent)`,
											}}
										>
											<div className="flex min-w-0 items-start gap-1.5">
												<TriangleAlert
													className="mt-0.5 size-3 shrink-0 opacity-90"
													style={{ color: event.color || "var(--primary)" }}
												/>
												<span
													className="truncate text-xs leading-snug font-bold tracking-tight"
													style={{ color: event.color || "var(--primary)" }}
												>
													{event.title}
												</span>
											</div>
											<div
												className="text-xs font-bold opacity-85"
												style={{ color: event.color || "var(--primary)" }}
											>
												Due: {format(event.end, "hh:mm a")}
											</div>
										</div>
									) : (
										<BigCalendarEventContent
											event={event}
											height={layout.height}
										/>
									)}
								</BigCalendarEventPopover>
							)}
						/>
					) : (
						<BigCalendarSkeleton
							startHour={6}
							endHour={22}
							headerClassName="p-4"
						/>
					)}
				</section>
			</div>

			{/* Delete dialog — keep as AlertDialog since it's a destructive confirmation */}
			<DeleteEventDialog
				event={eventToDelete}
				open={!!eventToDelete}
				onOpenChange={(open) => {
					if (!open) setEventToDelete(null);
				}}
			/>

			{/* Unified Create / Edit action bar */}
			<EventActionBar
				open={actionBarOpen}
				onOpenChange={closeActionBar}
				event={actionBarEvent}
				teamId={params.teamId}
				currentUser={userData}
				teamMembers={teamMembersData?.founds ?? []}
				isCurrentUserLoading={isLoadingUser}
				isCurrentUserError={isErrorUser}
				currentUserError={userError}
				isTeamMembersLoading={isLoadingTeamMembers}
				isTeamMembersError={isErrorTeamMembers}
				teamMembersError={teamMembersError}
			/>
		</div>
	);
}
