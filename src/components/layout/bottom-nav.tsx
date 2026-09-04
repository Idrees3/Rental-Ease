"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Landmark, Receipt, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

const payerLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/rent", label: "Rent", icon: Home },
  { href: "/emi", label: "EMI", icon: Landmark },
  { href: "/expenses", label: "Bills", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const collectorLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = role === "collector" ? collectorLinks : payerLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-safe"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[4rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs transition-colors",
                active
                  ? "text-maroon font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
