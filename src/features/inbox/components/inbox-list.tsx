import { Inbox } from "lucide-react";
import { Fragment } from "react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useInboxStore } from "@/stores/use-inbox-store";
import type { TInboxItem } from "../schemas";
import { InboxItem } from "./inbox-item";

interface IInboxListProps {
	items: Array<TInboxItem>;
}

export const InboxList = ({ items }: IInboxListProps) => {
	const { selectedItemId } = useInboxStore();

	if (items.length === 0) {
		return (
			<Empty className="border-none bg-transparent">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Inbox />
					</EmptyMedia>
					<EmptyTitle>All caught up!</EmptyTitle>
					<EmptyDescription>
						You have no new inbox items at the moment.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{items.map((item) => (
				<Fragment key={item.id}>
					<InboxItem item={item} isSelected={selectedItemId === item.id} />
				</Fragment>
			))}
		</div>
	);
};
