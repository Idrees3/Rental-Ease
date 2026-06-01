import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create account"
      description="Track rent, EMI, and bills in QAR."
    >
      <SignupForm />
    </AuthCard>
  );
}
