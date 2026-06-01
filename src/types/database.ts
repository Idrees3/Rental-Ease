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

export type LoanType = "home" | "car" | "personal" | "other";

export type EmiTracker = {
  id: string;
  user_id: string;
  lender_name: string;
  loan_type: LoanType;
  amount_qar: number;
  due_day: number;
  reminder_days_before: number;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export type TrackerKind = "rent" | "emi";

export type PaymentRecord = {
  id: string;
  user_id: string;
  kind: TrackerKind;
  tracker_id: string;
  amount_paid_qar: number;
  amount_due_qar: number;
  paid_at: string;
  month_year: string;
  created_at: string;
};

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  home: "Home loan",
  car: "Car loan",
  personal: "Personal loan",
  other: "Other loan",
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

export type CategoryBudget = {
  id: string;
  user_id: string;
  category: ExpenseCategory;
  amount_qar: number;
  month_year: string;
  created_at: string;
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  utilities: "Utilities (Kahramaa)",
  telecom: "Telecom",
  subscription: "Subscriptions",
  groceries: "Grocery",
  transport: "Transport",
  other: "Other",
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "utilities",
  "telecom",
  "subscription",
  "groceries",
  "transport",
  "other",
];
