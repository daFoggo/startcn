import { Fragment, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
	breadcrumbs?: ReactNode;
	actions: {
		id: string;
		node: ReactNode;
	}[];
}

export const DashboardHeader = ({
	breadcrumbs,
	actions,
}: DashboardHeaderProps) => {
	return (
		<header className="flex h-(--dashboard-header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--dashboard-header-height)">
			<div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 w-full">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" />
				{breadcrumbs && breadcrumbs}
				<div className="flex items-center gap-2 ml-auto">
					{actions.map((action, index) => (
						<Fragment key={action.id}>
							{action.node}
							{index < actions.length - 1 && (
								<Separator orientation="vertical" />
							)}
						</Fragment>
					))}
				</div>
			</div>
		</header>
	);
};
