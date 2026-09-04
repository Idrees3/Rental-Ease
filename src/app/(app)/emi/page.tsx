import { AppHeader } from "@/components/layout/app-header";
import { EmiList } from "@/components/emi/emi-list";
import { getEmiTrackers } from "@/lib/data/emi";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllPaymentRecords,
  getPaymentsForMonth,
  historiesForEmi,
} from "@/lib/data/payments";
import { getAccountProfile, getPayerLinkedProperty } from "@/lib/data/account";

export const metadata = { title: "EMI & Loans" };

export default async function EmiPage() {
  const account = await getAccountProfile();
  const linkedProperty = await getPayerLinkedProperty();

  if (!account || account.role !== "payer") {
    return (
      <>
        <AppHeader title="Loans & EMI" subtitle="Available for payer accounts only" />
        <main className="px-4 py-4">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Collector accounts focus on dues and payment confirmations.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (!linkedProperty) {
    return (
      <>
        <AppHeader title="Loans & EMI" subtitle="Connect with your collector first" />
        <main className="px-4 py-4">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Enter an invite code in Home to unlock payer features.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const [emis, payments, allRecords] = await Promise.all([
    getEmiTrackers(),
    getPaymentsForMonth(),
    getAllPaymentRecords(),
  ]);

  const histories = historiesForEmi(
    allRecords,
    emis.map((e) => e.id)
  );

  return (
    <>
      <AppHeader title="Loans & EMI" subtitle="Monthly loan payments in QAR" />
      <main className="space-y-4 px-4 py-4">
        <EmiList emis={emis} payments={payments} histories={histories} />
      </main>
    </>
  );
}
