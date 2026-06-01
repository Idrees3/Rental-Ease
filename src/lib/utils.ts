import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQAR(amount: number): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return "QAR 0";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "QAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `QAR ${value.toLocaleString("en-US")}`;
  }
}
