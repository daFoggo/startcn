"use client";

import { MessageSquare } from "lucide-react";
import { Fragment, useState } from "react";
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
import { Copy } from "@/components/animate-ui/icons/copy";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { RefreshCcw } from "@/components/animate-ui/icons/refresh-ccw";
import { ThumbsDown } from "@/components/animate-ui/icons/thumbs-down";
import { ThumbsUp } from "@/components/animate-ui/icons/thumbs-up";
import { SAMPLE_MESSAGES } from "@/features/chat-models/lib/constants";
import { rehypePlugins, remarkPlugins } from "@/lib/markdown-plugins";

export const BlockConversation = () => {
	const [messages] = useState(() => SAMPLE_MESSAGES);
	const handleRetry = () => {
		console.log("Retry clicked!");
	};

	return (
		<Conversation className="px-8 py-6 overflow-hidden">
			<ConversationContent>
				{messages.length === 0 ? (
					<ConversationEmptyState
						title="No messages yet"
						description="Start chatting to see messages here"
						icon={<MessageSquare className="size-6" />}
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
									<AnimateIcon animateOnHover>
										<MessageAction label="Retry" onClick={handleRetry}>
											<RefreshCcw className="size-3" />
										</MessageAction>
									</AnimateIcon>
									<AnimateIcon animateOnHover>
										<MessageAction
											label="Copy"
											onClick={() => navigator.clipboard.writeText(m.value)}
										>
											<Copy className="size-3" />
										</MessageAction>
									</AnimateIcon>
									<AnimateIcon animateOnHover>
										<MessageAction label="Like">
											<ThumbsUp className="size-3" />
										</MessageAction>
									</AnimateIcon>
									<AnimateIcon animateOnHover>
										<MessageAction label="Dislike">
											<ThumbsDown className="size-3" />
										</MessageAction>
									</AnimateIcon>
								</MessageActions>
							)}
						</Fragment>
					))
				)}
			</ConversationContent>

			<ConversationScrollButton />
		</Conversation>
	);
};
