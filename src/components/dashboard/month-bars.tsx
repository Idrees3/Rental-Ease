import { cn } from "@/lib/utils";

export function FilledBar({
  label,
  valueLabel,
  percent,
  tone = "maroon",
  hint,
}: {
  label: string;
  valueLabel: string;
  percent: number;
  tone?: "maroon" | "amber" | "emerald" | "slate";
  hint?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const bar =
    tone === "amber"
      ? "bg-amber-500"
      : tone === "emerald"
        ? "bg-emerald-500"
        : tone === "slate"
          ? "bg-slate-400"
          : "bg-maroon";

  return (
    <div className="space-y-2 rounded-2xl border border-maroon/10 bg-white p-4 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-base font-semibold text-foreground">
            {valueLabel}
          </p>
        </div>
        <p className="font-display text-2xl text-maroon">{pct}%</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-maroon/[0.08]">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function MonthHero({
  title,
  subtitle,
  day,
  daysInMonth,
  children,
}: {
  title: string;
  subtitle: string;
  day: number;
  daysInMonth: number;
  children?: React.ReactNode;
}) {
  const pct = Math.round((day / daysInMonth) * 100);
  return (
    <section className="overflow-hidden rounded-3xl border border-maroon/15 bg-gradient-to-br from-[#8A1538] via-[#6B1029] to-[#2a1218] p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            This month
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-2 text-base text-white/80">{subtitle}</p>
          {children}
        </div>
        <div className="w-full max-w-xs">
          <div className="flex items-end justify-between text-sm text-white/75">
            <span>
              Day {day} of {daysInMonth}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">Month calendar progress · QAR</p>
        </div>
      </div>
    </section>
  );
}
