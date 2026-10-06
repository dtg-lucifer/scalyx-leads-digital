/**
 * Centralized Application URL resolution.
 * Automatically adapts between configured environment domains, Vercel deployments,
 * and local development.
 * 
 * Uses NEXT_PUBLIC_APP_URL to determine the actual host of the application
 * when sending emails, building client portal URLs, document sharing links, etc.
 * 
 * Default production domain: https://leads.scalyx.in
 */

export const DEFAULT_APP_HOST = "https://leads.scalyx.in";
export const DEPLOYED_VERCEL_HOST = DEFAULT_APP_HOST; // Backward compatibility alias

/**
 * Normalizes any URL string to ensure it has a protocol and no trailing slashes.
 */
export function normalizeAppUrl(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

/**
 * Checks if a URL or host string points to a local machine (localhost, 127.0.0.1, etc.).
 */
export function isLocalhost(urlOrHost: string | undefined | null): boolean {
  if (!urlOrHost) return false;
  let clean = urlOrHost
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0];

  if (clean.startsWith("[") && clean.includes("]")) {
    const ipv6 = clean.slice(1, clean.indexOf("]"));
    return ipv6 === "::1" || ipv6 === "0:0:0:0:0:0:0:1";
  }

  clean = clean.split(":")[0];
  return (
    clean === "localhost" ||
    clean === "127.0.0.1" ||
    clean === "0.0.0.0" ||
    clean === "::1" ||
    clean.endsWith(".local")
  );
}

/**
 * Returns the application base URL (e.g. https://leads.scalyx.in).
 * Prioritizes actual configured NEXT_PUBLIC_APP_URL and actively filters out localhost/127.0.0.1
 * so links sent to clients or teammates are always universally accessible.
 */
export function getDeployedAppUrl(req?: Request | Headers): string {
  // 1. If explicit production NEXT_PUBLIC_APP_URL or APP_URL is configured and NOT localhost
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL)?.trim();
  if (appUrl && !isLocalhost(appUrl)) {
    return normalizeAppUrl(appUrl);
  }

  // 2. Incoming Request Headers (from Next.js API routes or Server Components)
  if (req) {
    const headers = "headers" in req ? req.headers : req;
    const forwardedHost = headers.get("x-forwarded-host") || headers.get("host");
    if (forwardedHost && !isLocalhost(forwardedHost)) {
      const proto = headers.get("x-forwarded-proto") || "https";
      return normalizeAppUrl(`${proto}://${forwardedHost}`);
    }
  }

  // 3. Vercel System Environment Variables (Production & Preview)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "");
    if (!host.includes("scalyx-leads-digital.vercel.app")) {
      return normalizeAppUrl(host);
    }
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, "");
    if (!host.includes("scalyx-leads-digital.vercel.app")) {
      return normalizeAppUrl(host);
    }
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const host = process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "");
    if (!host.includes("scalyx-leads-digital.vercel.app")) {
      return normalizeAppUrl(host);
    }
  }

  // 4. In browser environment, check window.location.origin
  if (typeof window !== "undefined" && window.location.origin) {
    if (!isLocalhost(window.location.hostname)) {
      return normalizeAppUrl(window.location.origin);
    }
  }

  // 5. Default production domain fallback
  return DEFAULT_APP_HOST;
}

/**
 * Alias for getDeployedAppUrl.
 */
export function getAppUrl(req?: Request | Headers): string {
  return getDeployedAppUrl(req);
}

/**
 * Ensures any URL points to the canonical host.
 * If the input URL contains localhost, 127.0.0.1, or the legacy vercel app domain,
 * or is a relative path, it replaces the origin with the deployed host.
 */
export function ensureDeployedUrl(
  url: string | undefined | null,
  req?: Request | Headers
): string {
  if (!url) return "";
  const trimmed = url.trim();
  const deployedBase = getDeployedAppUrl(req);

  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?/i;
  if (localhostRegex.test(trimmed)) {
    return trimmed.replace(localhostRegex, deployedBase);
  }

  // Rewrite legacy Vercel domain if present
  const legacyVercelRegex = /^https?:\/\/scalyx-leads-digital\.vercel\.app/i;
  if (legacyVercelRegex.test(trimmed)) {
    return trimmed.replace(legacyVercelRegex, deployedBase);
  }

  if (trimmed.startsWith("/")) {
    return `${deployedBase}${trimmed}`;
  }

  if (/^(portal|share|login|auth|dashboard|api)\//i.test(trimmed)) {
    return `${deployedBase}/${trimmed}`;
  }

  return trimmed;
}

/**
 * Sanitizes all parameters for an email to ensure no localhost or legacy URLs are sent
 * to clients or teammates.
 */
export function sanitizeEmailParams(
  params: Record<string, string>,
  req?: Request | Headers
): Record<string, string> {
  const deployedBase = getDeployedAppUrl(req);
  const localhostRegex = /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?/gi;
  const legacyVercelRegex = /https?:\/\/scalyx-leads-digital\.vercel\.app/gi;

  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      if (
        key.toLowerCase().endsWith("url") ||
        key.toLowerCase().endsWith("link")
      ) {
        sanitized[key] = ensureDeployedUrl(value, req);
      } else {
        // Replace any embedded localhost or legacy vercel URLs in text/markdown
        sanitized[key] = value
          .replace(localhostRegex, deployedBase)
          .replace(legacyVercelRegex, deployedBase);
      }
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
