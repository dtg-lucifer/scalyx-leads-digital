import { NextRequest, NextResponse } from "next/server";
import { getEmailTemplates, renderEmailHtml } from "@/lib/email/templates";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ templates: getEmailTemplates(req) });
}

export async function POST(req: NextRequest) {
  try {
    const { templateId, params } = await req.json();
    const html = await renderEmailHtml(
      templateId || "custom_email",
      params || {},
      { forSending: false },
      req,
    );
    return NextResponse.json({ html });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to render email template" },
      { status: 500 },
    );
  }
}
