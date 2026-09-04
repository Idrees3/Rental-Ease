import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/15 bg-[#1c1218] text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl text-white">{APP_NAME}</p>
          <p className="mt-3 max-w-sm text-base leading-relaxed">
            Rent reminders and payment tracking for Qatar — for people who pay
            rent and people who collect it.
          </p>
        </div>
        <div>
          <p className="text-base font-medium text-white">Product</p>
          <ul className="mt-3 space-y-2 text-base">
            <li>
              <Link href="/download" className="hover:text-white">
                Download
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white">
                Create account
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-base font-medium text-white">Help</p>
          <ul className="mt-3 space-y-2 text-base">
            <li>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 px-4 py-4 text-center text-sm text-white/45">
        © {new Date().getFullYear()} {APP_NAME}. Built for Qatar. Under active
        development.
      </div>
    </footer>
  );
}
