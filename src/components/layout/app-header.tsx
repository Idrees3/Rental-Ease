import { APP_NAME } from "@/lib/constants";
import { HeaderAuth } from "@/components/layout/header-auth";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-maroon">
              {APP_NAME}
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              {title ?? "Dashboard"}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
