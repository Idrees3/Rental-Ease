import { AppHeader } from "@/components/layout/app-header";
import { EmptyState } from "@/components/features/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatQAR } from "@/lib/utils";
import { Home, Plus } from "lucide-react";

export const metadata = {
  title: "Rent",
};

export default function RentPage() {
  const hasRent = false;

  return (
    <>
      <AppHeader
        title="Rent tracker"
        subtitle="Never miss your monthly rent in Qatar"
      />
      <main className="space-y-4 px-4 py-4">
        {hasRent ? (
          <RentPlaceholder />
        ) : (
          <EmptyState
            icon={Home}
            title="No rent set up yet"
            description="Add your monthly rent amount, due date, and get reminders by email and push."
          />
        )}
        <Button className="w-full" size="lg" disabled>
          <Plus className="h-4 w-4" />
          Add rent (after sign-in)
        </Button>
      </main>
    </>
  );
}

function RentPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Apartment — West Bay</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-maroon">{formatQAR(5500)}</p>
        <p className="text-sm text-muted-foreground">Due on the 1st · QAR</p>
      </CardContent>
    </Card>
  );
}
