import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatQAR } from "@/lib/utils";

type SummaryCardProps = {
  title: string;
  description: string;
  amount?: number;
  meta?: string;
  href: string;
  accent?: "maroon" | "slate";
};

export function SummaryCard({
  title,
  description,
  amount,
  meta,
  href,
  accent = "slate",
}: SummaryCardProps) {
  return (
    <Link href={href} className="block transition-opacity hover:opacity-90">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {amount != null && (
            <p
              className={
                accent === "maroon"
                  ? "text-2xl font-semibold text-maroon"
                  : "text-2xl font-semibold"
              }
            >
              {formatQAR(amount)}
            </p>
          )}
          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
