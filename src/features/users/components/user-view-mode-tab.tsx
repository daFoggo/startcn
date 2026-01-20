import { Grid3x3, List, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "../types/user.types";
import { UserViewMode } from "../utils/constants";
import { ListViewContent } from "./list-view-content";
import { TableViewContent } from "./table-view-content";

interface UserViewModeTabProps {
	users: User[];
	currentViewMode: UserViewMode;
	onViewModeChange: (viewMode: UserViewMode) => void;
}

export const UserViewModeTab = ({
	users,
	currentViewMode,
	onViewModeChange,
}: UserViewModeTabProps) => {
	const handleGetViewModesData = (users: User[]) => [
		{
			value: UserViewMode.LIST,
			icon: <List className="size-4" />,
			label: "List",
			content: <ListViewContent users={users} />,
		},
		{
			value: UserViewMode.TABLE,
			icon: <Table2 />,
			label: "Table",
			content: <TableViewContent users={users} />,
		},
		{
			value: UserViewMode.GRID,
			icon: <Grid3x3 />,
			label: "Grid",
			content: <div>Grid View Placeholder</div>,
		},
	];

	const viewModesData = handleGetViewModesData(users);

	return (
		<Tabs
			value={currentViewMode}
			onValueChange={(v) => onViewModeChange(v as UserViewMode)}
		>
			<TabsList>
				{viewModesData.map((viewMode) => (
					<TabsTrigger key={viewMode.value} value={viewMode.value}>
						{viewMode.icon}
						{viewMode.label}
					</TabsTrigger>
				))}
			</TabsList>
			{viewModesData.map((viewMode) => (
				<TabsContent key={viewMode.value} value={viewMode.value}>
					{viewMode.content}
				</TabsContent>
			))}
		</Tabs>
	);
};
