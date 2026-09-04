import { createClient } from "@/lib/supabase/server";
import type {
  CollectorPlan,
  CollectorProperty,
  RentPaymentConfirmation,
  UserRole,
} from "@/types/database";

export type AccountProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  collector_plan: CollectorPlan;
  trial_ends_at: string;
};

export async function getAccountProfile(): Promise<AccountProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, collector_plan, trial_ends_at")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata?.full_name ?? null,
      role: "payer",
      collector_plan: "starter",
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return data as AccountProfile;
}

export async function getCollectorProperties(): Promise<CollectorProperty[]> {
  const profile = await getAccountProfile();
  if (!profile || profile.role !== "collector") return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collector_properties")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getCollectorProperties:", error.message);
    return [];
  }
  return (data ?? []) as CollectorProperty[];
}

export async function getPayerLinkedProperty(): Promise<CollectorProperty | null> {
  const profile = await getAccountProfile();
  if (!profile || profile.role !== "payer") return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collector_properties")
    .select("*")
    .eq("payer_id", profile.id)
    .maybeSingle();

  if (error) {
    console.error("getPayerLinkedProperty:", error.message);
    return null;
  }
  return (data as CollectorProperty | null) ?? null;
}

export async function getCollectorPendingConfirmations(): Promise<
  RentPaymentConfirmation[]
> {
  const profile = await getAccountProfile();
  if (!profile || profile.role !== "collector") return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rent_payment_confirmations")
    .select("*")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("getCollectorPendingConfirmations:", error.message);
    return [];
  }
  return (data ?? []) as RentPaymentConfirmation[];
}

export async function getPayerPaymentConfirmations(): Promise<
  RentPaymentConfirmation[]
> {
  const profile = await getAccountProfile();
  if (!profile || profile.role !== "payer") return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rent_payment_confirmations")
    .select("*")
    .eq("payer_id", profile.id)
    .order("submitted_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("getPayerPaymentConfirmations:", error.message);
    return [];
  }
  return (data ?? []) as RentPaymentConfirmation[];
}
