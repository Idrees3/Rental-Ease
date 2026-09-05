import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { CollectorDashboard } from "@/components/dashboard/collector-dashboard";
import {
  getAccountProfile,
  getCollectorPendingConfirmations,
  getCollectorProperties,
} from "@/lib/data/account";
import { currentMonthYear } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const account = await getAccountProfile();
  if (!account) return null;
  if (account.role !== "collector") redirect("/dashboard");

  const [properties, pending] = await Promise.all([
    getCollectorProperties(),
    getCollectorPendingConfirmations(),
  ]);

  const now = new Date();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthLabel = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const monthYear = currentMonthYear();

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
        title="Properties"
        subtitle="Add a unit → get invitation code → share with payer"
      />
      <CollectorDashboard
        plan={account.collector_plan}
        properties={properties}
        pending={pending}
        receivedThisMonth={receivedThisMonth}
        trialEndsAt={account.trial_ends_at}
        mode="properties"
        monthLabel={monthLabel}
        day={day}
        daysInMonth={daysInMonth}
      />
    </>
  );
}
