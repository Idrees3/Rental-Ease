import Link from "next/link";
import type { Metadata } from "next";
import { Apple, Smartphone, MonitorSmartphone } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Use on web or install",
  description: "Use Rental Ease in your browser, or install to your home screen.",
};

export default function DownloadPage() {
  return (
    <main className="bg-[#22161c] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-maroon-light">
          Access
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
          Use {APP_NAME} anywhere
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          The full product is a live website. Sign in on desktop or phone — every
          feature works in the browser. Installing is optional.
        </p>

        <div className="mt-12 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-6 w-6 text-maroon-light" />
              <h2 className="text-xl font-semibold">Website (recommended)</h2>
            </div>
            <p className="mt-3 text-white/70">
              Open rentalease.app, create an account, and use the full dashboard
              on laptop or phone — no store required.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-maroon"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-maroon-light" />
              <h2 className="text-xl font-semibold">Android (optional)</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/70">
              <li>Open rentalease.app in Chrome</li>
              <li>Menu → Install app or Add to Home screen</li>
              <li>Open the icon and sign in</li>
            </ol>
            <p className="mt-3 text-xs text-white/45">
              Google Play listing will be linked here when the native wrapper is
              published.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Apple className="h-6 w-6 text-maroon-light" />
              <h2 className="text-xl font-semibold">iPhone (optional)</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/70">
              <li>Open rentalease.app in Safari</li>
              <li>Share → Add to Home Screen</li>
              <li>Open the icon for a fullscreen experience</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
