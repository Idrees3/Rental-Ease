"use client";

import { useState, useTransition } from "react";
import { Pencil, Pause, Play, Trash2, CheckCircle2, History } from "lucide-react";
import { toggleRentActive, deleteRent } from "@/app/(app)/rent/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DueBadge } from "@/components/features/due-badge";
import { RentFormDialog } from "@/components/rent/rent-form-dialog";
import { MarkPaidDialog } from "@/components/rent/mark-paid-dialog";
import {
  getDueStatus,
  dueStatusLabel,
  formatDueDay,
} from "@/lib/dates";
import { isPaidThisMonth, formatPaidDate } from "@/lib/payment-utils";
import { formatQAR } from "@/lib/utils";
import type { PaymentRecord, RentTracker } from "@/types/database";

type RentListProps = {
  rents: RentTracker[];
  payments: PaymentRecord[];
  histories: Record<string, PaymentRecord[]>;
};

export function RentList({ rents, payments, histories }: RentListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);
  const [editRent, setEditRent] = useState<RentTracker | null>(null);
  const [paidRent, setPaidRent] = useState<RentTracker | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openAdd() {
    setEditRent(null);
    setFormOpen(true);
  }

  function openEdit(rent: RentTracker) {
    setEditRent(rent);
    setFormOpen(true);
  }

  function openPaid(rent: RentTracker) {
    setPaidRent(rent);
    setPaidOpen(true);
  }

  return (
    <>
      {rents.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No rent added yet. Tap the button below to add your home rent.
        </p>
      ) : (
        <ul className="space-y-3">
          {rents.map((rent) => {
            const paid = isPaidThisMonth(payments, "rent", rent.id);
            const status = getDueStatus(rent.due_day, paid);
            const label = dueStatusLabel(status, rent.due_day);
            const title = rent.landlord_name || "My rent";
            const history = histories[rent.id] ?? [];

            return (
              <li key={rent.id}>
                <Card className={!rent.is_active ? "opacity-60" : undefined}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {formatDueDay(rent.due_day)}
                        </p>
                      </div>
                      <DueBadge status={status} label={label} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-2xl font-semibold text-maroon">
                      {formatQAR(rent.amount_qar)}
                    </p>
                    {!rent.is_active && (
                      <p className="text-xs text-muted-foreground">
                        Reminders paused
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {!paid && rent.is_active && (
                        <Button
                          size="sm"
                          onClick={() => openPaid(rent)}
                          className="gap-1"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(rent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await toggleRentActive(rent.id, !rent.is_active);
                            } catch (e) {
                              setError(
                                e instanceof Error ? e.message : "Failed"
                              );
                            }
                          })
                        }
                      >
                        {rent.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpandedId(expandedId === rent.id ? null : rent.id)
                        }
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={pending}
                        onClick={() => {
                          if (
                            confirm("Delete this rent? This cannot be undone.")
                          ) {
                            startTransition(async () => {
                              await deleteRent(rent.id);
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {expandedId === rent.id && (
                      <div className="rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="mb-2 font-medium">Payment history</p>
                        {history.length === 0 ? (
                          <p className="text-muted-foreground">No payments yet.</p>
                        ) : (
                          <ul className="space-y-1">
                            {history.map((p) => (
                              <li
                                key={p.id}
                                className="flex justify-between gap-2"
                              >
                                <span>
                                  {formatPaidDate(p.paid_at)}
                                </span>
                                <span>
                                  {formatQAR(p.amount_paid_qar)}
                                  {p.amount_paid_qar !== p.amount_due_qar && (
                                    <span className="text-muted-foreground">
                                      {" "}
                                      (due {formatQAR(p.amount_due_qar)})
                                    </span>
                                  )}
                                </span>
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" size="lg" onClick={openAdd}>
        + Add rent
      </Button>
      <RentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rent={editRent}
      />
      <MarkPaidDialog open={paidOpen} onOpenChange={setPaidOpen} rent={paidRent} />
    </>
  );
}
