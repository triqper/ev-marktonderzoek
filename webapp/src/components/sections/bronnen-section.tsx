import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";

// Interne notitie LLM-verwerkbaarheid per bron: ACEA persberichten (direct verwerkbaar),
// RVO Stand van zaken (direct verwerkbaar), NAL Voortgangsrapportage 2025 (verwerkbaar,
// PDF-tabellen), EAFO (direct verwerkbaar), CBS StatLine (direct verwerkbaar, open API),
// Nationaal Laadonderzoek VER/RUG/RVO (verwerkbaar, vervangt verouderde ElaadNL 2023-bron),
// Vattenfall InCharge jaarcijfers (beperkt — één CPO, alleen sanity check),
// DOT-NL (beperkt — vergt aggregatie vóór gebruik).
const bronCategorieen = [
  {
    titel: "Internationaal / Publiek",
    bronnen: [
      "ACEA — New car registrations, persberichten (maandelijks): full year 2025, Q1 2026 en mei 2026 YTD",
      "EAFO (European Alternative Fuels Observatory, Europese Commissie) — Data updates en landenrapportages (2025-2026); uniforme bron landenvergelijking",
      "Europese Commissie — AFIR-verordening (EU) 2023/1804 (m.n. artikel 5, lid 1-2 inzake betaalvereisten)",
      "Europese Commissie — Verordening (EU) 2015/751 (Interchange Fee Regulation): 0,2% debit / 0,3% credit",
      "EEA — New registrations of electric vehicles, indicatorrapportage",
    ],
  },
  {
    titel: "Nederlandse overheid & validatie-instellingen",
    bronnen: [
      "RVO.nl — Stand van zaken elektrisch vervoer en laadpunten (maandelijks; peildatum juli 2026, incl. PHEV-park 543.355)",
      "Nationaal Laadonderzoek (VER/RUG/RVO, 5e editie, 3.500+ respondenten) — referentiekader gebruikspatronen; volledig rapport via de VER-website. NB: eerder onterecht primair aan ElaadNL toegeschreven",
      "NAL Voortgangsrapportage 2025 (april 2026) — plaatsingstempo, laadmix, laaddruk",
      "CBS StatLine — wagenpark, historische reeksen (open API)",
    ],
  },
  {
    titel: "Marktdata / prijsvergelijking",
    bronnen: [
      "MyVoltCost, Charge24, ANWB, Consumentenbond — laadtariefvergelijkingen NL (2026)",
      "DOT-NL — actuele laadtarieven",
      "Vattenfall InCharge — jaarcijfers (~8 mln publieke sessies/jaar, 2025, +68% YoY); kalibratiecheck sessievolume",
    ],
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
          (McKinsey, Deloitte, EY, PwC, Roland Berger, BCG) raadplegen. CBS-macrodata is via
          StatLine wél vrij toegankelijk en is als bron opgenomen; het werkelijke kennishiaat zit
          bij microdata en niet-openbare CPO-transactiedata (sessie-niveau data van individuele
          exploitanten, niet-gepubliceerde ACM/BOVAG-detailanalyses) — zie hoofdstuk
          &ldquo;Wat weten we nog niet?&rdquo;. Elk cijferobject in data/*.json bevat een
          data_asof-peildatum en waar beschikbaar een source_url voor systematische updates.
        </p>
      </div>
    </section>
  );
}
