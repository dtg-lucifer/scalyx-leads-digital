import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contracts = await db.getSavedContracts();
    return NextResponse.json({ contracts });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch saved contracts" },
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
    const contract = body.contract || body;
    if (!contract || !contract.id) {
      return NextResponse.json(
        { error: "Invalid contract payload" },
        { status: 400 },
      );
    }

    const saved = await db.saveContractDoc(contract);
    return NextResponse.json({ success: true, contract: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save contract" },
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
        { error: "Contract ID is required" },
        { status: 400 },
      );
    }

    await db.deleteContractDoc(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete contract" },
      { status: 500 },
    );
  }
}

