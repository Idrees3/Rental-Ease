"use client";

import type { ExpenseCategory } from "@/types/database";
import { EXPENSE_CATEGORY_LABELS } from "@/types/database";

const COLORS: Record<ExpenseCategory, string> = {
  utilities: "#8A1538",
  telecom: "#C45C26",
  subscription: "#2563EB",
  groceries: "#16A34A",
  transport: "#7C3AED",
  other: "#64748B",
};

type Slice = { category: ExpenseCategory; value: number };

export function ExpenseDonut({
  slices,
  total,
}: {
  slices: Slice[];
  total: number;
}) {
  const filtered = slices.filter((s) => s.value > 0);
  if (total <= 0 || filtered.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Add expenses to see your chart.
      </p>
    );
  }

  let cumulative = 0;
  const gradientParts = filtered.map((s) => {
    const pct = (s.value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return `${COLORS[s.category]} ${start}% ${cumulative}%`;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div
        className="relative h-36 w-36 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${gradientParts.join(", ")})`,
        }}
      >
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-background text-center">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-semibold">
            {total.toLocaleString("en-US")}
          </span>
          <span className="text-xs text-muted-foreground">QAR</span>
        </div>
      </div>
      <ul className="space-y-1.5 text-sm">
        {filtered.map((s) => (
          <li key={s.category} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS[s.category] }}
            />
            <span>{EXPENSE_CATEGORY_LABELS[s.category]}</span>
            <span className="ml-auto font-medium tabular-nums">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
