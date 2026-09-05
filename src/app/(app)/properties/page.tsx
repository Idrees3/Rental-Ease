import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { CollectorDashboard } from "@/components/dashboard/collector-dashboard";
import {
  getAccountProfile,
  getCollectorPendingConfirmations,
  getCollectorProperties,
} from "@/lib/data/account";

export const metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const account = await getAccountProfile();
  if (!account) return null;
  if (account.role !== "collector") redirect("/dashboard");

  const [properties, pending] = await Promise.all([
    getCollectorProperties(),
    getCollectorPendingConfirmations(),
  ]);

  return (
    <>
      <AppHeader
        title="Properties"
        subtitle="Add units, share invite codes, send reminders"
      />
      <CollectorDashboard
        plan={account.collector_plan}
        properties={properties}
        pending={pending}
        trialEndsAt={account.trial_ends_at}
        mode="properties"
      />
    </>
  );
}
