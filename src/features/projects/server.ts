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
				title: "Kettle or oven?",
				context: "kitchen - 19:07 to 19:19 - 2.2 kW peak",
				question:
					"The kitchen load looks like a kettle boil, but it lasted longer than usual. Was this mainly the kettle?",
				source: "PENDING",
				confidence: 0.72,
				slotsFilled: 3,
				slotsTotal: 5,
				slots: [
					{
						name: "Appliance",
						value: "Pending",
						source: "PENDING",
						filled: false,
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
				id: "evt-laundry-1851",
				activityId: "laundry",
				activityName: "Laundry",
				timestamp: "Today 18:51",
				title: "Washer cycle needs routing",
				context: "utility room - 18:51 to 19:15 - 0.9 kWh",
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
				id: "evt-dishwasher-1917",
				activityId: "cooking",
				activityName: "Cooking at home",
				timestamp: "Today 19:17",
				title: "Dishwasher review sample",
				context: "kitchen - 19:17 to 19:23 - low-confidence pattern",
				question:
					"Saved for review because this overlaps with the kettle window.",
				source: "LATER",
				confidence: 0.58,
				slotsFilled: 2,
				slotsTotal: 4,
				slots: [
					{
						name: "Appliance",
						value: "Dishwasher candidate",
						source: "SENSOR_AUTO",
						filled: true,
					},
					{
						name: "Confidence reason",
						value: "Overlap",
						source: "SENSOR_AUTO",
						filled: true,
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
				id: "pq-cooking-1908",
				activityId: "cooking",
				activityName: "Cooking at home",
				context: "kitchen - 19:07 to 19:19 - 2.2 kW peak",
				question:
					"The kitchen load overlaps with another signal. Was this mainly the kettle?",
				quickActions: ["Kettle", "Oven", "Dishwasher", "Ask later"],
				canRedirectMembers: ["Mia", "Linh"],
			},
			{
				id: "pq-laundry-1851",
				activityId: "laundry",
				activityName: "Laundry",
				context: "utility room - 18:51 to 19:15 - 0.9 kWh",
				question:
					"This looks like a washer cycle. Were you the person who started it?",
				quickActions: ["Yes, me", "No, ask Linh", "Ask Mia", "Ask later"],
				canRedirectMembers: ["Mia", "Linh"],
			},
		],
		buildingContext: {
			liveAt: "27 May 2026 - 19:21",
			metrics: [
				{
					label: "Whole-house",
					value: "2.34 kW",
					helper: "live load",
				},
				{
					label: "Hot water flow",
					value: "0.0 L/min",
					helper: "idle",
				},
				{
					label: "Occupants",
					value: "2 home",
					helper: "Wi-Fi + presence",
				},
			],
			powerTraceKw: [
				0.4, 0.7, 0.9, 1.0, 1.8, 2.4, 2.6, 2.5, 2.3, 1.1, 1.8, 2.2, 2.0, 1.7,
				0.8, 1.3, 2.0, 2.34,
			],
			waterFlowTraceLpm: [
				0, 0, 0, 0, 0, 0.6, 1.8, 2.4, 1.2, 0.2, 0, 0, 0.4, 1.1, 0.8, 0.2, 0, 0,
			],
			activityWindows: [
				{
					id: "washer-1851",
					activityId: "laundry",
					label: "Washer cycle",
					start: "18:51",
					end: "19:15",
					colorKey: "laundry",
					lane: 1,
				},
				{
					id: "kettle-1907",
					activityId: "cooking",
					label: "Kettle / kitchen load",
					start: "19:07",
					end: "19:19",
					colorKey: "kettle",
					lane: 2,
				},
				{
					id: "dishwasher-1917",
					activityId: "cooking",
					label: "Dishwasher review sample",
					start: "19:17",
					end: "19:23",
					colorKey: "dishwasher",
					lane: 3,
				},
			],
			pendingItems: [
				{
					id: "ctx-kettle-1908",
					time: "19:08",
					title: "Kitchen circuit",
					context: "2.2 kW peak - 12 min - kettle or oven?",
					status: "ASKING NOW",
				},
				{
					id: "ctx-washer-1851",
					time: "18:51",
					title: "Washer cycle",
					context: "24 min - needs household member routing",
					status: "ASKING",
				},
				{
					id: "ctx-dishwasher-1917",
					time: "19:17",
					title: "Low-confidence dishwasher",
					context: "overlaps with kitchen load window",
					status: "REVIEW",
				},
			],
			autoResolvedItems: [
				{
					id: "auto-oven-1732",
					time: "17:32",
					title: "Oven preheat",
					context: "inferred from circuit and duration",
					status: "0.93",
				},
				{
					id: "auto-washer-1205",
					time: "12:05",
					title: "Washing machine cycle",
					context: "recurring weekly pattern",
					status: "0.91",
				},
				{
					id: "auto-unknown-0918",
					time: "09:18",
					title: "Unknown kitchen draw",
					context: "flagged for batched recap",
					status: "0.44",
				},
			],
			learningSummary:
				"Interactive-learning report: 73% of today's events labelled without asking. 4 user prompts so far with a cap of 6.",
		},
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
					location: "Kitchen circuit",
					reading: "2.2 kW peak",
					latency: "1 min",
				},
				{
					id: "hot-water-flow",
					name: "Hot-water flow meter",
					type: "Water",
					status: "connected",
					detail: "Last reading 4 min ago",
					location: "Hot-water inlet",
					reading: "0.0 L/min",
					latency: "4 min",
				},
				{
					id: "wifi-presence",
					name: "Wi-Fi presence",
					type: "Presence",
					status: "attention",
					detail: "Linh phone missing since yesterday",
					location: "Household router",
					reading: "2 occupants",
					latency: "live",
				},
				{
					id: "bedroom-climate",
					name: "Bedroom climate",
					type: "Environment",
					status: "connected",
					detail: "Last reading 2 min ago",
					location: "Bedroom",
					reading: "19 C",
					latency: "2 min",
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
		buildingContext: {
			liveAt: "27 May 2026 - 19:21",
			metrics: [],
			powerTraceKw: [],
			waterFlowTraceLpm: [],
			activityWindows: [],
			pendingItems: [],
			autoResolvedItems: [],
			learningSummary:
				"This study has ended and live context is no longer streaming.",
		},
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
