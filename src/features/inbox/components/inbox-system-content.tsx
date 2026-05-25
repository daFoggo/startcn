import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TInboxItem } from "../schemas";

interface IInboxSystemContentProps {
	item: TInboxItem;
}

export const InboxSystemContent = ({ item }: IInboxSystemContentProps) => {
	if (!item.data || Object.keys(item.data).length === 0) return null;

	return (
		<Card className="bg-muted/30" size="sm">
			<CardHeader>
				<CardTitle className="text-sm">Additional Information</CardTitle>
				<CardDescription>Metadata and system details</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="max-h-50 overflow-auto rounded-md border border-border/50 bg-background/50 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
					<pre>{JSON.stringify(item.data, null, 2)}</pre>
				</div>
			</CardContent>
		</Card>
	);
};
