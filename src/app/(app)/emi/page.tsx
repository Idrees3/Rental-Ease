import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/features/empty-state";
import { Button } from "@/components/ui/button";
import { Landmark, Plus } from "lucide-react";

export const metadata = { title: "EMI & Loans" };

export default function EmiPage() {
  return (
    <>
      <AppHeader
        title="EMI & loans"
        subtitle="Track home, car, and personal loan payments"
      />
      <main className="space-y-4 px-4 py-4">
        <EmptyState
          icon={Landmark}
          title="No loans tracked"
          description="Add each EMI with lender, amount in QAR, and due day."
        />
        <Button className="w-full" size="lg" disabled>
          <Plus className="h-4 w-4" />
          Add loan (Phase 3)
        </Button>
      </main>
    </>
  );
}
