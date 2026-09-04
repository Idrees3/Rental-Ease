import Link from "next/link";
import type { Metadata } from "next";
import { Apple, Smartphone, Download } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Download",
  description: "Install Rental Ease on Android, iPhone, or open in your browser.",
};

export default function DownloadPage() {
  return (
    <main className="bg-[#22161c] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
          Download
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
          Get {APP_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          The full product runs as a web app today. Install it to your home screen
          for a fullscreen experience. Play Store packaging comes next.
        </p>

        <div className="mt-12 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-maroon-light" />
              <h2 className="text-xl font-semibold">Android</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/70">
              <li>Open rentalease.app in Chrome</li>
              <li>Tap the menu → Install app or Add to Home screen</li>
              <li>Open the icon and sign in</li>
            </ol>
            <p className="mt-3 text-xs text-white/45">
              Google Play listing will be linked here when published.
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />
              Open & create account
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Apple className="h-6 w-6 text-maroon-light" />
              <h2 className="text-xl font-semibold">iPhone</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/70">
              <li>Open rentalease.app in Safari</li>
              <li>Tap Share → Add to Home Screen</li>
              <li>Open the icon — fullscreen, no App Store fee</li>
            </ol>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold"
            >
              Sign in after install
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Use in browser</h2>
            <p className="mt-3 text-white/70">
              Prefer not to install yet? Create an account and use the live SaaS
              right away — dashboards, invite linking, and email reminders are
              available now.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-maroon"
              >
                Start free trial
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
