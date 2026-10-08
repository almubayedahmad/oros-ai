import type { AIProvider, ProviderMessage } from "./types";

export const demoProvider: AIProvider = {
  id: "demo",
  name: "Demo",
  capabilities: ["chat"],
  status: "disabled",
  enabled: false,
  async generate() {
    return "Demo mode is active because no provider API key is configured. Add OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY to enable live generation.";
  },
  async *stream() {
    yield "Demo mode is active because no provider API key is configured. Add OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY to enable live generation.";
  }
};
