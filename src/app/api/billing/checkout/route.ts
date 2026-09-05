import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BILLING_PLANS,
  createCheckoutSession,
  isStripeConfigured,
  type BillingPlanId,
} from "@/lib/billing";
import { APP_URL } from "@/lib/constants";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel.",
      },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = (await request.json()) as { planId?: string };
  const planId = body.planId as BillingPlanId | undefined;
  if (!planId || !BILLING_PLANS[planId]) {
    return NextResponse.json({ error: "Choose a valid plan." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const plan = BILLING_PLANS[planId];
  if (profile?.role && plan.role !== profile.role) {
    return NextResponse.json(
      { error: `This plan is for ${plan.role} accounts.` },
      { status: 400 }
    );
  }

  try {
    const session = await createCheckoutSession({
      planId,
      customerEmail: user.email,
      userId: user.id,
      successUrl: `${APP_URL}/billing?success=1`,
      cancelUrl: `${APP_URL}/billing?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
