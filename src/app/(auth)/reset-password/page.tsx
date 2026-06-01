import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "New password" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Choose new password"
      description="Enter a new password for your account."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
