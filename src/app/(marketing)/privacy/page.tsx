import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Rental Ease.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#22161c] px-4 pb-20 pt-28 text-white sm:px-6">
      <article className="mx-auto max-w-3xl space-y-5 text-white/75">
        <h1 className="font-display text-5xl text-white">Privacy policy</h1>
        <p className="text-sm text-white/45">Last updated: September 2026</p>
        <p>
          We store your account email, role (payer or collector), and the
          financial data you enter — rent amounts, due dates, bills, loans, and
          payment confirmation status — so we can power tracking and reminders.
        </p>
        <p>
          Data is hosted with Supabase. Email reminders are sent with Resend.
          Optional push notifications use OneSignal. We do not sell your personal
          data.
        </p>
        <p>
          Collectors and linked payers can see payment status for their shared
          property only. Unrelated users cannot access your records.
        </p>
        <p>
          To request deletion or ask a privacy question, email{" "}
          <a href="mailto:support@rentalease.app" className="text-white underline">
            support@rentalease.app
          </a>
          .
        </p>
        <p>
          <Link href="/" className="text-white underline">
            ← Back to {APP_NAME}
          </Link>
        </p>
      </article>
    </main>
  );
}
