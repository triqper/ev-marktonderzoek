"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartCard } from "@/components/charts/chart-card";
import { CustomTooltip } from "@/components/charts/custom-tooltip";
import { CHART_COLORS, GRID_STROKE, TICK_STYLE } from "@/components/charts/chart-theme";
import marketData from "@/data/market-data.json";
import { formatPercent } from "@/lib/utils";

const seg = marketData.segmentatie_laadtype as any;

const data = [
  {
    segment: "AC (≤22 kW)",
    transacties: seg.AC.aandeel_transacties_pct.waarde,
    omzet: seg.AC.aandeel_omzet_pct.waarde,
    energie: seg.AC.aandeel_energie_pct.waarde,
  },
  {
    segment: "DC (50-150 kW)",
    transacties: seg.DC.aandeel_transacties_pct.waarde,
    omzet: seg.DC.aandeel_omzet_pct.waarde,
    energie: seg.DC.aandeel_energie_pct.waarde,
  },
  {
    segment: "HPC (>150 kW)",
    transacties: seg.HPC.aandeel_transacties_pct.waarde,
    omzet: seg.HPC.aandeel_omzet_pct.waarde,
    energie: seg.HPC.aandeel_energie_pct.waarde,
  },
];

export function SegmentatieChart() {
  return (
    <ChartCard
      title="Aandeel per laadtype: transacties vs. omzet vs. energie"
      description="AC domineert in volume, DC/HPC domineren in omzet per sessie"
      type="SCHATTING"
      data={data}
      filename="segmentatie-laadtype"
      footnote="Analytisch model o.b.v. het Nationaal Laadonderzoek (VER/RUG/RVO, 5e editie) en de NAL Voortgangsrapportage 2025 als referentiekader — zie data/market-data.json. Waarden afgerond; ±20-30% mogelijk."
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey="segment" tick={TICK_STYLE} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={TICK_STYLE}
            axisLine={{ stroke: GRID_STROKE }}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip formatter={(v) => formatPercent(v, 0)} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="transacties" name="Aandeel transacties" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="omzet" name="Aandeel omzet" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="energie" name="Aandeel energie" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
