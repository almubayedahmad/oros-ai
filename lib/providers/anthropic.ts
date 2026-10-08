import type { AIProvider, ProviderMessage } from "./types";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1";

async function generateAnthropic(messages: ProviderMessage[]) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const response = await fetch(`${ANTHROPIC_API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.content?.[0]?.text ?? "";
}

async function* streamAnthropic(messages: ProviderMessage[]) {
  const text = await generateAnthropic(messages);
  if (text) {
    yield text;
  }
}

export const anthropicProvider: AIProvider = {
  id: "anthropic",
  name: "Anthropic Claude",
  capabilities: ["chat", "reasoning", "coding"],
  status: ANTHROPIC_API_KEY ? "enabled" : "disabled",
  enabled: Boolean(ANTHROPIC_API_KEY),
  async generate(messages) {
    return generateAnthropic(messages);
  },
  stream(messages) {
    return streamAnthropic(messages);
  }
};
