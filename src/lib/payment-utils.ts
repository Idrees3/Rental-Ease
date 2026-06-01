import { currentMonthYear } from "@/lib/dates";
import type { PaymentRecord, TrackerKind } from "@/types/database";

export function isPaidThisMonth(
  payments: PaymentRecord[],
  kind: TrackerKind,
  trackerId: string,
  monthYear = currentMonthYear()
): boolean {
  return payments.some(
    (p) =>
      p.kind === kind &&
      p.tracker_id === trackerId &&
      p.month_year === monthYear
  );
}

export function formatPaidDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-QA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
