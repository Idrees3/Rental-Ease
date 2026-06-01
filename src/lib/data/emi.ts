import { createClient } from "@/lib/supabase/server";
import type { EmiTracker } from "@/types/database";

export async function getEmiTrackers(activeOnly = false) {
  const supabase = await createClient();
  let query = supabase
    .from("emi_trackers")
    .select("*")
    .order("created_at", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as EmiTracker[];
}
