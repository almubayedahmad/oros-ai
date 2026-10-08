import { demoProvider } from "./demo";
import { openaiProvider } from "./openai";
import { anthropicProvider } from "./anthropic";
import { googleProvider } from "./google";

export const providerRegistry = [openaiProvider, anthropicProvider, googleProvider];

export function getEnabledProviders() {
  return providerRegistry.filter((provider) => provider.enabled);
}

export function getDemoMode() {
  return getEnabledProviders().length === 0;
}

export function getBestProviderForChat(message: string) {
  const providers = getEnabledProviders();

  if (!providers.length) {
    return demoProvider;
  }

  const normalized = message.toLowerCase();
  const priority = [
    { matcher: /(code|function|bug|fix|implement|typescript|javascript|python|sql)/i, providerId: "openai" },
    { matcher: /(analyze|reason|compare|logic|architecture)/i, providerId: "anthropic" },
    { matcher: /(translate|summarize|rewrite|image|vision)/i, providerId: "google" }
  ];

  for (const rule of priority) {
    const match = rule.matcher.test(normalized);
    if (match) {
      const provider = providers.find((item) => item.id === rule.providerId);
      if (provider) {
        return provider;
      }
    }
  }

  return providers[0];
}

export * from "./types";
