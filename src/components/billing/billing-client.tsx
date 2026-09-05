"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CollectorPlan, UserRole } from "@/types/database";

type PlanCard = {
  id: string;
  name: string;
  price: number;
  detail: string;
  forRole: UserRole;
};

const PLANS: PlanCard[] = [
  {
    id: "payer",
    name: "Payer",
    price: 20,
    detail: "Rent link, EMI, bills, expenses, payment status",
    forRole: "payer",
  },
  {
    id: "collector_starter",
    name: "Collector Starter",
    price: 50,
    detail: "Up to 10 properties, reminders, confirmations",
    forRole: "collector",
  },
  {
    id: "collector_growth",
    name: "Collector Growth",
    price: 300,
    detail: "Up to 100 properties",
    forRole: "collector",
  },
];

export function BillingClient({
  role,
  plan,
  trialEndsAt,
  stripeReady,
}: {
  role: UserRole;
  plan: CollectorPlan;
  trialEndsAt: string;
  stripeReady: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const trialDate = new Date(trialEndsAt);
  const trialActive = trialDate.getTime() > Date.now();

  async function checkout(planId: string) {
    setMessage(null);
    setLoading(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Checkout failed");
      setLoading(null);
    }
  }

  return (
    <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="border-maroon/15 bg-gradient-to-br from-maroon/[0.05] to-white">
        <CardContent className="space-y-2 p-6">
          <p className="text-sm text-muted-foreground">Your account</p>
          <p className="font-display text-3xl capitalize">{role}</p>
          <p className="text-base text-muted-foreground">
            {trialActive
              ? `Free trial active until ${trialDate.toLocaleDateString()}`
              : "Trial ended — choose a plan to continue when Stripe is live"}
          </p>
          {role === "collector" && (
            <p className="text-sm text-muted-foreground">
              Current collector plan flag:{" "}
              <span className="font-medium capitalize text-foreground">
                {plan}
              </span>
            </p>
          )}
          {!stripeReady && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Stripe keys are not on this deployment yet. You can still use the
              full product during testing. Add Stripe env vars when ready for
              paid checkout.
            </p>
          )}
        </CardContent>
      </Card>

      {message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.filter((p) => p.forRole === role).map((p) => (
          <Card key={p.id} className="border-maroon/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-display text-4xl text-maroon">
                {p.price}
                <span className="text-lg text-muted-foreground"> QAR/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">{p.detail}</p>
              <Button
                className="w-full"
                disabled={!stripeReady || loading === p.id}
                onClick={() => checkout(p.id)}
              >
                {loading === p.id
                  ? "Opening Stripe…"
                  : stripeReady
                    ? "Subscribe with Stripe"
                    : "Stripe coming soon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Custom collector add-ons (+5 QAR per property above 10) will be available
        with Growth / custom billing next.
      </p>
    </main>
  );
}
