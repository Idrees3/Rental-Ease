"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendDueRemindersForUser } from "@/lib/reminders/due-reminders";
import { sendReminderEmail } from "@/lib/email";
import { sendPushReminder } from "@/lib/onesignal";
import { APP_URL } from "@/lib/constants";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in again.");
  return { supabase, user };
}

export async function updateNotificationPrefs(formData: FormData) {
  const { supabase, user } = await requireUser();
  const push_enabled = formData.get("push_enabled") === "on";
  const email_reminders = formData.get("email_reminders") === "on";

  const { error } = await supabase
    .from("profiles")
    .update({
      push_enabled,
      email_reminders,
      onesignal_external_id: user.id,
    })
    .eq("id", user.id);

  if (error) {
    if (error.message.includes("push_enabled")) {
      throw new Error("Run phase5_notifications.sql in Supabase.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function sendMyDueReminders() {
  const { user } = await requireUser();
  return sendDueRemindersForUser(user.id);
}

export async function sendTestNotification() {
  const { supabase, user } = await requireUser();
  const email = user.email!;

  const results: string[] = [];

  if (process.env.RESEND_API_KEY) {
    await sendReminderEmail({
      to: email,
      subject: "Rental Ease — test email",
      title: "Test reminder",
      body: "If you see this, Resend is working.",
      amountQar: 100,
      dueDate: "Test",
    });
    results.push("Email sent");
  } else {
    results.push("Email not configured");
  }

  if (process.env.ONESIGNAL_REST_API_KEY) {
    try {
      await sendPushReminder({
        userId: user.id,
        heading: "Rental Ease",
        content: "Test push — notifications are working.",
        url: `${APP_URL}/dashboard`,
      });
      results.push("Push sent");
    } catch {
      results.push("Push failed — allow notifications in browser first");
    }
  } else {
    results.push("Push not configured");
  }

  await supabase
    .from("profiles")
    .update({ onesignal_external_id: user.id })
    .eq("id", user.id);

  return results.join(" · ");
}
