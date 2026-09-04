"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AlertCircle, Link2, Wallet } from "lucide-react";
import { DueBadge } from "@/components/features/due-badge";
import { SummaryCard } from "@/components/features/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatQAR } from "@/lib/utils";
import type {
  CollectorProperty,
  RentPaymentConfirmation,
} from "@/types/database";
import type { DueStatus } from "@/lib/dates";
import {
  connectPayerByInviteCode,
  submitRentPayment,
} from "@/app/(app)/dashboard/actions";

type DueItem = {
  id: string;
  kind: "rent" | "emi";
  title: string;
  amount_qar: number;
  status: DueStatus;
  statusLabel: string;
  href: string;
};

type Props = {
  dueThisWeek: DueItem[];
  rentTotal: number;
  emiTotal: number;
  rentCount: number;
  emiCount: number;
  expenseCount: number;
  expenseTotal: number;
  linkedProperty: CollectorProperty | null;
  paymentConfirmations: RentPaymentConfirmation[];
};

export function PayerDashboard({
  dueThisWeek,
  rentTotal,
  emiTotal,
  rentCount,
  emiCount,
  expenseCount,
  expenseTotal,
  linkedProperty,
  paymentConfirmations,
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingUi, startTransition] = useTransition();
  const upcomingTotal = rentTotal + emiTotal;

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

      {!linkedProperty ? (
        <Card className="border-maroon/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-maroon" />
              Connect to your collector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask your landlord/collector for their invite code. Payer features
              unlock after you connect.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                runAction(
                  () => connectPayerByInviteCode(fd),
                  "Connected! You can now track rent and mark payments."
                );
              }}
            >
              <Input
                name="invite_code"
                placeholder="Invite code"
                className="uppercase"
                required
              />
              <Button type="submit" disabled={pendingUi}>
                Connect
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your linked rent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-lg font-semibold">{linkedProperty.property_name}</p>
              <p className="text-sm text-muted-foreground">
                Due day {linkedProperty.due_day} ·{" "}
                {formatQAR(linkedProperty.monthly_rent_qar)}/mo
              </p>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                runAction(
                  () => submitRentPayment(fd),
                  "Payment submitted. Waiting for collector to mark received."
                );
              }}
            >
              <input type="hidden" name="property_id" value={linkedProperty.id} />
              <Input
                name="amount_qar"
                type="number"
                min="1"
                step="0.01"
                defaultValue={linkedProperty.monthly_rent_qar}
                required
              />
              <Button type="submit" disabled={pendingUi}>
                I paid
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Collector must tap Received before status updates on both sides.
            </p>
          </CardContent>
        </Card>
      )}

      {dueThisWeek.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-red-900">
              <AlertCircle className="h-4 w-4" />
              Due this week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueThisWeek.map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.kind === "rent" ? "Rent" : "EMI"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatQAR(item.amount_qar)}</p>
                  <DueBadge status={item.status} label={item.statusLabel} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-maroon" />
            This month overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-maroon">
            {formatQAR(upcomingTotal)}
          </p>
          <p className="text-sm text-muted-foreground">
            {rentCount} rent · {emiCount} loans · {expenseCount} bills
          </p>
        </CardContent>
      </Card>

      {paymentConfirmations.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Payment status
          </h2>
          {paymentConfirmations.slice(0, 5).map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{formatQAR(item.amount_qar)}</p>
                  <p className="text-xs text-muted-foreground">{item.month_year}</p>
                </div>
                <p
                  className={
                    item.status === "received"
                      ? "text-xs font-medium text-green-700"
                      : "text-xs font-medium text-amber-700"
                  }
                >
                  {item.status === "received"
                    ? "Received"
                    : "Waiting confirmation"}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {linkedProperty && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Track more</h2>
          <SummaryCard
            title="Rent"
            description={
              rentCount
                ? `${rentCount} home${rentCount > 1 ? "s" : ""} tracked`
                : "Add your rent tracker"
            }
            amount={rentCount ? rentTotal : undefined}
            href="/rent"
            accent="maroon"
          />
          <SummaryCard
            title="Loans & EMI"
            description={
              emiCount
                ? `${emiCount} loan${emiCount > 1 ? "s" : ""} tracked`
                : "Add a loan"
            }
            amount={emiCount ? emiTotal : undefined}
            href="/emi"
          />
          <SummaryCard
            title="Monthly bills"
            description={
              expenseCount
                ? `${expenseCount} bill${expenseCount > 1 ? "s" : ""} this month`
                : "Track utilities & grocery"
            }
            amount={expenseTotal > 0 ? expenseTotal : undefined}
            href="/expenses"
          />
        </section>
      )}
    </main>
  );
}
