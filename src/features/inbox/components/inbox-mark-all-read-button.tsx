import { useMatch } from "@tanstack/react-router";
import { CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInboxMutations } from "../queries";

export const InboxMarkAllReadButton = () => {
	const isActiveRoute = useMatch({
		from: "/dashboard/$teamId/inbox/active",
		shouldThrow: false,
	});

	const { markAllAsRead } = useInboxMutations();

	const handleMarkAll = async () => {
		toast.promise(markAllAsRead.mutateAsync(), {
			loading: "Đang xử lý...",
			success: "Đã đánh dấu đọc tất cả!",
			error: "Không thể cập nhật trạng thái.",
		});
	};

	if (!isActiveRoute) return null;

	return (
		<Button
			variant="outline"
			onClick={handleMarkAll}
			disabled={markAllAsRead.isPending}
		>
			{markAllAsRead.isPending ? (
				<Loader2 className="animate-spin size-4" />
			) : (
				<CheckCheck className="size-4" />
			)}
			<span>Read all</span>
		</Button>
	);
};
