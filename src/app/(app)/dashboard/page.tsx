import { AppHeader } from "@/components/layout/app-header";
import { CollectorDashboard } from "@/components/dashboard/collector-dashboard";
import { PayerDashboard } from "@/components/dashboard/payer-dashboard";
import { APP_TAGLINE } from "@/lib/constants";
import {
  getAccountProfile,
  getCollectorPendingConfirmations,
  getCollectorProperties,
  getPayerLinkedProperty,
  getPayerPaymentConfirmations,
} from "@/lib/data/account";
import { getDashboardDueItems } from "@/lib/data/dashboard";
import { getExpenseSummary } from "@/lib/data/expenses";

export default async function DashboardPage() {
  const account = await getAccountProfile();
  if (!account) return null;

  if (account.role === "collector") {
    const [properties, pending] = await Promise.all([
      getCollectorProperties(),
      getCollectorPendingConfirmations(),
    ]);

    return (
      <>
        <AppHeader
          title="Overview"
          subtitle="Collect rent smoothly across Qatar"
        />
        <CollectorDashboard
          plan={account.collector_plan}
          properties={properties}
          pending={pending}
          trialEndsAt={account.trial_ends_at}
        />
      </>
    );
  }

  const [
    { dueThisWeek, rentTotal, emiTotal, rentCount, emiCount },
    expenses,
    linkedProperty,
    paymentConfirmations,
  ] = await Promise.all([
    getDashboardDueItems(),
    getExpenseSummary(),
    getPayerLinkedProperty(),
    getPayerPaymentConfirmations(),
  ]);

  return (
    <>
      <AppHeader title="Home" subtitle={APP_TAGLINE} />
      <PayerDashboard
        dueThisWeek={dueThisWeek}
        rentTotal={rentTotal}
        emiTotal={emiTotal}
        rentCount={rentCount}
        emiCount={emiCount}
        expenseCount={expenses.expenses.length}
        expenseTotal={expenses.totalSpent}
        linkedProperty={linkedProperty}
        paymentConfirmations={paymentConfirmations}
      />
    </>
  );
}
