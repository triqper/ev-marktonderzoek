"use client";

import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { ChartCard } from "@/components/charts/chart-card";
import { CHART_COLORS } from "@/components/charts/chart-theme";
import marketData from "@/data/market-data.json";
import { formatPercent } from "@/lib/utils";

const locaties = marketData.locaties as any[];

const data = locaties.map((l, i) => ({
  name: l.type,
  size: l.aandeel_transacties_pct,
  fill: CHART_COLORS[i % CHART_COLORS.length],
}));

function TreemapTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <div className="font-medium">{d.name}</div>
      <div className="text-muted-foreground">Aandeel transacties: {formatPercent(d.size, 0)}</div>
    </div>
  );
}

function CustomizedContent(props: any) {
  const { x, y, width, height, name, size, fill } = props;
  if (width < 2 || height < 2) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: "hsl(var(--card))", strokeWidth: 2 }} />
      {width > 70 && height > 36 && (
        <>
          <text x={x + 8} y={y + 20} fontSize={12} fill="white" fontWeight={600}>
            {name}
          </text>
          <text x={x + 8} y={y + 36} fontSize={12} fill="white" opacity={0.9}>
            {size}%
          </text>
        </>
      )}
    </g>
  );
}

export function LocatieTreemap() {
  return (
    <ChartCard
      title="Aandeel publieke laadtransacties per locatietype"
      description="Stedelijke laadpaal domineert qua volume, snelweg qua besteding per sessie"
      type="SCHATTING"
      data={locaties as unknown as Record<string, unknown>[]}
      filename="locaties"
    >
      <ResponsiveContainer width="100%" height={300}>
        <Treemap data={data} dataKey="size" stroke="hsl(var(--card))" content={<CustomizedContent />}>
          <Tooltip content={<TreemapTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </ChartCard>
  );
}
