import { z } from "zod";

export const ProjectOrganizationSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
});

export const ProjectStatusSchema = z.enum(["active", "ended"]);
export const AnnotationSourceSchema = z.enum([
	"YOU_SAID",
	"BOT_INFERRED",
	"SENSOR_AUTO",
	"CALENDAR",
	"PENDING",
	"LATER",
]);
export const AnnotationSourceFilterSchema = z.enum([
	"all",
	"YOU",
	"AUTO",
	"PENDING",
]);

export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
	organization: ProjectOrganizationSchema,
	status: ProjectStatusSchema.default("active"),
});

export const ProjectStatsSchema = z.object({
	coverage: z.number().min(0).max(100),
	pendingQuestions: z.number().min(0),
	autoResolvedEvents: z.number().min(0),
	totalEventsToday: z.number().min(0).default(0),
	userResolvedEvents: z.number().min(0).default(0),
});

export const ProjectListItemSchema = z.object({
	project: ProjectSchema,
	stats: ProjectStatsSchema,
});

export const ProjectByIdInputSchema = z.object({
	projectId: z.string().min(1),
});

export const ActivityStatSchema = z.object({
	label: z.string(),
	value: z.string(),
	helper: z.string().optional(),
});

export const SlotDefinitionSchema = z.object({
	name: z.string(),
	labelSpace: z.string(),
	sourcePolicy: z.string(),
});

export const ResidentActivitySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	what: z.string(),
	where: z.string(),
	when: z.string(),
	who: z.string(),
	stats: z.array(ActivityStatSchema),
	slots: z.array(SlotDefinitionSchema),
});

export const AnnotationSlotSchema = z.object({
	name: z.string(),
	value: z.string(),
	source: AnnotationSourceSchema,
	filled: z.boolean(),
});

export const AnnotationEventSchema = z.object({
	id: z.string(),
	activityId: z.string(),
	activityName: z.string(),
	timestamp: z.string(),
	title: z.string(),
	context: z.string(),
	question: z.string().optional(),
	response: z.string().optional(),
	source: AnnotationSourceSchema,
	confidence: z.number().min(0).max(1).optional(),
	slotsFilled: z.number().min(0),
	slotsTotal: z.number().min(1),
	slots: z.array(AnnotationSlotSchema),
});

export const PendingQuestionSchema = z.object({
	id: z.string(),
	activityId: z.string(),
	activityName: z.string(),
	context: z.string(),
	question: z.string(),
	quickActions: z.array(z.string()),
	canRedirectMembers: z.array(z.string()),
});

export const ConnectedDeviceSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	status: z.enum(["connected", "attention", "offline"]),
	detail: z.string(),
});

export const MemberRoutingPatternSchema = z.object({
	activityId: z.string(),
	activityName: z.string(),
	primaryMember: z.string(),
	confidence: z.number().min(0).max(100),
	note: z.string(),
});

export const ResidentOverridesSchema = z.object({
	quietHoursStart: z.string(),
	quietHoursEnd: z.string(),
	dailyQuestionLimit: z.number().min(0),
	scenarios: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			description: z.string(),
			enabled: z.boolean(),
		}),
	),
	connectedDevices: z.array(ConnectedDeviceSchema),
	memberRouting: z.array(MemberRoutingPatternSchema),
});

export const ProjectPrivacyPolicySchema = z.object({
	summary: z.string(),
	quotableSensors: z.array(z.string()),
	fullPolicy: z.array(z.string()),
});

export const ProjectDetailSchema = ProjectSchema.extend({
	description: z.string(),
	goals: z.array(z.string()),
	studyTimeline: z.string(),
	householdName: z.string(),
	members: z.array(z.string()),
	stats: ProjectStatsSchema,
	activities: z.array(ResidentActivitySchema),
	recentEvents: z.array(AnnotationEventSchema),
	pendingQuestions: z.array(PendingQuestionSchema),
	overrides: ResidentOverridesSchema,
	privacyPolicy: ProjectPrivacyPolicySchema,
});

export const SubmitAnnotationAnswerInputSchema = z.object({
	projectId: z.string().min(1),
	questionId: z.string().min(1),
	answer: z.string().min(1),
});

export const AnnotationAnswerResultSchema = z.object({
	eventId: z.string(),
	message: z.string(),
	slotsFilled: z.number().min(0),
	slotsTotal: z.number().min(1),
});

export type TProjectOrganization = z.infer<typeof ProjectOrganizationSchema>;
export type TProject = z.infer<typeof ProjectSchema>;
export type TProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type TProjectStats = z.infer<typeof ProjectStatsSchema>;
export type TProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type TProjectByIdInput = z.infer<typeof ProjectByIdInputSchema>;
export type TAnnotationSource = z.infer<typeof AnnotationSourceSchema>;
export type TAnnotationSourceFilter = z.infer<
	typeof AnnotationSourceFilterSchema
>;
export type TActivityStat = z.infer<typeof ActivityStatSchema>;
export type TSlotDefinition = z.infer<typeof SlotDefinitionSchema>;
export type TResidentActivity = z.infer<typeof ResidentActivitySchema>;
export type TAnnotationSlot = z.infer<typeof AnnotationSlotSchema>;
export type TAnnotationEvent = z.infer<typeof AnnotationEventSchema>;
export type TPendingQuestion = z.infer<typeof PendingQuestionSchema>;
export type TConnectedDevice = z.infer<typeof ConnectedDeviceSchema>;
export type TMemberRoutingPattern = z.infer<typeof MemberRoutingPatternSchema>;
export type TResidentOverrides = z.infer<typeof ResidentOverridesSchema>;
export type TProjectPrivacyPolicy = z.infer<typeof ProjectPrivacyPolicySchema>;
export type TProjectDetail = z.infer<typeof ProjectDetailSchema>;
export type TSubmitAnnotationAnswerInput = z.infer<
	typeof SubmitAnnotationAnswerInputSchema
>;
export type TAnnotationAnswerResult = z.infer<
	typeof AnnotationAnswerResultSchema
>;
