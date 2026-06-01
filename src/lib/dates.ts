/** Date helpers for rent/EMI due dates (Qatar app, simple calendar logic) */

export function currentMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatDueDay(day: number): string {
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  return `${day}${suffix} of each month`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function daysUntilDue(dueDay: number, from = new Date()): number {
  const y = from.getFullYear();
  const m = from.getMonth();
  const dim = daysInMonth(y, m);
  const due = new Date(y, m, Math.min(dueDay, dim));
  const today = startOfDay(from);
  const diff = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return diff;
  return diff;
}

export type DueStatus = "paid" | "today" | "soon" | "upcoming" | "overdue";

export function getDueStatus(
  dueDay: number,
  paidThisMonth: boolean,
  from = new Date()
): DueStatus {
  if (paidThisMonth) return "paid";
  const days = daysUntilDue(dueDay, from);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 7) return "soon";
  return "upcoming";
}

export function dueStatusLabel(status: DueStatus, dueDay: number): string {
  const days = daysUntilDue(dueDay);
  switch (status) {
    case "paid":
      return "Paid this month";
    case "today":
      return "Due today";
    case "overdue":
      return "Overdue";
    case "soon":
      return days === 1 ? "Due tomorrow" : `Due in ${days} days`;
    default:
      return `Due on the ${dueDay}${ordinal(dueDay)}`;
  }
}

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  const r = n % 10;
  if (r === 1) return "st";
  if (r === 2) return "nd";
  if (r === 3) return "rd";
  return "th";
}

export function monthsRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const months =
    (end.getFullYear() - now.getFullYear()) * 12 +
    (end.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export function formatMonthsRemaining(endDate: string | null): string {
  const m = monthsRemaining(endDate);
  if (m === null) return "No end date set";
  if (m === 0) return "Last payment month";
  if (m === 1) return "1 month left";
  return `${m} months left`;
}

export function isDueThisWeek(dueDay: number, paidThisMonth: boolean): boolean {
  if (paidThisMonth) return false;
  const days = daysUntilDue(dueDay);
  return days <= 7;
}

export function shiftMonthYear(monthYear: string, delta: number): string {
  const [y, m] = monthYear.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(monthYear: string): string {
  const [y, m] = monthYear.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
