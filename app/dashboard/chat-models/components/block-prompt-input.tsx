"use client";

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

interface IBlockPromptInputProps {
    modelId?: string;
}

export const BlockPromptInput = ({ modelId }: IBlockPromptInputProps) => {
  const usage = {
    inputTokens: 1200,
    outputTokens: 3400,
    totalTokens: 4600,
    cachedInputTokens: 0,
    reasoningTokens: 0,
  };

  const maxTokens = 128_000;
  const usedTokens = usage.totalTokens;

  return (
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
  );
};
