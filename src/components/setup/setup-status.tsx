import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

async function getAuthStatus(): Promise<"signed_in" | "signed_out" | "unknown"> {
  if (!isSupabaseConfigured()) return "unknown";
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ? "signed_in" : "signed_out";
  } catch {
    return "unknown";
  }
}

export async function SetupStatus() {
  const envOk = isSupabaseConfigured();
  const authStatus = await getAuthStatus();

  const items = [
    {
      label: "Supabase keys in .env.local",
      done: envOk,
    },
    {
      label: "Database tables + payment history SQL",
      done: true,
      hint: "Run phase3_payment_records.sql if Mark paid fails",
    },
    {
      label: "You are signed in",
      done: authStatus === "signed_in",
      hint: authStatus === "signed_out" ? "Use Sign in above" : undefined,
    },
  ] as const;

  return (
    <Card className="border-dashed">
      <CardContent className="space-y-3 py-4">
        <p className="text-sm font-medium">Setup checklist</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-maroon" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span>
                {item.label}
                {"hint" in item && item.hint && !item.done && (
                  <span className="block text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {envOk && (
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            In Supabase: Authentication → URL Configuration → add{" "}
            <code className="rounded bg-muted px-1">
              http://localhost:3000/auth/callback
            </code>
          </p>
        )}
        {!envOk && (
          <Link href="/login" className="text-sm text-maroon hover:underline">
            Configure environment first
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
