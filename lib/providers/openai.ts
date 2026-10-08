import type { AIProvider, ProviderMessage } from "./types";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateOpenAI(messages: ProviderMessage[]) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: false,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function* streamOpenAI(messages: ProviderMessage[]) {
  const text = await generateOpenAI(messages);
  if (text) {
    yield text;
  }
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
