"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import {
  deleteExpense,
  saveBudget,
  saveExpense,
  toggleExpensePaid,
} from "@/app/(app)/expenses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BudgetBar } from "@/components/expenses/budget-bar";
import { ExpenseDonut } from "@/components/expenses/expense-donut";
import type { ExpenseSummary } from "@/lib/data/expenses";
import { formatMonthLabel, shiftMonthYear } from "@/lib/dates";
import { formatQAR } from "@/lib/utils";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
  type MonthlyExpense,
} from "@/types/database";

type ExpensesClientProps = {
  summary: ExpenseSummary;
};

export function ExpensesClient({ summary }: ExpensesClientProps) {
  const router = useRouter();
  const monthYear = summary.monthYear;
  const [addOpen, setAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<MonthlyExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const budgetMap = useMemo(() => {
    const m = new Map<ExpenseCategory, number>();
    for (const b of summary.budgets) m.set(b.category, Number(b.amount_qar));
    return m;
  }, [summary.budgets]);

  const donutSlices = EXPENSE_CATEGORIES.map((category) => ({
    category,
    value: summary.byCategory[category],
  }));

  function changeMonth(delta: number) {
    const next = shiftMonthYear(monthYear, delta);
    router.push(`/expenses?month=${next}`);
  }

  function buildExportText(): string {
    const lines = [
      `Rental Ease — ${formatMonthLabel(summary.monthYear)}`,
      `Total spent: ${formatQAR(summary.totalSpent)}`,
      "",
      "By category:",
    ];
    for (const c of EXPENSE_CATEGORIES) {
      if (summary.byCategory[c] > 0) {
        lines.push(`  ${EXPENSE_CATEGORY_LABELS[c]}: ${formatQAR(summary.byCategory[c])}`);
      }
    }
    lines.push("", "Bills:");
    for (const e of summary.expenses) {
      lines.push(
        `  ${e.name}: ${formatQAR(e.amount_qar)}${e.is_paid ? " (paid)" : ""}`
      );
    }
    return lines.join("\n");
  }

  async function copySummary() {
    await navigator.clipboard.writeText(buildExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border bg-card px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="font-medium">{formatMonthLabel(monthYear)}</p>
          <p className="text-sm text-muted-foreground">
            Total {formatQAR(summary.totalSpent)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Spending overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseDonut slices={donutSlices} total={summary.totalSpent} />
        </CardContent>
      </Card>

      {EXPENSE_CATEGORIES.filter((c) => budgetMap.has(c)).map((category) => (
        <BudgetBar
          key={category}
          category={category}
          spent={summary.byCategory[category]}
          budget={budgetMap.get(category) ?? null}
        />
      ))}

      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" onClick={() => { setEditExpense(null); setAddOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add bill
        </Button>
        <Button variant="outline" onClick={() => setBudgetOpen(true)}>
          Set budget
        </Button>
        <Button variant="outline" onClick={copySummary}>
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Export"}
        </Button>
      </div>

      {summary.expenses.length === 0 ? (
        <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
          No bills this month. Tap &quot;Add bill&quot; to start.
        </p>
      ) : (
        <ul className="space-y-2">
          {summary.expenses.map((expense) => (
            <li key={expense.id}>
              <Card className={expense.is_paid ? "opacity-70" : undefined}>
                <CardContent className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {EXPENSE_CATEGORY_LABELS[expense.category]}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">
                    {formatQAR(expense.amount_qar)}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        startTransition(() =>
                          toggleExpensePaid(expense.id, !expense.is_paid)
                        )
                      }
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${expense.is_paid ? "text-emerald-600" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditExpense(expense);
                        setAddOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      disabled={pending}
                      onClick={() => {
                        if (confirm("Delete this bill?")) {
                          startTransition(() => deleteExpense(expense.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <ExpenseFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        expense={editExpense}
        monthYear={monthYear}
        onError={setError}
      />
      <BudgetFormDialog
        open={budgetOpen}
        onOpenChange={setBudgetOpen}
        monthYear={monthYear}
        onError={setError}
      />
    </div>
  );
}

function ExpenseFormDialog({
  open,
  onOpenChange,
  expense,
  monthYear,
  onError,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expense: MonthlyExpense | null;
  monthYear: string;
  onError: (m: string | null) => void;
}) {
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("month_year", monthYear);
    startTransition(async () => {
      try {
        await saveExpense(fd);
        onOpenChange(false);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit bill" : "Add bill"}</DialogTitle>
          <DialogDescription>Amount in QAR for {formatMonthLabel(monthYear)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {expense && <input type="hidden" name="id" value={expense.id} />}
          <div className="space-y-2">
            <Label htmlFor="name">Bill name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g. Kahramaa, Ooredoo"
              defaultValue={expense?.name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={expense?.category ?? "utilities"}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {EXPENSE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount_qar">Amount (QAR)</Label>
            <Input
              id="amount_qar"
              name="amount_qar"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={expense?.amount_qar ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_day">Due day (optional)</Label>
            <Input
              id="due_day"
              name="due_day"
              type="number"
              min={1}
              max={31}
              defaultValue={expense?.due_day ?? ""}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : "Save bill"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BudgetFormDialog({
  open,
  onOpenChange,
  monthYear,
  onError,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  monthYear: string;
  onError: (m: string | null) => void;
}) {
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("month_year", monthYear);
    startTransition(async () => {
      try {
        await saveBudget(fd);
        onOpenChange(false);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set monthly budget</DialogTitle>
          <DialogDescription>
            e.g. Grocery QAR 500 — we show a progress bar as you add expenses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget_category">Category</Label>
            <select
              id="budget_category"
              name="category"
              defaultValue="groceries"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {EXPENSE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget_amount">Budget (QAR)</Label>
            <Input
              id="budget_amount"
              name="amount_qar"
              type="number"
              min={1}
              required
              placeholder="500"
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving…" : "Save budget"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
