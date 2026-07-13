"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { ChartCard } from "@/components/charts/chart-card";
import { GRID_STROKE, TICK_STYLE } from "@/components/charts/chart-theme";
import riskMatrix from "@/data/risk-matrix.json";

const STATUS_COLOR: Record<string, string> = {
  Hoog: "hsl(var(--status-critical))",
  Middel: "hsl(var(--status-warning))",
  Laag: "hsl(var(--status-good))",
};

// Jitter identieke (x,y)-combinaties licht uit elkaar zodat overlappende
// aannames (bv. A1 en A2 hebben beide kans=4, impact=5) niet exact samenvallen.
const seen = new Map<string, number>();

const data = riskMatrix.aannames.map((a) => {
  const key = `${a.kans_onjuist}-${a.impact_indien_onjuist}`;
  const occurrence = seen.get(key) ?? 0;
  seen.set(key, occurrence + 1);
  const jitter = occurrence * 0.22;
  return {
    id: a.id,
    x: a.kans_onjuist + jitter,
    y: a.impact_indien_onjuist - jitter,
    xOrig: a.kans_onjuist,
    yOrig: a.impact_indien_onjuist,
    z: a.prioriteit_score,
    prioriteit: a.prioriteit,
    aanname: a.aanname,
  };
});

function RiskTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="max-w-xs rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <div className="mb-1 font-semibold">{d.id} · Prioriteit: {d.prioriteit}</div>
      <div className="text-muted-foreground">{d.aanname}</div>
      <div className="mt-1">Kans onjuist: {d.xOrig}/5 · Impact: {d.yOrig}/5</div>
    </div>
  );
}

export function RisicoScatter() {
  return (
    <ChartCard
      title="Risicomatrix: Impact × Onzekerheid per kritieke aanname"
      description="Rechtsboven = hoogste prioriteit om te valideren"
      type="AANNAME"
      data={riskMatrix.aannames as unknown as Record<string, unknown>[]}
      filename="risicomatrix"
    >
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis
            type="number"
            dataKey="x"
            name="Kans dat aanname onjuist is"
            domain={[0, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={TICK_STYLE}
            axisLine={{ stroke: GRID_STROKE }}
            tickLine={false}
            label={{ value: "Kans dat aanname onjuist is →", position: "insideBottom", offset: -8, fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Impact indien onjuist"
            domain={[0, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={TICK_STYLE}
            axisLine={{ stroke: GRID_STROKE }}
            tickLine={false}
            label={{ value: "Impact indien onjuist →", angle: -90, position: "insideLeft", fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <ZAxis type="number" dataKey="z" range={[120, 500]} />
          <ReferenceLine x={3} stroke={GRID_STROKE} strokeDasharray="4 4" />
          <ReferenceLine y={3} stroke={GRID_STROKE} strokeDasharray="4 4" />
          <Tooltip content={<RiskTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            data={data}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const r = 8 + (payload.z / 25) * 10;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={r} fill={STATUS_COLOR[payload.prioriteit]} fillOpacity={0.75} stroke="hsl(var(--card))" strokeWidth={2} />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill="white">
                    {payload.id}
                  </text>
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label} prioriteit
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
