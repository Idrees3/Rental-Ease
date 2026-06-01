import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("email, push_enabled, email_reminders")
    .eq("id", user.id)
    .single();

  if (error) {
    return {
      id: user.id,
      email: user.email ?? "",
      push_enabled: false,
      email_reminders: true,
    };
  }

  return {
    id: user.id,
    email: data?.email ?? user.email ?? "",
    push_enabled: Boolean(data?.push_enabled),
    email_reminders: data?.email_reminders !== false,
  };
}
