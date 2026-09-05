# Rental Ease — product decisions

Last updated: September 2026

## Brand & domain

| Item | Value |
|------|--------|
| App name | **Rental Ease** |
| Domain | **https://rentalease.app** |
| Currency | QAR |
| Audience | Qatar tenants (payers) and landlords (collectors) |

## Product shape — website first

- Primary product: **live website SaaS** (desktop + mobile browser).
- Same features on web and optional install (PWA / later Play Store).
- Domain hosts marketing, signup/login, full dashboards, support, and download/install help.

## Pricing (Stripe ready)

| Plan | Price |
|------|--------|
| Payer | 20 QAR / month |
| Collector Starter | 50 QAR / month (≤10 properties) |
| Collector Growth | 300 QAR / month (≤100) |
| Custom add-on | +5 QAR per property above 10 |
| Trial | 14 days free |

## Channels

| Platform | Status |
|----------|--------|
| Website | Primary — live now |
| PWA / Add to Home Screen | Optional |
| Android Play Store | Later wrapper of same web product |
| iOS | Install from site (no App Store fee) |

## Integrations

| Service | Use |
|---------|-----|
| Supabase | Auth, database, RLS |
| Resend | Email reminders |
| OneSignal | Push (optional) |
| Stripe | Subscriptions (env keys when ready) |
