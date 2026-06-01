# Rental Ease — product decisions (locked)

Last updated from founder input.

## Brand & domain

| Item | Value |
|------|--------|
| App name | **Rental Ease** |
| Domain | **https://rentalease.app** (purchased) |
| Currency | QAR |
| Audience | Qatar expats (scale: thousands) |

## Product shape — app only

- **Not** a “use in browser daily” SaaS.
- Users **install** the app (home screen / store), then sign in **inside the app** (fullscreen).
- Domain hosts: **install/download**, legal pages, optional upgrade — not a public web dashboard.

## Install channels (v1)

| Platform | Channel |
|----------|---------|
| **Android** | Google **Play Store** + **direct download** from rentalease.app (APK on site first if Play review is pending) |
| **iOS** | **Install from domain only** (Safari → Add to Home Screen) — **no** App Store, **no** $99/year |
| **Browser** | Install/landing only — not the main product |

## Integrations

| Service | Status | Use |
|---------|--------|-----|
| Supabase | Connected | Auth, database, RLS |
| Resend | Account created | Password reset, rent/EMI/bill emails |
| OneSignal | Account created | Push reminders |
| Lemon Squeezy | Later | Pro plan on web (if paid tier) |
| Google Play IAP | Later | If selling digital Pro inside Play app |

## Auth (Phase 2)

- **Email + password** + forgot password (not magic-link-only).

## Core features (v1)

- Multiple **rent** properties
- Multiple **EMI / loans** (months remaining)
- **Monthly bills** (utilities, telecom, etc.)
- **Grocery / budgets** with progress + alerts
- Mark **paid** (full or different amount) + history
- **Due this week** (highlight today)
- Month switch, donut chart, text export
- PWA: offline message, install experience

## Production URLs (configure in dashboards)

| Service | URL |
|---------|-----|
| Site / app | `https://rentalease.app` |
| Auth callback | `https://rentalease.app/auth/callback` |
| Install page (planned) | `https://rentalease.app/install` |
| Local dev | `http://localhost:3000` |

Supabase → Authentication → URL Configuration: add **both** localhost and production URLs.

## Build phases

1. Foundation — done (shell, Supabase keys)
2. Auth — password, protected app, forgot password
3. Reminders — rent, EMI, push, email
4. Expenses — budgets, charts, export
5. Install — domain page, Play Store, PWA fullscreen, offline

Start coding a phase only when you say: **Start Phase N**.
