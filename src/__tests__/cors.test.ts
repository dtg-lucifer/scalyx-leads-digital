import { describe, it, expect } from "bun:test";
import {
  getAllowedOrigin,
  isAllowedOrigin,
  getCorsHeaders,
  handleCorsPreflight,
} from "../lib/cors";

describe("CORS Handling & Domain Validation", () => {
  it("validates allowed origins correctly", () => {
    expect(isAllowedOrigin("https://leads.scalyx.in")).toBe(true);
    expect(isAllowedOrigin("http://leads.scalyx.in")).toBe(true);
    expect(isAllowedOrigin("https://scalyx.in")).toBe(true);
    expect(isAllowedOrigin("https://subdomain.scalyx.in")).toBe(true);
    expect(isAllowedOrigin("http://localhost:3000")).toBe(true);
    expect(isAllowedOrigin("https://preview-xyz.vercel.app")).toBe(true);
    expect(isAllowedOrigin("https://malicious-site.com")).toBe(false);
  });

  it("reflects allowed origins in headers", () => {
    const headersHttp = getCorsHeaders(
      new Request("https://leads.scalyx.in/api/auth/login", {
        headers: { Origin: "http://leads.scalyx.in" },
      })
    );
    expect(headersHttp["Access-Control-Allow-Origin"]).toBe("http://leads.scalyx.in");
    expect(headersHttp["Access-Control-Allow-Credentials"]).toBe("true");

    const headersHttps = getCorsHeaders(
      new Request("https://leads.scalyx.in/api/auth/login", {
        headers: { Origin: "https://leads.scalyx.in" },
      })
    );
    expect(headersHttps["Access-Control-Allow-Origin"]).toBe("https://leads.scalyx.in");

    // Untrusted origin falls back to canonical domain
    const headersUntrusted = getCorsHeaders(
      new Request("https://leads.scalyx.in/api/auth/login", {
        headers: { Origin: "https://evil.com" },
      })
    );
    expect(headersUntrusted["Access-Control-Allow-Origin"]).toBe("https://leads.scalyx.in");
  });

  it("handles OPTIONS preflight with 204 status and CORS headers", () => {
    const preflight = handleCorsPreflight(
      new Request("https://leads.scalyx.in/api/auth/login", {
        method: "OPTIONS",
        headers: { Origin: "http://leads.scalyx.in" },
      })
    );

    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("Access-Control-Allow-Origin")).toBe("http://leads.scalyx.in");
    expect(preflight.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(preflight.headers.get("Access-Control-Allow-Credentials")).toBe("true");
  });
});
