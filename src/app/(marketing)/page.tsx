import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Never miss rent in Qatar",
  description:
    "Rental Ease helps rent payers and collectors track dues, send reminders, and confirm payments — in QAR.",
};

export default function LandingPage() {
  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=80)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a10]/55 via-[#8A1538]/55 to-[#14080c]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,210,170,0.12),transparent_35%)]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-24">
          <p className="animate-fade-up font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
            {APP_NAME}
          </p>
          <h1 className="mt-5 max-w-xl animate-fade-up-delay text-xl font-medium text-white/95 sm:text-2xl">
            Never miss rent in Qatar.
          </h1>
          <p className="mt-3 max-w-lg animate-fade-up-delay-2 text-base leading-relaxed text-white/75 sm:text-lg">
            For rent payers and collectors — due dates, reminders, and payment
            confirmation in one simple app.
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
            Live product · under active development · billing coming soon
          </p>
        </div>
      </section>

      <section id="how" className="bg-[#14080c] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
            Two roles. One clear job.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="border-l border-maroon/50 pl-6">
              <h3 className="text-xl font-semibold text-white">Rent payer</h3>
              <p className="mt-3 text-white/70">
                Connect with your collector’s invite code, track rent, EMI, and
                bills in QAR, then tap <strong className="text-white">I paid</strong>{" "}
                so both sides stay aligned.
              </p>
              <p className="mt-4 text-sm text-white/50">20 QAR / month after trial</p>
            </div>
            <div className="border-l border-amber-500/40 pl-6">
              <h3 className="text-xl font-semibold text-white">Rent collector</h3>
              <p className="mt-3 text-white/70">
                Add each property (one payer each), share an invite code, send
                one-click email reminders, and mark payments{" "}
                <strong className="text-white">Received</strong>.
              </p>
              <p className="mt-4 text-sm text-white/50">
                From 50 QAR / month · up to 100 properties on Growth
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a0a10] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Built for real Qatar money flow
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Email reminders are live. Push notifications are ready. Payment
            status syncs between payer and collector inside the app.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Due dates that matter",
                body: "See what’s due this week and mark payments without chasing WhatsApp threads.",
              },
              {
                title: "Invite-code linking",
                body: "Collector creates a property, payer enters the code, and both accounts connect.",
              },
              {
                title: "Email reminders",
                body: "Collectors send rent reminders in one tap. Payers can enable their own alerts.",
              },
            ].map((item) => (
              <li key={item.title} className="space-y-2">
                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="bg-[#14080c] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Simple pricing in QAR
          </h2>
          <p className="mt-3 text-white/65">
            14 days free for everyone. Stripe checkout comes next — try the live
            app now.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Payer",
                price: "20",
                detail: "Rent, EMI, bills & expenses tracking",
              },
              {
                name: "Collector Starter",
                price: "50",
                detail: "Up to 10 properties · reminders · confirmations",
              },
              {
                name: "Collector Growth",
                price: "300",
                detail: "Up to 100 properties · or +5 QAR per extra unit",
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

      <section className="relative overflow-hidden px-4 py-24 sm:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-[#8A1538]/85" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Install it. Open it. Use it.
          </h2>
          <p className="mt-4 text-white/80">
            Works in the browser today. Add to Home Screen for an app-like
            experience on Android and iPhone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/download"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-maroon"
            >
              Get the app
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
            >
              Need help?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
