"use client";

import {
	CopyIcon,
	MessageSquareIcon,
	RefreshCcwIcon,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { Fragment, useState } from "react";
import {
	Context,
	ContextCacheUsage,
	ContextContent,
	ContextContentBody,
	ContextContentFooter,
	ContextContentHeader,
	ContextInputUsage,
	ContextOutputUsage,
	ContextReasoningUsage,
	ContextTrigger,
} from "@/components/ai-elements/context";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageAction,
	MessageActions,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	PromptInputFooter,
	PromptInputProvider,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import type { ComboBoxOption } from "@/components/common/combo-box";
import { Card } from "@/components/ui/card";
import { SAMPLE_MESSAGES } from "@/features/chat-models/lib/constants";
import { rehypePlugins, remarkPlugins } from "@/lib/markdown-plugins";
import { BlockHeader } from "./block-header";

interface IAIChatBlockProps {
	options?: ComboBoxOption[];
	currentOption?: string;
	onOptionChange?: (value: string) => void;
	onAddBlock?: () => void;
	modelId: string;
}

export const AIChatBlock = ({
	options = [],
	currentOption,
	onOptionChange,
	onAddBlock,
	modelId,
}: IAIChatBlockProps) => {
	const [messages] = useState(() => SAMPLE_MESSAGES);

	const usage = {
		inputTokens: 1200,
		outputTokens: 3400,
		totalTokens: 4600,
		cachedInputTokens: 0,
		reasoningTokens: 0,
	};

	const maxTokens = 128_000;
	const usedTokens = usage.totalTokens;

	const handleRetry = () => {
		console.log("Retry clicked!");
	};

	return (
		<Card className="flex flex-col gap-0 p-0 h-full">
			<BlockHeader
				options={options}
				currentOption={currentOption}
				onOptionChange={onOptionChange}
				onAddBlock={onAddBlock}
			/>

			<Conversation className="px-8 py-6 overflow-hidden">
				<ConversationContent>
					{messages.length === 0 ? (
						<ConversationEmptyState
							title="No messages yet"
							description="Start chatting to see messages here"
							icon={<MessageSquareIcon className="size-6" />}
						/>
					) : (
						messages.map((m, index) => (
							<Fragment key={m.key}>
								<Message from={m.from}>
									<MessageContent>
										<MessageResponse
											parseIncompleteMarkdown
											remarkPlugins={remarkPlugins}
											rehypePlugins={rehypePlugins}
										>
											{m.value}
										</MessageResponse>
									</MessageContent>
								</Message>

								{/* Actions for latest assistant message */}
								{m.from === "assistant" && index === messages.length - 1 && (
									<MessageActions>
										<MessageAction label="Retry" onClick={handleRetry}>
											<RefreshCcwIcon className="size-3" />
										</MessageAction>

										<MessageAction
											label="Copy"
											onClick={() => navigator.clipboard.writeText(m.value)}
										>
											<CopyIcon className="size-3" />
										</MessageAction>

										<MessageAction label="Like">
											<ThumbsUp className="size-3" />
										</MessageAction>

										<MessageAction label="Dislike">
											<ThumbsDown className="size-3" />
										</MessageAction>
									</MessageActions>
								)}
							</Fragment>
						))
					)}
				</ConversationContent>

				<ConversationScrollButton />
			</Conversation>

			<div className="px-8 pb-6">
				<PromptInputProvider>
					<Context
						usedTokens={usedTokens}
						maxTokens={maxTokens}
						usage={usage}
						modelId={modelId}
					>
						<PromptInput
							onSubmit={(msg) => console.log("Submit:", msg)}
							multiple
							globalDrop
						>
							{/* Attachments */}
							<PromptInputAttachments>
								{(file) => <PromptInputAttachment data={file} />}
							</PromptInputAttachments>

							<PromptInputBody>
								<PromptInputTextarea placeholder="Type your message..." />
							</PromptInputBody>

							<PromptInputFooter>
								<div className="flex justify-between items-center w-full">
									<div className="flex items-center gap-2">
										{/* Attachment menu */}
										<PromptInputTools>
											<PromptInputActionMenu>
												<PromptInputActionMenuTrigger />
												<PromptInputActionMenuContent>
													<PromptInputActionAddAttachments />
												</PromptInputActionMenuContent>
											</PromptInputActionMenu>
										</PromptInputTools>

										{/* Context trigger */}
										<ContextTrigger />
									</div>

									<PromptInputSubmit />
								</div>
							</PromptInputFooter>
						</PromptInput>

						{/* Context hovercard */}
						<ContextContent>
							<ContextContentHeader />

							<ContextContentBody className="space-y-2">
								<ContextInputUsage />
								<ContextOutputUsage />
								<ContextReasoningUsage />
								<ContextCacheUsage />
							</ContextContentBody>

							<ContextContentFooter />
						</ContextContent>
					</Context>
				</PromptInputProvider>
			</div>
		</Card>
	);
};
