import {
	IconAdjustmentsHorizontal,
	IconClipboardList,
	IconClock,
	IconListCheck,
	IconMapPin,
	IconRoute,
	IconShieldLock,
	IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/radix-switch";
import {
	CardTitleWithIcon,
	type ProjectDetailProps,
	ReadOnlyFact,
} from "./shared";

export function ResidentProjectConfiguration({ project }: ProjectDetailProps) {
	return (
		<div className="flex flex-col gap-8">
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-base font-medium">What the study tracks</h2>
					<p className="text-sm text-muted-foreground">
						These rules explain what AnnoBot is trying to label. They are set by
						the study team and are read-only for residents.
					</p>
				</div>

				<div className="grid gap-4">
					{project.activities.map((activity) => (
						<Card key={activity.id}>
							<CardHeader>
								<CardTitleWithIcon icon={IconClipboardList}>
									{activity.name}
								</CardTitleWithIcon>
								<CardDescription>{activity.description}</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
								<div className="grid gap-3">
									<ReadOnlyFact
										icon={IconListCheck}
										label="What"
										value={activity.what}
									/>
									<ReadOnlyFact
										icon={IconMapPin}
										label="Where"
										value={activity.where}
									/>
									<ReadOnlyFact
										icon={IconClock}
										label="When"
										value={activity.when}
									/>
									<ReadOnlyFact
										icon={IconUser}
										label="Who"
										value={activity.who}
									/>
								</div>
								<div className="rounded-lg border">
									<div className="border-b px-4 py-3">
										<p className="font-medium">Label fields</p>
										<p className="mt-1 text-sm text-muted-foreground">
											Fields the study wants captured for each event.
										</p>
									</div>
									{activity.slots.map((slot) => (
										<div
											key={slot.name}
											className="border-b px-4 py-3 last:border-b-0"
										>
											<div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
												<p className="font-medium">{slot.name}</p>
												<Badge variant="outline">{slot.labelSpace}</Badge>
											</div>
											<p className="mt-2 text-sm text-muted-foreground">
												{slot.sourcePolicy}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconShieldLock}>
							Privacy policy
						</CardTitleWithIcon>
						<CardDescription>{project.privacyPolicy.summary}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<div className="flex flex-wrap gap-2">
							{project.privacyPolicy.quotableSensors.map((sensor) => (
								<Badge key={sensor} variant="outline">
									{sensor}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconClock}>
							Quiet hours and budget
						</CardTitleWithIcon>
						<CardDescription>
							These controls limit interruption without changing the study
							definition.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="grid grid-cols-2 gap-3">
							<label
								className="flex flex-col gap-1"
								htmlFor="quiet-hours-start"
							>
								<span className="text-xs text-muted-foreground">Starts</span>
								<Input
									id="quiet-hours-start"
									readOnly
									value={project.overrides.quietHoursStart}
								/>
							</label>
							<label className="flex flex-col gap-1" htmlFor="quiet-hours-end">
								<span className="text-xs text-muted-foreground">Ends</span>
								<Input
									id="quiet-hours-end"
									readOnly
									value={project.overrides.quietHoursEnd}
								/>
							</label>
						</div>
						<label className="flex flex-col gap-2">
							<span className="text-xs text-muted-foreground">
								Daily question limit: {project.overrides.dailyQuestionLimit}
							</span>
							<input
								aria-label="Daily question limit"
								className="accent-primary"
								max={10}
								min={0}
								readOnly
								type="range"
								value={project.overrides.dailyQuestionLimit}
							/>
						</label>
					</CardContent>
				</Card>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconAdjustmentsHorizontal}>
							Scenario overrides
						</CardTitleWithIcon>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.overrides.scenarios.map((scenario) => (
							<div
								key={scenario.id}
								className="flex items-center gap-3 rounded-lg border px-4 py-3"
							>
								<div className="min-w-0 flex-1">
									<p className="font-medium">{scenario.name}</p>
									<p className="text-xs text-muted-foreground">
										{scenario.description}
									</p>
								</div>
								<Switch
									aria-label={scenario.name}
									defaultChecked={scenario.enabled}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitleWithIcon icon={IconRoute}>
							Member routing
						</CardTitleWithIcon>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{project.overrides.memberRouting.map((pattern) => (
							<div
								key={pattern.activityId}
								className="rounded-lg border px-4 py-3"
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-medium">{pattern.activityName}</p>
										<p className="text-xs text-muted-foreground">
											Usually asks {pattern.primaryMember}
										</p>
									</div>
									<Badge variant="outline">{pattern.confidence}%</Badge>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									{pattern.note}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
