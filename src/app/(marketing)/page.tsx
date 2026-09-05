import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Never miss rent in Qatar",
  description:
    "Rental Ease is a Qatar rent app for payers and collectors — track dues in QAR, email reminders, and confirm payments in one place.",
};

/** Confirmed Doha / Qatar imagery (Museum of Islamic Art). */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1681139853288-1c7fdcc4a974?auto=format&fit=crop&w=2400&q=80";
const CTA_IMAGE =
  "https://images.unsplash.com/photo-1681139885648-d2d330d53dda?auto=format&fit=crop&w=2000&q=80";

const payerSteps = [
  "Create a Rent payer account with email and password.",
  "Enter your collector’s invite code on Home.",
  "See your linked property, due day, and rent amount in QAR.",
  "Track EMI, Kahramaa-style bills, grocery and expenses.",
  "When you transfer rent, tap “I paid” — collector is notified.",
  "Status stays Waiting until they confirm Received.",
];

const collectorSteps = [
  "Create a Rent collector account.",
  "Add a property: name, monthly rent in QAR, due day, balance.",
  "Copy the invite code and share it with your tenant.",
  "When they connect, payer details appear on that property.",
  "Send a one-click email reminder when rent is due.",
  "Review “I paid” and tap Received to close the month.",
];

const capabilities = [
  {
    title: "Rent due tracking",
    body: "See what is due this week, on which day, and in QAR — for your home or your properties.",
  },
  {
    title: "Invite-code linking",
    body: "Collector and payer connect inside the app with a unique code. No shared passwords.",
  },
  {
    title: "Email reminders",
    body: "Collectors send rent reminders in one tap. Payers can enable their own alerts in Settings.",
  },
  {
    title: "Payment confirmation",
    body: "Payer taps I paid. Collector confirms Received. Both sides see the same status.",
  },
  {
    title: "EMI & monthly bills",
    body: "Payers also track loans, utilities, telecom, subscriptions, and grocery budgets.",
  },
  {
    title: "Install like an app",
    body: "Use in the browser or Add to Home Screen on Android and iPhone. Play Store comes later.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1820]/55 via-[#8A1538]/45 to-[#1c1218]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-28">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
            Built for Qatar · QAR
          </p>
          <p className="mt-4 animate-fade-up font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
            {APP_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl animate-fade-up-delay text-2xl font-medium leading-snug text-white sm:text-3xl">
            Never miss rent in Qatar.
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up-delay-2 text-lg leading-relaxed text-white/85 sm:text-xl">
            The simple way for tenants and landlords in Doha and across Qatar to
            track rent, send reminders, and confirm payments — all in QAR.
          </p>
          <div className="mt-9 flex animate-fade-up-delay-2 flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-maroon transition hover:bg-white/90"
            >
              Start free on the web
            </Link>
            <Link
              href="/download"
              className="rounded-full border border-white/50 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Optional install
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/65">
            Full website SaaS · works on desktop & mobile · install optional
          </p>
        </div>
      </section>

      <section className="bg-[#22161c] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a5b4]">
              What it is
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              Rent peace of mind — not another messy chat thread
            </h2>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="space-y-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              <p>
                In Qatar, rent is usually paid monthly in{" "}
                <strong className="text-white">QAR</strong>. Reminders often live
                on WhatsApp — easy to miss, hard to prove, stressful for both
                sides.
              </p>
              <p>
                <strong className="text-white">{APP_NAME}</strong> replaces that
                chaos with one clear place to track dues, remind, and confirm
                payment.
              </p>
              <p>
                Separate accounts. One property links to one payer. Email
                reminders and in-app status keep everyone aligned — without SMS
                costs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-maroon bg-white/[0.06] px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#d4a5b4]">
                  Rent payer
                </p>
                <p className="mt-2 text-lg text-white">
                  You pay rent — tenant, expat, or employee housing.
                </p>
              </div>
              <div className="border-l-4 border-amber-400/80 bg-white/[0.06] px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-200/90">
                  Rent collector
                </p>
                <p className="mt-2 text-lg text-white">
                  You collect rent — landlord, flat owner, or property manager.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#2a1c24] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a5b4]">
            How it works
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Two roles. Six clear steps each.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            Pick your side at signup. The app shows only what you need — no
            clutter, no mixed dashboards.
          </p>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-[#22161c]/80 p-7 sm:p-9">
              <div className="flex items-end justify-between gap-4">
                <h3 className="font-display text-3xl text-white sm:text-4xl">
                  If you pay rent
                </h3>
                <span className="rounded-full bg-maroon/30 px-3 py-1 text-sm font-medium text-[#f0d0da]">
                  20 QAR/mo
                </span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Enter your landlord’s invite code. Then use Home as your monthly
                money checklist.
              </p>
              <ol className="mt-8 space-y-5">
                {payerSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-display text-2xl leading-none text-[#e8a4b6]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed text-white/85 sm:text-lg">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-white/10 pt-5 text-base text-white/60">
                After 14-day free trial · full payer toolkit included
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-[#22161c]/80 p-7 sm:p-9">
              <div className="flex items-end justify-between gap-4">
                <h3 className="font-display text-3xl text-white sm:text-4xl">
                  If you collect
                </h3>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-100">
                  from 50 QAR
                </span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Add each flat as its own property. Share the code. Follow dues
                from one calm screen.
              </p>
              <ol className="mt-8 space-y-5">
                {collectorSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-display text-2xl leading-none text-amber-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed text-white/85 sm:text-lg">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-white/10 pt-5 text-base text-white/60">
                50 QAR ≤10 properties · 300 QAR ≤100 · or +5 QAR per extra
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#22161c] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            What you can do today
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            A live product for Qatar users. Stripe billing is next — try the full
            flow now during the free trial.
          </p>
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, index) => (
              <li key={item.title} className="relative pt-2">
                <span className="font-display text-sm tracking-widest text-[#d4a5b4]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/75 sm:text-lg">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#2a1c24] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Who it’s for
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Expats & tenants",
                body: "Juggle rent, EMI, and monthly bills in one calm place instead of scattered notes and chats.",
              },
              {
                title: "Landlords & collectors",
                body: "A few flats or units, clear due dates, remaining balance, reminders, and confirmation.",
              },
              {
                title: "Deliberately focused",
                body: "Not a bank. Not a marketplace. One property = one payer — built for clarity, not complexity.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-t-2 border-maroon/70 pt-6"
              >
                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/75 sm:text-lg">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#22161c] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Simple pricing in QAR
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">
            Everyone starts with{" "}
            <strong className="text-white">14 days free</strong>. Paid plans use
            Stripe soon. Until then, create an account and use the live app.
          </p>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Payer",
                price: "20",
                detail:
                  "Full payer toolkit: rent link, EMI, bills, expenses, payment status.",
              },
              {
                name: "Collector Starter",
                price: "50",
                detail:
                  "Up to 10 properties, invite codes, reminders, mark received.",
                featured: true,
              },
              {
                name: "Collector Growth",
                price: "300",
                detail:
                  "Up to 100 properties. Or stay on Starter and add units at +5 QAR each.",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-7 ${
                  plan.featured
                    ? "border-maroon bg-maroon/25"
                    : "border-white/15 bg-white/[0.05]"
                }`}
              >
                <p className="text-base text-white/70">{plan.name}</p>
                <p className="mt-4 font-display text-5xl text-white">
                  {plan.price}
                  <span className="text-xl text-white/55"> QAR/mo</span>
                </p>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  {plan.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-maroon px-7 py-3.5 text-base font-semibold text-white transition hover:bg-maroon-light"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#2a1c24] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Quick answers
          </h2>
          <ul className="mt-10 space-y-8">
            {[
              {
                q: "Is this only for Qatar?",
                a: "Yes — designed for Qatar rentals, QAR amounts, and local day-to-day use including expat households.",
              },
              {
                q: "Do I need the Play Store?",
                a: "Not yet. Open rentalease.app in Chrome or Safari and Add to Home Screen. A Play Store build is planned later.",
              },
              {
                q: "Can one email be both payer and collector?",
                a: "No. Roles are separate accounts with different emails, so each side stays clear.",
              },
            ].map((item) => (
              <li key={item.q} className="border-b border-white/15 pb-8">
                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                  {item.q}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/75 sm:text-lg">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/support"
            className="mt-10 inline-block text-base font-semibold text-[#e8a4b6] hover:underline"
          >
            More help on the Support page →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-28 sm:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${CTA_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-[#8A1538]/86" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Start in Qatar today
          </h2>
          <p className="mt-5 text-lg text-white/90 sm:text-xl">
            Create a free account, choose payer or collector, and see how rent
            tracking should feel — clear, local, and in QAR.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-maroon"
            >
              Start free trial
            </Link>
            <Link
              href="/download"
              className="rounded-full border border-white/50 px-7 py-3.5 text-base font-semibold text-white"
            >
              Download / install
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
