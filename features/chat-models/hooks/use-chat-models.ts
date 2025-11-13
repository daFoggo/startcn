"use client";

import useSWR from "swr";
// import { ChatModelsAPI } from "../api/client";
import { SAMPLE_MODELS } from "../lib/constants";

// Real hook
// export function useChatModels() {
//   return useSWR("chat-models", () => ChatModelsAPI.getModels());
// }

export function useSampleModels() {
  return useSWR("sample-chat-models", () => Promise.resolve(SAMPLE_MODELS), {
    revalidateOnFocus: false,
  });
}
