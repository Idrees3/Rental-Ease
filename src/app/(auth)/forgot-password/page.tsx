import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="We will email you a link to choose a new password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
