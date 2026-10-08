import { demoProvider } from "../demo";
import { openaiProvider } from "../openai";
import { anthropicProvider } from "../anthropic";
import { googleProvider } from "../google";
import type { AIProvider } from "../types";

const providers: AIProvider[] = [demoProvider, openaiProvider, anthropicProvider, googleProvider];

describe.each(providers)("Provider: $name ($id)", (provider) => {
  it("should have required interface properties", () => {
    expect(typeof provider.id).toBe("string");
    expect(typeof provider.name).toBe("string");
    expect(Array.isArray(provider.capabilities)).toBe(true);
    expect(["enabled", "disabled"]).toContain(provider.status);
    expect(typeof provider.enabled).toBe("boolean");
  });

  it("should have generate method", () => {
    expect(typeof provider.generate).toBe("function");
  });

  it("should have stream method", () => {
    expect(typeof provider.stream).toBe("function");
  });

  it("should not expose API keys in demo responses", async () => {
    if (provider.id === "demo") {
      const result = await provider.generate([{ role: "user", content: "test" }]);
      expect(result).toContain("Demo mode");
      expect(result).not.toContain("OPENAI_API_KEY");
      expect(result).not.toMatch(/sk-/);
    }
  });
});

describe("Demo Provider Specifics", () => {
  it("should always be disabled", () => {
    expect(demoProvider.enabled).toBe(false);
    expect(demoProvider.status).toBe("disabled");
  });

  it("should have chat capability", () => {
    expect(demoProvider.capabilities).toContain("chat");
  });

  it("should return demo message without actual API call", async () => {
    const result = await demoProvider.generate([{ role: "user", content: "test" }]);
    expect(typeof result).toBe("string");
    expect(result).toContain("Demo mode");
  });
});

describe("Provider Status Consistency", () => {
  it("status should match enabled flag", () => {
    providers.forEach((provider) => {
      if (provider.status === "enabled") {
        expect(provider.enabled).toBe(true);
      } else {
        expect(provider.enabled).toBe(false);
      }
    });
  });
});
