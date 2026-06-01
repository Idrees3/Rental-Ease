"use client";

import { useState, useTransition } from "react";
import { Pencil, Pause, Play, Trash2, CheckCircle2, History } from "lucide-react";
import { toggleEmiActive, deleteEmi } from "@/app/(app)/emi/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DueBadge } from "@/components/features/due-badge";
import { EmiFormDialog } from "@/components/emi/emi-form-dialog";
import { MarkEmiPaidDialog } from "@/components/emi/mark-emi-paid-dialog";
import {
  getDueStatus,
  dueStatusLabel,
  formatDueDay,
  formatMonthsRemaining,
} from "@/lib/dates";
import { isPaidThisMonth, formatPaidDate } from "@/lib/payment-utils";
import { formatQAR } from "@/lib/utils";
import { LOAN_TYPE_LABELS, type EmiTracker, type PaymentRecord } from "@/types/database";

type EmiListProps = {
  emis: EmiTracker[];
  payments: PaymentRecord[];
  histories: Record<string, PaymentRecord[]>;
};

export function EmiList({ emis, payments, histories }: EmiListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);
  const [editEmi, setEditEmi] = useState<EmiTracker | null>(null);
  const [paidEmi, setPaidEmi] = useState<EmiTracker | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      {emis.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No loans yet. Tap below to add home, car, or personal loan EMI.
        </p>
      ) : (
        <ul className="space-y-3">
          {emis.map((emi) => {
            const paid = isPaidThisMonth(payments, "emi", emi.id);
            const status = getDueStatus(emi.due_day, paid);
            const label = dueStatusLabel(status, emi.due_day);
            const history = histories[emi.id] ?? [];

            return (
              <li key={emi.id}>
                <Card className={!emi.is_active ? "opacity-60" : undefined}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{emi.lender_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {LOAN_TYPE_LABELS[emi.loan_type]} · {formatDueDay(emi.due_day)}
                        </p>
                      </div>
                      <DueBadge status={status} label={label} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-2xl font-semibold">{formatQAR(emi.amount_qar)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMonthsRemaining(emi.end_date)}
                    </p>
                    {!emi.is_active && (
                      <p className="text-xs text-muted-foreground">Reminders paused</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {!paid && emi.is_active && (
                        <Button size="sm" onClick={() => { setPaidEmi(emi); setPaidOpen(true); }}>
                          <CheckCircle2 className="h-4 w-4" />
                          Mark paid
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => { setEditEmi(emi); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          startTransition(() => toggleEmiActive(emi.id, !emi.is_active))
                        }
                      >
                        {emi.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(expandedId === emi.id ? null : emi.id)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={pending}
                        onClick={() => {
                          if (confirm("Delete this loan?")) {
                            startTransition(() => deleteEmi(emi.id));
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {expandedId === emi.id && (
                      <div className="rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="mb-2 font-medium">Payment history</p>
                        {history.length === 0 ? (
                          <p className="text-muted-foreground">No payments yet.</p>
                        ) : (
                          <ul className="space-y-1">
                            {history.map((p) => (
                              <li key={p.id} className="flex justify-between gap-2">
                                <span>{formatPaidDate(p.paid_at)}</span>
                                <span>{formatQAR(p.amount_paid_qar)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
      <Button className="w-full" size="lg" onClick={() => { setEditEmi(null); setFormOpen(true); }}>
        + Add loan / EMI
      </Button>
      <EmiFormDialog open={formOpen} onOpenChange={setFormOpen} emi={editEmi} />
      <MarkEmiPaidDialog open={paidOpen} onOpenChange={setPaidOpen} emi={paidEmi} />
    </>
  );
}
