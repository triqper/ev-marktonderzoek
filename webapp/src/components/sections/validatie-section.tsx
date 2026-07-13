"use client";

import { SectionHeader } from "@/components/section-header";
import { RisicoScatter } from "@/components/charts/risico-scatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { EpistemicBadge } from "@/components/epistemic-badge";
import riskMatrix from "@/data/risk-matrix.json";
import validationPlan from "@/data/validation-plan.json";

const PRIORITEIT_VARIANT: Record<string, "destructive" | "secondary" | "outline"> = {
  Hoog: "destructive",
  Middel: "secondary",
  Laag: "outline",
};

export function ValidatieSection() {
  return (
    <section id="validatie" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 9-11"
          title="Validatie- & risicodossier"
          description="Het businessidee als bundel ongeteste hypotheses — geordend op Risico = Impact x Onzekerheid, met een concreet experiment per top-aanname."
        />

        <div className="space-y-6">
          <RisicoScatter />

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aanname</TableHead>
                  <TableHead>Kans onjuist</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Betrouwbaarheid bewijs</TableHead>
                  <TableHead>Prioriteit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskMatrix.aannames
                  .slice()
                  .sort((a, b) => b.prioriteit_score - a.prioriteit_score)
                  .map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="max-w-md text-sm">{a.aanname}</TableCell>
                      <TableCell>{a.kans_onjuist}/5</TableCell>
                      <TableCell>{a.impact_indien_onjuist}/5</TableCell>
                      <TableCell>{a.betrouwbaarheid_bewijs}/5</TableCell>
                      <TableCell>
                        <Badge variant={PRIORITEIT_VARIANT[a.prioriteit]}>{a.prioriteit}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Validatieplan per top-aanname</h3>
              <EpistemicBadge type="AANNAME" />
            </div>
            <Accordion type="single" collapsible className="rounded-lg border border-border px-4">
              {validationPlan.experimenten.map((e) => (
                <AccordionItem key={e.aanname_id} value={e.aanname_id}>
                  <AccordionTrigger>
                    <span className="text-left">
                      <span className="font-mono text-xs text-primary">{e.aanname_id}</span> — {e.experiment}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p><strong className="text-foreground">Hypothese:</strong> {e.hypothese}</p>
                    <p><strong className="text-foreground">Succescriterium (falsificatiegrens):</strong> {e.meetbaar_succescriterium}</p>
                    <div className="flex flex-wrap gap-4 pt-1 text-xs">
                      <span><strong className="text-foreground">Kosten:</strong> €{e.kosten_indicatie_eur}</span>
                      <span><strong className="text-foreground">Doorlooptijd:</strong> {e.doorlooptijd_weken} weken</span>
                    </div>
                    <p><strong className="text-foreground">Bij succes:</strong> {e.vervolgstappen_bij_succes}</p>
                    <p><strong className="text-foreground">Bij falen:</strong> {e.vervolgstappen_bij_falen}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
