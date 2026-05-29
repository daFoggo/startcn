import { IconCheck, IconMessageCircle } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useProjectMutations } from "../../queries";
import type { TPendingQuestion } from "../../schemas";
import { CardTitleWithIcon } from "./shared";

export function PendingQuestionPanel({
	priority,
	projectId,
	question,
}: {
	priority?: boolean;
	projectId: string;
	question: TPendingQuestion;
}) {
	const [answer, setAnswer] = useState(question.quickActions[0] ?? "");
	const [isResolved, setIsResolved] = useState(false);
	const { submitAnnotationAnswer } = useProjectMutations();
	const freeTextId = `${question.id}-free-text-answer`;

	if (isResolved) return null;

	const handleSubmit = async () => {
		try {
			const response = await submitAnnotationAnswer.mutateAsync({
				answer,
				projectId,
				questionId: question.id,
			});
			setIsResolved(true);
			toast.success(response.message);
		} catch (error) {
			toast.error(getErrorMessage(error, "Could not save annotation."));
		}
	};

	return (
		<Card className={cn(priority && "ring-primary/30")}>
			<CardHeader>
				<CardTitleWithIcon icon={IconMessageCircle}>
					Pending question
				</CardTitleWithIcon>
				<CardDescription>{question.context}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<p className="text-base font-medium">{question.question}</p>
				<div className="flex flex-wrap gap-2">
					{question.quickActions.map((action) => (
						<Button
							key={action}
							onClick={() => setAnswer(action)}
							variant={answer === action ? "default" : "outline"}
						>
							{action}
						</Button>
					))}
				</div>
				<label className="flex flex-col gap-1" htmlFor={freeTextId}>
					<span className="text-xs text-muted-foreground">
						Free-text answer
					</span>
					<Textarea
						id={freeTextId}
						onChange={(event) => setAnswer(event.target.value)}
						value={answer}
					/>
				</label>
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<p className="text-sm text-muted-foreground">
						Not you? Redirect choices: {question.canRedirectMembers.join(", ")}
					</p>
					<Button
						disabled={submitAnnotationAnswer.isPending || !answer.trim()}
						onClick={handleSubmit}
					>
						<IconCheck data-icon="inline-start" />
						<span>
							{submitAnnotationAnswer.isPending ? "Saving" : "Save answer"}
						</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
