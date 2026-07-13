import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, ShieldAlert } from "lucide-react";

const kansen = [
  { titel: "Vertrouwd betaalgemak", tekst: "De bank-app is al het centrale betaalpunt voor veel klanten; laden toevoegen kan frictie wegnemen." },
  { titel: "KYC/identiteit als asset", tekst: "Geverifieerde klantidentiteit en betaalgegevens al aanwezig — geen aparte registratie nodig." },
  { titel: "Bereik", tekst: "Een grootbank heeft een klantenbestand dat de meeste EMSP's niet hebben." },
  { titel: "Overzicht/besparing-propositie", tekst: "Relevant voor de prijsbewuste particuliere thuislader — laadkosten combineren met budgetinzicht." },
  { titel: "Ad-hoc/occasional-use-niche", tekst: "Vakantierijders hebben weinig loyaliteit aan één laadpas — 'betalen met wat je al hebt' is een reëel alternatief." },
];

const risicos = [
  { titel: "Strategisch", tekst: "Risico op focusverlies — mobility valt buiten de kernactiviteit van de meeste banken." },
  { titel: "Juridisch (AFIR/PSD3)", tekst: "AFIR verplicht CPO's al tot contactloze kaartbetaling op de paal; PSD3 kan aanvullende eisen stellen. Vereist gerichte juridische toetsing." },
  { titel: "Operationeel", tekst: "Afhankelijkheid van een technische partner voor dekking; laadpaal-uptime ligt buiten controle van de bank." },
  { titel: "Commercieel", tekst: "Dunne marges in de keten laten mogelijk weinig ruimte voor een extra schakel." },
];

export function KansenRisicoSection() {
  return (
    <section id="kansen-risicos" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 7"
          title="Strategische kansen & risico's voor de bank"
          description="Welke frictie lost een geïntegreerde bankoplossing op, en welke risico's kleven eraan?"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-[hsl(var(--status-good))]" /> Kansen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kansen.map((k) => (
                <Alert key={k.titel}>
                  <AlertTitle>{k.titel}</AlertTitle>
                  <AlertDescription>{k.tekst}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-[hsl(var(--status-critical))]" /> Risico&apos;s
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {risicos.map((r) => (
                <Alert key={r.titel} variant="warning">
                  <AlertTitle>{r.titel}</AlertTitle>
                  <AlertDescription>{r.tekst}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
