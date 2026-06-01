# Rental Ease

Bill reminders and expense tracking for **Qatar expats** — rent, EMI/loans, and monthly bills in **QAR**.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + shadcn-style UI components
- **Supabase** — auth & database
- **Resend** — email reminders
- **OneSignal** — push notifications

## Features (roadmap)

1. **Rent** — monthly amount, due day, reminders
2. **EMI & loans** — multiple lenders, due dates
3. **Monthly bills** — utilities (e.g. Kahramaa), telecom, subscriptions

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in Supabase, Resend, OneSignal keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase (Rental Ease project)

Project ref: `efwcyuhtknalmsnrshka`

1. Keys go in `.env.local` (see `.env.example`).
2. Run `supabase/schema.sql` in the [SQL Editor](https://supabase.com/dashboard/project/efwcyuhtknalmsnrshka/sql/new).
3. Add redirect URL `http://localhost:3000/auth/callback` under Authentication → URL Configuration.

See **SETUP.md** for a non-technical walkthrough.

### Resend & OneSignal

Add API keys from `.env.example` when you are ready to send reminders.

## Project structure

```
src/
  app/           # App Router pages
  components/    # UI + layout + features
  lib/           # Supabase, email, OneSignal, utils
  types/         # TypeScript types
supabase/
  schema.sql     # Database schema + RLS
```

## Design

- Mobile-first, max-width shell
- Qatar maroon accent (`#8A1538`)
- Currency: QAR via `formatQAR()`

## License

Private — Rental Ease
