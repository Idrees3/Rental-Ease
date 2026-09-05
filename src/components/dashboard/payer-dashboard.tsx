"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AlertCircle, KeyRound, Link2, Wallet } from "lucide-react";
import { DueBadge } from "@/components/features/due-badge";
import { SummaryCard } from "@/components/features/summary-card";
import { FilledBar, MonthHero } from "@/components/dashboard/month-bars";
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
  billsPaid: number;
  rentPaidThisMonth: number;
  emiPaidThisMonth: number;
  linkedProperty: CollectorProperty | null;
  paymentConfirmations: RentPaymentConfirmation[];
  monthLabel: string;
  day: number;
  daysInMonth: number;
};

export function PayerDashboard({
  dueThisWeek,
  rentTotal,
  emiTotal,
  rentCount,
  emiCount,
  expenseCount,
  expenseTotal,
  billsPaid,
  rentPaidThisMonth,
  emiPaidThisMonth,
  linkedProperty,
  paymentConfirmations,
  monthLabel,
  day,
  daysInMonth,
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingUi, startTransition] = useTransition();
  const upcomingTotal = rentTotal + emiTotal + expenseTotal;

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

  const linkedRent = linkedProperty
    ? Number(linkedProperty.monthly_rent_qar)
    : rentTotal;
  const rentTarget = linkedRent || rentTotal || 1;
  const rentPct = (rentPaidThisMonth / rentTarget) * 100;
  const emiPct = emiCount > 0 ? (emiPaidThisMonth / emiCount) * 100 : 0;
  const billsPct = expenseCount > 0 ? (billsPaid / expenseCount) * 100 : 0;

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

      <MonthHero
        title={monthLabel}
        subtitle="See how much of this month’s money is already handled"
        day={day}
        daysInMonth={daysInMonth}
      >
        <p className="mt-4 text-lg text-white/90">
          Planned outgoings{" "}
          <span className="font-semibold text-white">
            {formatQAR(upcomingTotal)}
          </span>
        </p>
      </MonthHero>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FilledBar
          label="Month elapsed"
          valueLabel={`Day ${day} / ${daysInMonth}`}
          percent={(day / daysInMonth) * 100}
        />
        <FilledBar
          label="Rent this month"
          valueLabel={`${formatQAR(rentPaidThisMonth)} paid`}
          percent={rentPct}
          tone={rentPct >= 100 ? "emerald" : "amber"}
          hint={
            linkedProperty
              ? `Due ${formatQAR(linkedProperty.monthly_rent_qar)}`
              : rentCount
                ? `Tracked ${formatQAR(rentTotal)}`
                : "Connect invite code to track rent"
          }
        />
        <FilledBar
          label="EMI / loans paid"
          valueLabel={`${emiPaidThisMonth} of ${emiCount} loans`}
          percent={emiPct}
          tone={emiPct >= 100 ? "emerald" : "maroon"}
        />
        <FilledBar
          label="Bills marked paid"
          valueLabel={`${billsPaid} of ${expenseCount} bills`}
          percent={billsPct}
          tone={billsPct >= 100 ? "emerald" : "slate"}
          hint={expenseTotal > 0 ? `Spent ${formatQAR(expenseTotal)}` : undefined}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {!linkedProperty ? (
            <Card className="border-maroon/25 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-2xl">
                  <KeyRound className="h-5 w-5 text-maroon" />
                  Enter invitation code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Your collector creates a property and gets an 8-character code.
                  Paste it here to link your rent.
                </p>
                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    runAction(
                      () => connectPayerByInviteCode(fd),
                      "Connected! Invitation accepted."
                    );
                  }}
                >
                  <Input
                    name="invite_code"
                    placeholder="e.g. AB12CD34"
                    className="h-12 text-center font-mono text-lg uppercase tracking-[0.25em]"
                    maxLength={12}
                    required
                  />
                  <Button
                    type="submit"
                    className="h-12 px-6"
                    disabled={pendingUi}
                  >
                    <Link2 className="h-4 w-4" />
                    Connect
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-maroon/15 bg-gradient-to-br from-maroon/[0.05] to-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  Linked property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xl font-semibold">
                    {linkedProperty.property_name}
                  </p>
                  <p className="text-base text-muted-foreground">
                    Due day {linkedProperty.due_day} ·{" "}
                    {formatQAR(linkedProperty.monthly_rent_qar)}/mo
                  </p>
                </div>
                <FilledBar
                  label="Payment toward this month’s rent"
                  valueLabel={`${formatQAR(rentPaidThisMonth)} / ${formatQAR(linkedProperty.monthly_rent_qar)}`}
                  percent={
                    (rentPaidThisMonth /
                      Number(linkedProperty.monthly_rent_qar || 1)) *
                    100
                  }
                  tone={
                    rentPaidThisMonth >= Number(linkedProperty.monthly_rent_qar)
                      ? "emerald"
                      : "amber"
                  }
                />
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    runAction(
                      () => submitRentPayment(fd),
                      "Payment submitted. Waiting for collector confirmation."
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
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <Wallet className="h-5 w-5 text-maroon" />
                Money map
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-display text-4xl text-maroon">
                {formatQAR(upcomingTotal)}
              </p>
              <p className="text-sm text-muted-foreground">
                Rent + EMI + bills this month
              </p>
              <FilledBar
                label="Rent share"
                valueLabel={formatQAR(rentTotal || linkedRent)}
                percent={
                  upcomingTotal > 0
                    ? ((rentTotal || linkedRent) / upcomingTotal) * 100
                    : 0
                }
              />
              <FilledBar
                label="EMI share"
                valueLabel={formatQAR(emiTotal)}
                percent={upcomingTotal > 0 ? (emiTotal / upcomingTotal) * 100 : 0}
                tone="amber"
              />
              <FilledBar
                label="Bills share"
                valueLabel={formatQAR(expenseTotal)}
                percent={
                  upcomingTotal > 0 ? (expenseTotal / upcomingTotal) * 100 : 0
                }
                tone="slate"
              />
            </CardContent>
          </Card>

          {paymentConfirmations.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-xl">Payment status</h2>
              {paymentConfirmations.slice(0, 5).map((item) => (
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
                    ? `${rentCount} tracker${rentCount > 1 ? "s" : ""}`
                    : "Optional personal rent trackers"
                }
                amount={rentCount ? rentTotal : undefined}
                href="/rent"
                accent="maroon"
              />
              <SummaryCard
                title="Loans & EMI"
                description={
                  emiCount
                    ? `${emiCount} loan${emiCount > 1 ? "s" : ""}`
                    : "Add a loan"
                }
                amount={emiCount ? emiTotal : undefined}
                href="/emi"
              />
              <SummaryCard
                title="Monthly bills"
                description={
                  expenseCount
                    ? `${expenseCount} bill${expenseCount > 1 ? "s" : ""}`
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
