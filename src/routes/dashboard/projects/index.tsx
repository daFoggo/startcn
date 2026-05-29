import { IconSearch } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ProjectCard, projectsListQueryOptions } from "@/features/projects";

export const Route = createFileRoute("/dashboard/projects/")({
	loader: ({ context }) => {
		return context.queryClient.ensureQueryData(projectsListQueryOptions());
	},
	component: ProjectsRoute,
	staticData: {
		getTitle: () => "Projects",
		hideSidebar: true,
		pageHeader: {
			title: "Projects",
			description:
				"Choose a resident study to review pending questions, coverage, logs, and project controls.",
		},
		pageContainerSize: "default",
	},
});

function ProjectsRoute() {
	const { data: projects } = useSuspenseQuery(projectsListQueryOptions());

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<InputGroup className="md:max-w-80">
					<InputGroupAddon>
						<IconSearch />
					</InputGroupAddon>
					<InputGroupInput
						aria-label="Search projects"
						placeholder="Search for a project"
						type="search"
					/>
				</InputGroup>
			</div>

			<ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{projects.map(({ project, stats }) => (
					<li key={project.id} className="list-none">
						<ProjectCard project={project} stats={stats} />
					</li>
				))}
			</ul>
		</div>
	);
}
