import { cn } from "@/lib/utils";
import { formatQAR } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS, type ExpenseCategory } from "@/types/database";

type BudgetBarProps = {
  category: ExpenseCategory;
  spent: number;
  budget: number | null;
};

export function BudgetBar({ category, spent, budget }: BudgetBarProps) {
  if (!budget) return null;

  const pct = Math.min(100, Math.round((spent / budget) * 100));
  const over = spent > budget;

  return (
    <div className="space-y-1 rounded-lg border bg-muted/30 p-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{EXPENSE_CATEGORY_LABELS[category]}</span>
        <span className={cn(over && "font-medium text-red-600")}>
          {formatQAR(spent)} / {formatQAR(budget)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            over ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-maroon"
          )}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      {over && (
        <p className="text-xs font-medium text-red-600">
          Over budget by {formatQAR(spent - budget)}
        </p>
      )}
      {!over && pct >= 80 && (
        <p className="text-xs text-amber-700">Almost at your limit ({pct}%)</p>
      )}
    </div>
  );
}
