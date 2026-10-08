import type { AIProvider, ProviderMessage } from "./types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_MODEL = process.env.GOOGLE_MODEL ?? "gemini-1.5-flash";

type GoogleRole = "user" | "model";

type GoogleContent = {
  role: GoogleRole;
  parts: Array<{ text: string }>;
};

type GoogleResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

async function generateGoogle(messages: ProviderMessage[]): Promise<string> {
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured.");
  }

  const contents: GoogleContent[] = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    }));

  if (contents.length === 0) {
    throw new Error("No valid messages to send to Google");
  }

  let response: Response;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_MODEL}:generateContent?key=${encodeURIComponent(GOOGLE_API_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contents }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Google request timeout (30s exceeded)");
      }
      throw new Error(`Google request failed: ${error.message}`);
    }
    throw new Error("Google request failed: Unknown error");
  }

  if (!response.ok) {
    let responseText = "Unable to read error response";
    try {
      responseText = await response.text();
    } catch {
      // noop
    }
    throw new Error(`Google API error ${response.status}: ${responseText.slice(0, 200)}`);
  }

  let data: GoogleResponse;
  try {
    data = (await response.json()) as GoogleResponse;
  } catch {
    throw new Error("Google returned invalid JSON");
  }

  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content || typeof content !== "string") {
    throw new Error("Google returned empty or malformed response");
  }

  return content;
}

async function* streamGoogle(messages: ProviderMessage[]): AsyncGenerator<string> {
  const text = await generateGoogle(messages);
  yield text;
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
