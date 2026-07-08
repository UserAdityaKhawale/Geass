export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserSettings } from "@/lib/models/UserSettings";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const userSettings = await UserSettings.findOne({ userId });
    if (!userSettings || !userSettings.stripeCustomerId) {
      return NextResponse.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: userSettings.stripeCustomerId,
      limit: 12,
    });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      date: invoice.created * 1000,
      status: invoice.status,
      pdfUrl: invoice.invoice_pdf,
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error("GET /api/stripe/invoices error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
