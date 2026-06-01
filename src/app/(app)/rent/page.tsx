import { AppHeader } from "@/components/layout/app-header";
import { RentList } from "@/components/rent/rent-list";
import { getPaymentsForMonth, getPaymentHistory } from "@/lib/data/payments";
import { getRentTrackers } from "@/lib/data/rent";

export const metadata = { title: "Rent" };

export default async function RentPage() {
  const rents = await getRentTrackers();
  const payments = await getPaymentsForMonth();

  const histories: Record<string, Awaited<ReturnType<typeof getPaymentHistory>>> =
    {};
  for (const rent of rents) {
    histories[rent.id] = await getPaymentHistory("rent", rent.id);
  }

  return (
    <>
      <AppHeader
        title="Rent"
        subtitle="Your home rent — amounts in QAR"
      />
      <main className="space-y-4 px-4 py-4">
        <RentList rents={rents} payments={payments} histories={histories} />
      </main>
    </>
  );
}
