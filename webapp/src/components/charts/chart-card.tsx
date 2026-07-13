"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EpistemicBadge, type EpistemicType } from "@/components/epistemic-badge";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

export function ChartCard({
  title,
  description,
  type,
  data,
  filename,
  children,
  footnote,
}: {
  title: string;
  description?: string;
  type: EpistemicType;
  data?: Record<string, unknown>[];
  filename?: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  const handleDownload = () => {
    if (!data) return;
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename || "data"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EpistemicBadge type={type} />
          {data && (
            <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download data als CSV">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {footnote && <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>}
      </CardContent>
    </Card>
  );
}
