import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: { error?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const configured = isSupabaseConfigured();

  return (
    <>
      <AppHeader title="Sign in" subtitle={`Continue to ${APP_NAME}`} />
      <main className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Welcome</CardTitle>
            <CardDescription>
              Enter your email and we will send you a secure link — no password
              needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.error === "auth" && (
              <p className="text-sm text-destructive">
                Sign-in link expired or invalid. Please try again.
              </p>
            )}
            {configured ? (
              <LoginForm />
            ) : (
              <p className="text-sm text-muted-foreground">
                Add Supabase keys to <code className="text-xs">.env.local</code>{" "}
                first.
              </p>
            )}
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="text-maroon hover:underline">
                Back to dashboard
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
