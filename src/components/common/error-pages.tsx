import {
	IconHome as Home,
	IconRotate2 as RotateCcw,
	IconAlertTriangle as TriangleAlert,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { PixelBackground } from "@/components/decorations/pixel-background";
import { AuthPageHeader } from "@/components/layout/auth/page-header";
import { Button } from "@/components/ui/button";

/**
 * Component hiển thị giao diện khi người dùng truy cập vào một route không tồn tại (404 Not Found).
 */
export const NotFound = () => {
	return (
		<PixelBackground
			className="h-screen bg-background"
			gap={10}
			speed={20}
			pattern="cursor"
			darkColors="#0d1b4b,#1a3a8f,#2563eb"
			lightColors="#bfdbfe,#93c5fd,#3b82f6"
		>
			<div className="flex h-full flex-col p-6">
				<AuthPageHeader />
				<main className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
					<p className="font-mono text-6xl font-bold text-foreground">404</p>
					<p className="text-xl text-muted-foreground">
						Oops! The page you are looking for does not exist.
					</p>
					<Button render={<Link to="/" />}>Go back home</Button>
				</main>
			</div>
		</PixelBackground>
	);
};

/**
 * Component hiển thị khi ứng dụng gặp lỗi runtime nghiêm trọng (500 Error Boundary),
 * cho phép người dùng thử tải lại trang hoặc quay về trang chủ.
 */
export const ErrorFallback = ({ reset }: { reset: () => void }) => {
	return (
		<PixelBackground
			className="h-screen bg-background"
			gap={10}
			speed={20}
			pattern="cursor"
			darkColors="#0d1b4b,#1a3a8f,#2563eb"
			lightColors="#bfdbfe,#93c5fd,#3b82f6"
		>
			<div className="flex h-full flex-col p-6">
				<AuthPageHeader />
				<main className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
					<p className="font-mono text-6xl font-bold text-foreground">500</p>
					<p className="text-xl text-muted-foreground">
						Something went wrong on our end.
					</p>
					<div className="flex gap-2">
						<Button onClick={() => reset()} variant="outline">
							Try again
							<RotateCcw className="size-4" />
						</Button>
						<Button render={<Link to="/" />}>
							Go back home
							<Home className="size-4" />
						</Button>
					</div>
				</main>
			</div>
		</PixelBackground>
	);
};

/**
 * Component hiển thị khi một layout lồng nhau bị lỗi (Nested Error Boundary),
 * không crash toàn bộ app mà chỉ crash khu vực hiển thị của layout đó.
 */
export const NestedErrorFallback = ({
	reset,
	error,
}: {
	reset: () => void;
	error?: any;
}) => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center min-h-[300px] h-full w-full">
			<div className="rounded-full bg-destructive/10 p-3 text-destructive shadow-inner">
				<TriangleAlert className="size-8" />
			</div>
			<div className="space-y-2 max-w-md mx-auto">
				<h3 className="text-lg font-semibold tracking-tight text-foreground">
					Failed to load section
				</h3>
				<p className="text-sm text-muted-foreground leading-relaxed">
					{error?.message ||
						"An unexpected error occurred while rendering this view."}
				</p>
			</div>
			<Button
				onClick={() => reset()}
				variant="outline"
				size="sm"
				className="mt-2 shadow-sm hover:shadow-md transition-all"
			>
				<RotateCcw className="size-3.5 mr-2" />
				Try reloading section
			</Button>
		</div>
	);
};
