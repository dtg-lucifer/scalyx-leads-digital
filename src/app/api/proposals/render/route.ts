import { renderProposalHtml } from "@/lib/proposal/renderer";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { markdown } = await req.json();
    const html = await renderProposalHtml(markdown || "");
    return NextResponse.json({ html });
  } catch (error: unknown) {
    console.error("Proposal render error:", error);
    const msg = error instanceof Error ? error.message : "Render failure";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
