import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://leads.scalyx.in",
  "http://leads.scalyx.in",
  "https://scalyx.in",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

/**
 * Checks whether an incoming origin is trusted.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  const trimmed = origin.trim().toLowerCase();

  return (
    ALLOWED_ORIGINS.includes(trimmed) ||
    trimmed.endsWith(".scalyx.in") ||
    trimmed.endsWith(".vercel.app")
  );
}

/**
 * Resolves the appropriate Access-Control-Allow-Origin value based on the request.
 */
export function getAllowedOrigin(origin: string | null | undefined): string {
  if (!origin) return "https://leads.scalyx.in";
  const trimmed = origin.trim();

  if (isAllowedOrigin(trimmed)) {
    return trimmed;
  }

  return "https://leads.scalyx.in";
}

/**
 * Generates CORS headers for a given request.
 */
export function getCorsHeaders(req?: NextRequest | Request | null): Record<string, string> {
  const originHeader = req?.headers.get("origin");
  const origin = getAllowedOrigin(originHeader);

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept, Cookie, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/**
 * Handles CORS OPTIONS preflight request.
 */
export function handleCorsPreflight(req: NextRequest | Request): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

/**
 * Applies CORS headers to an outgoing NextResponse.
 */
export function applyCorsHeaders(
  response: NextResponse,
  req?: NextRequest | Request | null
): NextResponse {
  const headers = getCorsHeaders(req);
  for (const [key, val] of Object.entries(headers)) {
    response.headers.set(key, val);
  }
  return response;
}
