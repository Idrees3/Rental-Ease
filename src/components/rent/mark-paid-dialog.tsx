"use client";

import { useState, useTransition } from "react";
import { markRentPaid } from "@/app/(app)/rent/actions";
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
import { formatQAR } from "@/lib/utils";
import type { RentTracker } from "@/types/database";

type MarkPaidDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rent: RentTracker | null;
};

export function MarkPaidDialog({ open, onOpenChange, rent }: MarkPaidDialogProps) {
  const [different, setDifferent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!rent) return null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await markRentPaid(formData);
        onOpenChange(false);
        setDifferent(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark rent as paid</DialogTitle>
          <DialogDescription>
            Due amount: {formatQAR(rent.amount_qar)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="tracker_id" value={rent.id} />
          <input type="hidden" name="amount_due_qar" value={rent.amount_qar} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={different}
              onChange={(e) => setDifferent(e.target.checked)}
            />
            I paid a different amount
          </label>
          {different ? (
            <div className="space-y-2">
              <Label htmlFor="amount_paid_qar">Amount you paid (QAR)</Label>
              <Input
                id="amount_paid_qar"
                name="amount_paid_qar"
                type="number"
                min={1}
                required
                placeholder={String(rent.amount_qar)}
              />
            </div>
          ) : (
            <input type="hidden" name="amount_paid_qar" value={rent.amount_qar} />
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : "Confirm paid"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
