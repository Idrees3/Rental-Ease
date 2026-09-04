import { AppHeader } from "@/components/layout/app-header";
import { RentList } from "@/components/rent/rent-list";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllPaymentRecords,
  getPaymentsForMonth,
  historiesForRent,
} from "@/lib/data/payments";
import { getAccountProfile, getPayerLinkedProperty } from "@/lib/data/account";
import { getRentTrackers } from "@/lib/data/rent";

export const metadata = { title: "Rent" };

export default async function RentPage() {
  const account = await getAccountProfile();
  const linkedProperty = await getPayerLinkedProperty();

  if (!account || account.role !== "payer") {
    return (
      <>
        <AppHeader title="Rent" subtitle="Available for payer accounts only" />
        <main className="px-4 py-4">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Collector accounts manage rent from Collector Home.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (!linkedProperty) {
    return (
      <>
        <AppHeader title="Rent" subtitle="Connect with your collector first" />
        <main className="px-4 py-4">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Ask your collector for an invite code, then connect from Home.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const [rents, payments, allRecords] = await Promise.all([
    getRentTrackers(),
    getPaymentsForMonth(),
    getAllPaymentRecords(),
  ]);

  const histories = historiesForRent(
    allRecords,
    rents.map((r) => r.id)
  );

  return (
    <>
      <AppHeader title="Rent" subtitle="Your home rent — amounts in QAR" />
      <main className="space-y-4 px-4 py-4">
        <RentList rents={rents} payments={payments} histories={histories} />
      </main>
    </>
  );
}
