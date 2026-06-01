import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { SummaryCard } from "@/components/features/summary-card";
import { DueBadge } from "@/components/features/due-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TAGLINE } from "@/lib/constants";
import { getDashboardDueItems } from "@/lib/data/dashboard";
import { getExpenseSummary } from "@/lib/data/expenses";
import { formatQAR } from "@/lib/utils";
import { NotificationsCard } from "@/components/notifications/notifications-card";
import { getProfile } from "@/lib/data/profile";
import { isNotificationsConfigured } from "@/lib/notifications/config";
import { AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const [
    { dueThisWeek, rentTotal, emiTotal, rentCount, emiCount },
    expenses,
    profile,
  ] = await Promise.all([
    getDashboardDueItems(),
    getExpenseSummary(),
    getProfile(),
  ]);

  const upcomingTotal = rentTotal + emiTotal;

  return (
    <>
      <AppHeader title="Home" subtitle={APP_TAGLINE} />
      <main className="space-y-4 px-4 py-4">
        {dueThisWeek.length > 0 && (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-red-900">
                <AlertCircle className="h-4 w-4" />
                Due this week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dueThisWeek.map((item) => (
                <Link
                  key={`${item.kind}-${item.id}`}
                  href={item.href}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.kind === "rent" ? "Rent" : "EMI"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatQAR(item.amount_qar)}</p>
                    <DueBadge status={item.status} label={item.statusLabel} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Active rent & EMI per month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-maroon">
              {formatQAR(upcomingTotal)}
            </p>
            <p className="text-sm text-muted-foreground">
              {rentCount} rent · {emiCount} loans
            </p>
          </CardContent>
        </Card>

        {profile && isNotificationsConfigured() && (
          <NotificationsCard
            userId={profile.id}
            pushEnabled={profile.push_enabled}
            emailReminders={profile.email_reminders}
            oneSignalAppId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? ""}
          />
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Quick links
          </h2>
          <SummaryCard
            title="Rent"
            description={
              rentCount
                ? `${rentCount} home${rentCount > 1 ? "s" : ""} tracked`
                : "Add your rent"
            }
            amount={rentCount ? rentTotal : undefined}
            href="/rent"
            accent="maroon"
          />
          <SummaryCard
            title="Loans & EMI"
            description={
              emiCount
                ? `${emiCount} loan${emiCount > 1 ? "s" : ""} tracked`
                : "Add a loan"
            }
            amount={emiCount ? emiTotal : undefined}
            href="/emi"
          />
          <SummaryCard
            title="Monthly bills"
            description={
              expenses.expenses.length
                ? `${expenses.expenses.length} bill${expenses.expenses.length > 1 ? "s" : ""} this month`
                : "Track utilities & grocery"
            }
            amount={expenses.totalSpent > 0 ? expenses.totalSpent : undefined}
            href="/expenses"
          />
        </section>
      </main>
    </>
  );
}
