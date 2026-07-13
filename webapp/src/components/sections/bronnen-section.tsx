import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";

const bronCategorieen = [
  {
    titel: "Internationaal / Publiek",
    bronnen: [
      "ACEA — New car registrations: full year 2025 & Q1 2026 (2026)",
      "EAFO (European Alternative Fuels Observatory, Europese Commissie) — Data updates en landenrapportages (2025-2026)",
      "Europese Commissie — AFIR-verordening (EU) 2023/1804",
      "EEA — New registrations of electric vehicles, indicatorrapportage",
    ],
  },
  {
    titel: "Nederlandse overheid & validatie-instellingen",
    bronnen: ["RVO.nl — Stand van zaken elektrisch vervoer en laadpunten (2026)", "ElaadNL — Nationaal Laadonderzoek 2023 (referentiekader gebruikspatronen)"],
  },
  {
    titel: "Marktdata / prijsvergelijking",
    bronnen: ["MyVoltCost, Charge24, ANWB, Consumentenbond — laadtariefvergelijkingen NL (2026)"],
  },
];

export function BronnenSection() {
  return (
    <section id="bronnen" className="scroll-mt-20 py-16">
      <div className="container">
        <SectionHeader eyebrow="Bijlage" title="Bronnenlijst" description="Volledig register met herleidbaarheid per cijfer: zie data/*.json." />
        <div className="grid gap-6 md:grid-cols-3">
          {bronCategorieen.map((cat) => (
            <Card key={cat.titel}>
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold">{cat.titel}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {cat.bronnen.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Dit dossier kon binnen de beschikbare tijd en toegang geen betaalde consultancyrapporten
          (McKinsey, Deloitte, EY, PwC, Roland Berger, BCG) of ACM/BOVAG/CBS-microdata raadplegen —
          zie hoofdstuk &ldquo;Wat weten we nog niet?&rdquo;.
        </p>
      </div>
    </section>
  );
}
