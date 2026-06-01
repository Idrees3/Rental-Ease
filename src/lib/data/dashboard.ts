import { getEmiTrackers } from "@/lib/data/emi";
import { getPaymentsForMonth } from "@/lib/data/payments";
import { getRentTrackers } from "@/lib/data/rent";
import {
  daysUntilDue,
  getDueStatus,
  dueStatusLabel,
  isDueThisWeek,
} from "@/lib/dates";
import { isPaidThisMonth } from "@/lib/payment-utils";
import type { EmiTracker, RentTracker } from "@/types/database";

export type DueItem = {
  id: string;
  kind: "rent" | "emi";
  title: string;
  amount_qar: number;
  due_day: number;
  status: ReturnType<typeof getDueStatus>;
  statusLabel: string;
  href: string;
};

export async function getDashboardDueItems(): Promise<{
  dueThisWeek: DueItem[];
  rentTotal: number;
  emiTotal: number;
  rentCount: number;
  emiCount: number;
}> {
  const [rents, emis, payments] = await Promise.all([
    getRentTrackers(true),
    getEmiTrackers(true),
    getPaymentsForMonth(),
  ]);

  const dueThisWeek: DueItem[] = [];

  for (const rent of rents) {
    const paid = isPaidThisMonth(payments, "rent", rent.id);
    if (isDueThisWeek(rent.due_day, paid)) {
      const status = getDueStatus(rent.due_day, paid);
      dueThisWeek.push({
        id: rent.id,
        kind: "rent",
        title: rent.landlord_name || "Rent",
        amount_qar: rent.amount_qar,
        due_day: rent.due_day,
        status,
        statusLabel: dueStatusLabel(status, rent.due_day),
        href: "/rent",
      });
    }
  }

  for (const emi of emis) {
    const paid = isPaidThisMonth(payments, "emi", emi.id);
    if (isDueThisWeek(emi.due_day, paid)) {
      const status = getDueStatus(emi.due_day, paid);
      dueThisWeek.push({
        id: emi.id,
        kind: "emi",
        title: emi.lender_name,
        amount_qar: emi.amount_qar,
        due_day: emi.due_day,
        status,
        statusLabel: dueStatusLabel(status, emi.due_day),
        href: "/emi",
      });
    }
  }

  dueThisWeek.sort((a, b) => daysUntilDue(a.due_day) - daysUntilDue(b.due_day));

  const rentTotal = rents.reduce((s, r) => s + Number(r.amount_qar), 0);
  const emiTotal = emis.reduce((s, e) => s + Number(e.amount_qar), 0);

  return {
    dueThisWeek,
    rentTotal,
    emiTotal,
    rentCount: rents.length,
    emiCount: emis.length,
  };
}
