import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoices = await db.getSavedInvoices();
    return NextResponse.json({ invoices });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch saved invoices" },
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
    const invoice = body.invoice || body;
    if (!invoice || !invoice.id) {
      return NextResponse.json(
        { error: "Invalid invoice payload" },
        { status: 400 },
      );
    }

    const saved = await db.saveInvoiceDoc(invoice);
    return NextResponse.json({ success: true, invoice: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save invoice" },
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
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    await db.deleteInvoiceDoc(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

