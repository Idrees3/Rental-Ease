"use client";

import { useState, useTransition } from "react";
import { saveEmi } from "@/app/(app)/emi/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LOAN_TYPE_LABELS, type EmiTracker, type LoanType } from "@/types/database";

type EmiFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emi?: EmiTracker | null;
};

export function EmiFormDialog({ open, onOpenChange, emi }: EmiFormDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await saveEmi(formData);
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{emi ? "Edit loan" : "Add loan / EMI"}</DialogTitle>
          <DialogDescription>
            Monthly payment in QAR. We will remind you before it is due.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {emi && <input type="hidden" name="id" value={emi.id} />}
          <div className="space-y-2">
            <Label htmlFor="lender_name">Bank or lender name</Label>
            <Input
              id="lender_name"
              name="lender_name"
              required
              placeholder="e.g. QNB, Doha Bank"
              defaultValue={emi?.lender_name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan_type">Loan type</Label>
            <select
              id="loan_type"
              name="loan_type"
              defaultValue={emi?.loan_type ?? "other"}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {(Object.keys(LOAN_TYPE_LABELS) as LoanType[]).map((key) => (
                <option key={key} value={key}>
                  {LOAN_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount_qar">Monthly EMI (QAR)</Label>
            <Input
              id="amount_qar"
              name="amount_qar"
              type="number"
              min={1}
              required
              defaultValue={emi?.amount_qar ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_day">Due day each month (1–28)</Label>
            <Input
              id="due_day"
              name="due_day"
              type="number"
              min={1}
              max={28}
              required
              defaultValue={emi?.due_day ?? 5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Loan end date (optional)</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={emi?.end_date ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Used to show how many months are left.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder_days_before">Remind me (days before)</Label>
            <Input
              id="reminder_days_before"
              name="reminder_days_before"
              type="number"
              min={0}
              max={14}
              defaultValue={emi?.reminder_days_before ?? 3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : emi ? "Save changes" : "Add loan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
