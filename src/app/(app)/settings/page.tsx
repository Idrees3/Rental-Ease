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
      <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
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
            <p className="pt-2 text-xs text-muted-foreground">
              Stripe billing is off while testing. Prices later: payer 20 QAR/mo;
              collector 50 / 300 QAR or +5 QAR per property.
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
