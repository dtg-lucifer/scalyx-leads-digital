import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const proposals = await db.getSavedProposals();
    return NextResponse.json({ proposals });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch saved proposals" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const proposal = body.proposal || body;
    if (!proposal || !proposal.id) {
      return NextResponse.json(
        { error: "Invalid proposal payload" },
        { status: 400 },
      );
    }

    const saved = await db.saveProposalDoc(proposal);
    return NextResponse.json({ success: true, proposal: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save proposal" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Proposal ID is required" },
        { status: 400 },
      );
    }

    await db.deleteProposalDoc(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete proposal" },
      { status: 500 },
    );
  }
}

