import { APP_NAME } from "@/lib/constants";
import { HeaderAuth } from "@/components/layout/header-auth";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-maroon/10 bg-white/90 backdrop-blur">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-maroon md:hidden">
              {APP_NAME}
            </p>
            <h1 className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
              {title ?? "Dashboard"}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
