import "@tanstack/react-start/server-only";
import type {
	TAnnotationAnswerResult,
	TProjectDetail,
	TProjectListItem,
	TSubmitAnnotationAnswerInput,
} from "./schemas";

const projects: TProjectDetail[] = [
	{
		id: "energy-water-2026",
		name: "Residential energy and water behavior",
		organization: {
			id: "smart-building-lab",
			name: "Smart Building Systems Lab",
		},
		status: "active",
		description:
			"A 12-week residential study that learns household routines from energy, hot-water, presence, and calendar signals while asking residents only for uncertain labels.",
		goals: [
			"Improve appliance and activity labels without cameras or continuous audio.",
			"Measure how quickly interactive learning reduces daily resident prompts.",
			"Keep every label auditable through source and confidence provenance.",
		],
		studyTimeline: "May 20 - August 12, 2026",
		householdName: "Nguyen household",
		members: ["Harry", "Mia", "Linh"],
		stats: {
			coverage: 78,
			pendingQuestions: 2,
			autoResolvedEvents: 18,
			totalEventsToday: 26,
			userResolvedEvents: 6,
		},
		activities: [
			{
				id: "cooking",
				name: "Cooking at home",
				description:
					"Labels kitchen load shapes, appliance usage, and meal context.",
				what: "Cooking, heating drinks, oven preheat, dishwasher runs, and related kitchen events.",
				where:
					"Inferred from kitchen circuit, plug-level meters, and Wi-Fi presence.",
				when: "Breakfast, lunch, dinner, and short late snack windows when confidence is low.",
				who: "Learns the likely household member from prior confirmations and presence.",
				stats: [
					{ label: "Energy", value: "9.4 kWh", helper: "today" },
					{ label: "Hot water", value: "72 L", helper: "kitchen + dish" },
					{ label: "Questions", value: "1", helper: "asked today" },
				],
				slots: [
					{
						name: "Appliance",
						labelSpace: "kettle, oven, toaster, dishwasher, other",
						sourcePolicy:
							"Smart-meter shape first, resident if confidence < 0.85",
					},
					{
						name: "Meal context",
						labelSpace: "breakfast, lunch, dinner, snack, drink",
						sourcePolicy: "Inferred from time window and appliance label",
					},
					{
						name: "Who was home",
						labelSpace: "household member set",
						sourcePolicy: "Wi-Fi presence and redirect confirmations",
					},
				],
			},
			{
				id: "laundry",
				name: "Laundry",
				description:
					"Detects washer and dryer cycles, routing ownership, and exceptions.",
				what: "Washer cycle, dryer cycle, hand-wash exception, and combined laundry routine.",
				where: "Laundry circuit and utility-room presence.",
				when: "Morning and weekend windows, with exceptions captured from answers.",
				who: "Prefers the member historically associated with the cycle time.",
				stats: [
					{ label: "Cycles", value: "2", helper: "today" },
					{ label: "Auto", value: "1", helper: "resolved" },
					{ label: "Pending", value: "1", helper: "routing check" },
				],
				slots: [
					{
						name: "Cycle type",
						labelSpace: "washer, dryer, both, not laundry",
						sourcePolicy: "Circuit signature and resident confirmation",
					},
					{
						name: "Responsible member",
						labelSpace: "household members",
						sourcePolicy: "Learned pattern plus not-me redirects",
					},
				],
			},
			{
				id: "sleep",
				name: "Sleep comfort",
				description:
					"Morning-only subjective check-in linked to bedroom environment.",
				what: "Rested score, disruption notes, and comfort context.",
				where: "Bedroom temperature, HVAC set point, and presence interval.",
				when: "One morning check-in after wake-up, never at night.",
				who: "Asks the member associated with the bedroom presence pattern.",
				stats: [
					{ label: "In bed", value: "7h 28m", helper: "last night" },
					{ label: "Bedroom", value: "19 C", helper: "median" },
					{ label: "Score", value: "4 / 5", helper: "you said" },
				],
				slots: [
					{
						name: "Rested score",
						labelSpace: "1, 2, 3, 4, 5",
						sourcePolicy: "Resident only, morning prompt",
					},
					{
						name: "Environmental context",
						labelSpace: "temperature, humidity, HVAC set point",
						sourcePolicy: "Sensor auto with privacy-filtered quote",
					},
				],
			},
		],
		recentEvents: [
			{
				id: "evt-kettle-1908",
				activityId: "cooking",
				activityName: "Cooking at home",
				timestamp: "Today 19:08",
				title: "Kettle - two cups of tea",
				context: "kitchen - 19:08 - 12 min - 1.8 kW",
				question:
					"The kitchen load looks like a kettle boil, but it lasted longer than usual. Was this mainly the kettle?",
				response: "Kettle - two cups of tea",
				source: "YOU_SAID",
				confidence: 0.72,
				slotsFilled: 4,
				slotsTotal: 5,
				slots: [
					{
						name: "Appliance",
						value: "Kettle",
						source: "YOU_SAID",
						filled: true,
					},
					{
						name: "Meal context",
						value: "Making tea",
						source: "BOT_INFERRED",
						filled: true,
					},
					{
						name: "Kind of day",
						value: "Workday",
						source: "CALENDAR",
						filled: true,
					},
					{
						name: "Who was home",
						value: "Harry and Mia",
						source: "SENSOR_AUTO",
						filled: true,
					},
					{
						name: "Comfort note",
						value: "Queued for morning recap",
						source: "LATER",
						filled: false,
					},
				],
			},
			{
				id: "evt-oven-1732",
				activityId: "cooking",
				activityName: "Cooking at home",
				timestamp: "Today 17:32",
				title: "Oven preheat",
				context: "kitchen - 17:32 - 18 min - 2.2 kW",
				question: "Auto-resolved, no question asked",
				response: "Oven preheat",
				source: "SENSOR_AUTO",
				confidence: 0.93,
				slotsFilled: 5,
				slotsTotal: 5,
				slots: [
					{
						name: "Appliance",
						value: "Oven",
						source: "SENSOR_AUTO",
						filled: true,
					},
					{
						name: "Meal context",
						value: "Dinner",
						source: "BOT_INFERRED",
						filled: true,
					},
				],
			},
			{
				id: "evt-laundry-0815",
				activityId: "laundry",
				activityName: "Laundry",
				timestamp: "Today 08:15",
				title: "Washer cycle needs routing",
				context: "utility room - 08:15 - 41 min - 0.9 kWh",
				question:
					"This looks like a washer cycle. Were you the person who started it?",
				source: "PENDING",
				confidence: 0.61,
				slotsFilled: 2,
				slotsTotal: 4,
				slots: [
					{
						name: "Cycle type",
						value: "Washer",
						source: "SENSOR_AUTO",
						filled: true,
					},
					{
						name: "Responsible member",
						value: "Pending",
						source: "PENDING",
						filled: false,
					},
				],
			},
			{
				id: "evt-sleep-0642",
				activityId: "sleep",
				activityName: "Sleep comfort",
				timestamp: "Today 06:42",
				title: "Morning rested score",
				context: "bedroom - 23:14 to 06:42 - 19 C",
				question: "How rested do you feel?",
				response: "4 / 5",
				source: "YOU_SAID",
				confidence: 1,
				slotsFilled: 3,
				slotsTotal: 3,
				slots: [
					{
						name: "Rested score",
						value: "4 / 5",
						source: "YOU_SAID",
						filled: true,
					},
					{
						name: "Bedroom temperature",
						value: "19 C",
						source: "SENSOR_AUTO",
						filled: true,
					},
				],
			},
			{
				id: "evt-mystery-0918",
				activityId: "cooking",
				activityName: "Cooking at home",
				timestamp: "Today 09:18",
				title: "Small kitchen draw",
				context: "kitchen - 09:18 - 2 min - 0.4 kW",
				question: "Saved for recap because the daily prompt budget is tight.",
				source: "LATER",
				confidence: 0.44,
				slotsFilled: 1,
				slotsTotal: 4,
				slots: [
					{
						name: "Location",
						value: "Kitchen circuit",
						source: "SENSOR_AUTO",
						filled: true,
					},
					{
						name: "Appliance",
						value: "Queued",
						source: "LATER",
						filled: false,
					},
				],
			},
		],
		pendingQuestions: [
			{
				id: "pq-laundry-0815",
				activityId: "laundry",
				activityName: "Laundry",
				context: "utility room - 08:15 - 41 min - 0.9 kWh",
				question:
					"This looks like a washer cycle. Were you the person who started it?",
				quickActions: ["Yes, me", "No, ask Linh", "Ask Mia", "Ask later"],
				canRedirectMembers: ["Mia", "Linh"],
			},
			{
				id: "pq-cooking-0918",
				activityId: "cooking",
				activityName: "Cooking at home",
				context: "kitchen - 09:18 - 2 min - 0.4 kW",
				question:
					"There was a short kitchen draw after breakfast. Did someone use the toaster?",
				quickActions: ["Yes, toaster", "No, kettle", "Other", "Ask later"],
				canRedirectMembers: ["Mia", "Linh"],
			},
		],
		overrides: {
			quietHoursStart: "21:00",
			quietHoursEnd: "09:00",
			dailyQuestionLimit: 5,
			scenarios: [
				{
					id: "away",
					name: "I am away",
					description: "Queue questions until presence returns.",
					enabled: false,
				},
				{
					id: "guests",
					name: "Guests at home",
					description: "Relax household member routing for shared activities.",
					enabled: true,
				},
				{
					id: "silent-today",
					name: "Silent mode today",
					description: "Only show questions inside the web dashboard.",
					enabled: false,
				},
			],
			connectedDevices: [
				{
					id: "kitchen-meter",
					name: "Kitchen sub-meter",
					type: "Electricity",
					status: "connected",
					detail: "Last reading 1 min ago",
				},
				{
					id: "hot-water-flow",
					name: "Hot-water flow meter",
					type: "Water",
					status: "connected",
					detail: "Last reading 4 min ago",
				},
				{
					id: "wifi-presence",
					name: "Wi-Fi presence",
					type: "Presence",
					status: "attention",
					detail: "Linh phone missing since yesterday",
				},
			],
			memberRouting: [
				{
					activityId: "cooking",
					activityName: "Cooking at home",
					primaryMember: "Mia",
					confidence: 74,
					note: "Dinner events usually route to Mia; tea events route to Harry.",
				},
				{
					activityId: "laundry",
					activityName: "Laundry",
					primaryMember: "Linh",
					confidence: 68,
					note: "Morning cycles usually route to Linh, but exceptions are common.",
				},
				{
					activityId: "sleep",
					activityName: "Sleep comfort",
					primaryMember: "Harry",
					confidence: 91,
					note: "Ask only in the morning after wake-up detection.",
				},
			],
		},
		privacyPolicy: {
			summary:
				"AnnoBot can quote compact sensor evidence in questions, but it does not show raw continuous traces to residents or other household members.",
			quotableSensors: [
				"Room or circuit label",
				"Event time and duration",
				"Power or water magnitude",
				"Presence summary",
				"Calendar day type",
			],
			fullPolicy: [
				"Questions can include event-level sensor summaries such as room, time, duration, and approximate load.",
				"Camera and continuous audio are not part of this resident study scope.",
				"Residents can correct labels and leave the project from the web app.",
				"Auto-resolved labels retain source and confidence provenance for audit.",
			],
		},
	},
	{
		id: "comfort-pilot",
		name: "Apartment comfort check-ins",
		organization: {
			id: "urban-housing-group",
			name: "Urban Housing Research Group",
		},
		status: "ended",
		description:
			"A completed pilot focused on thermal comfort and short morning check-ins.",
		goals: ["Validate low-burden comfort questions for occupied apartments."],
		studyTimeline: "February 1 - March 15, 2026",
		householdName: "Nguyen household",
		members: ["Harry", "Mia"],
		stats: {
			coverage: 92,
			pendingQuestions: 0,
			autoResolvedEvents: 11,
			totalEventsToday: 12,
			userResolvedEvents: 1,
		},
		activities: [],
		recentEvents: [],
		pendingQuestions: [],
		overrides: {
			quietHoursStart: "22:00",
			quietHoursEnd: "08:00",
			dailyQuestionLimit: 2,
			scenarios: [],
			connectedDevices: [],
			memberRouting: [],
		},
		privacyPolicy: {
			summary: "Completed pilot. Data collection is no longer active.",
			quotableSensors: [],
			fullPolicy: ["The study has ended and no new prompts are scheduled."],
		},
	},
];

export async function listProjects(): Promise<TProjectListItem[]> {
	return projects.map((project) => ({
		project: {
			id: project.id,
			name: project.name,
			organization: project.organization,
			status: project.status,
		},
		stats: project.stats,
	}));
}

export async function getProjectById(
	projectId: string,
): Promise<TProjectDetail> {
	const project = projects.find((candidate) => candidate.id === projectId);

	if (!project) {
		throw new Error("Project not found.");
	}

	return project;
}

export async function submitAnnotationAnswer(
	input: TSubmitAnnotationAnswerInput,
): Promise<TAnnotationAnswerResult> {
	const project = projects.find(
		(candidate) => candidate.id === input.projectId,
	);
	const question = project?.pendingQuestions.find(
		(candidate) => candidate.id === input.questionId,
	);

	if (!project || !question) {
		throw new Error("Pending question not found.");
	}

	return {
		eventId: `answered-${input.questionId}`,
		message: `Saved "${input.answer}" for ${question.activityName}. Similar events will be quieter next time.`,
		slotsFilled: 4,
		slotsTotal: 5,
	};
}
