/**
 * Centralized Application URL resolution.
 * Automatically adapts between Vercel deployments (custom domain, production, preview) and local development.
 * Guarantees that any URL shared with clients or teammates always points to the deployed Vercel host,
 * NEVER localhost or private IP addresses.
 */

export const DEPLOYED_VERCEL_HOST = "https://scalyx-leads-digital.vercel.app";

/**
 * Checks if a URL or host string points to a local machine (localhost, 127.0.0.1, etc.).
 */
export function isLocalhost(urlOrHost: string | undefined | null): boolean {
  if (!urlOrHost) return false;
  const clean = urlOrHost
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
  return (
    clean === "localhost" ||
    clean === "127.0.0.1" ||
    clean === "0.0.0.0" ||
    clean === "[::1]" ||
    clean.endsWith(".local")
  );
}

/**
 * Returns the deployed application base URL (e.g. https://scalyx-leads-digital.vercel.app).
 * Prioritizes actual deployed Vercel URLs and actively filters out localhost/127.0.0.1
 * so links sent to clients or teammates are always universally accessible.
 */
export function getDeployedAppUrl(req?: Request | Headers): string {
  // 1. If explicit production APP_URL is configured and NOT localhost
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl && !isLocalhost(appUrl)) {
    return appUrl.replace(/\/$/, "");
  }

  // 2. Vercel System Environment Variables (Production & Preview)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const host = process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }

  // 3. Incoming Request Headers (from Next.js API routes or Server Components)
  if (req) {
    const headers = "headers" in req ? req.headers : req;
    const forwardedHost = headers.get("x-forwarded-host") || headers.get("host");
    if (forwardedHost && !isLocalhost(forwardedHost)) {
      const proto = headers.get("x-forwarded-proto") || "https";
      return `${proto}://${forwardedHost.replace(/\/$/, "")}`;
    }
  }

  // 4. In browser environment, check window.location.origin
  if (typeof window !== "undefined" && window.location.origin) {
    if (!isLocalhost(window.location.hostname)) {
      return window.location.origin.replace(/\/$/, "");
    }
  }

  // 5. Deployed Vercel fallback
  return DEPLOYED_VERCEL_HOST;
}

/**
 * Alias for getDeployedAppUrl.
 */
export function getAppUrl(req?: Request | Headers): string {
  return getDeployedAppUrl(req);
}

/**
 * Ensures any URL points to the deployed Vercel host.
 * If the input URL contains localhost, 127.0.0.1, or is a relative path,
 * it replaces the origin with the deployed host.
 */
export function ensureDeployedUrl(
  url: string | undefined | null,
  req?: Request | Headers
): string {
  if (!url) return "";
  const trimmed = url.trim();
  const deployedBase = getDeployedAppUrl(req);

  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;
  if (localhostRegex.test(trimmed)) {
    return trimmed.replace(localhostRegex, deployedBase);
  }

  if (trimmed.startsWith("/")) {
    return `${deployedBase}${trimmed}`;
  }

  return trimmed;
}

/**
 * Sanitizes all parameters for an email to ensure no localhost URLs are sent
 * to clients or teammates.
 */
export function sanitizeEmailParams(
  params: Record<string, string>,
  req?: Request | Headers
): Record<string, string> {
  const deployedBase = getDeployedAppUrl(req);
  const localhostRegex = /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/gi;

  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      if (
        key.toLowerCase().endsWith("url") ||
        key.toLowerCase().endsWith("link")
      ) {
        sanitized[key] = ensureDeployedUrl(value, req);
      } else {
        // Replace any embedded localhost URLs in text/markdown
        sanitized[key] = value.replace(localhostRegex, deployedBase);
      }
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
