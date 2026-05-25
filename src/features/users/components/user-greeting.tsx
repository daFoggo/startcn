import {
	AlertCircle,
	PackageCheck,
	SlidersHorizontal,
	Users,
} from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "@/components/ui/button-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import type { TStatsPeriod, TUserStats } from "../schemas";

interface IUserGreetingProps {
	greeting: string;
	stats?: TUserStats;
	period: TStatsPeriod;
	onPeriodChange: (period: TStatsPeriod) => void;
	isLoading?: boolean;
	isError?: boolean;
	error?: unknown;
}

export const UserGreeting = memo(
	({
		greeting,
		stats,
		period,
		onPeriodChange,
		isLoading = false,
		isError = false,
		error,
	}: IUserGreetingProps) => {
		const statsErrorMessage = isError
			? getErrorMessage(error, "Could not load stats.")
			: undefined;

		return (
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<p className="text-xl font-light">{greeting}</p>

				<div className="flex items-center gap-2">
					<ButtonGroup className="rounded-full border-none bg-muted">
						<Select
							value={period}
							onValueChange={(val) => onPeriodChange(val as TStatsPeriod)}
						>
							<SelectTrigger className="rounded-full border-none bg-transparent">
								<SelectValue placeholder="My weekly stats" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="weekly">My weekly stats</SelectItem>
								<SelectItem value="monthly">My monthly stats</SelectItem>
							</SelectContent>
						</Select>

						<ButtonGroupSeparator />

						<ButtonGroupText className="cursor-default gap-2 border-none bg-transparent">
							<PackageCheck className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1">
								{isLoading ? (
									<Skeleton className="h-4 w-6" />
								) : isError || !stats ? (
									<span
										className="flex items-center gap-1 font-medium text-destructive"
										title={statsErrorMessage}
									>
										<AlertCircle className="size-3.5 shrink-0" />
										Error
									</span>
								) : (
									<span className="font-semibold text-foreground">
										{stats.tasks_completed}
									</span>
								)}
								<span className="text-sm text-muted-foreground">
									tasks completed
								</span>
							</div>
						</ButtonGroupText>

						<ButtonGroupText className="cursor-default gap-2 border-none bg-transparent">
							<Users className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1">
								{isLoading ? (
									<Skeleton className="h-4 w-6" />
								) : isError || !stats ? (
									<span
										className="flex items-center gap-1 font-medium text-destructive"
										title={statsErrorMessage}
									>
										<AlertCircle className="size-3.5 shrink-0" />
										Error
									</span>
								) : (
									<span className="font-semibold text-foreground">
										{stats.collaborated_with}
									</span>
								)}
								<span className="text-sm text-muted-foreground">
									collaborated with
								</span>
							</div>
						</ButtonGroupText>
					</ButtonGroup>

					<Button variant="outline">
						<SlidersHorizontal />
						Customize
					</Button>
				</div>
			</div>
		);
	},
);

UserGreeting.displayName = "UserGreeting";
