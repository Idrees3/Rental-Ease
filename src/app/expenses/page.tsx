import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/features/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatQAR } from "@/lib/utils";
import { Plus, Receipt } from "lucide-react";

export const metadata = {
  title: "Monthly bills",
};

const SAMPLE_CATEGORIES = [
  { name: "Kahramaa (electricity)", amount: 280 },
  { name: "Ooredoo / Vodafone", amount: 150 },
  { name: "Internet (Ooredoo/Fiber)", amount: 325 },
] as const;

export default function ExpensesPage() {
  const hasExpenses = false;

  return (
    <>
      <AppHeader
        title="Monthly bills"
        subtitle="Utilities, telecom & recurring expenses in QAR"
      />
      <main className="space-y-4 px-4 py-4">
        {hasExpenses ? null : (
          <>
            <EmptyState
              icon={Receipt}
              title="Start tracking bills"
              description="Log Kahramaa, telecom, subscriptions, and more — all in QAR for life in Qatar."
            />
            <section className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Common in Qatar
              </p>
              {SAMPLE_CATEGORIES.map((item) => (
                <Card key={item.name} className="opacity-60">
                  <CardContent className="flex items-center justify-between py-3">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">
                      {formatQAR(item.amount)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </section>
          </>
        )}
        <Button className="w-full" size="lg" disabled>
          <Plus className="h-4 w-4" />
          Add bill (after sign-in)
        </Button>
      </main>
    </>
  );
}
