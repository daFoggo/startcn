import {
	IconExternalLink as ExternalLink,
	IconLoader2 as Loader2,
	IconBrandTelegram as Send,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { useTelegramMutations } from "../queries";

export const TelegramLinkCard = () => {
	const { startLink } = useTelegramMutations();

	const handleStartLink = async () => {
		try {
			const result = await startLink.mutateAsync();
			window.open(result.link_url, "_blank", "noopener,noreferrer");
			toast.success("Telegram link opened");
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Could not create Telegram link. Try again."),
			);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Send className="size-4" />
					Telegram account
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Connect this web account to the Telegram bot so mobile chat actions
					can open and authenticate the web app.
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={handleStartLink}
					disabled={startLink.isPending}
				>
					{startLink.isPending ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<ExternalLink className="size-4" />
					)}
					<span>Connect Telegram</span>
				</Button>
			</CardContent>
		</Card>
	);
};
