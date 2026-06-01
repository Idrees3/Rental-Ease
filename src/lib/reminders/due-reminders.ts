import { createClient } from "@/lib/supabase/server";
import { getPaymentsForMonth } from "@/lib/data/payments";
import { daysUntilDue, dueStatusLabel, getDueStatus } from "@/lib/dates";
import { isPaidThisMonth } from "@/lib/payment-utils";
import { sendReminderEmail } from "@/lib/email";
import { sendPushReminder } from "@/lib/onesignal";
import { formatQAR } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";

export type ReminderItem = {
  kind: "rent" | "emi";
  title: string;
  amount_qar: number;
  daysUntil: number;
  statusLabel: string;
};

export async function getDueRemindersForUser(
  userId: string
): Promise<ReminderItem[]> {
  const supabase = await createClient();
  const payments = await getPaymentsForMonth();

  const [rents, emis] = await Promise.all([
    supabase
      .from("rent_trackers")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true),
    supabase
      .from("emi_trackers")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true),
  ]);

  const items: ReminderItem[] = [];

  for (const rent of rents.data ?? []) {
    if (isPaidThisMonth(payments, "rent", rent.id)) continue;
    const days = daysUntilDue(rent.due_day);
    if (days > rent.reminder_days_before) continue;
    const status = getDueStatus(rent.due_day, false);
    items.push({
      kind: "rent",
      title: rent.landlord_name || "Rent",
      amount_qar: Number(rent.amount_qar),
      daysUntil: days,
      statusLabel: dueStatusLabel(status, rent.due_day),
    });
  }

  for (const emi of emis.data ?? []) {
    if (isPaidThisMonth(payments, "emi", emi.id)) continue;
    const days = daysUntilDue(emi.due_day);
    if (days > emi.reminder_days_before) continue;
    const status = getDueStatus(emi.due_day, false);
    items.push({
      kind: "emi",
      title: emi.lender_name,
      amount_qar: Number(emi.amount_qar),
      daysUntil: days,
      statusLabel: dueStatusLabel(status, emi.due_day),
    });
  }

  return items;
}

export async function sendDueRemindersInternal(
  userId: string,
  email: string,
  opts: { emailReminders: boolean; pushEnabled: boolean }
) {
  const items = await getDueRemindersForUser(userId);
  if (items.length === 0) {
    return { sent: 0, count: 0, message: "Nothing due soon — you're all set." };
  }

  let sent = 0;
  const lines = items
    .map((i) => `${i.title}: ${formatQAR(i.amount_qar)} (${i.statusLabel})`)
    .join("\n");

  if (opts.emailReminders && email && process.env.RESEND_API_KEY) {
    await sendReminderEmail({
      to: email,
      subject: `Rental Ease — ${items.length} payment reminder(s)`,
      title: "Upcoming payments",
      body: `Hi,\n\n${lines}\n\nOpen the app to mark as paid.`,
      amountQar: items.reduce((s, i) => s + i.amount_qar, 0),
    });
    sent += 1;
  }

  if (opts.pushEnabled && process.env.ONESIGNAL_REST_API_KEY) {
    const top = items[0];
    await sendPushReminder({
      userId,
      heading: "Payment reminder",
      content: `${top.title} — ${formatQAR(top.amount_qar)}. ${top.statusLabel}`,
      url: `${APP_URL}/dashboard`,
    });
    sent += 1;
  }

  return {
    sent,
    count: items.length,
    message:
      sent > 0
        ? `Sent ${items.length} reminder(s) by email and/or push.`
        : "Turn on email or push in Notifications below.",
  };
}

export async function sendDueRemindersForUser(userId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error("Not authorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, email_reminders, push_enabled")
    .eq("id", userId)
    .single();

  const email = profile?.email ?? user.email ?? "";
  return sendDueRemindersInternal(userId, email, {
    emailReminders: profile?.email_reminders !== false,
    pushEnabled: profile?.push_enabled === true,
  });
}
