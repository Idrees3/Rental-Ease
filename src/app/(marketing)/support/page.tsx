import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support",
  description: "Help and contact for Rental Ease.",
};

const faqs = [
  {
    q: "What is Rental Ease?",
    a: "A Qatar-focused rent app for payers and collectors. Track dues in QAR, send email reminders, and confirm payments in-app.",
  },
  {
    q: "How do payer and collector connect?",
    a: "The collector adds a property and gets an invite code. The payer enters that code after signup. One property = one payer.",
  },
  {
    q: "Is billing live?",
    a: "Not yet. Everyone gets a 14-day free trial while we finish Stripe. You can use the live product now for testing and early access.",
  },
  {
    q: "Can I use it without installing?",
    a: "Yes. Sign up at rentalease.app in any browser. Install to Home Screen when you want the app feel.",
  },
  {
    q: "Emails not arriving?",
    a: "Check spam, confirm your email on signup, and make sure notification preferences are on in Settings. Contact us if it still fails.",
  },
];

export default function SupportPage() {
  return (
    <main className="bg-[#14080c] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
          Support
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">
          We’re here to help
        </h1>
        <p className="mt-4 text-lg text-white/70">
          {APP_NAME} is live and improving quickly. For account or reminder
          issues, email us and we’ll reply as soon as we can.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/55">Email support</p>
          <a
            href="mailto:support@rentalease.app"
            className="mt-1 block text-xl font-medium text-white hover:underline"
          >
            support@rentalease.app
          </a>
          <p className="mt-3 text-sm text-white/55">
            Include your account email and whether you are a payer or collector.
          </p>
        </div>

        <h2 className="mt-14 font-display text-3xl">FAQ</h2>
        <ul className="mt-6 space-y-6">
          {faqs.map((item) => (
            <li key={item.q} className="border-b border-white/10 pb-6">
              <h3 className="text-lg font-medium">{item.q}</h3>
              <p className="mt-2 text-white/65">{item.a}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold"
          >
            Create account
          </Link>
          <Link
            href="/download"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold"
          >
            Download
          </Link>
        </div>
      </div>
    </main>
  );
}
