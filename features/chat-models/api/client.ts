import type { ComboBoxOption } from "@/components/common/combo-box";
import { kyClient } from "@/lib/ky";

export const ChatModelsAPI = {
  getModels(): Promise<ComboBoxOption[]> {
    return kyClient.get("chat-models").json();
  },
};
