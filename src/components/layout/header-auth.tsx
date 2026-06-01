import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function HeaderAuth() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-maroon hover:underline"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-[10rem] truncate text-xs text-muted-foreground">
        {user.email}
      </span>
      <SignOutButton />
    </div>
  );
}
