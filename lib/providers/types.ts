export type ProviderCapability = "chat" | "reasoning" | "coding" | "vision" | "search";

export type ProviderMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ProviderStatus = "enabled" | "disabled";

export interface AIProvider {
  id: string;
  name: string;
  capabilities: ProviderCapability[];
  status: ProviderStatus;
  enabled: boolean;
  generate: (messages: ProviderMessage[]) => Promise<string>;
  stream: (messages: ProviderMessage[]) => AsyncIterable<string>;
}
