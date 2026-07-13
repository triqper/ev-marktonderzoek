import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { ScenarioPanel } from "@/components/scenario-panel";

export function BusinesscaseSection() {
  return (
    <section id="businesscase" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 8"
          title="Bankpropositie & businesscase"
          description="Interactieve scenario-analyse — pas marktaandeel, transactiewaarde, marge, adoptiegraad en laadfrequentie aan en zie het effect direct."
        />
        <Card className="mb-6">
          <CardContent className="overflow-x-auto p-6">
            <pre className="min-w-[560px] font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">{`(1) Totaal NL publieke laadtransacties/jaar (T_totaal) = 95.000.000  [SCHATTING]
(2) Marktaandeel bank (s)                             = 1% / 5% / 10%
(3) Transacties bank (T_bank)                          = T_totaal x s
(4) Gemiddelde transactiewaarde (v)                     = EUR 10,00  [SCHATTING]
(5) Total Payment Volume (TPV)                          = T_bank x v
(6) Take-rate / marge bank (m)                          = 0,5% - 15%  [AANNAME-bandbreedte]
(7) Bruto-omzet bank                                     = TPV x m`}</pre>
          </CardContent>
        </Card>
        <ScenarioPanel />
      </div>
    </section>
  );
}
