import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Eigen compacte notatie i.p.v. Intl.NumberFormat(..., { notation: "compact" }).
 * Die Intl-optie levert server- vs. client-afhankelijke uitkomsten op (ICU-dataset-
 * verschil tussen Node en de browser, bv. "475K" vs "475,0K") en veroorzaakt zo een
 * React-hydration-mismatch. Deze functie is deterministisch op elke omgeving.
 */
function compactSuffix(value: number): { divided: number; suffix: string } {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return { divided: value / 1_000_000_000, suffix: " mld" };
  if (abs >= 1_000_000) return { divided: value / 1_000_000, suffix: " mln" };
  if (abs >= 1_000) return { divided: value / 1_000, suffix: "K" };
  return { divided: value, suffix: "" };
}

function formatCompactNumber(value: number): string {
  const { divided, suffix } = compactSuffix(value);
  const rounded = Math.round(divided * 10) / 10;
  const str = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",");
  return `${str}${suffix}`;
}

export function formatEUR(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    return `€ ${formatCompactNumber(value)}`;
  }
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    return formatCompactNumber(value);
  }
  return new Intl.NumberFormat("nl-NL", {
    notation: "standard",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}
