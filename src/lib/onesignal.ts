/**
 * OneSignal REST API helpers for push reminders.
 * Configure NEXT_PUBLIC_ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in .env
 */

export type PushReminderParams = {
  userId: string;
  heading: string;
  content: string;
  url?: string;
};

export async function sendPushReminder(params: PushReminderParams) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    throw new Error("OneSignal is not configured");
  }

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({
      app_id: appId,
      include_aliases: { external_id: [params.userId] },
      target_channel: "push",
      headings: { en: params.heading },
      contents: { en: params.content },
      url: params.url,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OneSignal error: ${text}`);
  }

  return response.json();
}
