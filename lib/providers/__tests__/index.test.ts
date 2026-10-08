import { getDemoMode, getEnabledProviders, getBestProviderForChat, providerRegistry } from "../index";
import { demoProvider } from "../demo";

describe("Provider Registry", () => {
  it("should export provider registry as array", () => {
    expect(Array.isArray(providerRegistry)).toBe(true);
    expect(providerRegistry.length).toBeGreaterThan(0);
  });

  it("should have all required provider IDs", () => {
    const ids = providerRegistry.map((provider) => provider.id);
    expect(ids).toContain("openai");
    expect(ids).toContain("anthropic");
    expect(ids).toContain("google");
  });

  it("should have unique provider IDs", () => {
    const ids = providerRegistry.map((provider) => provider.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have non-empty provider names", () => {
    providerRegistry.forEach((provider) => {
      expect(typeof provider.name).toBe("string");
      expect(provider.name.length).toBeGreaterThan(0);
    });
  });

  it("should have capabilities array", () => {
    providerRegistry.forEach((provider) => {
      expect(Array.isArray(provider.capabilities)).toBe(true);
      expect(provider.capabilities.length).toBeGreaterThan(0);
    });
  });

  it("should have valid status values", () => {
    providerRegistry.forEach((provider) => {
      expect(["enabled", "disabled"]).toContain(provider.status);
    });
  });

  it("should have enabled boolean matching status", () => {
    providerRegistry.forEach((provider) => {
      if (provider.status === "enabled") {
        expect(provider.enabled).toBe(true);
      } else {
        expect(provider.enabled).toBe(false);
      }
    });
  });
});

describe("Demo Mode Detection", () => {
  it("should return boolean from getDemoMode", () => {
    expect(typeof getDemoMode()).toBe("boolean");
  });

  it("should return true when no providers enabled", () => {
    const enabled = getEnabledProviders();
    expect(getDemoMode()).toBe(enabled.length === 0);
  });
});

describe("Best Provider Selection", () => {
  it("should return demo provider when no providers enabled", () => {
    if (getDemoMode()) {
      const provider = getBestProviderForChat("test message");
      expect(provider.id).toBe("demo");
      expect(provider).toEqual(demoProvider);
    }
  });

  it("should return a provider with valid id", () => {
    const provider = getBestProviderForChat("test message");
    expect(provider).toBeDefined();
    expect(typeof provider.id).toBe("string");
    expect(provider.id.length).toBeGreaterThan(0);
  });

  it("should have generate function", () => {
    const provider = getBestProviderForChat("test message");
    expect(typeof provider.generate).toBe("function");
  });

  it("should have stream function", () => {
    const provider = getBestProviderForChat("test message");
    expect(typeof provider.stream).toBe("function");
  });
});
