"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Copy, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilledBar, MonthHero } from "@/components/dashboard/month-bars";
import { formatQAR } from "@/lib/utils";
import type {
  CollectorPlan,
  CollectorProperty,
  RentPaymentConfirmation,
} from "@/types/database";
import {
  confirmRentPayment,
  createCollectorProperty,
  sendCollectorReminder,
} from "@/app/(app)/dashboard/actions";

type Props = {
  plan: CollectorPlan;
  properties: CollectorProperty[];
  pending: RentPaymentConfirmation[];
  receivedThisMonth: number;
  trialEndsAt: string;
  mode?: "overview" | "properties";
  monthLabel: string;
  day: number;
  daysInMonth: number;
};

export function CollectorDashboard({
  plan,
  properties,
  pending,
  receivedThisMonth,
  trialEndsAt,
  mode = "overview",
  monthLabel,
  day,
  daysInMonth,
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latestInvite, setLatestInvite] = useState<string | null>(null);
  const [pendingUi, startTransition] = useTransition();

  const dueTotal = properties.reduce(
    (sum, p) => sum + Number(p.monthly_rent_qar),
    0
  );
  const balanceTotal = properties.reduce(
    (sum, p) => sum + Number(p.remaining_balance_qar),
    0
  );
  const linkedCount = properties.filter((p) => p.payer_id).length;
  const collectedPct = dueTotal > 0 ? (receivedThisMonth / dueTotal) * 100 : 0;
  const linkedPct =
    properties.length > 0 ? (linkedCount / properties.length) * 100 : 0;

  function runAction(action: () => Promise<void>, okMessage: string) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setMessage(okMessage);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {(message || error) && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
          }`}
          role="status"
        >
          {error ?? message}
        </p>
      )}

      {latestInvite && (
        <Card className="border-maroon/30 bg-maroon/[0.04] shadow-md">
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-1 h-6 w-6 text-maroon" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New invitation code — share with your payer
                </p>
                <p className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-maroon">
                  {latestInvite}
                </p>
              </div>
            </div>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(latestInvite);
                setMessage("Invitation code copied.");
              }}
            >
              <Copy className="h-4 w-4" />
              Copy code
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === "overview" && (
        <>
          <MonthHero
            title={monthLabel}
            subtitle="Track collection progress across every property"
            day={day}
            daysInMonth={daysInMonth}
          >
            <p className="mt-4 text-sm text-white/75">
              Plan <span className="capitalize text-white">{plan}</span> · Trial
              until {new Date(trialEndsAt).toLocaleDateString()}
            </p>
          </MonthHero>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilledBar
              label="Month elapsed"
              valueLabel={`Day ${day} / ${daysInMonth}`}
              percent={(day / daysInMonth) * 100}
              tone="maroon"
            />
            <FilledBar
              label="Collected this month"
              valueLabel={`${formatQAR(receivedThisMonth)} of ${formatQAR(dueTotal)}`}
              percent={collectedPct}
              tone={collectedPct >= 100 ? "emerald" : "amber"}
              hint="Confirmed Received payments"
            />
            <FilledBar
              label="Payers linked"
              valueLabel={`${linkedCount} of ${properties.length} properties`}
              percent={linkedPct}
              tone="emerald"
            />
            <FilledBar
              label="Outstanding balance"
              valueLabel={formatQAR(balanceTotal)}
              percent={
                dueTotal + balanceTotal > 0
                  ? (balanceTotal / (dueTotal + balanceTotal)) * 100
                  : 0
              }
              tone="slate"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-maroon/10 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <KeyRound className="h-5 w-5 text-maroon" />
                  Invitation codes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Each property gets a unique code. Share it with the payer so
                  they can connect in the app.
                </p>
                {properties.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-6 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-maroon/40" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No codes yet. Add a property to generate your first
                      invitation code.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/properties">Add property</Link>
                    </Button>
                  </div>
                ) : (
                  properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{property.property_name}</p>
                        <p className="font-mono text-xl font-bold tracking-widest text-maroon">
                          {property.invite_code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.payer_id
                            ? `Linked · ${property.payer_name ?? "Payer"}`
                            : "Waiting for payer to connect"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            property.invite_code
                          );
                          setMessage(`Copied ${property.invite_code}`);
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-maroon/10 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  Needs confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pending.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No pending payments. You’re all caught up.
                  </p>
                ) : (
                  pending.map((item) => {
                    const property = properties.find(
                      (p) => p.id === item.property_id
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {formatQAR(item.amount_qar)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {property?.property_name ?? "Property"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          disabled={pendingUi}
                          onClick={() => {
                            const fd = new FormData();
                            fd.set("confirmation_id", item.id);
                            fd.set("property_id", item.property_id);
                            fd.set("amount_qar", String(item.amount_qar));
                            runAction(
                              () => confirmRentPayment(fd),
                              "Marked as received."
                            );
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Received
                        </Button>
                      </div>
                    );
                  })
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/properties">Manage all properties</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {mode === "properties" && (
        <>
          <Card className="border-maroon/10 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Add property & get invitation code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                After you save, a unique invitation code is created automatically.
                Send that code to your rent payer.
              </p>
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  runAction(async () => {
                    const result = await createCollectorProperty(fd);
                    if (result?.inviteCode) {
                      setLatestInvite(result.inviteCode);
                    }
                    e.currentTarget.reset();
                  }, "Property added. Invitation code is ready below.");
                }}
              >
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="property_name">Property name</Label>
                  <Input
                    id="property_name"
                    name="property_name"
                    placeholder="e.g. Flat C12, Al Sadd"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payer_name">Payer name (optional)</Label>
                  <Input id="payer_name" name="payer_name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payer_email">Payer email (for reminders)</Label>
                  <Input id="payer_email" name="payer_email" type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="monthly_rent_qar">Monthly rent (QAR)</Label>
                  <Input
                    id="monthly_rent_qar"
                    name="monthly_rent_qar"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="due_day">Due day (1–28)</Label>
                  <Input
                    id="due_day"
                    name="due_day"
                    type="number"
                    min="1"
                    max="28"
                    required
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="remaining_balance_qar">Remaining balance</Label>
                  <Input
                    id="remaining_balance_qar"
                    name="remaining_balance_qar"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={0}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pendingUi}>
                    {pendingUi ? "Creating…" : "Save & generate invite code"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="font-display text-2xl">
              Properties ({properties.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {properties.map((property) => (
                <Card key={property.id} className="border-maroon/10 shadow-sm">
                  <CardContent className="space-y-4 py-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold">
                          {property.property_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due day {property.due_day} ·{" "}
                          {formatQAR(property.monthly_rent_qar)}/mo
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          property.payer_id
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {property.payer_id ? "Linked" : "Share invite"}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-maroon/[0.06] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Invitation code
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="font-mono text-2xl font-bold tracking-widest text-maroon">
                          {property.invite_code}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              property.invite_code
                            );
                            setMessage("Invitation code copied.");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <FilledBar
                      label="Balance remaining"
                      valueLabel={formatQAR(property.remaining_balance_qar)}
                      percent={
                        Number(property.monthly_rent_qar) > 0
                          ? (Number(property.remaining_balance_qar) /
                              Number(property.monthly_rent_qar)) *
                            100
                          : 0
                      }
                      tone="slate"
                    />

                    <p className="text-sm text-muted-foreground">
                      Payer: {property.payer_name ?? "Not connected"}
                      {property.payer_email ? ` · ${property.payer_email}` : ""}
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={pendingUi || !property.payer_email}
                      onClick={() => {
                        const fd = new FormData();
                        fd.set("property_id", property.id);
                        runAction(
                          () => sendCollectorReminder(fd),
                          "Reminder email sent."
                        );
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Send reminder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
