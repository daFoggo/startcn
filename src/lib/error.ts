export function getErrorMessage(
	error: unknown,
	fallback = "Something went wrong",
) {
	if (error instanceof Error) {
		return error.message.trim() || fallback;
	}

	if (typeof error === "string") {
		return error.trim() || fallback;
	}

	if (isRecord(error) && typeof error.message === "string") {
		return error.message.trim() || fallback;
	}

	return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
