"use server";

import { revalidatePath } from "next/cache";
import { currentMonthYear } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import { getAccountProfile } from "@/lib/data/account";
import { sendReminderEmail } from "@/lib/email";

function makeInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function requireProfile() {
  const supabase = await createClient();
  const profile = await getAccountProfile();
  if (!profile) throw new Error("Please sign in again.");
  return { supabase, profile };
}

function allowedProperties(plan: "starter" | "growth" | "custom") {
  if (plan === "growth" || plan === "custom") return 100;
  return 10;
}

export async function createCollectorProperty(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "collector") throw new Error("Only collectors can add properties.");

  const property_name = (formData.get("property_name") as string)?.trim();
  const payer_name = (formData.get("payer_name") as string)?.trim() || null;
  const payer_email = (formData.get("payer_email") as string)?.trim() || null;
  const monthly_rent_qar = Number(formData.get("monthly_rent_qar"));
  const due_day = Number(formData.get("due_day"));
  const remaining_balance_qar = Number(formData.get("remaining_balance_qar") ?? 0);

  if (!property_name) throw new Error("Property name is required.");
  if (!monthly_rent_qar || monthly_rent_qar <= 0) throw new Error("Enter a valid rent amount.");
  if (due_day < 1 || due_day > 28) throw new Error("Due day must be between 1 and 28.");
  if (remaining_balance_qar < 0) throw new Error("Remaining balance cannot be negative.");

  const { count, error: countError } = await supabase
    .from("collector_properties")
    .select("*", { count: "exact", head: true })
    .eq("collector_id", profile.id);
  if (countError) throw new Error(countError.message);

  const maxByPlan = allowedProperties(profile.collector_plan);
  if ((count ?? 0) >= maxByPlan) {
    throw new Error(
      `Plan limit reached (${maxByPlan} properties). Upgrade plan or switch to custom add-ons.`
    );
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const invite_code = makeInviteCode();
    const { error } = await supabase.from("collector_properties").insert({
      collector_id: profile.id,
      invite_code,
      property_name,
      payer_name,
      payer_email,
      monthly_rent_qar,
      due_day,
      remaining_balance_qar,
      is_active: true,
    });

    if (!error) {
      revalidatePath("/dashboard");
      revalidatePath("/properties");
      return { inviteCode: invite_code };
    }
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      throw new Error(
        "Database tables missing. Run phase6_dual_persona.sql in Supabase SQL Editor."
      );
    }
    if (error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  throw new Error("Could not create invite code. Try again.");
}

export async function connectPayerByInviteCode(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "payer") throw new Error("Only payers can connect.");

  const inviteCode = (formData.get("invite_code") as string)?.trim().toUpperCase();
  if (!inviteCode || inviteCode.length < 6) throw new Error("Enter a valid invite code.");

  const { error } = await supabase.rpc("claim_property_invite", {
    p_invite_code: inviteCode,
  });

  if (error) {
    // Fallback if RPC not installed yet: try direct claim (needs open RLS / fails gracefully)
    if (
      error.message.includes("claim_property_invite") ||
      error.message.includes("Could not find the function") ||
      error.code === "PGRST202"
    ) {
      const { data: property, error: findError } = await supabase
        .from("collector_properties")
        .select("id, payer_id")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (findError || !property) {
        throw new Error(
          "Invite code not found, or run phase6b_claim_invite.sql in Supabase so linking works."
        );
      }
      if (property.payer_id) {
        throw new Error("This invite code has already been used.");
      }

      const { error: updateError } = await supabase
        .from("collector_properties")
        .update({
          payer_id: profile.id,
          payer_name: profile.full_name,
          payer_email: profile.email,
        })
        .eq("id", property.id)
        .is("payer_id", null);

      if (updateError) {
        throw new Error(
          "Could not connect. Ask admin to run phase6b_claim_invite.sql in Supabase."
        );
      }
    } else {
      throw new Error(error.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/rent");
  revalidatePath("/emi");
  revalidatePath("/expenses");
  revalidatePath("/properties");
}

export async function submitRentPayment(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "payer") throw new Error("Only payers can submit payment.");

  const property_id = formData.get("property_id") as string;
  const amount_qar = Number(formData.get("amount_qar"));
  if (!property_id) throw new Error("Missing property.");
  if (!amount_qar || amount_qar <= 0) throw new Error("Enter a valid amount.");

  const { data: property, error: propertyError } = await supabase
    .from("collector_properties")
    .select("id, collector_id, monthly_rent_qar, payer_id")
    .eq("id", property_id)
    .maybeSingle();

  if (propertyError) throw new Error(propertyError.message);
  if (!property || property.payer_id !== profile.id) throw new Error("Property link not found.");

  const { error } = await supabase.from("rent_payment_confirmations").insert({
    property_id: property.id,
    payer_id: profile.id,
    collector_id: property.collector_id,
    amount_qar,
    month_year: currentMonthYear(),
    status: "submitted",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/rent");
}

export async function confirmRentPayment(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "collector") throw new Error("Only collectors can confirm payment.");

  const confirmation_id = formData.get("confirmation_id") as string;
  const property_id = formData.get("property_id") as string;
  const amount_qar = Number(formData.get("amount_qar"));
  if (!confirmation_id || !property_id) throw new Error("Missing payment confirmation.");

  const { error: confirmationError } = await supabase
    .from("rent_payment_confirmations")
    .update({ status: "received", received_at: new Date().toISOString() })
    .eq("id", confirmation_id)
    .eq("collector_id", profile.id)
    .eq("status", "submitted");
  if (confirmationError) throw new Error(confirmationError.message);

  const { data: property, error: propertyError } = await supabase
    .from("collector_properties")
    .select("remaining_balance_qar")
    .eq("id", property_id)
    .eq("collector_id", profile.id)
    .single();
  if (propertyError) throw new Error(propertyError.message);

  const updatedBalance = Math.max(0, Number(property.remaining_balance_qar) - amount_qar);
  const { error: balanceError } = await supabase
    .from("collector_properties")
    .update({ remaining_balance_qar: updatedBalance })
    .eq("id", property_id)
    .eq("collector_id", profile.id);
  if (balanceError) throw new Error(balanceError.message);

  revalidatePath("/dashboard");
  revalidatePath("/rent");
}

export async function sendCollectorReminder(formData: FormData) {
  const { supabase, profile } = await requireProfile();
  if (profile.role !== "collector") throw new Error("Only collectors can send reminders.");

  const property_id = formData.get("property_id") as string;
  if (!property_id) throw new Error("Missing property.");

  const { data: property, error } = await supabase
    .from("collector_properties")
    .select("property_name, payer_email, monthly_rent_qar, due_day")
    .eq("id", property_id)
    .eq("collector_id", profile.id)
    .single();

  if (error) throw new Error(error.message);
  if (!property.payer_email) throw new Error("Add payer email before sending reminder.");

  await sendReminderEmail({
    to: property.payer_email,
    subject: `Rent reminder — ${property.property_name}`,
    title: `Rent due for ${property.property_name}`,
    body: `Your collector sent a reminder. Please check the app and mark payment once completed.`,
    amountQar: Number(property.monthly_rent_qar),
    dueDate: `Day ${property.due_day}`,
  });

  revalidatePath("/dashboard");
}
