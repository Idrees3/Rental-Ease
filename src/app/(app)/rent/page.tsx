import { AppHeader } from "@/components/layout/app-header";
import { RentList } from "@/components/rent/rent-list";
import {
  getAllPaymentRecords,
  getPaymentsForMonth,
  historiesForRent,
} from "@/lib/data/payments";
import { getRentTrackers } from "@/lib/data/rent";

export const metadata = { title: "Rent" };

export default async function RentPage() {
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
