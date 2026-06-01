"use client";

import { useState, useTransition } from "react";
import { saveRent } from "@/app/(app)/rent/actions";
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
import type { RentTracker } from "@/types/database";

type RentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rent?: RentTracker | null;
};

export function RentFormDialog({ open, onOpenChange, rent }: RentFormDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await saveRent(formData);
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
          <DialogTitle>{rent ? "Edit rent" : "Add rent"}</DialogTitle>
          <DialogDescription>
            Monthly rent in QAR. We will remind you before it is due.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {rent && <input type="hidden" name="id" value={rent.id} />}
          <div className="space-y-2">
            <Label htmlFor="landlord_name">Home name (optional)</Label>
            <Input
              id="landlord_name"
              name="landlord_name"
              placeholder="e.g. West Bay apartment"
              defaultValue={rent?.landlord_name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount_qar">Monthly rent (QAR)</Label>
            <Input
              id="amount_qar"
              name="amount_qar"
              type="number"
              min={1}
              step={1}
              required
              placeholder="5500"
              defaultValue={rent?.amount_qar ?? ""}
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
              defaultValue={rent?.due_day ?? 1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminder_days_before">Remind me (days before)</Label>
            <Input
              id="reminder_days_before"
              name="reminder_days_before"
              type="number"
              min={0}
              max={14}
              defaultValue={rent?.reminder_days_before ?? 3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : rent ? "Save changes" : "Add rent"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
