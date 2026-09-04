import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create account"
      description="Choose payer or collector and start your 14-day free trial."
    >
      <SignupForm />
    </AuthCard>
  );
}
