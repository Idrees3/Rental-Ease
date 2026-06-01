"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import type { LoanType } from "@/types/database";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in again.");
  return { supabase, user };
}

export async function saveEmi(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = formData.get("id") as string | null;
  const lender_name = (formData.get("lender_name") as string)?.trim();
  const loan_type = formData.get("loan_type") as LoanType;
  const amount_qar = Number(formData.get("amount_qar"));
  const due_day = Number(formData.get("due_day"));
  const reminder_days_before = Number(formData.get("reminder_days_before") ?? 3);
  const end_date = (formData.get("end_date") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!lender_name) throw new Error("Enter bank or lender name.");
  if (!amount_qar || amount_qar <= 0) throw new Error("Enter a valid EMI amount.");
  if (due_day < 1 || due_day > 28) throw new Error("Due day must be between 1 and 28.");

  const row = {
    user_id: user.id,
    lender_name,
    loan_type,
    amount_qar,
    due_day,
    reminder_days_before,
    end_date: end_date || null,
    notes,
    is_active: true,
  };

  if (id) {
    const { error } = await supabase
      .from("emi_trackers")
      .update(row)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("emi_trackers").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/emi");
  revalidatePath("/dashboard");
}

export async function toggleEmiActive(id: string, is_active: boolean) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("emi_trackers")
    .update({ is_active })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/emi");
  revalidatePath("/dashboard");
}

export async function deleteEmi(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("emi_trackers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/emi");
  revalidatePath("/dashboard");
}

export async function markEmiPaid(formData: FormData) {
  const { supabase, user } = await requireUser();
  const tracker_id = formData.get("tracker_id") as string;
  const amount_due_qar = Number(formData.get("amount_due_qar"));
  const amount_paid_qar = Number(formData.get("amount_paid_qar"));
  const month_year = currentMonthYear();

  if (!tracker_id || !amount_paid_qar || amount_paid_qar <= 0) {
    throw new Error("Enter how much you paid.");
  }

  const { error } = await supabase.from("payment_records").insert({
    user_id: user.id,
    kind: "emi",
    tracker_id,
    amount_due_qar,
    amount_paid_qar,
    month_year,
  });

  if (error) {
    if (error.code === "42P01") {
      throw new Error(
        "Payment history is not set up. Run phase3_payment_records.sql in Supabase."
      );
    }
    throw new Error(error.message);
  }

  revalidatePath("/emi");
  revalidatePath("/dashboard");
}
