"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  trialEndsAt: string;
  mode?: "overview" | "properties";
};

export function CollectorDashboard({
  plan,
  properties,
  pending,
  trialEndsAt,
  mode = "overview",
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

      {mode === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Properties", value: String(properties.length) },
              { label: "Linked payers", value: String(linkedCount) },
              { label: "Pending reviews", value: String(pending.length) },
              { label: "Expected / month", value: formatQAR(dueTotal) },
            ].map((stat) => (
              <Card key={stat.label} className="border-maroon/10 shadow-sm">
                <CardContent className="space-y-1 p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-3xl text-maroon">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="overflow-hidden border-maroon/15 bg-gradient-to-br from-maroon/[0.06] to-white">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collector plan</p>
                <p className="mt-1 font-display text-2xl capitalize text-foreground">
                  {plan}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Outstanding balance {formatQAR(balanceTotal)} · Trial until{" "}
                  {new Date(trialEndsAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href="/properties">Manage properties</Link>
                </Button>
                <Button asChild>
                  <Link href="/billing">View billing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl">Needs confirmation</h2>
              <span className="text-sm text-muted-foreground">
                {pending.length} waiting
              </span>
            </div>
            {pending.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-muted-foreground">
                  No pending payments. You’re all caught up.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {pending.map((item) => {
                  const property = properties.find(
                    (p) => p.id === item.property_id
                  );
                  return (
                    <Card key={item.id} className="border-amber-200 bg-amber-50/40">
                      <CardContent className="flex items-center justify-between gap-3 py-5">
                        <div>
                          <p className="font-semibold">
                            {formatQAR(item.amount_qar)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {property?.property_name ?? "Property"} ·{" "}
                            {item.month_year}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {property?.payer_name ?? "Payer"} marked paid
                          </p>
                        </div>
                        <Button
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Recent properties</h2>
              <Link
                href="/properties"
                className="text-sm font-medium text-maroon hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {properties.slice(0, 4).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  pendingUi={pendingUi}
                  onRemind={() => {
                    const fd = new FormData();
                    fd.set("property_id", property.id);
                    runAction(
                      () => sendCollectorReminder(fd),
                      "Reminder email sent."
                    );
                  }}
                  onCopy={() => {
                    void navigator.clipboard.writeText(property.invite_code);
                    setMessage("Invite code copied.");
                  }}
                />
              ))}
              {properties.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="py-10 text-center text-muted-foreground">
                    <Building2 className="mx-auto mb-3 h-8 w-8 text-maroon/40" />
                    Add your first property to generate an invite code.
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/properties">Add property</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </>
      )}

      {mode === "properties" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Add property</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  runAction(async () => {
                    await createCollectorProperty(fd);
                    e.currentTarget.reset();
                  }, "Property added. Share the invite code with your payer.");
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
                  <Button type="submit" disabled={pendingUi} className="w-full sm:w-auto">
                    {pendingUi ? "Saving…" : "Save property"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="font-display text-2xl">
              All properties ({properties.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  pendingUi={pendingUi}
                  onRemind={() => {
                    const fd = new FormData();
                    fd.set("property_id", property.id);
                    runAction(
                      () => sendCollectorReminder(fd),
                      "Reminder email sent."
                    );
                  }}
                  onCopy={() => {
                    void navigator.clipboard.writeText(property.invite_code);
                    setMessage("Invite code copied.");
                  }}
                />
              ))}
              {properties.length === 0 && (
                <Card className="lg:col-span-2 border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No properties yet. Use the form above to add one.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function PropertyCard({
  property,
  pendingUi,
  onRemind,
  onCopy,
}: {
  property: CollectorProperty;
  pendingUi: boolean;
  onRemind: () => void;
  onCopy: () => void;
}) {
  return (
    <Card className="border-maroon/10 shadow-sm">
      <CardContent className="space-y-4 py-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-lg font-semibold">{property.property_name}</p>
            <p className="text-sm text-muted-foreground">
              Due day {property.due_day} · {formatQAR(property.monthly_rent_qar)}
              /mo
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              property.payer_id
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {property.payer_id ? "Linked" : "Waiting"}
          </span>
        </div>

        <div className="rounded-xl bg-muted/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">Invite code</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="font-mono text-lg font-semibold tracking-wider">
              {property.invite_code}
            </p>
            <Button type="button" size="sm" variant="outline" onClick={onCopy}>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        </div>

        <p className="text-sm">
          Balance:{" "}
          <span className="font-semibold">
            {formatQAR(property.remaining_balance_qar)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Payer: {property.payer_name ?? "Not connected"}
          {property.payer_email ? ` · ${property.payer_email}` : ""}
        </p>

        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={pendingUi || !property.payer_email}
          onClick={onRemind}
        >
          <Mail className="h-4 w-4" />
          Send reminder
        </Button>
      </CardContent>
    </Card>
  );
}
