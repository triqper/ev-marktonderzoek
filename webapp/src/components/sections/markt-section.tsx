"use client";

import { SectionHeader } from "@/components/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EpistemicBadge } from "@/components/epistemic-badge";
import { LandenVergelijkingChart } from "@/components/charts/landen-vergelijking-chart";
import { SegmentatieChart } from "@/components/charts/segmentatie-chart";
import { LocatieTreemap } from "@/components/charts/locatie-treemap";
import { KpiCard } from "@/components/kpi-card";
import marketData from "@/data/market-data.json";

const seg = marketData.segmentatie_laadtype as any;
const locaties = marketData.locaties as any[];

export function MarktSection() {
  return (
    <section id="markt" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 1-3"
          title="Marktomvang, segmentatie en locaties"
          description="Nederland, Europa en de belangrijkste individuele markten — huidige status en technische/locatie-segmentatie van laadtransacties."
        />

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="NL private thuisladers" value="667.000" type="FEIT" sublabel="RVO.nl, 2026" />
          <KpiCard label="EU27 BEV-nieuwverkoop Q1 2026" value="19,4%" type="FEIT" sublabel="ACEA, Q1 2026" />
          <KpiCard label="EU27 geschat laadpuntenpark" value="~1,6 mln" type="SCHATTING" sublabel="Extrapolatie EAFO-deelset" />
          <KpiCard label="Gem. publiek laadtarief NL" value="€0,48/kWh" type="FEIT" sublabel="Prijsvergelijkers, 2026" />
        </div>

        <Tabs defaultValue="omvang">
          <TabsList>
            <TabsTrigger value="omvang">Marktomvang NL/EU</TabsTrigger>
            <TabsTrigger value="segmentatie">AC/DC/HPC-segmentatie</TabsTrigger>
            <TabsTrigger value="locaties">Laadlocaties</TabsTrigger>
          </TabsList>

          <TabsContent value="omvang" className="space-y-6 pt-4">
            <LandenVergelijkingChart />
          </TabsContent>

          <TabsContent value="segmentatie" className="space-y-6 pt-4">
            <SegmentatieChart />
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Gem. transactiewaarde</TableHead>
                    <TableHead>Gem. kWh/sessie</TableHead>
                    <TableHead>Gem. sessieduur</TableHead>
                    <TableHead>Transacties/gebruiker/mnd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(["AC", "DC", "HPC"] as const).map((key) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>€{seg[key].gem_transactiewaarde_eur.waarde.toFixed(2)}</TableCell>
                      <TableCell>{seg[key].gem_kwh_per_sessie.waarde} kWh</TableCell>
                      <TableCell>{seg[key].gem_sessieduur_min.waarde} min</TableCell>
                      <TableCell>{seg[key].transacties_per_gebruiker_per_maand.waarde}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end">
              <EpistemicBadge type="SCHATTING" />
            </div>
          </TabsContent>

          <TabsContent value="locaties" className="space-y-6 pt-4">
            <LocatieTreemap />
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locatietype</TableHead>
                    <TableHead>Aandeel transacties</TableHead>
                    <TableHead>Sessieduur</TableHead>
                    <TableHead>Gem. besteding</TableHead>
                    <TableHead>Gebruikersprofiel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locaties.map((l) => (
                    <TableRow key={l.type}>
                      <TableCell className="font-medium">{l.type}</TableCell>
                      <TableCell>{l.aandeel_transacties_pct}%</TableCell>
                      <TableCell>{l.gem_sessieduur_min} min</TableCell>
                      <TableCell>€{l.gem_besteding_eur.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">{l.type_gebruiker}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
