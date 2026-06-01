import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh px-4 py-10">
      <article className="mx-auto max-w-lg prose prose-sm prose-slate">
        <h1>{APP_NAME} — Privacy</h1>
        <p className="text-muted-foreground">Last updated: June 2026</p>
        <p>
          We store your account email and the financial data you enter (rent,
          loans, bills) to provide reminders and tracking. Data is stored
          securely with Supabase and is only visible to you.
        </p>
        <p>
          We do not sell your data. You can delete your account by contacting
          support or removing your data from the app.
        </p>
        <p>
          <Link href="/install" className="text-maroon">
            ← Back to install
          </Link>
        </p>
      </article>
    </div>
  );
}
