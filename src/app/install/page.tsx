import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, Apple } from "lucide-react";

export const metadata = {
  title: "Install",
  description: "Download Rental Ease for Android and iPhone",
};

export default function InstallPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-maroon/5 to-background px-4 py-10">
      <div className="mx-auto max-w-lg space-y-8 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-maroon">
            {APP_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Install the app
          </h1>
          <p className="mt-2 text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-5 w-5 text-maroon" />
              Android
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Open this site in <strong>Chrome</strong></p>
            <p>2. Tap menu → <strong>Install app</strong> or <strong>Add to Home screen</strong></p>
            <p className="text-xs">Play Store link will be added here when published.</p>
            <Button asChild className="w-full">
              <Link href="/login">
                <Download className="h-4 w-4" />
                Open app & sign in
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Apple className="h-5 w-5 text-maroon" />
              iPhone (no App Store fee)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Open <strong>Safari</strong> → rentalease.app</p>
            <p>2. Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></p>
            <p>3. Open the icon — works like an app</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Sign in after install</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </div>
  );
}
