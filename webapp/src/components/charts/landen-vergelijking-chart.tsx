"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartCard } from "@/components/charts/chart-card";
import { CustomTooltip } from "@/components/charts/custom-tooltip";
import { CHART_COLORS, GRID_STROKE, TICK_STYLE } from "@/components/charts/chart-theme";
import marketData from "@/data/market-data.json";
import { formatNumber } from "@/lib/utils";

const landen = marketData.landen as any;

const data = [
  { land: "Nederland", evPark: 701149 + 543355, laadpunten: 210000 },
  { land: "Duitsland", evPark: 2034260 + 950000, laadpunten: 165000 },
  { land: "Frankrijk", evPark: 2500000, laadpunten: 155000 },
  { land: "Nordics", evPark: 2600000, laadpunten: 95000 },
  { land: "VK", evPark: 1900000, laadpunten: 82000 },
  { land: "België", evPark: 480000, laadpunten: 44000 },
];

export function LandenVergelijkingChart() {
  return (
    <ChartCard
      title="EV-park en publieke laadpunten per land"
      description="Nederland, Duitsland, Frankrijk, Nordics, VK en België — 2026"
      type="SCHATTING"
      data={data}
      filename="landen-vergelijking"
      footnote="NL-cijfers (incl. 543.355 PHEV, data_asof juli 2026) en DE-BEV zijn FEIT (RVO/EAFO); DE-PHEV en overige landen zijn SCHATTING met foutmarge. Waar mogelijk geüniformeerd op EAFO; per rij is de gebruikte bron vastgelegd in data/market-data.json."
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatNumber(v, { compact: true })}
            tick={TICK_STYLE}
            axisLine={{ stroke: GRID_STROKE }}
            tickLine={false}
          />
          <YAxis type="category" dataKey="land" tick={TICK_STYLE} axisLine={{ stroke: GRID_STROKE }} tickLine={false} width={80} />
          <Tooltip
            content={<CustomTooltip formatter={(v) => formatNumber(v, { compact: true })} />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="evPark" name="EV-park (BEV+PHEV)" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} maxBarSize={20} />
          <Bar dataKey="laadpunten" name="Publieke laadpunten" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
