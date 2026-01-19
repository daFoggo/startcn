import { createFileRoute, Link } from "@tanstack/react-router";
import { SquareArrowUpRight } from "lucide-react";
import Antigravity from "@/components/decorations/antigravity";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SITE_CONFIG } from "@/configs/site";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const metadata = SITE_CONFIG.metadata;

	return (
		<div className="flex flex-col min-h-dvh items-center justify-center space-y-4 relative">
			<Antigravity
				count={300}
				magnetRadius={6}
				ringRadius={7}
				waveSpeed={0.4}
				waveAmplitude={1}
				particleSize={1.5}
				lerpSpeed={0.05}
				color="#1447e6"
				particleVariance={1}
				rotationSpeed={0}
				depthFactor={1}
				pulseSpeed={3}
				particleShape="capsule"
				fieldStrength={10}
				className="absolute inset-0"
				autoAnimate
			/>
			<Card className="max-w-md relative z-10">
				<CardHeader>
					<CardTitle className="font-semibold">{metadata.title}</CardTitle>
					<CardDescription>{metadata.subTitle}</CardDescription>
					<CardAction>
						<Button size="icon">
							<SquareArrowUpRight className="size-4" />
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>{metadata.description}</CardContent>
				<CardFooter>
					<Link
						to="/dashboard"
						className="hover:text-primary hover:underline  duration-300"
					>
						Go to /dashboard
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
