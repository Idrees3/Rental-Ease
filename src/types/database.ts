export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  onesignal_external_id: string | null;
  created_at: string;
};

export type RentTracker = {
  id: string;
  user_id: string;
  landlord_name: string | null;
  amount_qar: number;
  due_day: number;
  reminder_days_before: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type EmiTracker = {
  id: string;
  user_id: string;
  lender_name: string;
  loan_type: "home" | "car" | "personal" | "other";
  amount_qar: number;
  due_day: number;
  reminder_days_before: number;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type ExpenseCategory =
  | "utilities"
  | "telecom"
  | "subscription"
  | "groceries"
  | "transport"
  | "other";

export type MonthlyExpense = {
  id: string;
  user_id: string;
  name: string;
  category: ExpenseCategory;
  amount_qar: number;
  due_day: number | null;
  is_recurring: boolean;
  month_year: string;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
};
