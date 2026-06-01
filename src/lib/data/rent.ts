import { createClient } from "@/lib/supabase/server";
import type { RentTracker } from "@/types/database";

export async function getRentTrackers(activeOnly = false) {
  const supabase = await createClient();
  let query = supabase
    .from("rent_trackers")
    .select("*")
    .order("created_at", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getRentTrackers:", error.message);
    return [];
  }
  return (data ?? []) as RentTracker[];
}
