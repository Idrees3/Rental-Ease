import { AppHeader } from "@/components/layout/app-header";
import { BillingClient } from "@/components/billing/billing-client";
import { getAccountProfile } from "@/lib/data/account";
import { isStripeConfigured } from "@/lib/billing";

export const metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const account = await getAccountProfile();
  if (!account) return null;

  return (
    <>
      <AppHeader
        title="Billing"
        subtitle="Plans in QAR · 14-day free trial while testing"
      />
      {searchParams.success && (
        <p className="mx-4 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-6 lg:mx-8">
          Payment started successfully. Your subscription will activate once
          Stripe confirms.
        </p>
      )}
      {searchParams.canceled && (
        <p className="mx-4 mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:mx-6 lg:mx-8">
          Checkout canceled. You can try again anytime.
        </p>
      )}
      <BillingClient
        role={account.role}
        plan={account.collector_plan}
        trialEndsAt={account.trial_ends_at}
        stripeReady={isStripeConfigured()}
      />
    </>
  );
}
