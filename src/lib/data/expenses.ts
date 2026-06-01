import { createClient } from "@/lib/supabase/server";
import { currentMonthYear } from "@/lib/dates";
import type {
  CategoryBudget,
  ExpenseCategory,
  MonthlyExpense,
} from "@/types/database";

function safe<T>(data: T[] | null, error: { code?: string; message?: string } | null): T[] {
  if (error) {
    console.error(error.message);
    return [];
  }
  return data ?? [];
}

export async function getExpensesForMonth(monthYear: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("monthly_expenses")
    .select("*")
    .eq("month_year", monthYear)
    .order("created_at", { ascending: false });
  return safe(data, error) as MonthlyExpense[];
}

export async function getBudgetsForMonth(monthYear: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category_budgets")
    .select("*")
    .eq("month_year", monthYear);
  return safe(data, error) as CategoryBudget[];
}

export type ExpenseSummary = {
  monthYear: string;
  expenses: MonthlyExpense[];
  budgets: CategoryBudget[];
  totalSpent: number;
  byCategory: Record<ExpenseCategory, number>;
};

export async function getExpenseSummary(
  monthYear = currentMonthYear()
): Promise<ExpenseSummary> {
  const [expenses, budgets] = await Promise.all([
    getExpensesForMonth(monthYear),
    getBudgetsForMonth(monthYear),
  ]);

  const byCategory = {
    utilities: 0,
    telecom: 0,
    subscription: 0,
    groceries: 0,
    transport: 0,
    other: 0,
  } satisfies Record<ExpenseCategory, number>;

  for (const e of expenses) {
    byCategory[e.category] += Number(e.amount_qar);
  }

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount_qar), 0);

  return { monthYear, expenses, budgets, totalSpent, byCategory };
}

