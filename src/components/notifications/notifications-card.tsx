"use client";

import { useState, useTransition } from "react";
import { Bell, Mail } from "lucide-react";
import {
  sendMyDueReminders,
  sendTestNotification,
  updateNotificationPrefs,
} from "@/app/(app)/notifications/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isOneSignalConfigured, isResendConfigured } from "@/lib/notifications/config";

type NotificationsCardProps = {
  userId: string;
  pushEnabled: boolean;
  emailReminders: boolean;
  oneSignalAppId: string;
};

export function NotificationsCard({
  userId,
  pushEnabled,
  emailReminders,
  oneSignalAppId,
}: NotificationsCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function requestPush() {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({ appId: oneSignalAppId });
      await OneSignal.login(userId);
      await OneSignal.Notifications.requestPermission();
    });
    const fd = new FormData();
    if (emailReminders) fd.set("email_reminders", "on");
    fd.set("push_enabled", "on");
    startTransition(async () => {
      await updateNotificationPrefs(fd);
      setMessage("Push enabled — save confirmed.");
    });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-maroon" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          action={(fd) => {
            startTransition(async () => {
              try {
                await updateNotificationPrefs(fd);
                setMessage("Preferences saved.");
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Failed");
              }
            });
          }}
          className="space-y-3"
        >
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="email_reminders"
              defaultChecked={emailReminders}
              disabled={!isResendConfigured()}
            />
            <Mail className="h-4 w-4" />
            Email reminders (Resend)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="push_enabled"
              defaultChecked={pushEnabled}
              disabled={!isOneSignalConfigured()}
            />
            Push enabled on this device
          </label>
          <Button type="submit" variant="outline" size="sm" disabled={pending}>
            Save preferences
          </Button>
        </form>

        {isOneSignalConfigured() && (
          <Button
            type="button"
            className="w-full"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await requestPush();
                } catch {
                  setMessage("Allow notifications when the browser asks.");
                }
              })
            }
          >
            Allow push on this phone
          </Button>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  const msg = await sendTestNotification();
                  setMessage(msg);
                } catch (e) {
                  setMessage(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            Send test notification
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  const r = await sendMyDueReminders();
                  setMessage(r.message);
                } catch (e) {
                  setMessage(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            Send my due reminders now
          </Button>
        </div>

        {message && (
          <p className="text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
