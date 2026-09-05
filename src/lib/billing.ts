import { getStripe } from "@/lib/stripe";

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export type BillingPlanId = "payer" | "collector_starter" | "collector_growth";

export const BILLING_PLANS: Record<
  BillingPlanId,
  {
    id: BillingPlanId;
    name: string;
    amountQar: number;
    description: string;
    role: "payer" | "collector";
    priceEnv: string;
  }
> = {
  payer: {
    id: "payer",
    name: "Payer",
    amountQar: 20,
    description: "Rent, EMI, bills & payment status",
    role: "payer",
    priceEnv: "STRIPE_PRICE_PAYER",
  },
  collector_starter: {
    id: "collector_starter",
    name: "Collector Starter",
    amountQar: 50,
    description: "Up to 10 properties",
    role: "collector",
    priceEnv: "STRIPE_PRICE_COLLECTOR_STARTER",
  },
  collector_growth: {
    id: "collector_growth",
    name: "Collector Growth",
    amountQar: 300,
    description: "Up to 100 properties",
    role: "collector",
    priceEnv: "STRIPE_PRICE_COLLECTOR_GROWTH",
  },
};

export async function createCheckoutSession(opts: {
  planId: BillingPlanId;
  customerEmail: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const plan = BILLING_PLANS[opts.planId];
  if (!plan) throw new Error("Unknown plan");

  const stripe = getStripe();
  const priceId = process.env[plan.priceEnv];

  if (priceId) {
    return stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: opts.customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: opts.successUrl,
      cancel_url: opts.cancelUrl,
      metadata: {
        user_id: opts.userId,
        plan_id: plan.id,
      },
      subscription_data: {
        metadata: {
          user_id: opts.userId,
          plan_id: plan.id,
        },
      },
    });
  }

  // Fallback when Price IDs are not configured yet — amount in QAR fils (1 QAR = 100)
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: opts.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "qar",
          unit_amount: plan.amountQar * 100,
          recurring: { interval: "month" },
          product_data: {
            name: `Rental Ease — ${plan.name}`,
            description: plan.description,
          },
        },
      },
    ],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      user_id: opts.userId,
      plan_id: plan.id,
    },
  });
}
