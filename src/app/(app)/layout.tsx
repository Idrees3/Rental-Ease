import { BottomNav } from "@/components/layout/bottom-nav";
import { OneSignalInit } from "@/components/notifications/onesignal-init";
import { createClient } from "@/lib/supabase/server";
import { getAccountProfile } from "@/lib/data/account";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "";
  const account = await getAccountProfile();
  const role = account?.role ?? "payer";

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-background pb-nav">
      {user && appId ? <OneSignalInit userId={user.id} appId={appId} /> : null}
      {children}
      <BottomNav role={role} />
    </div>
  );
}
