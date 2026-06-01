export const APP_NAME = "Rental Ease";
export const APP_TAGLINE = "Bills & expenses for Qatar expats";
export const DEFAULT_CURRENCY = "QAR";

/** Production domain (install + app). Override via NEXT_PUBLIC_APP_URL in env. */
export const APP_DOMAIN = "rentalease.app";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? `https://${APP_DOMAIN}`;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "home" as const },
  { href: "/rent", label: "Rent", icon: "home" as const },
  { href: "/emi", label: "EMI", icon: "landmark" as const },
  { href: "/expenses", label: "Bills", icon: "receipt" as const },
] as const;
