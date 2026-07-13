"use client";

import type { TooltipProps } from "recharts";

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: TooltipProps<number, string> & { formatter?: (value: number, name: string) => string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      {label !== undefined && <div className="mb-1 font-medium">{label}</div>}
      <div className="space-y-0.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium tabular-nums">
              {formatter && typeof entry.value === "number" ? formatter(entry.value, String(entry.name)) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
