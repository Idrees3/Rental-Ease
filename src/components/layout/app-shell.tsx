"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Landmark,
  Receipt,
  LayoutDashboard,
  Settings,
  CreditCard,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/types/database";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function payerNav(): NavItem[] {
  return [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/rent", label: "Rent", icon: Home },
    { href: "/emi", label: "EMI", icon: Landmark },
    { href: "/expenses", label: "Bills", icon: Receipt },
    { href: "/billing", label: "Billing", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
}

function collectorNav(): NavItem[] {
  return [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/billing", label: "Billing", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  role,
  email,
  children,
}: {
  role: UserRole;
  email?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = role === "collector" ? collectorNav() : payerNav();
  const mobileLinks =
    role === "collector"
      ? links.filter((l) =>
          ["/dashboard", "/properties", "/billing", "/settings"].includes(l.href)
        )
      : links.filter((l) =>
          ["/dashboard", "/rent", "/emi", "/expenses", "/settings"].includes(
            l.href
          )
        );

  return (
    <div className="min-h-dvh bg-[hsl(30_20%_98%)]">
      <div className="mx-auto flex min-h-dvh max-w-7xl">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-maroon/10 bg-white px-4 py-6 md:flex">
          <Link href="/dashboard" className="px-2">
            <p className="font-display text-2xl text-maroon">{APP_NAME}</p>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {role} workspace
            </p>
          </Link>

          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-maroon text-white shadow-sm"
                      : "text-foreground/70 hover:bg-maroon/5 hover:text-maroon"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl bg-maroon/[0.04] px-3 py-3">
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            <Link
              href="/"
              className="mt-2 inline-block text-xs font-medium text-maroon hover:underline"
            >
              View website
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-nav md:pb-0">
          {children}
        </div>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur md:hidden pb-safe"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
          {mobileLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] transition-colors",
                  active
                    ? "font-medium text-maroon"
                    : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
