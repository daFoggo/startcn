import { IconCalendarEvent } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/dashboard/schedules/")({
	component: SchedulesPlaceholder,
	staticData: {
		getTitle: () => "Schedules",
	},
});

function SchedulesPlaceholder() {
	return (
		<Empty className="min-h-96 border">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconCalendarEvent />
				</EmptyMedia>
				<EmptyTitle>Schedules Page</EmptyTitle>
				<EmptyDescription>
					This is a placeholder page for your schedules.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
