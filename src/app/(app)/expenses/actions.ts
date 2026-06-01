"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import type { ExpenseCategory } from "@/types/database";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in again.");
  return { supabase, user };
}

export async function saveExpense(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as ExpenseCategory;
  const amount_qar = Number(formData.get("amount_qar"));
  const month_year = (formData.get("month_year") as string) || currentMonthYear();
  const due_dayRaw = formData.get("due_day") as string;
  const due_day = due_dayRaw ? Number(due_dayRaw) : null;

  if (!name) throw new Error("Enter a name for this bill.");
  if (!amount_qar || amount_qar < 0) throw new Error("Enter a valid amount.");

  const row = {
    user_id: user.id,
    name,
    category,
    amount_qar,
    month_year,
    due_day,
    is_recurring: true,
    is_paid: false,
    paid_at: null,
  };

  if (id) {
    const { error } = await supabase
      .from("monthly_expenses")
      .update(row)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("monthly_expenses").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
}

export async function deleteExpense(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("monthly_expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
}

export async function toggleExpensePaid(id: string, is_paid: boolean) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("monthly_expenses")
    .update({
      is_paid,
      paid_at: is_paid ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
}

export async function saveBudget(formData: FormData) {
  const { supabase, user } = await requireUser();
  const category = formData.get("category") as ExpenseCategory;
  const amount_qar = Number(formData.get("amount_qar"));
  const month_year = (formData.get("month_year") as string) || currentMonthYear();

  if (!amount_qar || amount_qar <= 0) throw new Error("Enter a valid budget amount.");

  const { error } = await supabase.from("category_budgets").upsert(
    {
      user_id: user.id,
      category,
      amount_qar,
      month_year,
    },
    { onConflict: "user_id,category,month_year" }
  );

  if (error) {
    if (error.message?.includes("category_budgets")) {
      throw new Error("Run phase4_budgets.sql in Supabase first.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/expenses");
}
