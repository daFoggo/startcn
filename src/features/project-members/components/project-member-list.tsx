import { DataTable } from "@/components/common/data-table";
import { RoleBadge } from "@/components/common/role-badge";
import type { TProjectMember } from "../schemas";
import { getProjectMemberColumns } from "./columns";

interface IProjectMemberListProps {
	teamId?: string;
	members: TProjectMember[];
	currentUserId?: string;
	canManageProject?: boolean;
}

/**
 * Thành phần hiển thị danh sách tất cả các thành viên đang tham gia Project.
 * Hoàn toàn ủy thác việc xử lý loading/error cho Suspense Boundary cấp Route.
 */
export const ProjectMemberList = ({
	teamId,
	members,
	currentUserId,
	canManageProject = true,
}: IProjectMemberListProps) => {
	const projectMemberColumns = getProjectMemberColumns({
		currentUserId,
		teamId,
	});
	const columns = canManageProject
		? projectMemberColumns
		: projectMemberColumns
				.filter((column) => column.id !== "actions")
				.map((column) =>
					column.id === "role" || (column as any).accessorKey === "role"
						? {
								...column,
								cell: ({ row }: any) => <RoleBadge role={row.original.role} />,
							}
						: column,
				);

	return (
		<DataTable<TProjectMember>
			data={members}
			columns={columns}
			getRowId={(row) => row.id}
			showPagination={false}
			enablePagination={false}
			enableRowSelection={false}
			enableColumnReorder={false}
			enableColumnPinning={false}
		/>
	);
};
