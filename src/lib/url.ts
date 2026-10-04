/**
 * Centralized Application URL resolution.
 * Automatically adapts between Vercel deployments (preview/production) and local development.
 */
export function getAppUrl(): string {
  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return url.replace(/\/$/, "");
}
