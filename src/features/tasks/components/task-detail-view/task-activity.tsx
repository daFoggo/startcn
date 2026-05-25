/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <idjk> */

import { format, formatDistanceToNow, isValid } from "date-fns";
import { Logs, MoreHorizontal, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MarkdownEditor } from "@/components/common/markdown-editor";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { useTaskMutations } from "../../queries";

interface ITaskActivityProps {
	taskId?: string;
	activities: ITaskActivityLog[];
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
	canComment?: boolean;
}

export interface ITaskActivityLog {
	id: string;
	activity_type: string;
	user?: {
		name?: string;
		avatar_url?: string;
	};
	created_at: string;
	content?: string;
	new_value?: unknown;
	old_value?: unknown;
	field_name?: string;
}

const formatActivityDate = (dateStr: string) => {
	const d = new Date(dateStr);
	if (!isValid(d)) return "some time ago";
	return formatDistanceToNow(d, { addSuffix: true });
};

const formatValue = (val: unknown) => {
	if (val === null || val === undefined || val === "") return "None";
	return String(val);
};

export const TaskActivity = ({
	taskId,
	activities,
	isLoading = false,
	isError = false,
	error,
	canComment = true,
}: ITaskActivityProps) => {
	const [commentText, setCommentText] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	const { addComment } = useTaskMutations();

	const timelineItems = useMemo(() => [...activities].reverse(), [activities]);
	const activitiesCount = activities.length;
	const hasActivities = activitiesCount > 0;

	useEffect(() => {
		if (bottomRef.current) {
			// Manually target the Radix viewport to avoid causing outer parent layout scrolls
			const viewport = bottomRef.current.closest(
				"[data-slot='scroll-area-viewport']",
			);
			if (viewport) {
				viewport.scrollTop = viewport.scrollHeight;
			}
		}
	}, [activitiesCount]);

	const handleSendComment = async (explicitContent?: string) => {
		const finalContent = (explicitContent ?? commentText).trim();
		if (!finalContent || !taskId) return;

		try {
			await addComment.mutateAsync({ taskId, content: finalContent });
			setCommentText("");
		} catch (error) {
			toast.error(getErrorMessage(error, "Failed to send comment"));
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive">
				<TriangleAlert className="size-4" />
				<AlertTitle>Error loading activity</AlertTitle>
				<AlertDescription>
					{getErrorMessage(error, "Failed to load task activity.")}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-lg font-semibold tracking-tight">Activity</p>

			<ScrollArea className={hasActivities ? "h-40 pr-4" : "pr-4"}>
				{/* Main unified coordinate space spans entire height, full width */}
				<div className="flex flex-col gap-4">
					{/* 1. Relative block ONLY for historical entries + vertical timeline line */}
					<div className="relative flex flex-col gap-4">
						{timelineItems.length > 0 ? (
							<div className="absolute top-3 bottom-3 left-3 z-0 w-0.5 -translate-x-1/2 rounded-full bg-muted" />
						) : null}

						{timelineItems.length === 0 ? (
							<div className="relative z-10">
								<Empty>
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<Logs />
										</EmptyMedia>
										<EmptyTitle>No activity recorded yet.</EmptyTitle>
										<EmptyDescription>
											Modify your task or add comments to track updates.
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							</div>
						) : (
							timelineItems.map((activity: ITaskActivityLog) => {
								const isComment = activity.activity_type === "comment";
								const userName = activity.user?.name || "Someone";

								if (isComment) {
									return (
										/* Comment block standardized exactly to InputGroup component layout */
										<InputGroup
											className="relative z-10 overflow-hidden bg-card! dark:bg-card!"
											key={activity.id}
										>
											<InputGroupAddon
												align="block-start"
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-2">
													<Avatar size="sm">
														<AvatarImage src={activity.user?.avatar_url} />
														<AvatarFallback>
															{userName.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="flex items-center gap-1.5 text-xs">
														<span className="font-semibold text-foreground">
															{userName}
														</span>
														<span className="font-normal text-muted-foreground">
															commented{" "}
															{formatActivityDate(activity.created_at)}
														</span>
													</div>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="size-6 text-muted-foreground"
												>
													<MoreHorizontal className="size-4" />
												</Button>
											</InputGroupAddon>

											<MarkdownRenderer
												content={activity.content || ""}
												className="px-2.5 pb-2"
												emptyContent={
													<span className="text-sm text-muted-foreground">
														No comment content.
													</span>
												}
											/>
										</InputGroup>
									);
								}

								let actionDisplay = <span>updated the card</span>;

								if (activity.activity_type === "started") {
									actionDisplay = (
										<span className="text-muted-foreground">
											started the task
										</span>
									);
								} else if (activity.activity_type === "completed") {
									actionDisplay = (
										<span className="text-muted-foreground">
											completed the task
										</span>
									);
								} else if (activity.activity_type === "status_change") {
									actionDisplay = (
										<span className="text-muted-foreground">
											moved status to{" "}
											<span className="font-semibold text-foreground">
												{formatValue(activity.new_value)}
											</span>
										</span>
									);
								} else if (activity.activity_type === "field_change") {
									const fieldName =
										activity.field_name?.replace("_", " ") || "item";

									const isTextDetailed =
										activity.field_name === "title" ||
										activity.field_name === "description";

									let formattedValue = formatValue(activity.new_value);
									if (
										activity.field_name === "due_date" &&
										activity.new_value &&
										typeof activity.new_value === "string"
									) {
										try {
											const d = new Date(activity.new_value);
											if (isValid(d)) {
												formattedValue = format(d, "PPP");
											}
										} catch {
											// fallback
										}
									}

									actionDisplay = (
										<span className="text-muted-foreground">
											changed the {fieldName}
											{!isTextDetailed && (
												<>
													{" "}
													to{" "}
													<span className="font-semibold text-foreground">
														{formattedValue}
													</span>
												</>
											)}
										</span>
									);
								} else if (activity.activity_type === "member_add") {
									actionDisplay = (
										<span className="text-muted-foreground">
											added{" "}
											<span className="font-semibold text-foreground">
												{formatValue(activity.new_value)}
											</span>{" "}
											to this task
										</span>
									);
								} else if (activity.activity_type === "member_remove") {
									actionDisplay = (
										<span className="text-muted-foreground">
											removed{" "}
											<span className="font-semibold text-foreground">
												{formatValue(activity.old_value)}
											</span>{" "}
											from this task
										</span>
									);
								}

								return (
									<div
										key={activity.id}
										className="relative z-10 flex w-full items-center gap-4"
									>
										<Avatar size="sm">
											<AvatarImage src={activity.user?.avatar_url} />
											<AvatarFallback>{userName.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex flex-wrap items-center gap-2 text-sm">
											<span className="font-semibold text-foreground">
												{userName}
											</span>
											{actionDisplay}
											<span className="text-muted-foreground">
												{formatActivityDate(activity.created_at)}
											</span>
										</div>
									</div>
								);
							})
						)}

						<div ref={bottomRef} />
					</div>
				</div>
			</ScrollArea>

			{canComment && (
				<MarkdownEditor
					value={commentText}
					onChange={setCommentText}
					containerClassName="bg-card dark:bg-card"
					contentClassName="max-h-40 overflow-y-auto"
					editorClassName="min-h-20"
					onSubmit={handleSendComment}
					isSubmitPending={addComment.isPending}
					placeholder="Add comment... (Press Ctrl + Enter to send)"
					onModEnter={handleSendComment}
				/>
			)}
		</div>
	);
};
