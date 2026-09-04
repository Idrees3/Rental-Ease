import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Never miss rent in Qatar",
  description:
    "Rental Ease is a Qatar rent app for payers and collectors — track dues in QAR, email reminders, and confirm payments in one place.",
};

/** Confirmed Doha / Qatar imagery (Museum of Islamic Art), not UAE. */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1681139853288-1c7fdcc4a974?auto=format&fit=crop&w=2400&q=80";
const CTA_IMAGE =
  "https://images.unsplash.com/photo-1681139885648-d2d330d53dda?auto=format&fit=crop&w=2000&q=80";

export default function LandingPage() {
  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a10]/60 via-[#8A1538]/50 to-[#14080c]" />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-24">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            Built for Qatar · QAR
          </p>
          <p className="mt-3 animate-fade-up font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
            {APP_NAME}
          </p>
          <h1 className="mt-5 max-w-xl animate-fade-up-delay text-xl font-medium text-white/95 sm:text-2xl">
            Never miss rent in Qatar.
          </h1>
          <p className="mt-3 max-w-lg animate-fade-up-delay-2 text-base leading-relaxed text-white/75 sm:text-lg">
            The simple way for tenants and landlords in Doha and across Qatar to
            track rent, send reminders, and confirm payments — all in QAR.
          </p>
          <div className="mt-8 flex animate-fade-up-delay-2 flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-maroon transition hover:bg-white/90"
            >
              Start 14-day free trial
            </Link>
            <Link
              href="/download"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Download app
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/55">
            Live in Qatar · under active development · billing coming soon
          </p>
        </div>
      </section>

      <section className="bg-[#14080c] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
            What it is
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
            Rent peace of mind — not another messy chat thread
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
            <p>
              In Qatar, rent is often paid monthly in{" "}
              <strong className="text-white">QAR</strong>, and reminders usually
              live on WhatsApp. Easy to forget. Hard to prove. Stressful for both
              sides.
            </p>
            <p>
              <strong className="text-white">{APP_NAME}</strong> is a focused app
              for that problem. You choose one role when you sign up:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Rent payer</strong> — you pay rent
                (tenant / expat / employee housing)
              </li>
              <li>
                <strong className="text-white">Rent collector</strong> — you
                collect rent (landlord / flat owner / property manager)
              </li>
            </ul>
            <p>
              Each account is separate. One property links to one payer. Email
              reminders and in-app payment status keep everyone clear — without
              SMS costs.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#1a0a10] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
            Two roles. Clear steps.
          </h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold text-white">If you pay rent</h3>
              <p className="mt-3 text-white/65">
                After signup, enter the invite code from your landlord. Then the
                app becomes your monthly money checklist.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Create a Rent payer account (email + password).",
                  "Enter your collector’s invite code on Home.",
                  "See your linked property, due day, and rent amount in QAR.",
                  "Track EMI/loans, Kahramaa-style bills, grocery & expenses.",
                  "When you transfer rent, tap “I paid” — collector gets notified.",
                  "Status stays “Waiting” until they tap “Received.”",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-white/75">
                    <span className="font-display text-lg text-maroon-light">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-white/50">
                Planned price: <strong className="text-white">20 QAR / month</strong>{" "}
                after 14-day free trial.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">
                If you collect rent
              </h3>
              <p className="mt-3 text-white/65">
                Add each flat or unit as its own property (one payer each). Share
                the invite code. Follow dues from one screen.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Create a Rent collector account.",
                  "Add a property: name, monthly rent (QAR), due day, balance.",
                  "Copy the invite code and send it to your tenant.",
                  "When they connect, you see payer details on that property.",
                  "Send a one-click email reminder when rent is due.",
                  "When they mark “I paid”, review and tap “Received.”",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-white/75">
                    <span className="font-display text-lg text-amber-400/90">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-white/50">
                From <strong className="text-white">50 QAR / month</strong> (up to
                10 properties) · <strong className="text-white">300 QAR</strong>{" "}
                for up to 100 · or +5 QAR per extra property.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#14080c] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            What you can do today
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            This is a live product for Qatar users. Stripe billing is next; you
            can try the full flow now during the free trial window.
          </p>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Rent due tracking",
                body: "Know what is due this week, on which day, and in QAR — for your home or your properties.",
              },
              {
                title: "Invite-code linking",
                body: "Collector and payer connect inside the app with a unique code. No shared passwords.",
              },
              {
                title: "Email reminders",
                body: "Collectors send rent reminders in one tap via Resend. Payers can turn on their own alerts in Settings.",
              },
              {
                title: "Payment confirmation",
                body: "Payer taps “I paid.” Collector confirms “Received.” Both sides see the same status.",
              },
              {
                title: "EMI & monthly bills",
                body: "Payers can also track car/home loans, utilities, telecom, subscriptions, and grocery budgets.",
              },
              {
                title: "Install like an app",
                body: "Use in the browser or Add to Home Screen on Android and iPhone. Play Store listing comes later.",
              },
            ].map((item) => (
              <li key={item.title} className="space-y-2 border-t border-white/10 pt-5">
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#1a0a10] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Who it’s for
          </h2>
          <div className="mt-8 space-y-4 text-white/70">
            <p>
              <strong className="text-white">Expats and tenants in Qatar</strong>{" "}
              who juggle rent, EMI, and monthly bills and want one calm place
              instead of scattered notes.
            </p>
            <p>
              <strong className="text-white">
                Landlords and small collectors
              </strong>{" "}
              with a few flats or units who need due dates, remaining balance,
              and a simple way to remind and confirm payment.
            </p>
            <p>
              Not a bank. Not a marketplace. Not for whole-building complex
              management yet —{" "}
              <strong className="text-white">one property = one payer</strong> by
              design.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#14080c] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Simple pricing in QAR
          </h2>
          <p className="mt-3 max-w-2xl text-white/65">
            Everyone starts with <strong className="text-white">14 days free</strong>.
            Paid plans will use Stripe soon. Until then, create an account and
            use the live app.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-sm text-white/55">{plan.name}</p>
                <p className="mt-3 font-display text-4xl text-white">
                  {plan.price}
                  <span className="text-lg text-white/50"> QAR/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/65">{plan.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-maroon px-6 py-3 text-sm font-semibold text-white transition hover:bg-maroon-light"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#1a0a10] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-white">Quick answers</h2>
          <ul className="mt-8 space-y-6">
            {[
              {
                q: "Is this only for Qatar?",
                a: "Yes — the product is designed for Qatar rentals, QAR amounts, and local day-to-day use (including expat households).",
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
              <li key={item.q} className="border-b border-white/10 pb-6">
                <h3 className="text-lg font-medium text-white">{item.q}</h3>
                <p className="mt-2 text-white/65">{item.a}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/support"
            className="mt-8 inline-block text-sm font-medium text-maroon-light hover:underline"
          >
            More help on the Support page →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-24 sm:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${CTA_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-[#8A1538]/88" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Start in Qatar today
          </h2>
          <p className="mt-4 text-white/85">
            Create a free account, choose payer or collector, and see how rent
            tracking should feel — clear, local, and in QAR.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-maroon"
            >
              Start free trial
            </Link>
            <Link
              href="/download"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
            >
              Download / install
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
