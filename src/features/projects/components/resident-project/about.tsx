import {
	IconAlertCircle,
	IconCalendar,
	IconCheck,
	IconHome,
	IconInfoCircle,
	IconListDetails,
	IconShieldLock,
	IconTargetArrow,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	CardTitleWithIcon,
	type ProjectDetailProps,
	type TitleIcon,
} from "./shared";

export function ResidentAboutProject({ project }: ProjectDetailProps) {
	return (
		<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconInfoCircle}>
							{project.name}
						</CardTitleWithIcon>
						<CardDescription>{project.description}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="grid gap-3 md:grid-cols-2">
							<AboutFact
								icon={IconHome}
								label="Research unit"
								value={project.organization.name}
							/>
							<AboutFact
								icon={IconCalendar}
								label="Study timeline"
								value={project.studyTimeline}
							/>
							<AboutFact
								icon={IconUsers}
								label="Household"
								value={`${project.householdName} - ${project.members.join(", ")}`}
							/>
							<AboutFact
								icon={IconShieldLock}
								label="Participation"
								value={project.status === "active" ? "Active" : "Ended"}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconTargetArrow}>
							Research goals
						</CardTitleWithIcon>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-3">
							{project.goals.map((goal) => (
								<li className="flex gap-3" key={goal}>
									<IconCheck className="mt-1 size-4 shrink-0 text-primary" />
									<span>{goal}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconShieldLock}>
							Full privacy policy
						</CardTitleWithIcon>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-3">
							{project.privacyPolicy.fullPolicy.map((item) => (
								<li className="flex gap-3" key={item}>
									<IconInfoCircle className="mt-1 size-4 shrink-0 text-muted-foreground" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconListDetails}>
							Tracked activities
						</CardTitleWithIcon>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.activities.map((activity) => (
							<div key={activity.id} className="rounded-lg border px-4 py-3">
								<p className="font-medium">{activity.name}</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{activity.description}
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconX}>Leave project</CardTitleWithIcon>
						<CardDescription>
							Leaving stops new resident prompts for this study.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<AlertDialog>
							<AlertDialogTrigger render={<Button variant="destructive" />}>
								<IconX data-icon="inline-start" />
								<span>Leave project</span>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogMedia>
										<IconAlertCircle />
									</AlertDialogMedia>
									<AlertDialogTitle>Leave this project?</AlertDialogTitle>
									<AlertDialogDescription>
										You will stop receiving new AnnoBot questions for this
										project. Existing labels remain in the study audit log.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction variant="destructive">
										Leave project
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

function AboutFact({
	icon: Icon,
	label,
	value,
}: {
	icon: TitleIcon;
	label: string;
	value: string;
}) {
	return (
		<div className="flex gap-3 rounded-lg border px-4 py-3">
			<Icon className="mt-1 size-4 text-muted-foreground" />
			<div>
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="mt-1 text-sm font-medium">{value}</p>
			</div>
		</div>
	);
}
