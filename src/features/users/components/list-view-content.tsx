import { Copy, ExternalLink, MapPinHouse, Phone, UserPen } from "lucide-react";
import { Fragment } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import type { User } from "../types/user.types";

interface ListViewContentProps {
	users: User[];
}

export const ListViewContent = ({ users }: ListViewContentProps) => {
	const handleCopyPhoneNum = (phone: string) => {
		navigator.clipboard.writeText(phone);
		toast.success("Phone number copied to clipboard");
	};
	return (
		<ItemGroup>
			{users.map((user) => (
				<Fragment key={`item-${user?.id}`}>
					<Item
						variant="outline"
						className="hover:border-primary/70 hover:bg-primary/10 transition-colors duration-300"
					>
						<ItemMedia>
							<Avatar>
								<AvatarImage />
								<AvatarFallback>
									{user?.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{user?.name}</ItemTitle>
							<ItemDescription>{user?.email}</ItemDescription>
						</ItemContent>

						<ItemActions>
							<Button variant="secondary">
								<UserPen />
								View detail
							</Button>
						</ItemActions>

						<ItemFooter>
							<div className="flex gap-2 items-center">
								<ButtonGroup>
									<Button size="sm" variant="secondary">
										<Phone className="size-3" />
										{user?.phone}
									</Button>
									<Button
										size="icon-sm"
										variant="secondary"
										onClick={() => handleCopyPhoneNum(user?.phone)}
									>
										<Copy className="size-3" />
									</Button>
								</ButtonGroup>

								<Separator orientation="vertical" />

								<div className="flex gap-1 items-center">
									<MapPinHouse className="size-3" />
									<span>
										{user?.address.street}, {user?.address.city}
									</span>
								</div>
								<Separator orientation="vertical" />

								<a
									href={user?.website}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary hover:underline transition-all duration-300 flex gap-1 items-center"
								>
									<span>{user?.website}</span>
									<ExternalLink className="size-3" />
								</a>
							</div>
						</ItemFooter>
					</Item>
				</Fragment>
			))}
		</ItemGroup>
	);
};
