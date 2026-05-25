export const buildConfigPath = (projectId: string) =>
	`projects/${projectId}/task-config`;

export const buildSectionPath = (projectId: string, section: string) =>
	`${buildConfigPath(projectId)}/${section}`;
