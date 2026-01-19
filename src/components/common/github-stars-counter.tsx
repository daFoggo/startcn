import { StarIcon } from "lucide-react";
import {
	GithubStars,
	GithubStarsIcon,
	GithubStarsLogo,
	GithubStarsNumber,
	GithubStarsParticles,
} from "@/components/animate-ui/primitives/animate/github-stars";
import { SITE_CONFIG } from "@/configs/site";

export const GithubStarsCounter = () => {
	return (
		<a
			href={`https://github.com/${SITE_CONFIG.github?.username}/${SITE_CONFIG.github?.repo}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<GithubStars
				className="flex gap-2 items-center"
				username={SITE_CONFIG.github?.username}
				repo={SITE_CONFIG.github?.repo}
			>
				<GithubStarsLogo className="text-muted-foreground size-4" />
				<div className="p-1 bg-muted flex items-center gap-1 rounded-sm cursor-pointer">
					<GithubStarsNumber className="text-muted-foreground font-medium font-mono" />
					<GithubStarsParticles>
						<GithubStarsIcon
							icon={StarIcon}
							className="bg-muted size-4"
							activeClassName="text-muted-foreground"
						/>
					</GithubStarsParticles>
				</div>
			</GithubStars>
		</a>
	);
};
