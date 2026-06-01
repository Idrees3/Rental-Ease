import { cn } from "@/lib/utils";
import type { DueStatus } from "@/lib/dates";

const styles: Record<DueStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  today: "bg-red-100 text-red-800",
  overdue: "bg-red-100 text-red-800",
  soon: "bg-amber-100 text-amber-900",
  upcoming: "bg-muted text-muted-foreground",
};

export function DueBadge({
  status,
  label,
}: {
  status: DueStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {label}
    </span>
  );
}
