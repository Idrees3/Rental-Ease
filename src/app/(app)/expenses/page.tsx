import { AppHeader } from "@/components/layout/app-header";
import { ExpensesClient } from "@/components/expenses/expenses-client";
import { getExpenseSummary } from "@/lib/data/expenses";
import { currentMonthYear } from "@/lib/dates";

export const metadata = { title: "Monthly bills" };

type ExpensesPageProps = {
  searchParams: { month?: string };
};

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const monthYear =
    searchParams.month && /^\d{4}-\d{2}$/.test(searchParams.month)
      ? searchParams.month
      : currentMonthYear();

  const summary = await getExpenseSummary(monthYear);

  return (
    <>
      <AppHeader
        title="Monthly bills"
        subtitle="Track utilities, grocery & more in QAR"
      />
      <main className="space-y-4 px-4 py-4">
        <ExpensesClient summary={summary} />
      </main>
    </>
  );
}
