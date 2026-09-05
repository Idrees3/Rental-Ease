import { AppHeader } from "@/components/layout/app-header";
import { ExpensesClient } from "@/components/expenses/expenses-client";
import { Card, CardContent } from "@/components/ui/card";
import { getAccountProfile, getPayerLinkedProperty } from "@/lib/data/account";
import { getExpenseSummary } from "@/lib/data/expenses";
import { currentMonthYear } from "@/lib/dates";

export const metadata = { title: "Monthly bills" };

type ExpensesPageProps = {
  searchParams: { month?: string };
};

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const account = await getAccountProfile();
  const linkedProperty = await getPayerLinkedProperty();

  if (!account || account.role !== "payer") {
    return (
      <>
        <AppHeader title="Monthly bills" subtitle="Available for payer accounts only" />
        <main className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Collector accounts use Overview and Properties.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (!linkedProperty) {
    return (
      <>
        <AppHeader title="Monthly bills" subtitle="Connect with your collector first" />
        <main className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Enter your invite code in Home to unlock bills and expenses tracking.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

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
      <main className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <ExpensesClient summary={summary} />
      </main>
    </>
  );
}
