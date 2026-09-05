import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/constants";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  metadataBase: new URL(APP_URL),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8A1538",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${sans.variable} ${display.variable} font-sans min-h-dvh antialiased`}>
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
