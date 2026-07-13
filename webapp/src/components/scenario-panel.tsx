"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { CustomTooltip } from "@/components/charts/custom-tooltip";
import { CHART_COLORS, GRID_STROKE, TICK_STYLE } from "@/components/charts/chart-theme";
import { berekenScenario, SCENARIO_BOUNDS, SCENARIO_DEFAULTS } from "@/lib/calculations";
import { formatEUR, formatNumber, formatPercent } from "@/lib/utils";
import { EpistemicBadge } from "@/components/epistemic-badge";

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  );
}

export function ScenarioPanel() {
  const [marktaandeel, setMarktaandeel] = React.useState(SCENARIO_DEFAULTS.marktaandeelPct);
  const [transactiewaarde, setTransactiewaarde] = React.useState(SCENARIO_DEFAULTS.gemTransactiewaarde);
  const [marge, setMarge] = React.useState(SCENARIO_DEFAULTS.margePct);
  const [adoptiegraad, setAdoptiegraad] = React.useState(31);
  const [laadfrequentie, setLaadfrequentie] = React.useState(5);

  // Adoptiegraad en laadfrequentie werken door op het totaal transactievolume
  // t.o.v. de basiswaarden (31% resp. 5x/maand) — transparant en herleidbaar.
  const totaalTransacties = React.useMemo(() => {
    const basis = SCENARIO_DEFAULTS.totaalTransacties;
    const adoptieFactor = adoptiegraad / 31;
    const frequentieFactor = laadfrequentie / 5;
    return basis * adoptieFactor * frequentieFactor;
  }, [adoptiegraad, laadfrequentie]);

  const resultaat = React.useMemo(
    () =>
      berekenScenario({
        totaalTransacties,
        marktaandeelPct: marktaandeel,
        gemTransactiewaarde: transactiewaarde,
        margePct: marge,
      }),
    [totaalTransacties, marktaandeel, transactiewaarde, marge]
  );

  const chartData = [1, 5, 10].map((s) => {
    const r = berekenScenario({
      totaalTransacties,
      marktaandeelPct: s,
      gemTransactiewaarde: transactiewaarde,
      margePct: marge,
    });
    return { label: `${s}%`, tpv: r.tpv, omzet: r.omzetBank, isActief: s === marktaandeel };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scenario-variabelen</CardTitle>
          <CardDescription>Pas de aannames aan — de businesscase rekent live door</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SliderRow
            label="Marktaandeel bank"
            value={marktaandeel}
            onChange={setMarktaandeel}
            {...SCENARIO_BOUNDS.marktaandeelPct}
            format={(v) => formatPercent(v, 1)}
          />
          <SliderRow
            label="Gem. transactiewaarde"
            value={transactiewaarde}
            onChange={setTransactiewaarde}
            {...SCENARIO_BOUNDS.gemTransactiewaarde}
            format={(v) => formatEUR(v)}
          />
          <SliderRow
            label="Marge / take-rate bank"
            value={marge}
            onChange={setMarge}
            {...SCENARIO_BOUNDS.margePct}
            format={(v) => formatPercent(v, 2)}
          />
          <Separator />
          <SliderRow
            label="EV-adoptiegraad (nieuwverkoop)"
            value={adoptiegraad}
            onChange={setAdoptiegraad}
            {...SCENARIO_BOUNDS.adoptiegraadPct}
            format={(v) => formatPercent(v, 0)}
          />
          <SliderRow
            label="Laadfrequentie (sessies/maand)"
            value={laadfrequentie}
            onChange={setLaadfrequentie}
            {...SCENARIO_BOUNDS.laadfrequentiePerMaand}
            format={(v) => `${formatNumber(v)}x`}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Adoptiegraad en laadfrequentie schalen het totale NL-transactievolume t.o.v. de
            uitgangswaarden (31% nieuwverkoopaandeel, 5 sessies/maand). Zie <code className="rounded bg-muted px-1 py-0.5">lib/calculations.ts</code> voor de exacte formule.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div key={resultaat.transactiesBank} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">Transacties/jaar (bank)</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{formatNumber(resultaat.transactiesBank, { compact: true })}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div key={resultaat.tpv} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">Total Payment Volume</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{formatEUR(resultaat.tpv, { compact: true })}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div key={resultaat.omzetBank} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
            <Card className="border-primary/40">
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">Geschatte omzet bank/jaar</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-primary">{formatEUR(resultaat.omzetBank, { compact: true })}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">TPV en omzet bij 1% / 5% / 10% marktaandeel</CardTitle>
              <CardDescription>Bij huidige transactiewaarde en marge-instelling</CardDescription>
            </div>
            <EpistemicBadge type="SCHATTING" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="label" tick={TICK_STYLE} axisLine={{ stroke: GRID_STROKE }} tickLine={false} />
                <YAxis tickFormatter={(v) => formatEUR(v, { compact: true })} tick={TICK_STYLE} axisLine={{ stroke: GRID_STROKE }} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip formatter={(v) => formatEUR(v, { compact: true })} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="tpv" name="Total Payment Volume" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={48} />
                <Bar dataKey="omzet" name="Omzet bank" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
