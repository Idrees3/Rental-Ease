"use client";

import {
  Home,
  Landmark,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ICONS = {
  home: Home,
  rent: Home,
  emi: Landmark,
  receipt: Receipt,
} as const;

export type EmptyIconName = keyof typeof ICONS;

type EmptyStateProps = {
  icon: EmptyIconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon: LucideIcon = ICONS[icon];

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-maroon/10 text-maroon">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
