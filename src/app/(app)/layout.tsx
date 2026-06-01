import { BottomNav } from "@/components/layout/bottom-nav";
import { OneSignalInit } from "@/components/notifications/onesignal-init";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="pb-nav">
      {user && appId ? <OneSignalInit userId={user.id} appId={appId} /> : null}
      {children}
      <BottomNav />
    </div>
  );
}
