export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import { UserSettings } from "@/lib/models/UserSettings";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    let userSettings = await UserSettings.findOne({ userId });
    if (!userSettings) {
      userSettings = await UserSettings.create({ userId });
    }

    let customerId = userSettings.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userSettings.email || userId, // Fallback if no email
        metadata: { userId },
      });
      customerId = customer.id;
      userSettings.stripeCustomerId = customerId;
      await userSettings.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?cancel=true`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("POST /api/stripe/checkout error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
