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

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {!linkedProperty ? (
            <Card className="border-maroon/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <Link2 className="h-5 w-5 text-maroon" />
                  Connect to your collector
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  Ask your landlord for an invite code. Payer features unlock
                  after you connect.
                </p>
                <form
                  className="flex flex-col gap-2 sm:flex-row"
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
            <Card className="border-maroon/15 bg-gradient-to-br from-maroon/[0.05] to-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-2xl">
                  Your linked rent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xl font-semibold">
                    {linkedProperty.property_name}
                  </p>
                  <p className="text-base text-muted-foreground">
                    Due day {linkedProperty.due_day} ·{" "}
                    {formatQAR(linkedProperty.monthly_rent_qar)}/mo
                  </p>
                </div>
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    runAction(
                      () => submitRentPayment(fd),
                      "Payment submitted. Waiting for collector to mark received."
                    );
                  }}
                >
                  <input
                    type="hidden"
                    name="property_id"
                    value={linkedProperty.id}
                  />
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
                <p className="text-sm text-muted-foreground">
                  Collector must tap Received before status updates on both
                  sides.
                </p>
              </CardContent>
            </Card>
          )}

          {dueThisWeek.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-red-900">
                  <AlertCircle className="h-5 w-5" />
                  Due this week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dueThisWeek.map((item) => (
                  <Link
                    key={`${item.kind}-${item.id}`}
                    href={item.href}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white/90 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.kind === "rent" ? "Rent" : "EMI"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatQAR(item.amount_qar)}
                      </p>
                      <DueBadge status={item.status} label={item.statusLabel} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <Wallet className="h-5 w-5 text-maroon" />
                This month overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl text-maroon">
                {formatQAR(upcomingTotal)}
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                {rentCount} rent · {emiCount} loans · {expenseCount} bills
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {paymentConfirmations.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl">Payment status</h2>
              {paymentConfirmations.slice(0, 6).map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardContent className="flex items-center justify-between gap-3 py-4">
                    <div>
                      <p className="font-medium">{formatQAR(item.amount_qar)}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.month_year}
                      </p>
                    </div>
                    <p
                      className={
                        item.status === "received"
                          ? "text-sm font-medium text-emerald-700"
                          : "text-sm font-medium text-amber-700"
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
              <h2 className="font-display text-xl">Track more</h2>
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
        </div>
      </div>
    </main>
  );
}
