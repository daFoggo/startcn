import { IconSubtitlesAi } from "@tabler/icons-react";
import { SITE_CONFIG } from "@/configs/site";

export const AuthPageHeader = () => {
	return (
		<div className="flex w-full items-center gap-2">
			<IconSubtitlesAi className="size-5!" />
			<span className="text-lg font-semibold">{SITE_CONFIG.app.title}</span>
		</div>
	);
};
