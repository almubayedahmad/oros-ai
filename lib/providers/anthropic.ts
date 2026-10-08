import type { AIProvider, ProviderMessage } from "./types";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1";

type AnthropicMessage = {
  role: "user" | "assistant";
  content: string;
};

type AnthropicResponse = {
  content?: Array<{ type?: string; text?: string }>;
};

async function generateAnthropic(messages: ProviderMessage[]): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const systemMessages = messages.filter((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const anthropicMessages: AnthropicMessage[] = chatMessages.map((message) => ({
    role: message.role as "user" | "assistant",
    content: message.content
  }));

  const systemPrompt = systemMessages.length > 0 ? systemMessages.map((m) => m.content).join("\n\n") : undefined;

  const payload: Record<string, unknown> = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: anthropicMessages
  };

  if (systemPrompt) {
    payload.system = systemPrompt;
  }

  let response: Response;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    response = await fetch(`${ANTHROPIC_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Anthropic request timeout (30s exceeded)");
      }
      throw new Error(`Anthropic request failed: ${error.message}`);
    }
    throw new Error("Anthropic request failed: Unknown error");
  }

  if (!response.ok) {
    let responseText = "Unable to read error response";
    try {
      responseText = await response.text();
    } catch {
      // noop
    }
    throw new Error(`Anthropic API error ${response.status}: ${responseText.slice(0, 200)}`);
  }

  let data: AnthropicResponse;
  try {
    data = (await response.json()) as AnthropicResponse;
  } catch {
    throw new Error("Anthropic returned invalid JSON");
  }

  const textContent = data?.content?.find((item) => item.type === "text");
  const content = textContent?.text;

  if (!content || typeof content !== "string") {
    throw new Error("Anthropic returned empty or malformed response");
  }

  return content;
}

async function* streamAnthropic(messages: ProviderMessage[]): AsyncGenerator<string> {
  const text = await generateAnthropic(messages);
  yield text;
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
