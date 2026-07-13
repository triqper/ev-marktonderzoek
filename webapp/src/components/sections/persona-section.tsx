"use client";

import { SectionHeader } from "@/components/section-header";
import { PersonaHeatmap } from "@/components/charts/persona-heatmap";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import personas from "@/data/personas.json";

export function PersonaSection() {
  return (
    <section id="personas" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 4"
          title="Laadpersona's"
          description="Vijf typen EV-rijders, hun laadgedrag en de relevantie van elk segment voor een geïntegreerde bankpropositie."
        />
        <div className="space-y-6">
          <PersonaHeatmap />
          <Accordion type="single" collapsible className="rounded-lg border border-border px-4">
            {personas.personas.map((p) => (
              <AccordionItem key={p.naam} value={p.naam}>
                <AccordionTrigger>
                  <span className="flex flex-wrap items-center gap-2 text-left">
                    {p.naam}
                    <Badge variant="secondary">{p.marktaandeel_ev_park_pct}% van EV-park</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>
                    <strong className="text-foreground">Kernbehoeften:</strong> {p.kernbehoeften.join(", ")}
                  </p>
                  <p>
                    <strong className="text-foreground">Betaalgedrag:</strong> {p.betaalgedrag}
                  </p>
                  <p>
                    <strong className="text-foreground">Prijs- vs. gemaksgevoeligheid:</strong> {p.prijsgevoeligheid} prijsgevoelig, {p.gemaksgevoeligheid} gemaksgevoelig
                  </p>
                  <p>
                    <strong className="text-foreground">Relevantie bankpropositie:</strong> {p.relevantie_bankpropositie}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
