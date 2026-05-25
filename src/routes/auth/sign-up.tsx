import { createFileRoute } from "@tanstack/react-router";
import { PixelBackground } from "@/components/decorations/pixel-background";
import { AuthPageHeader } from "@/components/layout/auth/page-header";
import { SignUpForm } from "@/features/auth";

export const Route = createFileRoute("/auth/sign-up")({
	component: SignUpPage,
});

function SignUpPage() {
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

				<main className="flex flex-1 items-center justify-center">
					<SignUpForm />
				</main>
			</div>
		</PixelBackground>
	);
}
