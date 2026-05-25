import { DataTable } from "@/components/common/data-table";
import type { TTeamMember } from "../schemas";
import { getTeamMemberColumns } from "./columns";

interface ITeamMemberListProps {
	members: TTeamMember[];
	currentUserId?: string;
}

/**
 * Hiển thị danh sách các thành viên trong Team dưới dạng bảng dữ liệu (DataTable).
 */
export const TeamMemberList = ({
	members,
	currentUserId,
}: ITeamMemberListProps) => {
	const columns = getTeamMemberColumns({ members, currentUserId });

	return (
		<DataTable<TTeamMember>
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
