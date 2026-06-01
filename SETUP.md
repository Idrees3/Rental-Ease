# Rental Ease — simple setup guide

You do not need to be a programmer. Follow these steps in order.

## Step 1 — Run the app on your computer

Open PowerShell in the project folder and run:

```powershell
cd c:\Users\DELL\Desktop\Rentaleaseapp
npm run dev
```

Open **http://localhost:3000** in your browser.

## Step 2 — Supabase is already connected

Your project URL and publishable key are saved in `.env.local` (this file stays on your computer only).

**Project:** `efwcyuhtknalmsnrshka`  
**Dashboard:** https://supabase.com/dashboard/project/efwcyuhtknalmsnrshka

## Step 3 — Create database tables (one time)

1. Open Supabase → **SQL Editor**
2. Open the file `supabase/schema.sql` in this project
3. Copy all text → paste in SQL Editor → click **Run**

When done, the setup checklist on the home page will still show this step until we auto-detect tables (you can ignore that for now once SQL ran successfully).

## Step 4 — Allow sign-in (local + production)

Domain: **https://rentalease.app**

In Supabase → **Authentication** → **URL Configuration**:

| Setting | Value |
|---------|--------|
| Site URL (production) | `https://rentalease.app` |
| Redirect URLs | `http://localhost:3000/auth/callback` |
| | `https://rentalease.app/auth/callback` |

Save after adding **both** (dev + live).

### Resend (rentalease.app)

1. Resend → **Domains** → add `rentalease.app`
2. Add the DNS records at your domain registrar
3. When verified, set `RESEND_FROM_EMAIL=Rental Ease <reminders@rentalease.app>` in `.env.local`

### OneSignal

1. App → **Settings** → note **App ID** → `NEXT_PUBLIC_ONESIGNAL_APP_ID`
2. **Keys & IDs** → REST API Key → `ONESIGNAL_REST_API_KEY`
3. Web platform site URL: `https://rentalease.app`

### Point domain to hosting (before launch)

1. Deploy app to **Vercel** (connect GitHub repo)
2. Vercel → Project → **Domains** → add `rentalease.app` and `www.rentalease.app`
3. At your registrar, set DNS as Vercel instructs (usually A/CNAME)

## Step 5 — Sign in

1. In the app, tap **Sign in** (top right)
2. Enter your email
3. Open the email from Supabase and click the link
4. You return to the app, signed in

## Optional — Supabase CLI (advanced)

Only if you install the [Supabase CLI](https://supabase.com/docs/guides/cli):

```powershell
supabase login
supabase link --project-ref efwcyuhtknalmsnrshka
```

Your database password is **only** needed for CLI/database tools. Put it in `.env.local` as `DATABASE_URL` — never share it in chat or GitHub.

## Health check

With `npm run dev` running, open:

http://localhost:3000/api/supabase-check

You should see `"ok": true`.

## What we build next

1. Save rent amount and due date
2. Add EMI / loans
3. Track monthly bills (Kahramaa, telecom, etc.)
4. Email and push reminders

Your AI assistant in Cursor will handle the code — you focus on testing in the browser and Supabase dashboard.
