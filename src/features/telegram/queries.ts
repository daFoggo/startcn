import { useMutation } from "@tanstack/react-query";
import { startTelegramLinkFn } from "./functions";

export const useTelegramMutations = () => {
	const startLink = useMutation({
		mutationFn: () => startTelegramLinkFn(),
	});

	return { startLink };
};
