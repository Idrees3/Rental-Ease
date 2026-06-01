import { AppHeader } from "@/components/layout/app-header";
import { EmiList } from "@/components/emi/emi-list";
import { getEmiTrackers } from "@/lib/data/emi";
import {
  getAllPaymentRecords,
  getPaymentsForMonth,
  historiesForEmi,
} from "@/lib/data/payments";

export const metadata = { title: "EMI & Loans" };

export default async function EmiPage() {
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
