import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import type { PaymentRecord, TrackerKind } from "@/types/database";

function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.message?.includes("payment_records") ||
    error.message?.includes("does not exist")
  );
}

export async function getPaymentsForMonth(monthYear = currentMonthYear()) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_records")
    .select("*")
    .eq("month_year", monthYear)
    .order("paid_at", { ascending: false });

  if (error) {
    if (isMissingTable(error)) return [];
    console.error("getPaymentsForMonth:", error.message);
    return [];
  }
  return (data ?? []) as PaymentRecord[];
}

/** One query for all payment history (faster than N+1 per tracker) */
export async function getAllPaymentRecords(limit = 200) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_records")
    .select("*")
    .order("paid_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingTable(error)) return [];
    console.error("getAllPaymentRecords:", error.message);
    return [];
  }
  return (data ?? []) as PaymentRecord[];
}

export function groupPaymentsByTracker(records: PaymentRecord[]) {
  const map: Record<string, PaymentRecord[]> = {};
  for (const r of records) {
    const key = `${r.kind}:${r.tracker_id}`;
    if (!map[key]) map[key] = [];
    if (map[key].length < 6) map[key].push(r);
  }
  return map;
}

export function historiesForRent(
  records: PaymentRecord[],
  rentIds: string[]
): Record<string, PaymentRecord[]> {
  const grouped = groupPaymentsByTracker(records);
  const out: Record<string, PaymentRecord[]> = {};
  for (const id of rentIds) {
    out[id] = grouped[`rent:${id}`] ?? [];
  }
  return out;
}

export function historiesForEmi(
  records: PaymentRecord[],
  emiIds: string[]
): Record<string, PaymentRecord[]> {
  const grouped = groupPaymentsByTracker(records);
  const out: Record<string, PaymentRecord[]> = {};
  for (const id of emiIds) {
    out[id] = grouped[`emi:${id}`] ?? [];
  }
  return out;
}

export async function getPaymentHistory(
  kind: TrackerKind,
  trackerId: string,
  limit = 6
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_records")
    .select("*")
    .eq("kind", kind)
    .eq("tracker_id", trackerId)
    .order("paid_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingTable(error)) return [];
    return [];
  }
  return (data ?? []) as PaymentRecord[];
}
