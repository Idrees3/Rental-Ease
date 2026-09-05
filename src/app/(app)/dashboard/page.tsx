import { AppHeader } from "@/components/layout/app-header";
import { CollectorDashboard } from "@/components/dashboard/collector-dashboard";
import { PayerDashboard } from "@/components/dashboard/payer-dashboard";
import {
  getAccountProfile,
  getCollectorPendingConfirmations,
  getCollectorProperties,
  getPayerLinkedProperty,
  getPayerPaymentConfirmations,
} from "@/lib/data/account";
import { getDashboardDueItems } from "@/lib/data/dashboard";
import { getExpenseSummary } from "@/lib/data/expenses";
import { getPaymentsForMonth } from "@/lib/data/payments";
import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import { isPaidThisMonth } from "@/lib/payment-utils";
import { getEmiTrackers } from "@/lib/data/emi";
import { getRentTrackers } from "@/lib/data/rent";

function monthMeta() {
  const now = new Date();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthLabel = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return { day, daysInMonth, monthLabel, monthYear: currentMonthYear() };
}

export default async function DashboardPage() {
  const account = await getAccountProfile();
  if (!account) return null;
  const { day, daysInMonth, monthLabel, monthYear } = monthMeta();

  if (account.role === "collector") {
    const [properties, pending] = await Promise.all([
      getCollectorProperties(),
      getCollectorPendingConfirmations(),
    ]);

    const supabase = await createClient();
    const { data: receivedRows } = await supabase
      .from("rent_payment_confirmations")
      .select("amount_qar")
      .eq("status", "received")
      .eq("month_year", monthYear);

    const receivedThisMonth = (receivedRows ?? []).reduce(
      (sum, row) => sum + Number(row.amount_qar),
      0
    );

    return (
      <>
        <AppHeader
          title="Overview"
          subtitle="Collection progress and invitation codes"
        />
        <CollectorDashboard
          plan={account.collector_plan}
          properties={properties}
          pending={pending}
          receivedThisMonth={receivedThisMonth}
          trialEndsAt={account.trial_ends_at}
          monthLabel={monthLabel}
          day={day}
          daysInMonth={daysInMonth}
        />
      </>
    );
  }

  const [
    { dueThisWeek, rentTotal, emiTotal, rentCount, emiCount },
    expenses,
    linkedProperty,
    paymentConfirmations,
    payments,
    rents,
    emis,
  ] = await Promise.all([
    getDashboardDueItems(),
    getExpenseSummary(),
    getPayerLinkedProperty(),
    getPayerPaymentConfirmations(),
    getPaymentsForMonth(),
    getRentTrackers(true),
    getEmiTrackers(true),
  ]);

  const rentPaidThisMonth =
    paymentConfirmations
      .filter((p) => p.month_year === monthYear && p.status === "received")
      .reduce((s, p) => s + Number(p.amount_qar), 0) ||
    rents.reduce(
      (s, r) =>
        s +
        (isPaidThisMonth(payments, "rent", r.id) ? Number(r.amount_qar) : 0),
      0
    );

  const emiPaidThisMonth = emis.filter((e) =>
    isPaidThisMonth(payments, "emi", e.id)
  ).length;

  const billsPaid = expenses.expenses.filter((e) => e.is_paid).length;

  return (
    <>
      <AppHeader title="Home" subtitle="Your month at a glance in QAR" />
      <PayerDashboard
        dueThisWeek={dueThisWeek}
        rentTotal={rentTotal}
        emiTotal={emiTotal}
        rentCount={rentCount}
        emiCount={emiCount}
        expenseCount={expenses.expenses.length}
        expenseTotal={expenses.totalSpent}
        billsPaid={billsPaid}
        rentPaidThisMonth={rentPaidThisMonth}
        emiPaidThisMonth={emiPaidThisMonth}
        linkedProperty={linkedProperty}
        paymentConfirmations={paymentConfirmations}
        monthLabel={monthLabel}
        day={day}
        daysInMonth={daysInMonth}
      />
    </>
  );
}
