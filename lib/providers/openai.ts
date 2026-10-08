import type { AIProvider, ProviderMessage } from "./types";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type OpenAIMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

async function generateOpenAI(messages: ProviderMessage[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openaiMessages: OpenAIMessage[] = messages.map((message) => ({
    role: message.role,
    content: message.content
  }));

  let response: Response;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: false,
        messages: openaiMessages
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("OpenAI request timeout (30s exceeded)");
      }
      throw new Error(`OpenAI request failed: ${error.message}`);
    }
    throw new Error("OpenAI request failed: Unknown error");
  }

  if (!response.ok) {
    let responseText = "Unable to read error response";
    try {
      responseText = await response.text();
    } catch {
      // noop
    }
    throw new Error(`OpenAI API error ${response.status}: ${responseText.slice(0, 200)}`);
  }

  let data: OpenAIResponse;
  try {
    data = (await response.json()) as OpenAIResponse;
  } catch {
    throw new Error("OpenAI returned invalid JSON");
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenAI returned empty or malformed response");
  }

  return content;
}

async function* streamOpenAI(messages: ProviderMessage[]): AsyncGenerator<string> {
  const text = await generateOpenAI(messages);
  yield text;
}

export const openaiProvider: AIProvider = {
  id: "openai",
  name: "OpenAI Compatible",
  capabilities: ["chat", "coding", "reasoning"],
  status: OPENAI_API_KEY ? "enabled" : "disabled",
  enabled: Boolean(OPENAI_API_KEY),
  async generate(messages) {
    return generateOpenAI(messages);
  },
  stream(messages) {
    return streamOpenAI(messages);
  }
};
