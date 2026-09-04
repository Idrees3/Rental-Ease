"use client";

import { useState, useTransition } from "react";
import { Bell, Building2, CheckCircle2, Copy, Mail } from "lucide-react";
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
};

export function CollectorDashboard({
  plan,
  properties,
  pending,
  trialEndsAt,
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
    <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
      {(message || error) && (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            error ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
          }`}
          role="status"
        >
          {error ?? message}
        </p>
      )}

      <section className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-[11px] text-muted-foreground">Properties</p>
            <p className="text-lg font-semibold">{properties.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-[11px] text-muted-foreground">Linked</p>
            <p className="text-lg font-semibold">{linkedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-3">
            <p className="text-[11px] text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold text-amber-700">{pending.length}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly expected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-2xl font-semibold text-maroon">{formatQAR(dueTotal)}</p>
          <p className="text-sm text-muted-foreground">
            Outstanding balance {formatQAR(balanceTotal)} · Plan{" "}
            <span className="capitalize">{plan}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Trial until {new Date(trialEndsAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Needs your confirmation
          </h2>
          {pending.map((item) => {
            const property = properties.find((p) => p.id === item.property_id);
            return (
              <Card key={item.id} className="border-amber-200 bg-amber-50/40">
                <CardContent className="flex items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium">{formatQAR(item.amount_qar)}</p>
                    <p className="text-xs text-muted-foreground">
                      {property?.property_name ?? "Property"} · {item.month_year}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {property?.payer_name ?? "Payer"} marked paid
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
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Properties</h2>
        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              <Building2 className="mx-auto mb-2 h-8 w-8 text-maroon/40" />
              Add your first property to get an invite code for your payer.
            </CardContent>
          </Card>
        ) : (
          properties.map((property) => (
            <Card key={property.id}>
              <CardContent className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{property.property_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due day {property.due_day} · {formatQAR(property.monthly_rent_qar)}
                      /mo
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      property.payer_id
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {property.payer_id ? "Linked" : "Waiting"}
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">Invite code</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-base font-semibold tracking-wider">
                      {property.invite_code}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard.writeText(property.invite_code);
                        setMessage("Invite code copied.");
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                </div>

                <p className="text-sm">
                  Balance:{" "}
                  <span className="font-medium">
                    {formatQAR(property.remaining_balance_qar)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Payer: {property.payer_name ?? "Not connected"}{" "}
                  {property.payer_email ? `· ${property.payer_email}` : ""}
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
          ))
        )}
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Add property</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              runAction(async () => {
                await createCollectorProperty(fd);
                e.currentTarget.reset();
              }, "Property added. Share the invite code with your payer.");
            }}
          >
            <div className="space-y-1.5">
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
              <Input id="payer_name" name="payer_name" placeholder="Tenant name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payer_email">Payer email (for reminders)</Label>
              <Input
                id="payer_email"
                name="payer_email"
                type="email"
                placeholder="payer@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
            <div className="space-y-1.5">
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
            <Button type="submit" className="w-full" disabled={pendingUi}>
              {pendingUi ? "Saving…" : "Save property"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 py-4 text-sm text-muted-foreground">
          <Bell className="mt-0.5 h-4 w-4 text-maroon" />
          Billing (Stripe) is off for testing. Plans: 50 QAR ≤10 properties, 300
          QAR ≤100, or +5 QAR per extra property.
        </CardContent>
      </Card>
    </main>
  );
}
