import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import type { PaymentRecord, TrackerKind } from "@/types/database";

export async function getPaymentsForMonth(monthYear = currentMonthYear()) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payment_records")
    .select("*")
    .eq("month_year", monthYear)
    .order("paid_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }
  return (data ?? []) as PaymentRecord[];
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
    if (error.code === "42P01") return [];
    throw error;
  }
  return (data ?? []) as PaymentRecord[];
}
