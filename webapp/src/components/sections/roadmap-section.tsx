import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const fasen = [
  {
    titel: "Fase 1 — Desk Research & Expert Validation",
    periode: "Week 1-2",
    doel: "Elimineer bekende onzekerheden met harde secundaire data.",
    activiteiten: ["Verdiepend marktonderzoek per segment", "Juridische quickscan AFIR/PSD3", "Expertinterviews CPO/EMSP-finance (start A2)"],
    beslissing: "Go indien marge-model plausibel positief; anders pivot naar alternatief verdienmodel of stop.",
  },
  {
    titel: "Fase 2 — Probleem- & Waardevalidatie",
    periode: "Week 2-4",
    doel: "Bewijs daadwerkelijke klantfrictie en -vraag.",
    activiteiten: ["Concierge MVP-interviews (A1)", "Fake Door-test live zetten (A7)", "Technische gesprekken kandidaat-partners (A3)"],
    beslissing: "Go indien A1-succescriterium (≥15% wisselbereid) wordt gehaald; anders pivot naar nichesegment of stop.",
  },
  {
    titel: "Fase 3 — Oplossings- & Gedragsvalidatie",
    periode: "Week 4-8",
    doel: "Test prototypes en meet daadwerkelijke bereidheid tot handelen.",
    activiteiten: ["Figma-prototype UX-test (A4)", "Fake Door-resultaten analyseren (A7)", "Partnerkeuze formaliseren via LOI"],
    beslissing: "Go naar pilot/MVP-besluit indien 3 van 4 top-aannames slagen; anders terug naar Fase 1 of stop.",
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 12"
          title="Roadmap naar bewijs — 90-dagen cyclus"
          description="Drie strakke fasen met duidelijke kill/pivot/go-criteria."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {fasen.map((f, i) => (
            <Card key={f.titel} className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="w-fit">{f.periode}</Badge>
                <CardTitle className="text-base">{f.titel}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 text-sm">
                <p className="text-muted-foreground">{f.doel}</p>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  {f.activiteiten.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <Separator />
                <p>
                  <span className="font-medium text-foreground">Kill/pivot/go: </span>
                  <span className="text-muted-foreground">{f.beslissing}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
