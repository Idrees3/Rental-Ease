import { AppHeader } from "@/components/layout/app-header";
import { NotificationsCard } from "@/components/notifications/notifications-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccountProfile } from "@/lib/data/account";
import { getProfile } from "@/lib/data/profile";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [account, profile] = await Promise.all([
    getAccountProfile(),
    getProfile(),
  ]);

  if (!account || !profile) return null;

  return (
    <>
      <AppHeader title="Settings" subtitle="Account & notifications" />
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-xl">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-base">
            <p>
              <span className="text-muted-foreground">Email:</span> {account.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span>{" "}
              <span className="capitalize">{account.role}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Trial ends:</span>{" "}
              {new Date(account.trial_ends_at).toLocaleDateString()}
            </p>
            {account.role === "collector" && (
              <p>
                <span className="text-muted-foreground">Plan:</span>{" "}
                <span className="capitalize">{account.collector_plan}</span>
              </p>
            )}
            <p className="pt-2 text-sm text-muted-foreground">
              Use Billing in the sidebar to subscribe when Stripe is connected.
              Until then the full website product stays open for testing.
            </p>
          </CardContent>
        </Card>

        <NotificationsCard
          userId={profile.id}
          pushEnabled={profile.push_enabled}
          emailReminders={profile.email_reminders}
          oneSignalAppId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? ""}
        />
      </main>
    </>
  );
}
