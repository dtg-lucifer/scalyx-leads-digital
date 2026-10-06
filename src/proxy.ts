import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, handleCorsPreflight } from "@/lib/cors";

export default function proxy(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const proto = request.headers.get("x-forwarded-proto");
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("0.0.0.0");

  const pathname = request.nextUrl.pathname;

  // 1. Enforce HTTPS for non-local browser page navigation
  if (
    proto === "http" &&
    !isLocal &&
    !pathname.startsWith("/api/")
  ) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    httpsUrl.host = host;
    return NextResponse.redirect(httpsUrl, 308);
  }

  // 2. Handle CORS preflight (OPTIONS) requests across all API routes
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return handleCorsPreflight(request);
  }

  // 3. For API routes, attach CORS headers to the response
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    const corsHeaders = getCorsHeaders(request);
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - assets/* (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)",
  ],
};
