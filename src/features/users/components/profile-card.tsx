import {
	IconCalendar as Calendar,
	IconMail as Mail,
	IconUser as UserIcon,
	IconUserEdit as UserRoundPen,
} from "@tabler/icons-react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TUser } from "../schemas";

interface IProfileCardProps {
	user: TUser;
}

export function ProfileCard({ user }: IProfileCardProps) {
	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() || "??";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<UserRoundPen className="size-4" />
					<span>Personal Details</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
				<Avatar className="size-24">
					{user?.avatar_url && user.avatar_url !== "" && (
						<AvatarImage src={user.avatar_url} alt={user.name} />
					)}
					<AvatarFallback className="text-3xl font-medium">
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className="flex w-full flex-col gap-3">
					<div className="flex items-center gap-3 rounded-lg border bg-muted px-3 py-2">
						<UserIcon className="size-4 text-muted-foreground" />
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground">Name</span>
							<span className="text-sm font-medium">{user.name}</span>
						</div>
					</div>

					<div className="flex items-center gap-3 rounded-lg border bg-muted px-3 py-2">
						<Mail className="size-4 text-muted-foreground" />
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground">
								Email Address
							</span>
							<span className="text-sm font-medium">{user.email}</span>
						</div>
					</div>

					<div className="flex items-center gap-3 rounded-lg border bg-muted px-3 py-2">
						<Calendar className="size-4 text-muted-foreground" />
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground">Joined Date</span>
							<span className="text-sm font-medium">
								{user.created_at
									? format(new Date(user.created_at), "MMMM d, yyyy")
									: "recently"}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
