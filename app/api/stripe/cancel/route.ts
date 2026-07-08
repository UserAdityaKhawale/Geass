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

    const userSettings = await UserSettings.findOne({ userId });
    if (!userSettings || !userSettings.stripeCustomerId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    // Get the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: userSettings.stripeCustomerId,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    // Cancel the subscription at period end
    const subscription = subscriptions.data[0];
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // Update user settings
    await UserSettings.findOneAndUpdate(
      { userId },
      { 
        subscriptionTier: "free",
        cancelAtPeriodEnd: true,
        subscriptionEndsAt: new Date((subscription.items.data[0]?.current_period_end || Math.floor(Date.now() / 1000)) * 1000).toISOString()
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/stripe/cancel error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
