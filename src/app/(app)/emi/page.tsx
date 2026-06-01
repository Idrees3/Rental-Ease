import { AppHeader } from "@/components/layout/app-header";
import { EmiList } from "@/components/emi/emi-list";
import { getEmiTrackers } from "@/lib/data/emi";
import { getPaymentsForMonth, getPaymentHistory } from "@/lib/data/payments";

export const metadata = { title: "EMI & Loans" };

export default async function EmiPage() {
  const emis = await getEmiTrackers();
  const payments = await getPaymentsForMonth();

  const histories: Record<string, Awaited<ReturnType<typeof getPaymentHistory>>> =
    {};
  for (const emi of emis) {
    histories[emi.id] = await getPaymentHistory("emi", emi.id);
  }

  return (
    <>
      <AppHeader
        title="Loans & EMI"
        subtitle="Monthly loan payments in QAR"
      />
      <main className="space-y-4 px-4 py-4">
        <EmiList emis={emis} payments={payments} histories={histories} />
      </main>
    </>
  );
}
