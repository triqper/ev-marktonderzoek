"use client";

import { ChartCard } from "@/components/charts/chart-card";
import personas from "@/data/personas.json";
import { cn } from "@/lib/utils";

const RELEVANTIE_SCORE: Record<string, number> = {
  Laag: 1,
  "Laag-middel": 2,
  Middel: 3,
  "Middel-hoog": 4,
  Hoog: 5,
};

function scoreFromText(text: string): number {
  const key = Object.keys(RELEVANTIE_SCORE).find((k) => text.startsWith(k));
  return key ? RELEVANTIE_SCORE[key] : 3;
}

/** Sequentiële blauwe ramp (dataviz-skill: één hue, licht -> donker voor magnitude). */
const SEQUENTIAL_STEPS = [
  "hsl(213 68% 92%)",
  "hsl(213 68% 80%)",
  "hsl(213 68% 66%)",
  "hsl(213 68% 55%)",
  "hsl(213 68% 42%)",
];

const columns = [
  { key: "marktaandeel_ev_park_pct", label: "Marktaandeel EV-park", suffix: "%", max: 40 },
  { key: "aandeel_laadtransacties_pct", label: "Aandeel laadtransacties", suffix: "%", max: 32 },
  { key: "relevantie_score", label: "Relevantie bankpropositie", suffix: "/5", max: 5 },
];

export function PersonaHeatmap() {
  const rows = personas.personas.map((p) => ({
    naam: p.naam,
    marktaandeel_ev_park_pct: p.marktaandeel_ev_park_pct,
    aandeel_laadtransacties_pct: p.aandeel_laadtransacties_pct,
    relevantie_score: scoreFromText(p.relevantie_bankpropositie),
    relevantie_tekst: p.relevantie_bankpropositie,
  }));

  return (
    <ChartCard
      title="Persona-heatmap: volume vs. relevantie voor de bankpropositie"
      description="Donkerder = hogere waarde binnen de kolom"
      type="SCHATTING"
      data={rows}
      filename="persona-heatmap"
      footnote="Relevantiescore is een eigen 1-5 codering van de kwalitatieve relevantiebeoordeling per persona — zie data/personas.json."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-muted-foreground">Persona</th>
              {columns.map((c) => (
                <th key={c.key} className="p-2 text-left text-xs font-medium text-muted-foreground">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.naam}>
                <td className="whitespace-nowrap p-2 text-sm font-medium">{row.naam}</td>
                {columns.map((c) => {
                  const value = (row as any)[c.key] as number;
                  const ratio = Math.min(value / c.max, 1);
                  const stepIdx = Math.min(Math.floor(ratio * SEQUENTIAL_STEPS.length), SEQUENTIAL_STEPS.length - 1);
                  return (
                    <td key={c.key} className="p-0">
                      <div
                        className={cn("flex h-12 min-w-[90px] items-center justify-center rounded-md text-xs font-semibold tabular-nums")}
                        style={{ backgroundColor: SEQUENTIAL_STEPS[stepIdx], color: stepIdx > 2 ? "white" : "hsl(var(--foreground))" }}
                        title={c.key === "relevantie_score" ? row.relevantie_tekst : undefined}
                      >
                        {value}
                        {c.suffix}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
