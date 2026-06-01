import { AppHeader } from "@/components/layout/app-header";
import { SummaryCard } from "@/components/features/summary-card";
import { SetupStatus } from "@/components/setup/setup-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TAGLINE } from "@/lib/constants";
import { formatQAR } from "@/lib/utils";
import { CalendarClock } from "lucide-react";

/** Placeholder totals until Supabase is wired */
const DEMO = {
  rentDue: 5500,
  rentDueDay: 1,
  emiTotal: 3200,
  emiNext: "12 Jun",
  expensesMonth: 1840,
  monthLabel: "May 2026",
};

export default function HomePage() {
  return (
    <>
      <AppHeader
        title="Dashboard"
        subtitle={APP_TAGLINE}
      />
      <main className="space-y-4 px-4 py-4">
        <Card className="border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <CalendarClock className="h-4 w-4 text-maroon" />
              Upcoming this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-maroon">
              {formatQAR(DEMO.rentDue + DEMO.emiTotal)}
            </p>
            <p className="text-sm text-muted-foreground">
              Rent + EMI before other bills
            </p>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Your trackers
          </h2>
          <SummaryCard
            title="Rent"
            description="Monthly rent reminder"
            amount={DEMO.rentDue}
            meta={`Due on day ${DEMO.rentDueDay} of each month`}
            href="/rent"
            accent="maroon"
          />
          <SummaryCard
            title="EMI & loans"
            description="Home, car, or personal loans"
            amount={DEMO.emiTotal}
            meta={`Next payment · ${DEMO.emiNext}`}
            href="/emi"
          />
          <SummaryCard
            title="Monthly bills"
            description="Utilities, telecom, subscriptions"
            amount={DEMO.expensesMonth}
            meta={DEMO.monthLabel}
            href="/expenses"
          />
        </section>

        <SetupStatus />
      </main>
    </>
  );
}
