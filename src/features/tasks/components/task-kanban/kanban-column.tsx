import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TTask } from "../../schemas";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
	id: string;
	title: string;
	tasks: TTask[];
	onTaskClick: (task: TTask) => void;
	onDeleteTask?: (task: TTask) => void;
	onAddTask: (statusId: string) => void;
	isOverlay?: boolean;
	canManageTasks?: boolean;
}

export const KanbanColumn = ({
	id,
	title,
	tasks,
	onTaskClick,
	onDeleteTask,
	onAddTask,
	isOverlay,
	canManageTasks = true,
}: KanbanColumnProps) => {
	const {
		setNodeRef: setSortableRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		disabled: isOverlay || !canManageTasks,
		data: {
			type: "column",
			title,
		},
	});

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id,
		disabled: isOverlay || !canManageTasks,
		data: {
			type: "column",
		},
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging && !isOverlay ? 0.3 : 1,
	};

	return (
		<div
			ref={setSortableRef}
			style={style}
			className="flex w-64 shrink-0 flex-col"
		>
			<Card
				className={cn(
					"flex h-full flex-col gap-2 p-2 transition-all duration-200",
					isOverlay
						? "bg-background shadow-xl ring-1 ring-foreground/15"
						: "border border-foreground/10 bg-card/40 ring-0!",
				)}
			>
				<div className="flex flex-row items-center justify-between">
					<div
						className="flex min-w-0 flex-1 cursor-grab items-center gap-2 active:cursor-grabbing"
						{...(isOverlay || !canManageTasks ? {} : attributes)}
						{...(isOverlay || !canManageTasks ? {} : listeners)}
					>
						{canManageTasks && (
							<GripVertical className="size-3.5 text-muted-foreground/60 transition-colors hover:text-muted-foreground" />
						)}
						<CardTitle className="truncate text-sm font-semibold text-foreground">
							{title}
						</CardTitle>
						<Badge variant="secondary">{tasks.length}</Badge>
					</div>
					{!isOverlay && canManageTasks && (
						<Button
							variant="ghost"
							size="icon-sm"
							className="text-muted-foreground/60 hover:text-foreground"
							onClick={() => onAddTask(id)}
						>
							<Plus className="size-3.5" />
						</Button>
					)}
				</div>

				<CardContent
					ref={setDroppableRef}
					className={cn(
						"no-scrollbar flex min-h-20 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-0.5 transition-colors duration-200",
						isOver && !isOverlay
							? "bg-foreground/5 ring-1 ring-foreground/10"
							: "bg-transparent",
					)}
				>
					<SortableContext
						items={tasks.map((t) => t.id)}
						strategy={verticalListSortingStrategy}
					>
						{tasks.map((task) => (
							<KanbanCard
								key={task.id}
								task={task}
								onClick={() => onTaskClick(task)}
								onDelete={onDeleteTask ? () => onDeleteTask(task) : undefined}
								isOverlay={isOverlay}
								canDrag={canManageTasks}
							/>
						))}
					</SortableContext>
				</CardContent>
			</Card>
		</div>
	);
};
