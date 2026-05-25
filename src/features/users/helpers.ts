import { getHours } from "date-fns";

/**
 * @description Helper function to get a random personalized greeting based on the time of day.
 * @param name The user's name to include in the greeting.
 * @returns A string containing a random greeting.
 */
export const getUserGreeting = (name: string): string => {
	const hour = getHours(new Date());

	// Sáng sớm (4–6h)
	if (hour >= 4 && hour < 6) {
		const greetings = [
			`Early bird mode, ${name}! Let's crush it.`,
			`Rise and shine, ${name}! Time to win.`,
			`Dawn warrior, ${name}! You're already ahead.`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	// Buổi sáng (6–11h)
	if (hour >= 6 && hour < 11) {
		const greetings = [
			`Morning, ${name}! Ready to make waves?`,
			`Good morning, ${name}! Let's get to work.`,
			`Rise & shine, ${name}! Today is yours.`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	// Trưa (11–13h)
	if (hour >= 11 && hour < 13) {
		const greetings = [
			`Midday grind, ${name}! Keep the fire going.`,
			`High noon, ${name}! Still crushing it?`,
			`Noon warrior, ${name}! Momentum is everything.`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	// Chiều (13–17h)
	if (hour >= 13 && hour < 17) {
		const greetings = [
			`Afternoon hustle, ${name}! Finish strong.`,
			`PM powerhouse, ${name}! Almost there.`,
			`Good afternoon, ${name}! Keep pushing.`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	// Tối (17–21h)
	if (hour >= 17 && hour < 21) {
		const greetings = [
			`Evening shift, ${name}! Wrapping up?`,
			`Sunset hustle, ${name}! One last push.`,
			`Good evening, ${name}! Let's finish strong.`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	// Đêm khuya (21h+ và 0–4h)
	const greetings = [
		`Night owl mode, ${name}! Focus time.`,
		`Midnight magic, ${name}! Shipping soon?`,
		`Moonlight coder, ${name}! Make it count.`,
		`3AM club, ${name}! Respect the grind.`,
	];
	return greetings[Math.floor(Math.random() * greetings.length)];
};
