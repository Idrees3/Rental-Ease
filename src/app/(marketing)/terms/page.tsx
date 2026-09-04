import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Rental Ease.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#22161c] px-4 pb-20 pt-28 text-white sm:px-6">
      <article className="mx-auto max-w-3xl space-y-5 text-white/75">
        <h1 className="font-display text-5xl text-white">Terms of use</h1>
        <p className="text-sm text-white/45">Last updated: September 2026</p>
        <p>
          {APP_NAME} provides rent and payment tracking tools for personal and
          small-property use in Qatar. By creating an account you agree to use
          the service lawfully and keep your login secure.
        </p>
        <p>
          The product is under active development. Features, pricing, and
          availability may change. During the free trial period, paid billing
          (Stripe) is not charged.
        </p>
        <p>
          You remain responsible for the accuracy of amounts, due dates, and
          payment confirmations you enter. {APP_NAME} is not a bank, escrow, or
          legal rent collection agency.
        </p>
        <p>
          We may suspend accounts that abuse reminders, attempt unauthorized
          access, or misuse another user’s invite codes.
        </p>
        <p>
          Questions?{" "}
          <Link href="/support" className="text-white underline">
            Contact support
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
