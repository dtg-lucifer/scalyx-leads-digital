import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  getDeployedAppUrl,
  ensureDeployedUrl,
  sanitizeEmailParams,
  normalizeAppUrl,
  isLocalhost,
  DEFAULT_APP_HOST,
} from "../lib/url";
import { renderEmailHtml, getEmailTemplates } from "../lib/email/templates";

describe("URL Resolution & Email Host Validation", () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_APP_URL;
    }
  });

  it("normalizes URLs correctly", () => {
    expect(normalizeAppUrl("leads.scalyx.in")).toBe("https://leads.scalyx.in");
    expect(normalizeAppUrl("https://leads.scalyx.in/")).toBe("https://leads.scalyx.in");
    expect(normalizeAppUrl("http://leads.scalyx.in///")).toBe("http://leads.scalyx.in");
  });

  it("detects localhost and loopback hosts", () => {
    expect(isLocalhost("http://localhost:3000")).toBe(true);
    expect(isLocalhost("localhost:3000")).toBe(true);
    expect(isLocalhost("http://127.0.0.1:3000")).toBe(true);
    expect(isLocalhost("0.0.0.0")).toBe(true);
    expect(isLocalhost("[::1]")).toBe(true);
    expect(isLocalhost("https://leads.scalyx.in")).toBe(false);
  });

  it("uses NEXT_PUBLIC_APP_URL when configured", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://leads.scalyx.in";
    expect(getDeployedAppUrl()).toBe("https://leads.scalyx.in");

    // Without protocol
    process.env.NEXT_PUBLIC_APP_URL = "leads.scalyx.in";
    expect(getDeployedAppUrl()).toBe("https://leads.scalyx.in");
  });

  it("falls back to DEFAULT_APP_HOST (leads.scalyx.in) if NEXT_PUBLIC_APP_URL is localhost", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    expect(getDeployedAppUrl()).toBe(DEFAULT_APP_HOST);
    expect(getDeployedAppUrl()).toBe("https://leads.scalyx.in");
  });

  it("ensureDeployedUrl replaces localhost, legacy vercel domains, and relative paths", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://leads.scalyx.in";

    // Localhost replacement
    expect(ensureDeployedUrl("http://localhost:3000/portal/techcorp")).toBe(
      "https://leads.scalyx.in/portal/techcorp"
    );

    // Legacy vercel replacement
    expect(
      ensureDeployedUrl("https://scalyx-leads-digital.vercel.app/portal/techcorp")
    ).toBe("https://leads.scalyx.in/portal/techcorp");

    // Relative path with leading slash
    expect(ensureDeployedUrl("/share/share-folder-12345")).toBe(
      "https://leads.scalyx.in/share/share-folder-12345"
    );

    // Relative path without leading slash
    expect(ensureDeployedUrl("portal/techcorp")).toBe(
      "https://leads.scalyx.in/portal/techcorp"
    );

    // Correct deployed URL remains unchanged
    expect(ensureDeployedUrl("https://leads.scalyx.in/login")).toBe(
      "https://leads.scalyx.in/login"
    );
  });

  it("sanitizeEmailParams rewrites URL fields and markdown embedded links", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://leads.scalyx.in";

    const params = {
      portalUrl: "http://localhost:3000/portal/acme",
      downloadUrl: "https://scalyx-leads-digital.vercel.app/portal/acme",
      customMessage:
        "Visit [Your Portal](http://localhost:3000/portal/acme) or [Legacy](https://scalyx-leads-digital.vercel.app/share/123)",
    };

    const sanitized = sanitizeEmailParams(params);
    expect(sanitized.portalUrl).toBe("https://leads.scalyx.in/portal/acme");
    expect(sanitized.downloadUrl).toBe("https://leads.scalyx.in/portal/acme");
    expect(sanitized.customMessage).toContain("https://leads.scalyx.in/portal/acme");
    expect(sanitized.customMessage).toContain("https://leads.scalyx.in/share/123");
    expect(sanitized.customMessage).not.toContain("localhost");
    expect(sanitized.customMessage).not.toContain("scalyx-leads-digital.vercel.app");
  });

  it("renderEmailHtml generates emails with leads.scalyx.in links", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://leads.scalyx.in";

    const html = await renderEmailHtml("client_onboarding", {
      clientName: "Test Client",
      portalUrl: "https://scalyx-leads-digital.vercel.app/portal/test",
      portalPassword: "secret-code",
    });

    expect(html).toContain("https://leads.scalyx.in/portal/test");
    expect(html).not.toContain("https://scalyx-leads-digital.vercel.app");
    expect(html).not.toContain("localhost");
  });

  it("getEmailTemplates returns templates with dynamic leads.scalyx.in defaults", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://leads.scalyx.in";

    const templates = getEmailTemplates();
    const onboarding = templates.find((t) => t.id === "client_onboarding");
    const portalUrlField = onboarding?.fields.find((f) => f.key === "portalUrl");

    expect(portalUrlField?.defaultValue).toBe("https://leads.scalyx.in/portal/techcorp");
  });
});
