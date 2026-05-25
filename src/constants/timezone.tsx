export const TIMEZONES = (() => {
	try {
		return Intl.supportedValuesOf("timeZone").map((tz) => ({
			value: tz,
			label: tz,
		}));
	} catch (_e) {
		return [
			{ value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh" },
			{ value: "Asia/Singapore", label: "Asia/Singapore" },
			{ value: "Asia/Tokyo", label: "Asia/Tokyo" },
			{ value: "Europe/London", label: "Europe/London" },
			{ value: "America/New_York", label: "America/New_York" },
			{ value: "America/Los_Angeles", label: "America/Los_Angeles" },
		];
	}
})();
