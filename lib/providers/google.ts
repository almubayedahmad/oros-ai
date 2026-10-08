import type { AIProvider, ProviderMessage } from "./types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_MODEL = process.env.GOOGLE_MODEL ?? "gemini-1.5-flash";

async function generateGoogle(messages: ProviderMessage[]) {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : message.role,
          parts: [{ text: message.content }]
        }))
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Google request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function* streamGoogle(messages: ProviderMessage[]) {
  const text = await generateGoogle(messages);
  if (text) {
    yield text;
  }
}

export const googleProvider: AIProvider = {
  id: "google",
  name: "Google Gemini",
  capabilities: ["chat", "vision", "coding"],
  status: GOOGLE_API_KEY ? "enabled" : "disabled",
  enabled: Boolean(GOOGLE_API_KEY),
  async generate(messages) {
    return generateGoogle(messages);
  },
  stream(messages) {
    return streamGoogle(messages);
  }
};
