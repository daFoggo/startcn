import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface ITimezoneViewerProps {
	timezone?: string | null;
}

export const TimezoneViewer = ({ timezone }: ITimezoneViewerProps) => {
	const [time, setTime] = useState<string | null>(null);
	const [clientTz, setClientTz] = useState<string | null>(null);

	useEffect(() => {
		setClientTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
		const fmt = () => {
			try {
				return new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					timeZone: timezone || undefined,
				});
			} catch (_e) {
				return new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				});
			}
		};
		setTime(fmt());
		const id = setInterval(() => setTime(fmt()), 1000);
		return () => clearInterval(id);
	}, [timezone]);

	return (
		<SidebarMenuItem>
			<HoverCard openDelay={100} closeDelay={100}>
				<HoverCardTrigger>
					<SidebarMenuButton className="justify-between text-xs" size="sm">
						<span className="font-medium text-muted-foreground uppercase">
							time
						</span>
						<Badge variant="secondary" className="font-mono font-semibold">
							{time ?? "--:--"}
						</Badge>
					</SidebarMenuButton>
				</HoverCardTrigger>
				<HoverCardContent align="start" className="space-y-1.5">
					<p className="font-medium text-xs text-muted-foreground uppercase">
						Active Timezone
					</p>
					<p className="font-mono text-xs font-semibold">
						{timezone || clientTz || "UTC"}
					</p>
					<p className="text-xs text-muted-foreground leading-normal">
						Current project time in the project's timezone. All dates, ranges,
						and graphs you see are matched to this timezone.
					</p>
				</HoverCardContent>
			</HoverCard>
		</SidebarMenuItem>
	);
};
