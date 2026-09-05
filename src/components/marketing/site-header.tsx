"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/download", label: "Install" },
  { href: "/support", label: "Support" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight text-white">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm text-white/90 transition hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-maroon transition hover:bg-white/90"
          >
            Use on web
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#1c1218]/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-white/85"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-base text-white/85"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-maroon"
              onClick={() => setOpen(false)}
            >
              Create free account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
