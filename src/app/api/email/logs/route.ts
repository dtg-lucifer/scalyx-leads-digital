import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/store";
import { renderEmailHtml } from "@/lib/email/templates";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await db.getEmailLogs();
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId, params } = await req.json();
  // forSending: false renders with the embedded base64 data URI for instant, flawless iframe preview in dashboard
  const html = await renderEmailHtml(templateId, params || {}, {
    forSending: false,
  });
  return NextResponse.json({ html });
}
