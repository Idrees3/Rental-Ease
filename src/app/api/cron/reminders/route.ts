import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDueRemindersInternal } from "@/lib/reminders/due-reminders";

/** Optional daily cron — requires SUPABASE_SERVICE_ROLE_KEY + CRON_SECRET on Vercel */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const admin = createClient(url, serviceKey);
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, email_reminders, push_enabled")
    .or("email_reminders.eq.true,push_enabled.eq.true");

  let processed = 0;
  for (const p of profiles ?? []) {
    if (!p.email) continue;
    try {
      await sendDueRemindersInternal(p.id, p.email, {
        emailReminders: p.email_reminders !== false,
        pushEnabled: p.push_enabled === true,
      });
      processed += 1;
    } catch {
      // continue
    }
  }

  return NextResponse.json({ ok: true, processed });
}
