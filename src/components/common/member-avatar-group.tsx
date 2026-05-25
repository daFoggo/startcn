import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface IMemberAvatarGroupProps<T> {
	/** Danh sách dữ liệu (User, ProjectMember, TeamMember, etc.) */
	items: T[];
	/** Số lượng avatar hiển thị tối đa trước khi nén. Default: 4 */
	max?: number;
	/** Size của avatar: "default" | "sm" | "lg". Default: "sm" */
	size?: "default" | "sm" | "lg";
	/** Hàm để trích xuất thông tin cần thiết từ item */
	getAvatarInfo: (item: T) => {
		id: string;
		name?: string | null;
		avatar_url?: string | null;
	};
	/** className cho container AvatarGroup */
	className?: string;
	/** className cho từng Avatar item */
	avatarClassName?: string;
	/** Có hiển thị tooltip tên khi hover vào từng avatar không. Default: true */
	showTooltip?: boolean;
}

/**
 * Component hiển thị nhóm avatar (Member/User Group) với tính năng tự động nén (truncation).
 * Hỗ trợ Generic để dùng được cho nhiều loại dữ liệu khác nhau.
 */
export function MemberAvatarGroup<T>({
	items,
	max = 4,
	size = "sm",
	getAvatarInfo,
	className,
	avatarClassName,
	showTooltip = true,
}: IMemberAvatarGroupProps<T>) {
	const visibleItems = items.slice(0, max);
	const remainingCount = items.length - max;

	return (
		<AvatarGroup className={cn("flex items-center", className)}>
			{visibleItems.map((item) => {
				const { id, name, avatar_url } = getAvatarInfo(item);
				const avatarElement = (
					<Avatar key={id} size={size} className={cn("", avatarClassName)}>
						<AvatarImage src={avatar_url ?? undefined} alt={name || "User"} />
						<AvatarFallback className="uppercase">
							{name?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
				);

				if (!showTooltip || !name) return avatarElement;

				return (
					<Tooltip key={id}>
						<TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
						<TooltipContent side="top" className="text-xs">
							{name}
						</TooltipContent>
					</Tooltip>
				);
			})}

			{remainingCount > 0 && (
				<AvatarGroupCount
					className={cn(
						"bg-muted font-medium text-muted-foreground ring-2 ring-background",
						size === "sm" && "text-xs",
						size === "default" && "text-xs",
						size === "lg" && "text-sm",
					)}
				>
					+{remainingCount}
				</AvatarGroupCount>
			)}
		</AvatarGroup>
	);
}
